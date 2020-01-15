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
    let character;

    if(charName === "Slick"){
      character = require('../data/slick.json');
    } else if(charName === "Kah_Mei"){
      character = require('../data/kah_mei.json');
    } else {
      character = "unknown";
    }
    let newEquipedGear = [];
    Object.keys(character.gear.wonderousItems).forEach((item) => {
      if(character.gear.wonderousItems[item]){  
        if(item !== "ring"){
          newEquipedGear.push(character.gear.wonderousItems[item]);
        } else {
          for(let j=0;j<2;j++){
            newEquipedGear.push(character.gear.wonderousItems[item][j]);
          }
        }
      } else {
        newEquipedGear.push(character.gear.wonderousItems[item]);
      }
    })
    newEquipedGear.splice(7, 0, character.gear.armor);
    newEquipedGear.splice(11, 0, (character.gear.shield));

    this.setState({ character: character });
    this.setState({ mainHandAvailability: character.gear.weapons});
    this.setState({ offHandAvailability: character.gear.weapons});

    console.log(newEquipedGear);
    this.setState({ equipedGear: newEquipedGear });
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
    for(let i=0;i<item.bonuses.length;i++){
      let bonus = createBonus({...item.bonuses[i], source:item.slot});
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
      // adding a new stat
      this.setState(prevState => ({
        character:{
          ...prevState.character, characterStats:[
            ...prevState.character.characterStats, createStat({
              name:bonus.name,
              bonuses:[bonus]
            })
          ]
        }
      }))
    } else { 
      // We found it, add the bonus to the correct bonuses array
      let bonusesArray = this.state.character.characterStats[foundAt].bonuses;
      bonusesArray.push(bonus);
      
      let characterStats = this.state.character.characterStats;
      characterStats[foundAt].bonuses = bonusesArray;

      // now we adjust the sum object.
      let sum = setSum(this.state.character.characterStats[foundAt]);
      characterStats[foundAt].sum = sum;
      
      this.setState({ ...this.state.character, characterStats:characterStats});
    }
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
    
    this.setState({ ...this.state.character, characterStats:characterStats});
  }

  // Applying and removing Buffs
  // Applying and removing Options

  
  render() { 
    return ( 
      <CharacterContext.Provider value={{...this.state, selectCharacter: this.selectCharacter, 
        setAttack:this.setAttack, setFullAttack:this.setFullAttack, setChargeAttack:this.setChargeAttack,
        setMainHandAvailability:this.setMainHandAvailability, setOffHandAvailability:this.setOffHandAvailability,
        equipedGear:this.equipedGear, equipGear:this.equipGear, dequipGear:this.dequipGear        
      }}>
        {this.props.children}
      </CharacterContext.Provider>
     );
  }
}
 
export default CharacterContextProvider;