import React from 'react';
import styled from "styled-components";

const Div = styled.div`
    font-size: 2em;
    background-color: #97d2fa;
    border: 2px solid black;
    text-align: right;
    border-radius: 4px;

`;

const CurrentOpDisplay = ({ exp }) => (
    <Div id="display">
        {exp}
    </Div>
);

export default CurrentOpDisplay;

