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

  togglePanel(e){
    (e.target.parentNode.classList.contains("expanded") ? e.target.parentNode.classList.remove("expanded") : e.target.parentNode.classList.add("expanded")); 
    (e.target.parentNode.classList.contains("expanded") ? e.target.classList.add("wide") : e.target.classList.remove("wide"));
  }

  toggleSwitch(e, bonus){
    let array = bonus();
    console.log(array)
  }

  render(){
    return (
      <CharacterContext.Consumer>{(context) => {
        const { options } = context;
        let cbData = [];
        options.map((o) => (
          cbData.push(optionsData[o])
        ));
        
        return(
          <div className="lowerDisplayPane">
            <div className="title" onClick={(e)=>this.togglePanel(e)}>
              OPTIONS
            </div>
            <div className="optionButtons hidden">
              { cbData.map((o, index) => (
                <ToggleSwitch key={index} slot={o} cb={(e)=>this.toggleSwitch(e, o)} 
                item={o} /* owned={gearlist} */ active={true}/>
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