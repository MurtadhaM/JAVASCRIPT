const fs = require('fs');;
//const file = fs.readFileSync('./AdventOfCode/input.txt', "utf-8").split('\n');

var groups = Array();
var numberofyes = 0;
const loadFIle = async() => {
    const file = fs.readFileSync('./AdventOfCode/input.txt', "utf-8").split('\n\n');
    file.forEach(file => {
        groups.push(file)
    })

}

loadFIle()
    .then(console.log(numberofyes))
    .catch(err => {
        console.log(e.message);
    })






const checkAnswers = (answer) => {

    numberofmembers = answer.length;


    for (var i = 0; i < answer.length; i++) {




    }


    return answer;

}



console.log(checkAnswers(groups[0]))



//parseColumn(row.substring(8 , row.length ))