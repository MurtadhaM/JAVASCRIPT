const fs = require('fs');

file = fs.readFileSync('input.txt', 'utf8').split('\n');

var valid = 0;


class passport {
    most;
    least;
    letter;
    line;

}


const rule = (line) => {
    newPass = new passport();
    newPass.most = parseInt(line.split('-')[1]);
    newPass.least = parseInt(line.split('-')[0]);
    newPass.letter = line.split('-')[2];
    newPass.line = line.split(' ')[2];
    console.log(newPass);

    return newPass;


}

// part 1
const checkRule = (passport) => {
    var numberofRepeats = 0;
    for (var i = 0; i < passport.line.split('').length; i++) {
        if (passport.line.charAt(i) == passport.letter) {
            numberofRepeats++;
        }
    }


    if (numberofRepeats > passport.most || numberofRepeats < passport.least) {} else {
        valid++;
    }


}


// part 1
const checkRulepart2 = (passport) => {
    //   var numberofRepeats = 0;
    // for (var i = 0; i < passport.line.split('').length; i++) {
    //     if (passport.line.charAt(i) == passport.letter) {
    //         numberofRepeats++;
    //     }
    // }
    console.log(passport.line.charAt(passport.least))
    console.log(passport.line.charAt(passport.most))
    console.log(passport.line.charAt(passport.letter))



    if (passport.line.charAt(passport.least) === passport.letter && passport.line.charAt(passport.most) !== passport.letter || (passport.line.charAt(passport.least) !== passport.letter && passport.line.charAt(passport.most) === passport.letter)) {
        valid++;

    } else {

        console.log(passport.line)
    }


}

// for (var i = 0; i < file.length; i++) {
//     checkRule(rule(file[i]));

// }

for (var i = 0; i < file.length; i++) {
    checkRulepart2(rule(file[i]));

}
console.log(valid)