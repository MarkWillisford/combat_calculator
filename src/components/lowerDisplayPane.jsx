import React from 'react';
import '../css/lowerDisplayPane.css';

class LowerDisplayPane extends React.Component {
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
      <div className="lowerDisplayPane">
        <div className>

        </div>
        <div className="title" onClick={(e)=>this.togglePanel(e)}>
          OPTIONS
        </div>
      </div>
    );
  }
}

export default LowerDisplayPane;