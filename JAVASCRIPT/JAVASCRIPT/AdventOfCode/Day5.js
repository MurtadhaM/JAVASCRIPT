const fs = require('fs');;
//const file = fs.readFileSync('./AdventOfCode/input.txt', "utf-8").split('\n');

var answers = Array();
var numberofyes = 0;
const loadFIle = async() => {
    const file = fs.readFileSync('./AdventOfCode/input.txt', "utf-8").split('\n\n');
    file.forEach(file => {
        answers.push(file)
    })

}

loadFIle()
    .then(console.log(numberofyes))
    .catch(err => {
        console.log(e.message);
    })






const checkAnswers = (answer) => {


    const groupAnswers = new Array();
    const numberofPeople = groupAnswers.length;

    answer.split('\n').forEach(a => console.log(groupAnswers.push(a)))

    return groupAnswers;

}



console.log(checkAnswers(answers[0]))



//parseColumn(row.substring(8 , row.length ))