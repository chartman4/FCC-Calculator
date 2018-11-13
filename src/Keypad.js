import React, { Component } from 'react';
import styled from "styled-components";
import { calculate } from "./calculateUtil.js";

const KeyPadContainer = styled.div`
    display: grid;
    background-color: #7f8084;
    grid-template-columns: 55% 35%;
    justify-content: space-around;
    padding: 10px;
    grid-gap: 20px;
`

const NumberKeysContainer = styled.div`
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
`
const OperatorKeysContainer = styled.div`
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(4, 1fr);
`
const Button = styled.button`
    border-radius: 6px;
    font-size: 2rem;
    background: #3498db;
    border: 1px solid white;
    box-shadow: 0px 2px 0 grey, 2px 4px 6px #eee;
    letter-spacing: 1px;
    
    &:hover {
        box-shadow: 0px 2px 0 grey;
        color: white;
        }
`

const EQbutton = styled(Button)`
    grid-row: 2/-1;
    grid-column: 2/-1;
`
const Zerobutton = styled(Button)`
    grid-column: 1/3;
`

export default class Keypad extends Component {

    constructor(props) {
        super(props);

        this.state = {
            ops: [],
            lastOp: "0",
            resetDisplay: false,
            expression: ""
        };
        this.onClearClick = this.onClearClick.bind(this);
        this.onNumberClick = this.onNumberClick.bind(this);
        this.onOperatorClick = this.onOperatorClick.bind(this);
        this.onDecimalClick = this.onDecimalClick.bind(this);
        this.onCalculateClick = this.onCalculateClick.bind(this);
    }

    // add an event listener to allow user to enter operations on keyboard
    componentDidMount() {
        document.addEventListener("keydown", this.handleKeydown);
    }

