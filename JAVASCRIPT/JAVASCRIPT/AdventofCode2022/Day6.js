const { readFileSync, readFileAsync } = require('fs')
let days =62;
let fish = {
  starterFish: [],
  fish: [],







}

readFileSync('input.txt', 'utf8')
  .split(',')
  .forEach((character) => {
    fish.starterFish.push(character)
  })

  let day = [];

const valuesUpdate = (f) => {
  var textFish = [];

  if (f.length == 0 || days <= 1) {

    return f;
  }

  fish.starterFish = f.toString().replace(/0/g, '7,9').replace(/'7'/g,8).replace(/'9'/g,9).replace(/1/g, 0).replace(/2/g, 1).replace(/3/g, 2).replace(/4/g, 3).replace(/5/g, 4).replace(/6/g, 5).replace(/7/g, 6).replace(/8/g, 7).replace(/9/g, 8)
  textFish = fish.starterFish.split(',');
  if (typeof f === 'string') {


   return valuesUpdate(f.split(','));
  }




  return textFish;
}
DayResults = '';
const processDay = () => {
  for (let i = 0; i < days; i++) {



     DayResults = valuesUpdate(fish.starterFish);

    console.log('Day: ' + (i+1) + ' : ' + DayResults);


  }
  console.log('After ' + (days) + ' Days : Total # of Fish is ' + DayResults.length)

return fish.fish.length;
}

let values = 0;
fish.starterFish = fish.starterFish.toString().split(',');
console.log('Initial state: ' + fish.starterFish);
processDay()

