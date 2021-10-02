const fs = require('fs');
const file = fs.readFileSync('AdventOfCode/input.txt', "utf-8").split('\n\n');
//console.log(file[0])
let passports = Array();

var passport = {};
//{
//     byr;
//     iyr;
//     eyr;
//     hgt;
//     hcl;
//     ecl;
//     pid;
//     cid;
//
// }


const parseTags = function (tag) {
    const myPassport = Object();
    for (var tags in tag) {
        let myTag = tag[tags].split(':');
        switch (myTag[0]) {
            case 'byr':
                myPassport.byr = myTag[1];
                break;
            case  'cid':
                myPassport.cid = myTag[1];
                break;
            case  'ecl':
                myPassport.ecl = myTag[1];
                break;
            case  'eyr':
                myPassport.eyr = myTag[1];
                break;
            case  'iyr':
                myPassport.iyr = myTag[1];
                break;
            case  'hgt':
                myPassport.hgt = myTag[1];
                break;
            case  'pid':
                myPassport.pid = myTag[1];
                break;
            case  'hcl':
                myPassport.hcl = myTag[1];
                break;
            default:
                break;

        }


    }
    passports.push(myPassport);
    return myPassport;
}


const readLines = function () {
    for (let i = 0; i < file.length; i++) {
        // console.log(file[i]);
        parseTags(file[i].replace(/\n/g, ' ').split(' ').toString().trim().split(','));
    }
}


readLines();

let isValid = 0;

const validate = (myPass) => {

    let valid;

    // const obj = JSON.parse(myPass);
    //To avoid using the object name
    const {pid, hgt, eyr, iyr, cid, ecl, hcl, byr} = (myPass);
    const mapme = new Map();
   // (console.log(JSON.stringify(myPass)))
    //(pid, hgt, eyr, iyr, cid, ecl, hcl, byr).map(console.log)
    //  console.log(mapme)

    for (let name in {pid, hgt, eyr, iyr, ecl, hcl, byr}) {

        if (!myPass.hasOwnProperty(name)) {
            console.log(myPass[name]);
            console.log(name)
            return;
        }

    }


    let height;

    height = hgt.replace('in', '').replace('cm', '');

    let measurement = hgt.substring(hgt.length - 2);



    if (measurement !== "in" && measurement !== "cm") {
        console.log('failed because of hgt' + measurement)

        return
    }

    if (measurement === "cm" && (height < 150 || height > 193)) {
        console.log('failed because of hgt' + hgt)
        return

    }
    if (measurement === "in" && (height < 59 || height > 76)) {
        console.log('failed because of' + hgt)

        return
    }


    if (byr < 1920 || byr > 2002) {
        console.log('failed because of byr ' + byr)

        return
    }
    if (iyr < 2010 || iyr > 2020) {
        console.log('failed because of iyr ' + iyr)

        return
    }
    if (eyr < 2020 || eyr > 2030) {
        console.log('failed because of eyr ' + eyr)

        return;
    }
    if (eyr.length !== 4) {
        console.log('failed because of eyr ' + eyr)

        return
    }


    if (hcl.charAt(0) !== '#' || hcl.length !== 7 || hcl.match(/[g-z]/)) {
        console.log('failed because of' + hcl)

        return


    }

    if (ecl !== 'amb' && ecl !== 'blu' && ecl !== 'brn' && ecl !== 'grn' && ecl !== 'gry' && ecl !== 'hzl' && ecl !== 'oth') {
        console.log('failed because of ecl ' + ecl)

        return
    }
    if (pid.length !==9  ) {
        console.log('failed because of pid ' + pid)
        return
    }

    // if (cid) {
    //     if (!cid && cid.charAt(0) !== '0' && cid.length !== 9) {
    //         console.log('failed because of' + cid)
    //
    //         return
    //     }

    // }


    isValid++;

}


passports.map(validate)
console.log(isValid);
