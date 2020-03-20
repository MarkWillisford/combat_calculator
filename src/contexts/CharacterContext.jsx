import React, { createContext, Component } from 'react';
import { createBonus, setSum, createStat } from '../utility/statObjectFactories'
import { findGearSlotIndex } from '../utility/helperFunctions';
import * as optionsData from '../data/options';

export const CharacterContext = createContext();

class CharacterContextProvider extends Component {
  state = { 
    character: {
      "name":"unknown"
    },
    attackText:"attk",
    fullattkText:"fullattk",
    chargeText:"charge",
    mainHandAvailability:[],
    offHandAvailability:[],
    equipedGear:[],
    activeGear:[null, null, null, null, null,
                null, null, null, null, null,
                null, null, null, null, null,
                null, null],
    options:["fightingDefensively", "totalDefense"],
    activeOptions:[]
  }

  selectCharacter = (charName) => {
    let selectedCharacter;

    if(charName === "Slick"){
      selectedCharacter = require('../data/slick.json');
    } else if(charName === "Kah_Mei"){
      selectedCharacter = require('../data/kah_mei.json');
    } else {
      selectedCharacter = "unknown";
      // use a return to get out early
      return;
    }

    this.setState({ character: selectedCharacter }, () => {
      // We will use the character as the owned gear array
      // We now add the first item in each slot to the equipped gear list
      // TODO Add a original state to set back to upon switching to unknown char
      let newEquipedGear = [];
      Object.keys(this.state.character.gear.itemSlots).forEach((item) => {
        if(this.state.character.gear.itemSlots[item]){
          if(item !== "ring"){
            if(Array.isArray(this.state.character.gear.itemSlots[item])){
              this.equipGear(this.state.character.gear.itemSlots[item][0], findGearSlotIndex(item));
              newEquipedGear.push(this.state.character.gear.itemSlots[item][0]);
            } else {
              console.log("should never get here");
              // add item to equiped slots
              newEquipedGear.push(this.state.character.gear.itemSlots[item]);
              // add bonus
              this.equipGear(this.state.character.gear.itemSlots[item]);
            }
          } else {
            for(let j=0;j<2;j++){
              newEquipedGear.push(this.state.character.gear.itemSlots[item][j]);
              // add bonus
              let ringNum = j+1;
              this.equipGear(this.state.character.gear.itemSlots[item][j], findGearSlotIndex(item+ringNum));
            }
          }
        } else {
          newEquipedGear.push(this.state.character.gear.itemSlots[item]);
        }
      });
      
      // activate and equip the main hand weapon, and remove it from the available choices
      this.activateGear(this.state.character.gear.weapons[0], 15);
      let offHandArray3;
      let offHandArray1 = this.state.character.gear.weapons.slice(0 ,0);
      let offHandArray2 = this.state.character.gear.weapons.slice(0+1, this.state.character.gear.weapons.length+1);
      offHandArray3 = offHandArray1.concat(offHandArray2);

      this.setOffHandAvailability(offHandArray3);
      newEquipedGear.push(this.state.character.gear.weapons[0]);

      this.setState({ equipedGear: newEquipedGear });

      // apply character feats
      if(this.state.character.feats){
        let newOptions = this.state.options;
        for(let i=0; i<this.state.character.feats.length;i++){
          let str = this.state.character.feats[i].replace(/\s+/g, '');
          str = str.charAt(0).toLowerCase() + str.substring(1);

          if(optionsData[str]){
            newOptions.push(str);
          }
        }
        this.setState({ options:newOptions });
      }
    });

    this.setState({ mainHandAvailability: selectedCharacter.gear.weapons});
    this.setState({ offHandAvailability: selectedCharacter.gear.weapons});

    // Load custom options
    const abilities = selectedCharacter.abilities;
    let newOptions = this.state.options;
    for(let i=0;i<abilities.length;i++){
      let str = abilities[i].replace(/\s+/g, '');
      str = str.charAt(0).toLowerCase() + str.substring(1);
      newOptions.push(str);
    }
    
    this.setState({ options:newOptions });
  }

  setAttack = (text) => {
    this.setState({ attackText: text });
  }
  setFullAttack = (text) => {
    this.setState({ fullattkText: text });
  }
  setChargeAttack = (text) => {
    this.setState({ chargeText: text });
  }

  // Applying and removing Gear
  setMainHandAvailability = (weapons) => {
    this.setState({ mainHandAvailability: weapons });
  }
  setOffHandAvailability = (weapons) => {
    this.setState({ offHandAvailability: weapons });
  }
  equipGear = (item, index = null) => {
    // Get out if this is a null item
    if(item === null){
      return;
    }

    // If it is not a weapon, Add the bonus
    if(!item.criticalRage){
      for(let i=0;i<item.bonuses.length;i++){
        let bonus = createBonus({...item.bonuses[i], source:item.slot});
        this.addBonus(bonus);
      }
    }

    this.activateGear(item, index);
  }
  dequipGear = (item, index) => {
    // If it is not a weapon, remove the bonus
    if(item){
      console.log("not a weapon");
      console.log(item);
      for(let i=0;i<item.bonuses.length;i++){
        let bonus = createBonus({...item.bonuses[i], source:item.slot});
        this.removeBonus(bonus);
      }
    }
    
    this.deactivateGear(index);
  }
  activateGear = (item, index) => {
    // add the item to the active array
    let newActiveGear = this.state.activeGear;
    newActiveGear[index] = item;
    this.setState({ activeGear: newActiveGear });
  }
  deactivateGear = (index) => {
    let newActiveGear = this.state.activeGear;
    newActiveGear[index] = null;
    this.setState({ activeGear: newActiveGear });
  }
  
