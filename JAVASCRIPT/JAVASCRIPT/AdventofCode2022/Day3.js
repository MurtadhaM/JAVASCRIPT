/*
--- Day 3: Binary Diagnostic ---
 */

// defining a file reader module
const fs = require("fs");

// defining a function to process the input file
const processFile = (data, position) => {
  // testing reading each character of each line
  // temp vars
  let numOfZeros = 0;
  let numOfOnes = 0;
  let MostCommon = 0;
  let LeastCommon = 0;
  let gamaRate = "";
  let epsilon = "";
  let line = "";

  console.log(data[2][position]);
  for (let i = 0; i < data.length; i++) {
    if (data[i][position] == "0") {
      numOfZeros++;
    } else {
      numOfOnes++;
    }
    line += data[i][position];
  }
  // checking if gama or epsilon is the most common

  if (numOfZeros > numOfOnes) {
    MostCommon +=  data = line[position]; 
    console.log("Gama is  " + MostCommon);
    return gamaRate;
  } else if (numOfZeros < numOfOnes) {
    MostCommon +=  data = line[position]; 

    console.log("epsilon is  " + line);
    return epsilon;
  }

};

// reading the input file
var file = fs.readFileSync("input.txt", "utf8");
console.log(file);
// parsing the input file into an array
var input = file.split("\n");

// calling the function to process the input file
processFile(input, 1);
