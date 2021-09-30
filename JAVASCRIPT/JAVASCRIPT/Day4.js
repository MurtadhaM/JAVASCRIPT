const fs = require('fs');
const file = fs.readFileSync('input.txt', "utf-8").split('\n\n');
//console.log(file[0])
let passports = Array();

class passport {
    byr;
    iyr;
    eyr;
    hgt;
    hcl;
    ecl;
    pid;
    cid;

}


const parseTags = function (tag) {
    const myPassport = new passport();
    for (var tags in tag) {
        let myTag = tag[tags].split(':');
        switch (myTag[0]) {
            case 'byr':
                myPassport['byr'] = myTag[1];
                break;
            case  'cid':
                myPassport['cid'] = myTag[1];
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
const validate = () => {
    let valid;
    for (const passport in passports) {
        let myPass = passports[passport];

        //To avoid using the object name
        const {pid, hgt, eyr, iyr, cid, ecl, hcl, byr} = myPass;


        //console.log(myPass[value]);
        valid = (typeof pid != 'undefined' && typeof ecl != 'undefined' && typeof byr != 'undefined' && typeof eyr != 'undefined' && hcl !== 'undefined' && typeof hgt != 'undefined' && typeof iyr != 'undefined')

        let height;
        if (typeof hgt !== 'undefined') {
            height = hgt.replace('in', '').replace('cm','');
            console.log('height ' + height);

            let measurement = hgt.substring(hgt.length - 2);
            console.log('measurement ' + hgt);

            if (measurement === "cm" && (height < 150 && height > 193)) {
                valid = false;


            } else if (measurement === "in" && (height < 59 || height > 76)) {
                valid = false;

            } else if(measurement !== "in" && measurement !== "cm"){
                valid = false;
            }
        }


        if (byr < 1920 && byr > 2002) {
            valid = false;

        }
        if (iyr < 2010 && iyr > 2020) {
            valid = false;

        }
        if (eyr < 2020 && eyr > 2030 && eyre) {
            valid = false;
if(eyr.length !== 4){
    valid = false;
}
        }
        if (hcl) {
            if (!hcl && hcl.charAt(0) !== '#' || hcl.length !== 7 ) {
                valid = false;
            }

        }

        if (ecl !== 'amb' && 'blue' !== ecl && ecl !== 'brn' && ecl !== 'grn' && ecl !== 'gry' && ecl !== 'hzl' && ecl !== 'oth') {
            valid = false;
        }


        if (cid) {
            if (!cid && cid.charAt(0) !== '0' && cid.length !== 9) {
                valid = false;
            }

        }


        if (valid) {
            isValid++;
        }
    }

    console.log(isValid);

}

validate()
