import React from 'react';
import '../css/leftDisplayPane.css';
import '../css/checkbox.css';
import { CharacterContext } from '../contexts/CharacterContext';
import ToggleSwitch from './toggleSwitch';
import { createBonus } from '../utility/statObjectFactories'

class LeftDisplayPane extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      open:false,

    }
    this.togglePanel = this.togglePanel.bind(this);
  }
  static contextType = CharacterContext;

  togglePanel(e){
    console.log("toggling");
    (e.target.parentNode.classList.contains("expanded") ? this.closePanel(e.target.parentNode.classList) : this.openPanel(e.target.parentNode.classList))    
  }
  closePanel(element){
    element.remove("expanded");

  }
  openPanel(element){
    element.add("expanded");
  }


  handleMainWeaponChange(e){
    const { character, setOffHandAvailability } = this.context;

    // get the selected weapon
    let weapon = {};
    let index;
    for(let i=0;i<character.gear.weapons.length;i++){
      if(character.gear.weapons[i].name === e.target.value){
        weapon = character.gear.weapons[i];
        index = i;
      }
    }
    
    // create an array of options for the other select element
    let offHandArray1 = character.gear.weapons.slice(0 ,index);
    let offHandArray2 = character.gear.weapons.slice(index+1, character.gear.weapons.length+1);
    let offHandArray3 = offHandArray1.concat(offHandArray2);

    setOffHandAvailability(offHandArray3);
  }
  handleOffWeaponChange(e){
    const { character, setMainHandAvailability } = this.context;

    // get the selected weapon
    let weapon = {};
    let index;
    for(let i=0;i<character.gear.weapons.length;i++){
      if(character.gear.weapons[i].name === e.target.value){
        weapon = character.gear.weapons[i];
        index = i;
      }
    }
    
    // create an array of options for the other select element
    let mainHandArray1 = character.gear.weapons.slice(0 ,index);
    let mainHandArray2 = character.gear.weapons.slice(index+1, character.gear.weapons.length+1);
    let mainHandArray3 = mainHandArray1.concat(mainHandArray2);

    setMainHandAvailability(mainHandArray3);
  }
  toggleSwitch(e, item){
    const { equipGear, dequipGear } = this.context;
    let bonuses = item.bonuses;
    
    if(e.target.checked){
      equipGear(item);
    } else {
      dequipGear(item);
    }
    /*******************/
    /* Here I am going to pass the item back and if checked = true then add the buff, 
    /* if false, then remove it.
    /*******************/
  }

  render(){
    return (
      <CharacterContext.Consumer>{(context) => {
        const { character, mainHandAvailability, offHandAvailability } = context;
        if(character.name !== "unknown"){
          return(
            <div className="leftDisplayPane">
              <div className="title" onClick={(e)=>this.togglePanel(e)}>
                GEAR
              </div>
              <div className="gearButtons">
                {<ToggleSwitch slot="Head" cb={(e)=>this.toggleSwitch(e, character.gear.wonderousItems.head)}item={character.gear.wonderousItems.head}/>}
                {<ToggleSwitch slot="Headband" cb={(e)=>this.toggleSwitch(e, character.gear.wonderousItems.headband)} item={character.gear.wonderousItems.headband}/>}
                {<ToggleSwitch slot="Eyes" cb={(e)=>this.toggleSwitch(e, character.gear.wonderousItems.eyes)} item={character.gear.wonderousItems.eyes}/>}
                {<ToggleSwitch slot="Shoulders" cb={(e)=>this.toggleSwitch(e, character.gear.wonderousItems.shoulders)} item={character.gear.wonderousItems.shoulders}/>}
                {<ToggleSwitch slot="Neck" cb={(e)=>this.toggleSwitch(e)} item={character.gear.wonderousItems.neck}/>}
                {<ToggleSwitch slot="Chest" cb={(e)=>this.toggleSwitch(e, character.gear.wonderousItems.chest)} item={character.gear.wonderousItems.chest}/>}
                {<ToggleSwitch slot="Body" cb={(e)=>this.toggleSwitch(e, character.gear.wonderousItems.body)} item={character.gear.wonderousItems.body}/>}
                {<ToggleSwitch slot="Armor" cb={(e)=>this.toggleSwitch(e)} item={null}/>}
                {<ToggleSwitch slot="Belt" cb={(e)=>this.toggleSwitch(e, character.gear.wonderousItems.belt)} item={character.gear.wonderousItems.belt}/>}
                {<ToggleSwitch slot="Wrists" cb={(e)=>this.toggleSwitch(e, character.gear.wonderousItems.wrists)} item={character.gear.wonderousItems.wrists}/>}
                {<ToggleSwitch slot="Hands" cb={(e)=>this.toggleSwitch(e, character.gear.wonderousItems.hands)} item={character.gear.wonderousItems.hands}/>}
                {<ToggleSwitch slot="Shield" cb={(e)=>this.toggleSwitch(e)} item={null}/>}
                {<ToggleSwitch slot="Ring1" cb={(e)=>this.toggleSwitch(e, character.gear.wonderousItems.ring[0])} item={character.gear.wonderousItems.ring[0]}/>}
                {<ToggleSwitch slot="Ring2" cb={(e)=>this.toggleSwitch(e, character.gear.wonderousItems.ring[1])} item={character.gear.wonderousItems.ring[1]}/>}
                {<ToggleSwitch slot="Feet" cb={(e)=>this.toggleSwitch(e, character.gear.wonderousItems.feet)} item={character.gear.wonderousItems.feet}/>}
                <div className="gearButtonDiv" id="mainHand">
                  Main Hand
                  <select onChange={this.handleMainWeaponChange.bind(this)}>
                    <option value="-1">Select</option>
                    { mainHandAvailability.map((w) => <option key={w.name} value={w.name}>{w.name}</option>) }) }
                  </select>
                </div>
                <div className="gearButtonDiv" id="offHand">
                  Off Hand
                  <select onChange={this.handleOffWeaponChange.bind(this)}>
                    <option value="-1">Select</option>
                    { offHandAvailability.map((w) => <option key={w.name} value={w.name}>{w.name}</option>) }) }
                  </select>
                </div>
              </div>
            </div>
          )
        } else {
          return(            
            <div className="leftDisplayPane">
              <div className="title" onClick={(e)=>this.togglePanel(e)}>
                GEAR
              </div>
              <div className="gearButtons"> </div>            
            </div>
          )
        }
      }}</CharacterContext.Consumer>
    );
  }
}

export default LeftDisplayPane;

const gearButtonDiv = (slot) => {
  return ( 
    <div className="gearButtonDiv" id={slot}>
      <div>{slot}</div>                  
      <div class="el-checkbox el-checkbox-lg">
        <label class="el-switch">
          <input type="checkbox" name="switch"></input>
          <span class="el-switch-style"></span>
        </label>
      </div>
    </div>
   );
}