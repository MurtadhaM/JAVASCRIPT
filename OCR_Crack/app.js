// Importing the libraries
const express = require('express');
const fs = require('fs');
const https = require('https');
const http = require('http');
 // Setting up the SSL certificate
var https_options = {
  key: fs.readFileSync('key.pem', 'utf8'),
  cert: fs.readFileSync('server.crt', 'utf8')
};
const app = express();
//Creating a server
 var server = https.createServer(https_options, app).listen(443);
 var server2 = http.createServer( app).listen(80);
 try{
 // Responding with a fake success message
 server.on('request', function(request, response) {
    var mine = JSON.parse('   {"success": "Exceeded maximum number of activations",        "code": "103",        "activated": true,        "timestamp": 1645379846,        "sig": "ffe67b2cc95cb9f87d5e3b29ee080a3f"}')

    console.log(request.method + ' ' + request.url);
    response.writeHead(200, {'Content-Type': 'application/json'});
    response.end(JSON.stringify(mine));
    });

    server2.on('request', function(request, response) {
        var mine = JSON.parse('   {"success": "Exceeded maximum number of activations",        "code": "103",        "activated": true,        "timestamp": 1645379846,        "sig": "ffe67b2cc95cb9f87d5e3b29ee080a3f"}')

        console.log(request.method + ' ' + request.url);
        response.writeHead(200, {'Content-Type': 'application/json'});


        response.end(JSON.stringify(mine));
        
        });
    }
 
    catch(err){
        console.log(err);
    }
    finally{
        console.log('Server running on port 443');
        console.log('Server running on port 80');
    }
// Fucking worked!!!!
console.log('HTTPS Server listening on localhost:%s', 443);
console.log('HTTPS Server listening on localhost:%s', 80);
