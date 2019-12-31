import React from 'react';
import '../css/rightDisplayPane.css';

class RightDisplayPanes extends React.Component {
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
      <div className="rightDisplayPane">
        <div className>

        </div>
        <div className="title" onClick={(e)=>this.togglePanel(e)}>
          BUFFS
        </div>
      </div>
    );
  }
}

export default RightDisplayPanes;