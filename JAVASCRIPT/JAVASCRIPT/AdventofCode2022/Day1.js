//Advent of Code 2022 Day 1


const fs = require('fs');
const readline = require('readline');
import('download').then( data=> {
  console.log('fetch', data);
});



var input = fs.readFileSync('./input.txt', 'utf8');

var lines = input.trim().split('\n');


//
// var windows = [];
// var count = 0;
//
//
//
//
// //  for (var i = 0; i < lines.length ; i++) {
// //      var current = parseInt(lines[i]);
// //      var previous = lines[ i - 1];
// //      var increased = Boolean(((current) - (previous)) > 0);
//
// //      if (lines.indexOf(lines) !== 0 && current > previous) {
// //          console.log(current + " " + 'Increased');
// //          count++;
//
// //      } else if (lines[i]  !== 0 && current < previous) {
//
// //          console.log(current + " " + 'Decreased');
// //      } else {
// //          console.log(current + " " + 'Not Changed');
// //      }
// //  }
// //  console.log(count);
//
//
//  // Part 2
//
// for (var i = 0; i < lines.length; i++) {
//     if (  lines.length - i   > 2) {
//         var window = parseInt(lines[ i ]) + parseInt(lines[ i + 1 ]) + parseInt(lines[ i + 2 ]);
//         windows.push(window);
//     }
//
//
// }
//
//
// for (var i = 0; i < windows.length; i++) {
//     var current = parseInt(windows[ i ]);
//     var previous = windows[ i - 1 ];
//
//     if (current > previous) {
//         console.log(current + " " + 'Increased');
//         count++;
//     } else if(current < previous) {
//     {
//         console.log(current + " " + 'Decreased');
//     }
//
//     } else {
//         console.log(current + " " + 'Not Changed');
//     }
// }
//
//
// console.log(count);

//----------------------------------------------------------------------------------------------------------------------

let counter = 0;
let previous;
let value;
for (let i = 0; i < lines.length; i++) {

  value = parseInt(lines[i]);
  previous = lines[i - 1];
  if (value > previous) {
    console.log(value + " " + 'Increased');
    counter++;
  } else if (value < previous) {
    console.log(value + " " + 'Decreased');
  } else {
    console.log(value + " " + 'Not Changed');
  }

}

console.log(`The total number of increasing is ${counter}`);
