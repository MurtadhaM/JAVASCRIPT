const file = require('fs');


f = file.readFileSync('input.txt').toString().split('\n');

let step = 0;

let trees = 0;

const readTree = (line) =>{
    //console.log(line.charAt(step));
    if(line.charAt(step) === '#'){
        trees ++;
        console.log(trees);

    }


}

const readlines = (file) => {
    for (let i = 0; i < file.length; i+5){
        step = (step + 5)%31;

        console.log(file[i]);
        readTree(file[i]);


    }

}


let treesP2 = 0;
let stepsP2 = 0;

const readlinesP2 = (file, slope) => {
    for (let i = 0; i < file.length; i++){
        stepsP2 = (stepsP2 + slope)%31;
        console.log(file[i]);
        readTreeP2(file[i]);



    }
    console.log(treesP2);
    return treesP2;


}


const readTreeP2 = (line) =>{
    if(line.charAt(stepsP2) === '#'){
        treesP2 ++;
    }


}

let slops = [1,3,5,7];

let values =  Array();
// for (let i = 0; i < slops.length; i++) {
//     //readlinesP2(f,slops[i]);
//     console.log(treesP2);
//     values.push(readlinesP2(f, slops[i]));
//
//
// }





// var num = 1;
// for (let i = 0; i <slops.length; i++){
//     num *= values[i];
//     console.log(77* 218 *65 *82* 44);
// }

// console.log(num)

readlines(f,1);

//console.log(treesP2);
console.log(77* 218 * 65  * 82 * 83);

