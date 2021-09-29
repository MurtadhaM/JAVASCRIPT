// Importing the library
const fs = require('fs');

//getting the file
const data = fs.readFileSync('input.txt', 'utf8');
// Making them into lines
file = data.split('\n');



const part1 = (file) => {
    for (var i = 0; i < file.length; i++) {
        for (var j = 0; j < file.length; j++) {
            if (parseInt(file[i]) + parseInt(file[j]) == 2020) {
                console.log(parseInt(file[i]) * parseInt(file[j]));
                break;
            }

        }
    }
};

const part2 = (file) => {
    for (var i = 0; i < file.length; i++) {
        for (var j = 0; j < file.length; j++) {
            for (var k = 0; k < file.length; k++) {
                if (parseInt(file[i]) + parseInt(file[j]) + parseInt(file[k]) == 2020) {
                    console.log(parseInt(file[i]) * parseInt(file[j]) * parseInt(file[k]));
                    break;
                }
            }

        }
    }
};



part1(file);
part1(file);