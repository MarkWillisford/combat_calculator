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
    (e.target.parentNode.classList.contains("expanded") ? this.closePanel(e.target.parentNode) : this.openPanel(e.target.parentNode))    
  }
  closePanel(element){
    element.classList.remove("expanded");
    element.lastChild.classList.add("hidden");
  }
  openPanel(element){
    element.classList.add("expanded");
    element.lastChild.classList.remove("hidden");
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
    /*******************/
    /* Here I am going to pass the item back and if checked = true then add the buff, 
    /* if false, then remove it.
    /*******************/

    if(e.target.checked){
      equipGear(item);
    } else {
      console.log("removing gear");
      dequipGear(item);
    }
  }

  render(){
    return (
      <CharacterContext.Consumer>{(context) => {
        const { character, mainHandAvailability, offHandAvailability, equipedGear } = context;
        const slots = ["Head", "Headband", "Eyes", "Shoulders", "Neck", "Chest", "Body", 
          "Armor", "Belt", "Wrists", "Hands", "Shield", "Ring1", "Ring2", "Feet"];
        let equipedGearArray = [];
        if(character.name !== "unknown"){ 
          equipedGearArray = equipedGear;
        }

          return(
            <div className="leftDisplayPane">
              <div className="title" onClick={(e)=>this.togglePanel(e)}>
                GEAR
              </div>
              <div className="gearButtons hidden">
                {/* {<ToggleSwitch slot="Head" cb={(e)=>this.toggleSwitch(e, character.gear.itemSlots.head)}item={character.gear.itemSlots.head}/>}
                {<ToggleSwitch slot="Headband" cb={(e)=>this.toggleSwitch(e, character.gear.itemSlots.headband)} item={character.gear.itemSlots.headband}/>}
                {<ToggleSwitch slot="Eyes" cb={(e)=>this.toggleSwitch(e, character.gear.itemSlots.eyes)} item={character.gear.itemSlots.eyes}/>}
                {<ToggleSwitch slot="Shoulders" cb={(e)=>this.toggleSwitch(e, character.gear.itemSlots.shoulders)} item={character.gear.itemSlots.shoulders}/>}
                {<ToggleSwitch slot="Neck" cb={(e)=>this.toggleSwitch(e)} item={character.gear.itemSlots.neck}/>}
                {<ToggleSwitch slot="Chest" cb={(e)=>this.toggleSwitch(e, character.gear.itemSlots.chest)} item={character.gear.itemSlots.chest}/>}
                {<ToggleSwitch slot="Body" cb={(e)=>this.toggleSwitch(e, character.gear.itemSlots.body)} item={character.gear.itemSlots.body}/>}
                {<ToggleSwitch slot="Armor" cb={(e)=>this.toggleSwitch(e)} item={null}/>}
                {<ToggleSwitch slot="Belt" cb={(e)=>this.toggleSwitch(e, character.gear.itemSlots.belt)} item={character.gear.itemSlots.belt}/>}
                {<ToggleSwitch slot="Wrists" cb={(e)=>this.toggleSwitch(e, character.gear.itemSlots.wrists)} item={character.gear.itemSlots.wrists}/>}
                {<ToggleSwitch slot="Hands" cb={(e)=>this.toggleSwitch(e, character.gear.itemSlots.hands)} item={character.gear.itemSlots.hands}/>}
                {<ToggleSwitch slot="Shield" cb={(e)=>this.toggleSwitch(e)} item={null}/>}
                {<ToggleSwitch slot="Ring1" cb={(e)=>this.toggleSwitch(e, character.gear.itemSlots.ring[0])} item={character.gear.itemSlots.ring[0]}/>}
                {<ToggleSwitch slot="Ring2" cb={(e)=>this.toggleSwitch(e, character.gear.itemSlots.ring[1])} item={character.gear.itemSlots.ring[1]}/>}
                {<ToggleSwitch slot="Feet" cb={(e)=>this.toggleSwitch(e, character.gear.itemSlots.feet)} item={character.gear.itemSlots.feet}/>}
                */}
                { slots.map((s, index) => (<ToggleSwitch key={index} slot={s} cb={(e)=>this.toggleSwitch(e, equipedGearArray[index])} 
                  item={equipedGearArray[index]}/>)) }
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
       /*  } else {
          return(            
            <div className="leftDisplayPane">
              <div className="title" onClick={(e)=>this.togglePanel(e)}>
                GEAR
              </div>       
            </div>
          )
        } */
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