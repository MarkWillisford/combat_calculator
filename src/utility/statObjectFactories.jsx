export const createBonus = ({ name, source, stat, type, duration, amount }) => ({
	name,
	source,
	stat,
	type,
	duration,
	amount,
});

export const setSum = (stat) => {
  let total = 0;
  let arrayOfHighestBonuses = [ ];
  for(let i=0; i<stat.bonuses.length; i++){
    let typeToFind = stat.bonuses[i].type;
      // **************  This is all if normal non-stacking bonuses are used *********
      // ****  If the bonus is dodge or untyped then we need to skip part of this ****
    if(typeToFind !== 'dodge' && typeToFind !== 'untyped' && typeToFind !== 'rank'){  
      let found = false;
      let replace = false;
      let foundAt = null;
      // checking current 'highest' bonuses
      for(let j=0; j<arrayOfHighestBonuses.length; j++){
        if(arrayOfHighestBonuses[j].type == typeToFind){
          // if so, compare and keep only the largest
          if(stat.bonuses[i].amount > arrayOfHighestBonuses[j].amount){
            found = true;
            replace = true;
            foundAt = j;
          } else {
            found = true;
            replace = false;
          };
        };
      };
      if(found && replace){
        // we found it and we want to replace it
        total = total - parseInt(arrayOfHighestBonuses[foundAt].amount, 10);
        total = total + parseInt(stat.bonuses[i].amount, 10);
        arrayOfHighestBonuses[foundAt] = stat.bonuses[i];
      } else if(!found){
        // if not, add this bonus to the array and be done
        // 'no matching type found. adding first now'
        arrayOfHighestBonuses.push(stat.bonuses[i]);
        total = total + parseInt(stat.bonuses[i].amount, 10);
      };
    } else { 
      // this means that the type is dodge, untyped, or ranks
      let found = false;
      // checking array of highest bonuses
      for(let j=0; j<arrayOfHighestBonuses.length; j++){
        if(arrayOfHighestBonuses[j].type == typeToFind){
          arrayOfHighestBonuses[j].sum += stat.bonuses[i].amount;
          arrayOfHighestBonuses[j].bonuses.push(stat.bonuses[i]);
          found = true;
        };
      };

      if(!found){
        arrayOfHighestBonuses.push(stat.bonuses[i]);
        total = total + parseInt(stat.bonuses[i].amount, 10);
      };
    }; 
  };  // end of for loop - array of current bonuses

  let sum = { "total": total, "bonuses": arrayOfHighestBonuses };
  return sum;
}

export const createStat = ({ name, bonuses, sum = {  } }) => ({
	name, bonuses, sum, 
	// to get sum:
	// sum is an object with the highest of each bonus type in it. 
	// I.E. +4 deflection, +3 natural armor enhancement, etc . . .    
		// we need to create a new array with only the highest of each 
		// bonus type in it, saving the total.
	// so 'sum' is actually an object with a number and an array
	setSum(){
    console.log("in setSum");
		let total = 0;
		let arrayOfHighestBonuses = [ ];
		for(let i=0; i<this.bonuses.length; i++){
			let typeToFind = this.bonuses[i].type;

			// **************  This is all if normal non-stacking bonuses are used *********
			// ****  If the bonus is dodge or untyped then we need to skip part of this ****

			if(typeToFind !== 'dodge' && typeToFind !== 'untyped'){		
        console.log("in setSum, not stackable");	
				let found = false;
				let replace = false;
				let foundAt = null;
				// checking current 'highest' bonuses
				for(let j=0; j<arrayOfHighestBonuses.length; j++){
					if(arrayOfHighestBonuses[j].type == typeToFind){
						// if so, compare and keep only the largest 
						if(this.bonuses[i].amount > arrayOfHighestBonuses[j].amount){
							found = true;
							replace = true;
							foundAt = j;
						} else {
							// we found one, but it is already larger
							found = true;
							replace = false;
						};
					};
				};

				if(found && replace){
					// we found it and we want to replace it
					total = total - arrayOfHighestBonuses[foundAt].amount;
					total = total + this.bonuses[i].amount;
					arrayOfHighestBonuses[foundAt] = this.bonuses[i];
				} else if(!found){
					// if not, add this bonus to the array and be done
					arrayOfHighestBonuses.push(this.bonuses[i]);
					total = total + this.bonuses[i].amount;
				};
			} else { 
        console.log("in setSum, stackable");	
				// this means that the type is dodge or untyped
				let found = false;
				// checking array of highest bonuses
				for(let j=0; j<arrayOfHighestBonuses.length; j++){
					if(arrayOfHighestBonuses[j].type == typeToFind){
						arrayOfHighestBonuses[j].sum += this.bonuses[i].amount;
						arrayOfHighestBonuses[j].bonuses.push(this.bonuses[i]);
						found = true;
					};
				};

				if(!found){
					arrayOfHighestBonuses.push({bonuses: [this.bonuses[i]]});
					total = total + this.bonuses[i].amount;
				};
			}; 

		};	// end of for loop - array of current bonuses

		this.sum = { sum: total, bonuses: arrayOfHighestBonuses };
		this.flag = false;

		return this;
	}
});