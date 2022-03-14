import {readFileSync} from 'fs';
import pkg from 'lodash';
const { _ } = pkg;

const json_file =  readFileSync('./Staff_Data.json', 'utf8', (err, data) => {
    if (err) {
        console.log(err);
    } 
   
    const json_data = JSON.parse(data);
    return json_data;
 
});
 
 

const json_object =JSON.parse (json_file);



    
    




let test = _.map(json_object, 'department');
console.log(test)