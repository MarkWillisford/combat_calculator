export const fightingDefensively = () => {
  let bonus1 = {
    "stat":"attack",
    "type":"dodge",
    "amount":2
  }
  let bonus2 = {
    "stat":"armorClass",
    "type":"untyped",
    "amount":-4
  }
  return [bonus1, bonus2];
}

export const totalDefense = () => {
  let bonus = {
    "stat":"armorClass",
    "type":"dodge",
    "amount":4
  }
  return [bonus];
}