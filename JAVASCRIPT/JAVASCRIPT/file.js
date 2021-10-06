let values = ['emo', 'two', 'three'];

console.log(values)
console.log(values[0])


let p = new Promise((resolve, reject) => {
    let condition = true;
    if (condition) {
        resolve(condition)
    } else {
        reject(condition);
    }

})

p.then((x) => {

    console.log('the input was ' + x);
}).catch((e) => {
    console.log('the error is :' + e.message + ' and the message was ' + x);
})