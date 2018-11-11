import React, { Component } from 'react';
import './App.css';
import Calculator from "./Calculator"
import styled from "styled-components";


const Div = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  height: 100vh;
 
`
class App extends Component {
  render() {
    return (
      <Div>
        <Calculator />
      </Div>
    );
  }
}

export default App;
