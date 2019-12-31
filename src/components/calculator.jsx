import React from 'react';
import '../css/calculator.css';
import LeftDisplayPane from './leftDisplayPane';
import CenterDisplayPane from './centerDisplayPane';
import RightDisplayPane from './rightDisplayPane';
import CharacterContextProvider from '../contexts/CharacterContext';


class Calculator extends React.Component {
  render(){
    return (
      <div className="container">
        <CharacterContextProvider>
          <LeftDisplayPane />
          <CenterDisplayPane />
          <RightDisplayPane />
        </CharacterContextProvider>
      </div>
    );
  }
}

export default Calculator;