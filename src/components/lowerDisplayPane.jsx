import React from 'react';
import { CharacterContext } from '../contexts/CharacterContext';
import * as optionsData from '../data/options';
import ToggleSwitch from './toggleSwitch';
import '../css/lowerDisplayPane.css';

class LowerDisplayPane extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      open:false
    }
    this.togglePanel = this.togglePanel.bind(this);
  }
  static contextType = CharacterContext;

  togglePanel(e){
    (e.target.parentNode.classList.contains("lowerExpanded") ? this.closePanel(e.target.parentNode) : this.openPanel(e.target.parentNode))    
    // (e.target.parentNode.classList.contains("expanded") ? e.target.classList.add("wide") : e.target.classList.remove("wide"));
  }

  closePanel(element){
    element.classList.remove("lowerExpanded");
    element.lastChild.classList.add("hidden");
    element.firstChild.classList.remove("wide");
  }
  openPanel(element){
    element.classList.add("lowerExpanded");
    element.lastChild.classList.remove("hidden");
    element.firstChild.classList.add("wide");
  }

  toggleSwitch(e, option){
    const { activateOption, deactivateOption } = this.context;

    if(e.target.checked){
      console.log("checked");
      activateOption(option);
    } else {
      deactivateOption(option);
    }
  }

  render(){
    return (
      <CharacterContext.Consumer>{(context) => {
        const { options, activeOptions } = context;
        let cbData = [];
        options.map((option) => (
          cbData.push(optionsData[option])
        ));
        
        return(
          <div className="lowerDisplayPane">
            <div className="title" onClick={(e)=>this.togglePanel(e)}>
              OPTIONS
            </div>
            <div className="optionButtons hidden">
              { cbData.map((option, index) => (
                <ToggleSwitch key={index} slot={option.name} cb={(e)=>this.toggleSwitch(e, option)} 
                item={option} active={activeOptions.includes(option) ? true : false}/>
              ))}
              {/* 
                Power Attack, Combat Expertise, Ser, Smite Evil, 
               */}
            </div>
          </div>
        )
      }}</CharacterContext.Consumer>
    );
  }
}

export default LowerDisplayPane;