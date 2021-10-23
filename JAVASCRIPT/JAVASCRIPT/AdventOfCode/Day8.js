const fs = require('fs');;
const file = fs.readFileSync('./AdventOfCode/input.txt', "utf-8").split('\n');

const getFunctionValue = (line) => {
    const obj = new Object();
    obj.operation = line.split(' ')[0];
    obj.value = parseInt(line.split(' ')[1]);
    return obj;
}

var lines = Array();
var currentLine = 0;
var currentValue = 0;
var beenTo = Array();



const processLine = (lineN) => {
    if (currentLine >= file.length) {
        console.log('Done Recursion');
        return 'exit';
    }

    beenTo.push(currentLine);


    var input = file[currentLine];
    var line = getFunctionValue(input);

    if (line.operation === 'nop') {
        currentLine++;

    } else if (line.operation === 'acc') {

        currentValue += line.value;
        currentLine++;

    } else if (line.operation === 'jmp') {
        // console.log(currentLine)

        currentLine += (line.value);
        //processLine(currentLine + line.value);
        // console.log(line);

    } else {
        console.log('unreadable line');
    }



    // console.log(line)

    return line;


}







for (var i = 0; i < file.length; i++) {
    var value = processLine();
    if (value === 'exit') {
        console.log(file[currentLine])
            //        lines.push(value);

    }
    lines.push(file[currentLine]);


}


console.log(lines)
    //console.log(beenTo)
console.log('Current Line is : ' + parseInt(currentLine + 1));
console.log('Current Value is : ' + currentValue);
console.log(lines)

//parseColumn(row.substring(8 , row.length ))