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
    static defaultProps = {
        reset() { },
        addToExpression() { },
        updateCurrentOp() { }
    }
    constructor(props) {
        super(props);

        this.state = {
            allOps: [],
            currentOp: "0",
            resetDisplay: false
        };
        this.onClearClick = this.onClearClick.bind(this);
        this.onNumberClick = this.onNumberClick.bind(this);
        this.onOperatorClick = this.onOperatorClick.bind(this);
        this.onDecimalClick = this.onDecimalClick.bind(this);
        this.onCalculateClick = this.onCalculateClick.bind(this);
    }

    componentDidMount() {
        document.addEventListener("keydown", this.handleKeydown);
    }

    componentWillUnmount() {
        document.removeEventListener("keydown", this.handleKeydown);
    }


    handleKeydown = e => {
        // if key pressed is char assigned to this drum pad, make sound
        var c = e.key.toLowerCase();
        console.log(c);

        if ("0123456789".indexOf(c) !== -1) this.processNumber(c);
        else if ("+-/*".indexOf(c) !== -1) this.processOperator(c);
        else if ("c" === c) this.processClear();
        else if ("=" === c) this.processCalc();
        else if ("." === c) this.processDecimal();


    };

    processClear() {
        this.setState({
            allOps: [],
            currentOp: "0",
            resetDisplay: false
        })
        this.props.reset();
    }
    onClearClick(e) {
        console.log("reset");
        this.processClear();
    }

    processNumber(num) {
        // number cases:
        //      last op is 0, replace zero with number
        //      last op is operator, add operator to saved ops, save number as current operand
        //          & clear operation flag
        //      otherwise append number to previous number
        console.log(this.state.allOps.length);
        if ((this.state.currentOp === "0" && this.state.allOps.length === 0) || this.state.resetDisplay) {
            // last op is 0, replace zero lastOp with number
            this.setState({
                allOps: [], currentOp: num
            });
            //update displayed Current Op
            this.props.updateCurrentOp(num);
            this.props.updateExpression("");


        } else if ("+-*/".indexOf(this.state.currentOp) !== -1) {
            // last op is operator, update displays and add operator to saved ops, save number as current operand
            if (this.state.resetDisplay) this.props.updateExpression(this.state.currentOp);
            else this.props.addToExpression(this.state.currentOp);
            this.props.updateCurrentOp(num);
            this.setState({
                allOps: [...this.state.allOps, this.state.currentOp],
                currentOp: num,
                resetDisplay: false
            })
        }
        else {
            // otherwise append number to previous number
            const newOp = this.state.currentOp.concat(num);
            this.props.updateCurrentOp(newOp);

            this.setState({
                ...this.state, currentOp: newOp
            });
        }
    }
    onNumberClick(e) {
        console.log("onNumberClick");
        // this.props.updateCurrentOp("7");
        const keyPressed = e.target.value;
        console.log(keyPressed);
        this.processNumber(keyPressed);

    }
    processOperator(op) {
        // operator cases:
        //      previous op is operator, replace operator, 
        //      previous op is a decimal or number, save last op to allOps, 
        //             save operator 
        if ("+-*/".indexOf(this.state.currentOp) !== -1) {
            // previous op is operator, replace operator, 
            // update displayed Current Op
            this.setState({ ...this.state, currentOp: op })
            this.props.updateCurrentOp(op);
        } else {
            //  previous op is a decimal or number, save current op to allOps, 
            //             save operator as currentOp
            if (this.state.resetDisplay) this.props.updateExpression(this.state.currentOp);

            else this.props.addToExpression(this.state.currentOp);
            const newOps = [...this.state.allOps, this.state.currentOp];
            console.log(newOps);
            this.setState({
                allOps: newOps,
                currentOp: op,
                resetDisplay: false
            });
            this.props.updateCurrentOp(op);
        }
    }
    onOperatorClick(e) {
        const keyPressed = e.target.value;
        this.processOperator(keyPressed);
    }
    processDecimal() {
        // decimal point cases:
        //        after an operator, 
        //        after a number with no decimal, 
        //        after a number that has a decimal already , 
        // decimal after operator, save operator, save "0." as lastOp
        if ("+-*/".indexOf(this.state.currentOp) !== -1) {
            this.props.addToExpression(this.state.currentOp);

            this.setState({
                allOps: [...this.state.allOps, this.state.currentOp],
                currentOp: "0.",
                resetDisplay: false

            });

            this.props.updateCurrentOp("0.");

        }
        /// a number with no decimal, append decimal to lastOp and set flag
        else if (this.state.currentOp.indexOf(".") === -1) {
            const num = this.state.currentOp.concat(".");
            console.log(num);
            this.setState({
                ...this.state,
                currentOp: num,
                resetDisplay: false

            });
            this.props.updateCurrentOp(num);

        }
        //  after a number that has a decimal already ignore keypressed
    }
    onDecimalClick(e) {
        console.log("onDecimalClick");
        this.processDecimal();

    }

    processCalc() {
        var arr;
        var display = this.state.currentOp + "=";

        // if last op was an operation, ignore it
        // otherwise add it to allOps
        if ("*-/+".indexOf(this.state.currentOp) !== -1) {
            arr = [...this.state.allOps];
        } else {
            arr = [...this.state.allOps, this.state.currentOp];
            this.props.addToExpression(display);
        }

        var results = calculate(arr);
        console.log(results);
        if (results.message === "success") {
            this.props.updateCurrentOp(results.value);
            this.setState({
                allOps: [],
                currentOp: results.value,
                resetDisplay: true
            });
        } else {
            this.props.updateCurrentOp(results.message);
            this.setState({
                allOps: [],
                currentOp: 0,
                resetDisplay: true
            });
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