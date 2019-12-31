import React from 'react';
import '../css/navBar.css';

class NavBar extends React.Component {
  render(){
    return (
      <div className="navBar">
        <div className="title">Combat Calculator</div>
        <div className="hamburgerContainer"><i className="fas fa-bars"></i></div>
      </div>
    );
  }
}

export default NavBar;