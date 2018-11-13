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
height: 90vh;
font-family: sans-serif;
grid-template-rows: 60px 60px  1fr;
grid-gap: 20px;
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
        this.updateCurrentOp = this.updateCurrentOp.bind(this);
        this.updateExpression = this.updateExpression.bind(this);

    }


    updateExpression(exp) {
        var str = exp.toString();

        this.setState({
            expression: str
        });
    }
    updateCurrentOp(exp) {
        const newCurrentOp = exp;
        this.setState({
            currentOp: newCurrentOp
        });
    }
    render() {
        return (
            <Container>
                <ExpressionDisplay exp={this.state.expression} />
                <CurrentOpDisplay exp={this.state.currentOp} />
                <Keypad
                    updateCurrentOp={this.updateCurrentOp}
                    updateExpression={this.updateExpression} />
            </Container>
        )
    }
}