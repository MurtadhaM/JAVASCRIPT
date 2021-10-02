const fs = require('fs');
const fetch = require('fetch');
let url = 'https://adventofcode.com/2020/day/5/input';
const file = fs.readFileSync('./AdventOfCode/input.txt',"utf-8").split('\n') ;


const parseRow = (row) => {

    let r =  Object();
   r.start = 0 ;
   r.end = 128;

   let diff = r.end - r.start;



    console.log(diff)
}


parseRow(file[0].substring(0,7))
//parseColumn(file[0].substring(8 , file[0].length ))

