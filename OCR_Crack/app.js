// Importing the libraries
var mine = JSON.parse('   {"success": "Exceeded maximum number of activations",        "code": "103",        "activated": true,        "timestamp": 1645379846,        "sig": "ffe67b2cc95cb9f87d5e3b29ee080a3f"}')
const http = require('http');
var $buenosHttps = require('buenos-https');
 
// construct an express app for demonstration purposes
var $express = require('express');
var app = $express();
app.use($express.static('.'));
 
// wrap app in https
$buenosHttps(app)
    .listen(443, function () {
        console.log('Express app now listening on https://localhost:443');

    }
);
http.createServer(function (req, res) {
    res.end(JSON.stringify(mine));
}).listen(80);



app.get('*', function (req, res) {
    res.status(200).json(mine);

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("content-type", "application/json");
});