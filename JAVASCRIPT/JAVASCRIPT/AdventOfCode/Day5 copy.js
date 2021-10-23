const fs = require('fs');

const download = function(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        const request = https.get(url, response => {
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        });
        request.on('error', reject);
    });
}



var file = fs.readFileSync('AdventOfCode/input.txt', 'utf8').split('\n');
var lines = file;
var operations = [];



function parseOperatopms(line) {

    var operation = new Object();
    operation.type = line.split(' ')[0];
    operation.sign = line.split(' ')[1][0];
    // operation.value = line.split(' ')[1].substring(1);
    operation.value = line.split(' ')[1];

    operations.push(operation);

}





var stepsBeen = [];

// Populate the operations Array
lines.forEach(function(line) { parseOperatopms(line); });




console.log(operations)




var value = 0;
var step = 0;

function process_operations(operation) {

    if (operation == operations[step]) {
        console.log('been here');
        return;
    }
    stepsBeen.push(operation);

    operation.value = parseInt(operation.value);

    switch (operation.type) {
        case 'nop':
            break;
        case 'acc':
            value = operation.value + value;
            break;
        case 'jmp':
            step = step + operation.value;
            break;
    }


    console.log('the step ' + step + ' and the value is ' + value);
    process_operations(operations[step])

}

step++;
//operations.forEach(function(operation) { ; });

process_operations(operations[step]);