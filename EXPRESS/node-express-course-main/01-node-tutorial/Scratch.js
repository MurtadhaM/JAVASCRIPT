// Starting a scratch file
const {readFileSync, writeFileSync} = require('fs');
const fs = require('fs');
const path = require('path');
console.log(__dirname);
const first_file = readFileSync(`${__dirname}/one.txt`, 'utf8');
const second_file = readFileSync(`${path.join(__dirname, "two.txt")}`, 'utf8');


console.log(`the first file contents are: \n${first_file}` );
console.log(`the second file contents are: \n${second_file}` );