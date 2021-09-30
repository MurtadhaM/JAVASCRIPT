const file = require('fs');

let step = 0;

let trees = 0;

f = file.readFileSync('input.txt', "utf-8").toString().split('\n');
//console.log(f[0]);


line = 0;
const readLine = (step) => {

    console.log(step);
    let lineChars = '';
    for (let i = 0; i < f[line].length ; i++) {
    lineChars += f[line].split('')[i];
    }
    console.log(lineChars);
    if( f[line].charAt(step) === '#'){
        trees++;
        line++;
        return f[line] + 'The Character at ' + step + 'is ' +  f[line].charAt(step);

    }
  line ++;
     return f[line].charAt(step);

//line ++;
};



const walk = () => {
    for (let i = 1; i < f.length;        i = i + 2) {
        step = (step + 1)%31;
        if( f[i].charAt(step) === '#'){
            trees++;
        }
       console.log(f[i]);
       line ++;
    }


}

walk();
console.log(trees);
