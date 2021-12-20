#!/usr/bin/env node

/**
 * Module dependencies.
 */
"use strict";

var program = require('commander');
var fs = require('fs');
const http = require('http');
var ifaces = require('os').networkInterfaces();

let port = 4000 +Math.floor(Math.random()*1000);

program
    .version('0.1.4')
    .option('-i, --ip', 'IP Address //TODO:in developing')
    .option('-p, --port', 'set PORT, set port, default with random port')
    .option('-z, --gzip', 'set ZIP, download with zipped //TODO:in developing')
    .option('-u, --upload', 'PUT file NOT GET file, upload not download')
    .parse(process.argv);

if(program.port){
    port = parseInt(program.port, 10);
}

/*if(program.help){
    console.log('......')
    return;
}*/

//console.dir(program);

let filename = program.args.length;
let stream;
if (filename === 1) {
    let randomUrl = ''+Math.floor(Math.random()*999999).toString(10);
    const server = http.createServer((req, res) => {
        console.log(req.url);
        if(req.url.slice(0,randomUrl.length+1) === '/'+randomUrl){
            //console.log(req.address);
            if(program.upload && req.method.toUpperCase()==='PUT'){
                //上传
                stream = fs.createWriteStream(program.args[0]);
                req.pipe(stream);
                req.on('end',function(){
                    res.setHeader('Content-Type', "application/octet-stream");
                    res.end('OK');
                    process.nextTick(function(){
                        server.close();
                        console.log('file download or upload complete, server closed.');
                        process.exit();
                    });
                });
                return;
            }

            //以下是下载 download
            stream = fs.createReadStream(program.args[0]);
            stream.on('end', function(){
                console.log('传输完成 Finished');
                setTimeout(function() {
                    //传输结束后500ms自动退出程序                
                    server.close();
                    console.log('file download or upload complete, server closed.');
                    process.exit();
                }, 500);
            });
            let fileSize = fs.statSync(program.args[0]).size;
            //console.log(fileSize);
            let matched = program.zip;
            res.setHeader("Content-Disposition", "attachment;filename="+filename);
            res.setHeader('Content-Length', fileSize);
            res.setHeader('Content-Type', "application/octet-stream");
            var acceptEncoding = req.headers['accept-encoding'] || '';
            //console.log(acceptEncoding);
            if (matched && acceptEncoding.match(/\bgzip\b/)) {
                res.writeHead(200, 'Ok', {'Content-Encoding': 'gzip'});
                stream.pipe(zlib.createGzip()).pipe(res);
            } else if (matched && acceptEncoding.match(/\bdeflate\b/)) {
                res.writeHead(200, 'Ok', {'Content-Encoding': 'deflate'});
                stream.pipe(zlib.createDeflate()).pipe(res);
            } else {
                res.writeHead(200, 'Ok');
                res.statusCode = 200;
                stream.pipe(res);
            }
            return;
        }else{
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('File not found.');
        }
    });
    server.listen(port, () => {
        //let hostname = server.address();
        //console.log(hostname);
        Object.keys(ifaces).forEach(function (dev) {
        ifaces[dev].forEach(function (details) {
          if (details.family === 'IPv4' && details.address!=='127.0.0.1') {
              console.log(`Server running at http://${details.address}:${port}/${randomUrl}`+(program.upload?'':('/'+program.args[0])));
          }
        });
      });
    });
}else{
    program.help();
}