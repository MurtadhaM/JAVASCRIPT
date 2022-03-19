const { readFileSync, readFileAsync } = require('fs')

let fish = {
  id: [],
  remaining: () => {
    // iterate over the array of fish

    let num = fish.id.length

    for (let i = 0; i < num; i++) {
        if(fish.id[i] == fish.id[i - 1]){
            fish.id.splice(i, 1)
            con
        }
      // setting up the logic for the rules
      if (fish.id[i] == 0) {
        // resetting the fish
       fish.id[i] = 6
        // adding another fish
        fish.id.push(8)
      } else {
        // incrementing  the fish value
        fish.id[i] = fish.id[i] - 1
      }
    }
    return fish.id;
  },
}

readFileSync('input.txt', 'utf8')
  .split(',')
  .forEach((character) => {
    fish.id.push(character)
  })
  const delay = ms => new Promise(res => setTimeout(res, ms));

  const Process_Data_Async  = async () => {
  // settup the number of days 80 for part 1 and part 2 is 256
let numberOfDays = 80;  
console.log('Initial state: ', fish.id)
for (let i = 0; i < numberOfDays; i++) {
    
    fish.id = fish.remaining();
    console.log(fish.id)
}
  
     
    console.log("After " + numberOfDays+ ' Days ', fish.id.length) 

  }



  Process_Data_Async()