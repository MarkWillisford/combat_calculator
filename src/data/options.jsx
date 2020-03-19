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
  "powerAttack": function(activeOptions, character, getStatSum, whichAttackType, statsOutput, irrative) {
    for(let i=0;i<activeOptions.length;i++){
      if(activeOptions[i].name === "Power Attack"){
        console.log("running Power Attack calculations");
        let bab = getStatSum(character.characterStats, "bab");
        let attk = -Math.ceil(bab/4);
        let damage = -2*attk;

        // check for which attack
        if(whichAttackType === "off"){
          damage = damage*.5;
        } else if (whichAttackType === "twoHanded"){
          damage = damage*1.5;
        }
        
        statsOutput.attackBonus += attk;
        statsOutput.damageBonus += damage;
      }
    }
  },  
  "combatExpertise": function(activeOptions, character, getStatSum, whichAttackType, statsOutput, irrative) {
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
  "smiteEvil": function(activeOptions, character, getStatSum, whichAttackType, statsOutput, irrative) {
    for(let i=0;i<activeOptions.length;i++){
      // has option been selected?
      if(activeOptions[i].name === "Smite Evil"){
        const hd = character.hd;
        const cha = getStatSum(character.characterStats, "charisma");
        const chaMod = Math.floor((cha - 10) / 2);

        statsOutput.attackBonus += chaMod;
        console.log("adding cha to attk");
        console.log(chaMod);
        // If it is the first attack, check for double damage
        if(irrative === 1){
          if(window.confirm('Are you facing an evil outsider, undead or big bad dragon?')) {
            statsOutput.damageBonus += 2*hd;
            console.log("adding 2x hd to dam");
            console.log(2*hd);
          }
        } else {
          statsOutput.damageBonus += hd;
          console.log("adding hd to dam");
          console.log(hd);
        }

        // Check for existing Deflection bonus to AC
        let existingDeflectionBonus = 0;
        for(let i=0;i<character.characterStats.length;i++){
          if(character.characterStats[i].name === "armorClass"){
            for(let j=0;j<character.characterStats[i].bonuses.length;j++){
              if(character.characterStats[i].bonuses[j].type === "deflection"){
                existingDeflectionBonus = character.characterStats[i].bonuses[j].amount;
              }
            }
          }
        }
        const deflectionBonusDifference = chaMod - existingDeflectionBonus;
        if(deflectionBonusDifference > 0){
          statsOutput.AC += deflectionBonusDifference;
          statsOutput.TAC += deflectionBonusDifference;
        }
      }
    }
  }

}