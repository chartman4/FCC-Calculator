import React from 'react';
import styled from "styled-components";

const Div = styled.div`
    font-size: 2em;
    background-color: white;
    border: 2px solid black;
    text-align: right;
    border-radius: 4px;

`;

const ExpressionDisplay = ({ exp }) => (
    <Div >
        {exp}
    </Div>
)

export default ExpressionDisplay;