    // remove the event listener to allow user to enter operations on keyboard
    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeydown);
    }

    // determine key pressed and call appropriate function
    handleKeydown = e => {
        // get key pressed
        var c = e.key.toLowerCase();

        if ("0123456789".indexOf(c) !== -1) this.processNumber(c);
        else if ("+-/*".indexOf(c) !== -1) this.processOperator(c);
        else if ("c" === c) this.processClear();
        else if ("=" === c) this.processCalc();
        else if ("." === c) this.processDecimal();
    };

    // reset state and call functions passed by parent to update displays 
    processClear() {
        this.setState({
            ops: [],
            resetDisplay: false,
            lastOp: "0",
            expression: ""
        })
        this.props.updateCurrentOp("0");
        this.props.updateExpression("");
    }

    // when user clicks clear button
    onClearClick(e) {
        this.processClear();
    }


    // process a number input
    processNumber(num) {
        var op, exp = "";
        var ops;
        if (this.state.ops.length > 0) ops = this.state.ops.slice(); else ops = [];
        // number cases:
        //      last op is 0 and only op or last operation was to calculate, replace zero with number
        //      last op is operator, add operator to saved ops, save number as current operand
        //      otherwise append number to previous number
        if ((this.state.lastOp === "0" && this.state.ops.length === 0) || this.state.resetDisplay) {
            // last op is 0, replace zero lastOp with number
            op = num;
            exp = "";
            ops = [];
        }
        // currentOp is operator, add operator to saved ops, save number as currentOp
        // else if ("+-*/".indexOf(this.state.lastOp) !== -1) {
        else if ("+" === this.state.lastOp ||
            "-" === this.state.lastOp ||
            "*" === this.state.lastOp ||
            "/" === this.state.lastOp) {
            // last op is operator, update displays and add operator to saved ops, save number as current operand
            op = num;
            exp = this.state.expression + this.state.lastOp;  // append operator to expression
            ops.push(this.state.lastOp);
        }
        // otherwise append number to previous number
        else {
            op = this.state.lastOp.concat(num);
            exp = this.state.expression; // does not change, ops state does not change
        }
        this.setState({
            ops: [...ops], lastOp: op, expression: exp, resetDisplay: false
        });
        this.props.updateCurrentOp(op);
        const displayExp = exp.concat(op);
        this.props.updateExpression(displayExp);
    }

    onNumberClick(e) {
        const keyPressed = e.target.value;
        this.processNumber(keyPressed);
    }

    processOperator(op) {
        var exp = this.state.expression;
        var ops = this.state.ops.slice();
        // operator cases:
        //      previous op is an operator, replace lastOp with new op, no other changes
        //      previous op is a decimal or number (not an operator), save it to ops state and
        //      current operator to expression
        if ("+" !== this.state.lastOp &&
            "-" !== this.state.lastOp &&
            "*" !== this.state.lastOp &&
            "/" !== this.state.lastOp) {

            //  previous op is a decimal or number, save last op to ops and to exp
            ops.push(this.state.lastOp);
            exp = exp.concat(this.state.lastOp);
        }

        this.setState({
            ops: [...ops], lastOp: op, expression: exp, resetDisplay: false
        });
        this.props.updateCurrentOp(op);
        const display = exp.concat(op)
        this.props.updateExpression(display);
    }

    onOperatorClick(e) {
        const keyPressed = e.target.value;
        this.processOperator(keyPressed);
    }
    processDecimal() {
        console.log("processDecimal");
        var exp = this.state.expression;
        console.log(exp);

        var ops = this.state.ops.slice();
        console.log(ops);

        var op = "";
        // decimal point cases:
        //        after an operator, 
        //        after a number with no decimal, 
        //        after a number that has a decimal already ,

        // decimal after operator, save current operator, save "0." as currentOp
        // if (this.state.lastOp.toString().includes("+-*/")) {
        if ("+" === this.state.lastOp ||
            "-" === this.state.lastOp ||
            "*" === this.state.lastOp ||
            "/" === this.state.lastOp) {

            ops.push(this.state.lastOp);
            exp = exp.concat(this.state.lastOp);
            op = "0.";
        }
        /// a number with no decimal, append decimal to currentOp
        else if (this.state.lastOp.indexOf(".") === -1) {
            op = this.state.lastOp.concat(".");
        }
        //  after a number that has a decimal already ignore keypressed
        else op = this.state.lastOp;

        this.setState({
            ops: [...ops], lastOp: op, expression: exp, resetDisplay: false
        });
        this.props.updateCurrentOp(op);
        const display = exp.concat(op)
        this.props.updateExpression(display);
    }

    onDecimalClick(e) {
        this.processDecimal();
    }

    // Equal sign entered/clicked, process ops collected so far
    processCalc() {
        var ops;
        var exp = this.state.expression;
        var op = this.state.lastOp;

        // if last op was an operation, ignore it
        // otherwise add it to ops and expression
        // if ("*-/+".indexOf(this.state.lastOp) !== -1) {
        if ("+" === this.state.lastOp ||
            "-" === this.state.lastOp ||
            "*" === this.state.lastOp ||
            "/" === this.state.lastOp) {
            ops = [...this.state.ops];
        } else {
            ops = [...this.state.ops, this.state.lastOp];
            exp = exp.concat(this.state.lastOp);
        }

        var results = calculate(ops);
        if (results.message === "success") {
            this.setState({
                ops: [], lastOp: results.value, expression: "", resetDisplay: true
            });
            this.props.updateCurrentOp(results.value);
            const display = exp.concat("=").concat(results.value);
            this.props.updateExpression(display);
        } else {
            this.setState({
                ops: [],
                lastOp: 0,
                expression: "",
                resetDisplay: true
            });
            this.props.updateCurrentOp(results.message);
            const display = exp.concat(op)
            this.props.updateExpression(display);
        }
    }

    onCalculateClick(e) {
        this.processCalc();
    }

    render() {
        return (
            <KeyPadContainer>
                <NumberKeysContainer >
                    <Button id="seven" type="button" value="7" onClick={this.onNumberClick}>7</Button>
                    <Button id="eight" type="button" value="8" onClick={this.onNumberClick}>8</Button>
                    <Button id="nine" type="button" value="9" onClick={this.onNumberClick}>9</Button>
                    <Button id="four" type="button" value="4" onClick={this.onNumberClick}>4</Button>
                    <Button id="five" type="button" value="5" onClick={this.onNumberClick}>5</Button>
                    <Button id="six" type="button" value="6" onClick={this.onNumberClick}>6</Button>
                    <Button id="one" type="button" value="1" onClick={this.onNumberClick}>1</Button>
                    <Button id="two" type="button" value="2" onClick={this.onNumberClick}>2</Button>
                    <Button id="three" type="button" value="3" onClick={this.onNumberClick}>3</Button>
                    <Zerobutton id="zero" type="button" value="0" onClick={this.onNumberClick}>0</Zerobutton>
                    <Button id="decimal" type="button" value="." onClick={this.onDecimalClick}>.</Button>
                </NumberKeysContainer>
                <OperatorKeysContainer >
                    <Button id="divide" type="button" value="/" onClick={this.onOperatorClick}>&divide;</Button>
                    <Button id="clear" type="button" value="C" onClick={this.onClearClick}>C</Button>
                    <Button id="multiply" type="button" value="*" onClick={this.onOperatorClick}>&times;</Button>
                    <Button id="subtract" type="button" value="-" onClick={this.onOperatorClick}>-</Button>
                    <Button id="add" type="button" value="+" onClick={this.onOperatorClick}>+</Button>
                    <EQbutton id="equals" type="button" value="=" onClick={this.onCalculateClick}>=</EQbutton>
                </OperatorKeysContainer>
            </KeyPadContainer>
        )
    }
}