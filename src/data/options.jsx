import { act } from "react-dom/test-utils"

/******************/
/*    ACTIONS     */
/******************/
export const fightingDefensively = {
  "name":"Fighting Defensively",
  "bonuses":[
    {
      "stat":"attack",
      "type":"untyped",
      "amount":-4
    },{
      "stat":"armorClass",
      "type":"dodge",
      "amount":2
    }
  ]
}

export const totalDefense = {
  "name":"Total Defense",
  "bonuses":[
    {
      "stat":"armorClass",
      "type":"dodge",
      "amount":4
    }
  ]
}

/*******************/
/*    ABILITES     */
/*******************/
export const ser = {
  "name":"Ser",
  "bonuses":[]
}

export const smiteEvil = {
  "name":"Smite Evil",
  "bonuses":[]
}

export const sneakAttack = {
  "name":"Sneak Attack",
  "bonuses":[]
}

/****************/
/*    FEATS     */
/****************/
export const combatExpertise = {
  "name":"Combat Expertise",
  "bonuses":[]
}

export const powerAttack = {
  "name":"Power Attack",
  "bonuses":[]
}

export const checks = {
  "powerAttack": function(activeOptions, character, getStatSum, whichAttack, statsOutput) {
    for(let i=0;i<activeOptions.length;i++){
      if(activeOptions[i].name === "Power Attack"){
        console.log("running Power Attack calculations");
        let bab = getStatSum(character.characterStats, "bab");
        let attk = -Math.ceil(bab/4);
        let damage = -2*attk;

        // check for which attack
        if(whichAttack === "off"){
          damage = damage*.5;
        } else if (whichAttack === "twoHanded"){
          damage = damage*1.5;
        }
        
        statsOutput.attackBonus += attk;
        statsOutput.damageBonus += damage;
      }
    }
  },  
  "combatExpertise": function(activeOptions, character, getStatSum, whichAttack, statsOutput) {
    for(let i=0;i<activeOptions.length;i++){
      if(activeOptions[i].name === "Combat Expertise"){
        let bab = getStatSum(character.characterStats, "bab");
        let attk = -Math.ceil(bab/4);
        let ac = attk;

        statsOutput.attackBonus += attk;
        statsOutput.AC += ac;
      }
    }
  }, 
  "smiteEvil": function(activeOptions, character, getStatSum, whichAttack, statsOutput) {
    for(let i=0;i<activeOptions.length;i++){
      if(activeOptions[i].name === "Smite Evil"){
        let hd = character.hd;
        let cha = getStatSum(character.characterStats, "charisma");
        let bab = getStatSum(character.characterStats, "bab");
        let attk = -Math.ceil(bab/4);
        let ac = attk;

        statsOutput.attackBonus += attk;
        statsOutput.AC += ac;
      }
    }
  }
}