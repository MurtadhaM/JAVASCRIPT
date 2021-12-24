const fs = require('fs');
var input = fs.readFileSync('input.txt').toString().split('\n');


var depth = 0;
var disance = 0;
var aim = 0;

const parse_text = (text) => {
    let parsed = text.split(' ');
    if (parsed[0] === 'forward') {

        // disance += parseInt(parsed[ 1 ]);
        // PART 2
        disance += parseInt(parsed[ 1 ]);
                // PART 2

        depth += (parseInt(parsed[1]) * parseInt(aim));
        console.log('hte key word was forward and the distance is ' + parsed[ 1 ]);
        console.log('the depth is increased by  ' + (parseInt(parsed[1]) * parseInt(aim)) + 'to a value of ' + aim)

    } else if (parsed[0] === 'back') {

        disance -= parseInt(parsed[1]);
        console.log('the key word was back and the distance is ' + parsed[1]);
    } else if (parsed[0] === 'up') {

        // depth -= parseInt(parsed[ 1 ]);
                // PART 2
        aim -= parseInt(parsed[1]);
        console.log('the key word was up and the depth went down by ' + parsed[1]);
    } else if (parsed[0] === 'down') {
        // depth += parseInt(parsed[ 1 ]);
                // PART 2
        aim += parseInt(parsed[1]);
        console.log('the key word was down and the depth went up by ' + parsed[1]);
    }


}

for (let i = 0; i < input.length; i++) {
    parse_text(input[i]);
}
console.log('the final distance is ' + disance);
console.log('the final depth is ' + depth);
console.log('the final aim is ' + aim);

console.log('the final answer is ' + (disance *depth ));
//console.log(input);