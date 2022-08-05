

// A list of all generated Hostnames
var hostnames = []
var prefixes = []
var makes = []
var models = []

var serials = []
// generate a unique random HEX number with length of 14
function generateRandomHex() {


let make = document.getElementById('make').value
let model = document.getElementById('model').value
let serial = document.getElementById('serial').value

 let prefix = document.getElementById('dropdown').value
  // check if the prefix is empty
  if (prefix == '') {
    alert('Please select a prefix')
    return ' '
  }



  // generate a random hex number
//   var hex = ''
//   for (var i = 0; i < 14; i++) {
//     hex += Math.floor(Math.random() * 16).toString(16)
//   }



if(serial == '') {
  alert('Please enter a serial number')
  return ' '
}



var hash = sum(prefix +'-'+serial)
// adding the first 3 characters of the hash to the end of the hash
hash += sum(prefix +'-'+serial).substring(0,3)

let hostname =  prefix + '-' + hash;


console.log(hostname)



  // check if the make and model are empty
  if (make == '' || model == '' || serial == ''  ) {
    alert('Please enter a make and model')
    return ' '
  } 

  // check if the number is unique and not already in the list
  
  if (hostnames.includes(hostname)) {
    // generate a new one 
    alert(" hostname already exists, generating a new one and trying again");

    return ' '
  }

  
    hostnames.push(hostname) // return the number return hostname;
    makes.push(make)
    models.push(model)
    serials.push(serial)
    prefixes.push(prefix)
    updateTable()  
  // check if the number is unique and not already in the list

  return hostnames[hostnames.length - 1];

 
  
}



// this function populates the options for the dropdown menu
function populateDropdown() {
  let cities = [
    'ACU',
    'ALB',
    'ALX',
    'ARL',
    'ARV',
    'AZR',
    'BKH',
    'BLK',
    'BOL',
    'BVL',
    'CIN',
    'CLT',
    'DRO',
    'DUP',
    'DUR',
    'EGL',
    'ERL',
    'ESL',
    'FON',
    'FTP',
    'GAL',
    'HOU',
    'HST',
    'LAK',
    'LOU',
    'MBO',
    'MIL',
    'MST',
    'NAV',
    'NLB',
    'NOX',
    'ONT',
    'PHO',
    'POM',
    'RAV',
    'RMH',
    'ROS',
    'SAL',
    'SAT',
    'SUN',
    'SVL',
    'TFT',
    'TIJ',
    'TYL',
    'WIL',
  ]
  // get the dropdown menu
  var dropdown = document.getElementById('dropdown')

  // loop through the cities array and add them to the dropdown menu
  for (var i = 0; i < cities.length; i++) {
    var option = document.createElement('option')
    option.text = cities[i]
    dropdown.add(option)
  }
}

// this function updates the hostnames-table tables
function updateTable() {
  let rows = document.getElementById('hostnames-table')

  // loop through the hostnames array and add them to the table

  let i = hostnames.length - 1
  let row = document.createElement('tr')
  let hostname = document.createElement('td')
  let serial = document.createElement('td')
  let prefix = document.createElement('td')
  let make = document.createElement('td')
  let model = document.createElement('td')

  hostname.innerText = hostnames[i]
  prefix.innerText = prefixes[i]
  make.innerText = makes[i]
  model.innerText = models[i]
  serial.innerText = serials[i]

  row.appendChild(prefix)
  row.appendChild(serial)
  row.appendChild(make)
  row.appendChild(model)
  row.appendChild(hostname)
  rows.appendChild(row)
  
}




const load = () => {

document.head.appendChild(document.createElement('script')).src = 'https://cdn.jsdelivr.net/npm/hash-sum@2.0.0/hash-sum.min.js'

}




load()

function downloadCSVFile(csv, filename) {
	var csv_file, download_link;

	csv_file = new Blob([csv], {type: "text/csv"});

	download_link = document.createElement("a");

	download_link.download = filename;

	download_link.href = window.URL.createObjectURL(csv_file);

	download_link.style.display = "none";

	document.body.appendChild(download_link);

	download_link.click();

  
  console.log(csv)  
  
}
function htmlToCSV(html, filename) {
	var data = [];
	var rows = document.querySelectorAll("table tr");
			
	for (var i = 0; i < rows.length; i++) {
		var row = [], cols = rows[i].querySelectorAll("td, th");
				
		for (var j = 0; j < cols.length; j++) {
		        row.push(cols[j].innerText);
        }
		        
		data.push(row.join(",")); 		
	}

	downloadCSVFile(data.join("\n"), filename);
}

function downloadCSV() {
  var html = document.getElementById("hostnames-table").outerHTML;

  htmlToCSV(html, "hosts.csv");

  console.log(html)
}
