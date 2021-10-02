let values = ['emo', 'two', 'three'];

console.log(values)
console.log(values[0])

promise = Promise.all(values);

async function test(x) {
    const data = await promise;

    return data;
}

console.log(test('test').catch((err) => {
    return err;
}).then(() => {
    console.log('a')
}))