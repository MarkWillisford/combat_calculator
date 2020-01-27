import React, { createContext, Component } from 'react';
import { createBonus, setSum, createStat } from '../utility/statObjectFactories'

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
    equipedGear:[]
  }

  selectCharacter = (charName) => {
    let selectedCharacter;

    if(charName === "Slick"){
      selectedCharacter = require('../data/slick.json');
    } else if(charName === "Kah_Mei"){
      selectedCharacter = require('../data/kah_mei.json');
    } else {
      selectedCharacter = "unknown";
    }

    this.setState({ character: selectedCharacter }, () => {
      let newEquipedGear = [];
      Object.keys(this.state.character.gear.itemSlots).forEach((item) => {
        if(this.state.character.gear.itemSlots[item]){
          if(item !== "ring"){
            if(Array.isArray(this.state.character.gear.itemSlots[item])){
              // this.equipGear(this.state.character.gear.itemSlots[item][0]);
              console.log("you own too many of these");
            } else {
              // add item to equiped slots
              newEquipedGear.push(this.state.character.gear.itemSlots[item]);
              // add bonus
              this.equipGear(this.state.character.gear.itemSlots[item]);
            }
          } else {
            for(let j=0;j<2;j++){
              newEquipedGear.push(this.state.character.gear.itemSlots[item][j]);
              // add bonus
              this.equipGear(this.state.character.gear.itemSlots[item][j]);
            }
          }
        } else {
          newEquipedGear.push(this.state.character.gear.itemSlots[item]);
        }
      })

      this.setState({ equipedGear: newEquipedGear });
    });

    this.setState({ mainHandAvailability: selectedCharacter.gear.weapons});
    this.setState({ offHandAvailability: selectedCharacter.gear.weapons});
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
  equipGear = (item) => {
    for(let i=0;i<item.bonuses.length;i++){
      let bonus = createBonus({...item.bonuses[i], source:item.slot});
      this.addBonus(bonus);
    }
  }
  dequipGear = (item) => {
    console.log("in dequipGear");
    console.log(item);
    /***************************************/
    /* Adding removal and adding of gear. needs to draw data from owned gear in the char for name and availablity,
    /* Maybe the char needs a reorganization of data?
    /***************************************/
    for(let i=0;i<item.bonuses.length;i++){
      let bonus = createBonus({...item.bonuses[i], source:item.slot});
      this.removeBonus(bonus);
    }
    
    let newEquipedGear = this.state.equipedGear;
    for(let i=0;i<newEquipedGear.length;i++){
      if(newEquipedGear[i] === item){
        //newEquipedGear = newEquipedGear.splice(i, 1);
        newEquipedGear[i] = null;
      }
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
    console.log("in removeBonus");
    console.log(bonus);
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
        dequipGear:this.dequipGear        
      }}>
        {this.props.children}
      </CharacterContext.Provider>
     );
  }
}
 
export default CharacterContextProvider;