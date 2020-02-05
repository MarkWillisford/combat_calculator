import React, { Component } from 'react';
import '../css/actionButtons.css';
import { CharacterContext } from '../contexts/CharacterContext';

class ActionButtons extends Component{  
  static contextType = CharacterContext;


  /**************************/
  /* Helper Functions       */
  /**************************/

  getStatSum(characterStats, stat){
    for(let i=0;i<characterStats.length;i++){
      if(characterStats[i].name === stat){
        return characterStats[i].sum.total;
      }
    }
  }

  getAbilityScoreMod(num){
    const mod = Math.floor((num - 10) / 2);
    return mod;
  }

  /**************************/
  /* Attack Logic           */
  /**************************/

  attackLogic(character, weapon){
    /**************************/
    /* Attack Logic           */
    /**************************/
    let attack = this.getStatSum(character.characterStats, "bab");
    attack += weapon.enhancement;
    let damage = weapon.enhancement;
    let damageDice = character.size === 0 ? weapon.damage[1] : weapon.damage[0];
    
    /********************************************/
    /* Checks for feats and applicable weapons  */
    /********************************************/

    // Weapon Finesse
    if(character.feats.includes("Weapon Finesse")){
      // written as is for ease of reading
      let stat = this.getStatSum(character.characterStats, "dexterity");
      let mod = this.getAbilityScoreMod(stat);
      attack += mod;
    } else {
      let stat = this.getStatSum(character.characterStats, "strength");
      let mod = this.getAbilityScoreMod(stat);
      attack += mod;
    }
    
    // Weapon Focus
    for(let i=0;i<character.feats.length;i++){
      if(character.feats[i].indexOf("Weapon Focus") > -1){
        if(character.feats[i].indexOf(weapon.weapon) > -1){
          attack += 1;
        }
      }
    }

    // "Combat Expertise"
    // "Power Attack"

    // Smite Evil
    // Ser
    // "Accomplished Sneak Attacker"
    // Stolen Fury
    // Dodge

    return attack;
  }

  /**************************/
  /* Button Handlers        */
  /**************************/

  handleAttack(){
    const { character, setAttack, activeGear } = this.context;
    const weapon = activeGear[15];

    if(character.name === "unknown"){
      alert("Please Select a Character");
      return;
    }

    let attackText = "+" + this.attackLogic(character, weapon);
    setAttack(attackText);
  }
  handleFullAttack(){
    const { character, setFullAttack } = this.context;
    if(character.name === "unknown"){
      alert("Please Select a Character");
      return;
    }
    
    let fullAttackText = "+" + this.attackLogic(character);

    /**************************/
    /* Full Attack Logic      */
    /**************************/

    // "Two Weapon Fighting"

    setFullAttack(fullAttackText);
  }
  handleChargeAttack(){
    const { character, setChargeAttack } = this.context;
    if(character.name === "unknown"){
      alert("Please Select a Character");
      return;
    }
    let chargeAttackText = "+" + this.attackLogic(character);

    /**************************/
    /* Charge Attack Logic    */
    /**************************/

    setChargeAttack(chargeAttackText);

  }

  render(){
    return (
      <CharacterContext.Consumer>{(context) => {
        const { attackText, fullattkText, chargeText} = context;
  
        return(
          <div className="actionButtons">
            <div className="actionButtonWrapper" >
              <button className="actionButton" id="attk_Button" onClick={this.handleAttack.bind(this)}>Attack</button>
            </div>
            <div className="actionLabelWrapper">{attackText}</div>
            <div className="actionButtonWrapper" >
              <button className="actionButton" id="fullattk_Button" onClick={this.handleFullAttack.bind(this)}>Full Attack</button></div>
            <div className="actionLabelWrapper">{fullattkText}</div>
            <div className="actionButtonWrapper" >
              <button className="actionButton" id="charge_Button" onClick={this.handleChargeAttack.bind(this)}>Charge</button></div>
            <div className="actionLabelWrapper">{chargeText}</div>
          </div>
        )
      }}</CharacterContext.Consumer>
    );
  }
}

export default ActionButtons;