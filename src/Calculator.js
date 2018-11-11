import React, { Component } from 'react';
import styled from "styled-components";
import ExpressionDisplay from './ExpressionDisplay';
import CurrentOpDisplay from './CurrentOpDisplay';
import Keypad from './Keypad';



// Calculator will be centered full width on mobile, fixed with on otber devices
// https://freshman.tech/css-grid-calculator/
const Container = styled.div`
display: grid;
width: 95vw;
background-color: #7f8084;
border: 6px solid gray;
border-radius: 6px;
height: 80vh;
font-family: sans-serif;
grid-template-rows: 50px 50px  1fr;
grid-row: 2px;
@media (min-width: 700px) {
    width: 508px;

`


export default class Calculator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            expression: "",
            currentOp: "0",
        };
        this.reset = this.reset.bind(this);
        this.addToExpression = this.addToExpression.bind(this);
        this.updateCurrentOp = this.updateCurrentOp.bind(this);
        this.updateExpression = this.updateExpression.bind(this);

    }


    // clear all operands and operations, return to start state
    reset() {
        console.log("reset");
        this.setState({
            expression: "",
            currentOp: "0"
        });
    }
    addToExpression(exp) {
        console.log("addToExpression  " + exp);
        const newExp = this.state.expression.concat(exp);
        console.log("addToExpression  " + newExp);

        this.setState({
            expression: newExp
        });
    }
    updateExpression(exp) {
        var str = exp.toString();
        console.log("updateExpression  " + str);
        this.setState({
            expression: str
        });
    }
    updateCurrentOp(exp) {
        console.log("updateCurrentOp " + exp);
        const newCurrentOp = exp;
        this.setState({
            currentOp: newCurrentOp
        });
    }
    render() {
        return (
            <Container>
                <ExpressionDisplay exp1={this.state.expression} exp2={this.state.currentOp} />
                <CurrentOpDisplay exp={this.state.currentOp} />
                <Keypad
                    reset={this.reset}
                    addToExpression={this.addToExpression}
                    updateCurrentOp={this.updateCurrentOp}
                    updateExpression={this.updateExpression} />
            </Container>
        )
    }
}