  activateOption = (option) => {
    let newActiveOptions = this.state.activeOptions;
    newActiveOptions.push(option);
    this.setState({ activeOptions:newActiveOptions });

    for(let i=0;i<option.bonuses.length;i++){
      let bonus = createBonus({...option.bonuses[i], name:option.name, duration:-1, source:option.name});
      this.addBonus(bonus);
    }
  }
  deactivateOption = (option) => {
    let newActiveOptions = this.state.activeOptions;
    let optionIndex = null;
    for(let i=0;i<newActiveOptions.length;i++){
      if(newActiveOptions[i] === option){
        optionIndex = i;
      }
    }
    newActiveOptions.splice(optionIndex, 1);
    this.setState({ activeOptions:newActiveOptions });

    for(let i=0;i<option.bonuses.length;i++){
      console.log(option);
      let bonus = createBonus({...option.bonuses[i], name:option.name, duration:-1, source:option.name});
      this.removeBonus(bonus);
    }
  }


  addBonus(bonus){
    let found = false;
    let foundAt = null;

    for(let i=0;i<this.state.character.characterStats.length;i++){
      if(this.state.character.characterStats[i].name === bonus.stat){
        found = true;
        foundAt = i;
      }
    }
    // Not found so we need a new stat created
    if(!found){
      // create the new "stat" object
      let newStat = createStat({
        name:bonus.stat,
        bonuses:[bonus]
      })
      newStat.sum = setSum(newStat);
      let characterStats = this.state.character.characterStats;
      characterStats.push(newStat);
      
      // adding a new stat
      this.setState(prevState => ({ character:{...prevState.character, characterStats:characterStats }}));      
    } else { 
      // We found it, add the bonus to the correct bonuses array
      let bonusesArray = this.state.character.characterStats[foundAt].bonuses;
      bonusesArray.push(bonus);
      
      let characterStats = this.state.character.characterStats;
      characterStats[foundAt].bonuses = bonusesArray;

      // now we adjust the sum object.
      let sum = setSum(this.state.character.characterStats[foundAt]);
      characterStats[foundAt].sum = sum;
      
      this.setState(prevState => ({ character:{...prevState.character, characterStats:characterStats }}));
    }
  }
  callSum(bonus){
    let found = false;
    let foundAt = null;

    for(let i=0;i<this.state.character.characterStats.length;i++){
      if(this.state.character.characterStats[i].name === bonus.stat){
        found = true;
        foundAt = i;
      }
    }

    let bonusesArray = this.state.character.characterStats[foundAt].bonuses;    
    let characterStats = this.state.character.characterStats;
    characterStats[foundAt].bonuses = bonusesArray;

    let sum = setSum(this.state.character.characterStats[foundAt]);
    characterStats[foundAt].sum = sum;
    
    this.setState(prevState => ({ character:{...prevState.character, characterStats:characterStats }}));
  }
  removeBonus(bonus){
    let statFoundAt = 0;
    
    for(let i=0;i<this.state.character.characterStats.length;i++){
      if(this.state.character.characterStats[i].name === bonus.stat){
        statFoundAt = i;
      }
    }
    let bonusesArray = this.state.character.characterStats[statFoundAt].bonuses.filter(b => b.source !== bonus.source);

    let characterStats = this.state.character.characterStats;
    characterStats[statFoundAt].bonuses = bonusesArray;

    // now we adjust the sum object.
    let sum = setSum(this.state.character.characterStats[statFoundAt]);
    characterStats[statFoundAt].sum = sum;
    
    //this.setState({ ...this.state.character, characterStats:characterStats});
    this.setState(prevState => ({ character:{...prevState.character, characterStats:characterStats }}));
  }

  // Applying and removing Buffs
  // Applying and removing Options

  
  render() { 
    return ( 
      <CharacterContext.Provider value={{...this.state, 
        selectCharacter: this.selectCharacter, 
        setAttack:this.setAttack, 
        setFullAttack:this.setFullAttack, 
        setChargeAttack:this.setChargeAttack,
        setMainHandAvailability:this.setMainHandAvailability, 
        setOffHandAvailability:this.setOffHandAvailability,
        equipGear:this.equipGear, 
        dequipGear:this.dequipGear,
        activateOption:this.activateOption,
        deactivateOption:this.deactivateOption
      }}>
        {this.props.children}
      </CharacterContext.Provider>
     );
  }
}
 
export default CharacterContextProvider;