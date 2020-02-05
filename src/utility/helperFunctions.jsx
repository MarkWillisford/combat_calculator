export const findGearSlotIndex = (slotAsString) => {
  slotAsString = slotAsString.toLowerCase();
  
  switch(slotAsString){
    case "head":
      return 0
    break;
    case "headband":
      return 1
    break;
    case "eyes":
      return 2
    break;
    case "shoulders":
      return 3
    break;
    case "neck":
      return 4
    break;
    case "chest":
      return 5
    break;
    case "body":
      return 6
    break;
    case "armor":
      return 7
    break;
    case "belt":
      return 8
    break;
    case "wrists":
      return 9
    break;
    case "hands":
      return 10
    break;
    case "shield":
      return 11
    break;
    case "ring1":
      return 12
    break;
    case "ring2":
      return 13
    break;
    case "feat":
      return 14
    break;
  }
};