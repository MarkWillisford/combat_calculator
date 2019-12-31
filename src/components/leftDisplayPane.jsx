import React from 'react';
import '../css/leftDisplayPane.css';

class LeftDisplayPane extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      open:false
    }
    this.togglePanel = this.togglePanel.bind(this);
  }

  togglePanel(e){
    console.log("toggling");
    (e.target.parentNode.classList.contains("expanded") ? e.target.parentNode.classList.remove("expanded") : e.target.parentNode.classList.add("expanded"))    
  }

  render(){
    return (
      <div className="leftDisplayPane">
        <div className="title" onClick={(e)=>this.togglePanel(e)}>
          GEAR
        </div>
        <div className>

        </div>
      </div>

    );
  }
}

export default LeftDisplayPane;