import React from 'react';
/* import logo from './logo.svg'; */
import './App.css';

import Calculator from './components/calculator';
import NavBar from './components/navBar';

function App() {
  return (
    <div className="App">
      <NavBar />
      <Calculator />
    </div>
  );
}

export default App;
