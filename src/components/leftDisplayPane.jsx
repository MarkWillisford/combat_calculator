import React from 'react';
import '../css/leftDisplayPane.css';
import '../css/checkbox.css';
import { CharacterContext } from '../contexts/CharacterContext';
import ToggleSwitch from './toggleSwitch';

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
    const { character, setOffHandAvailability, equipGear, dequipGear } = this.context;

    // get the selected weapon
    let weapon = null;
    let index;
    for(let i=0;i<character.gear.weapons.length;i++){
      if(character.gear.weapons[i].name === e.target.value){
        weapon = character.gear.weapons[i];
        index = i;
      }
    }
    if(weapon){
      equipGear(weapon, 15);
    } else {
      dequipGear(weapon, 15);
    }
    
    // create an array of options for the other select element
    let offHandArray3;
    if(index){
      let offHandArray1 = character.gear.weapons.slice(0 ,index);
      let offHandArray2 = character.gear.weapons.slice(index+1, character.gear.weapons.length+1);
      offHandArray3 = offHandArray1.concat(offHandArray2);
    } else {
      offHandArray3 = character.gear.weapons;
    }

    setOffHandAvailability(offHandArray3);
  }
  handleOffWeaponChange(e){
    const { character, setMainHandAvailability, equipGear, dequipGear } = this.context;

    // get the selected weapon
    let weapon = null;
    let index;
    for(let i=0;i<character.gear.weapons.length;i++){
      if(character.gear.weapons[i].name === e.target.value){
        weapon = character.gear.weapons[i];
        index = i;
      }
    }
    if(weapon){
      equipGear(weapon, 16);
    } else {
      dequipGear(weapon, 16)
    }
    // create an array of options for the other select element
    let mainHandArray3;
    if(index){
      let mainHandArray1 = character.gear.weapons.slice(0 ,index);
      let mainHandArray2 = character.gear.weapons.slice(index+1, character.gear.weapons.length+1);
      mainHandArray3 = mainHandArray1.concat(mainHandArray2);
    } else {
      mainHandArray3 = character.gear.weapons;
    }

    setMainHandAvailability(mainHandArray3);
  }
  toggleSwitch(e, item, index){
    const { equipGear, dequipGear } = this.context;
    /*******************/
    /* Here I am going to pass the item back and if checked = true then add the buff, 
    /* if false, then remove it.
    /*******************/

    if(e.target.checked){
      equipGear(item, index);
    } else {
      dequipGear(item, index);
    }
  }

  render(){
    return (
      <CharacterContext.Consumer>{(context) => {
        const { mainHandAvailability, offHandAvailability, equipedGear, activeGear } = context;
        const slots = ["Head", "Headband", "Eyes", "Shoulders", "Neck", "Chest", "Body", 
          "Armor", "Belt", "Wrists", "Hands", "Shield", "Ring1", "Ring2", "Feet"];

        return(
          <div className="leftDisplayPane">
            <div className="title" onClick={(e)=>this.togglePanel(e)}>
              GEAR
            </div>
            <div className="gearButtons hidden">
              { slots.map((s, index) => (<ToggleSwitch key={index} slot={s} cb={(e)=>this.toggleSwitch(e, equipedGear[index], index)} 
                item={equipedGear[index]} /* owned={gearlist} */ active={activeGear[index]}/>)) }
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
      }}</CharacterContext.Consumer>
    );
  }
}

export default LeftDisplayPane;

/* const gearButtonDiv = (slot) => {
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
} */