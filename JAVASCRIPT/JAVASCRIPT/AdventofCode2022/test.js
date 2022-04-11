console.log(
  'the number of fish in 18 days from starting age of 3 is ' + ((3 + 18) % 8),
)

// let fish = 3;
// for (i = 0; i < 18; i++) {

//   if ((fish ) === 0) {
//     console.log('on day ' + (i) + ' fish was born')
//     fish = 6;
//   }

//   console.log('on day ' + (i ) + ' fish is ' + (fish ))
//   fish = fish - 1;
// }

let daysBorn = []

async function calculateGenerationAsync(fish, daysRemaining){
    if (daysBorn.length === 0) {
        return daysBorn;
    }
    
    let newFish = fish;
    if (fish === 0) {
        newFish = 6;
        daysBorn.push(daysRemaining);
    } else {
        newFish = fish - 1;
    }

    return await calculateGenerationAsync(newFish, daysRemaining - 1);
}


// function calculateGeneration(fish, daysRemaining){
//     let kids = 0;
//     for (i = 0; i < daysRemaining; i++) {
//         if ((fish ) === 0) {
//         kids = kids + 1;
//         daysBorn.push(18 - i);
//         fish = 6;
//         }
// //        console.log('on day ' + (i) + ' fish is ' + (fish ))
//        // console.log('kids born so far ' + kids)
//         fish = fish - 1;

//     }
//     return daysBorn  ;
// }
// calculateGeneration(3, 18);

//  for (let b =0; b >  daysBorn.length; i++) {
//     console.log(calculateGeneration(8 + daysBorn[b]))
// }

let totalFish = 0;
let f = [3]
for (let i = 0; i < f.length; i++) {
    calculateGenerationAsync(f[i], 18).then(function(result){

        console.log(result)
        totalFish = totalFish + result.length;
        console.log('total fish ' + totalFish)
        
    });
}





