import React, { Component } from 'react';
import '../css/actionButtons.css';
import { CharacterContext } from '../contexts/CharacterContext';
import * as optionsData from '../data/options';

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

  attackLogic(character, weapon, whichAttack, activeOptions, irative){
    /**************************/
    /* Attack Logic           */
    /**************************/
    let statsOutput = {
      attackBonus: 0,
      damageBonus: 0,
      damageDice: "",
      AC:0,
      FFAC:0,
      TAC:0,
    }

    statsOutput.attackBonus = this.getStatSum(character.characterStats, "bab") - ((irative-1)*5);
    console.log("adding bab");
    console.log(this.getStatSum(character.characterStats, "bab") - ((irative-1)*5));
    statsOutput.attackBonus += weapon.enhancement;
    console.log("adding weapon enhancement to attack and dam");
    console.log(weapon.enhancement);
    statsOutput.damageBonus = weapon.enhancement;
    statsOutput.damageDice = character.size === 0 ? weapon.damage[1] : weapon.damage[0];
    
    /********************************************/
    /*     Checks for existing stat bonuses     */
    /********************************************/
    const atkBonus = this.getStatSum(character.characterStats, "attack");
    const damBonus = this.getStatSum(character.characterStats, "damage");
    statsOutput.attackBonus += isNaN(atkBonus) ? 0 : atkBonus;
    statsOutput.damageBonus += isNaN(damBonus) ? 0 : damBonus;    
    console.log("adding existing attk");
    console.log(atkBonus);
    console.log("adding existing dam");
    console.log(damBonus);
    
    /********************************************/
    /* Checks for feats and applicable weapons  */
    /********************************************/

    // Weapon Finesse
    if(character.feats.includes("Weapon Finesse")){
      // written as is for ease of reading
      let stat = this.getStatSum(character.characterStats, "dexterity");
      let mod = this.getAbilityScoreMod(stat);
      statsOutput.attackBonus += mod;
      console.log("adding dex");
      console.log(mod);
    } else {
      let stat = this.getStatSum(character.characterStats, "strength");
      let mod = this.getAbilityScoreMod(stat);
      statsOutput.attackBonus += mod;
      console.log("adding str");
      console.log(mod);
    }
    
    // Weapon Focus
    for(let i=0;i<character.feats.length;i++){
      if(character.feats[i].indexOf("Weapon Focus") > -1){
        if(character.feats[i].indexOf(weapon.weapon) > -1){
          statsOutput.attackBonus += 1;
          console.log("adding WF");
          console.log("1");
        }
      }
    }

    // "Combat Expertise"
    // "Power Attack"
    // "Smite Evil"
    Object.keys(optionsData.checks).forEach((call) => {
      optionsData.checks[call](activeOptions, character, this.getStatSum, whichAttack, statsOutput, irative);
    })

    // Ser
    for(let i=0;i<activeOptions.length;i++){
      if(activeOptions[i].name === "Ser"){
        statsOutput.damageDice += " +1d6 (Sacred)";
      }
    }

    return statsOutput;
  }

  /**************************/
  /* Button Handlers        */
  /**************************/

  handleAttack(){
    const { character, setAttack, activeGear, activeOptions } = this.context;
    const weapon = activeGear[15];
    const offWeapon = activeGear[16];
    const irative = 1;
    let whichAttack;

    if(character.name === "unknown"){
      alert("Please Select a Character");
      return;
    }
    if(!weapon){
      alert("Please equip a weapon");
      return;
    }

    if(!offWeapon){
      whichAttack = "twoHanded";
    } else{
      whichAttack = "main";
    }
    const attackStatsObject = this.attackLogic(character, weapon, whichAttack, activeOptions, irative);
    console.log(attackStatsObject);

    let attackText = "+" + attackStatsObject.attackBonus + " (" + attackStatsObject.damageDice + " + " + attackStatsObject.damageBonus + ")";
    setAttack(attackText);
  }
  handleFullAttack(){
    const { character, setFullAttack, activeGear, activeOptions } = this.context;
    const weapon = activeGear[15];
    const offWeapon = activeGear[16];
    const irative = 1;
    let whichAttack;
    let attackTextArray = [];

    if(character.name === "unknown"){
      alert("Please Select a Character");
      return;
    }
    if(!weapon){
      alert("Please equip a weapon");
      return;
    }

    /**************************/
    /* Full Attack Logic      */
    /**************************/
    if(!offWeapon){
      // we are only wielding one weapon, procede as normal
      whichAttack = "twoHanded";
      let bab = this.getStatSum(character.characterStats, "bab");
      let counter = 1;
      for(let i=bab;i>0;i-=5){
        let attackText = {};
        const irative = counter;
        const attackStatsObject = this.attackLogic(character, weapon, whichAttack, activeOptions, irative);
        console.log(attackStatsObject);
        attackText.attackBonus = "+" + attackStatsObject.attackBonus;
        attackText.damageBonus = " (" + attackStatsObject.damageDice + " + " + attackStatsObject.damageBonus + ")";
        counter++;
        attackTextArray.push(attackText);
      }
    } else{
      // "Two Weapon Fighting"

    }

    console.log(attackTextArray);

    let attackText="array";
    setFullAttack(attackText);
  }
  handleChargeAttack(){
    const { character, setChargeAttack } = this.context;
    if(character.name === "unknown"){
      alert("Please Select a Character");
      return;
    }
    // let chargeAttackText = "+" + this.attackLogic(character);

    /**************************/
    /* Charge Attack Logic    */
    /**************************/

    // setChargeAttack(chargeAttackText);

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