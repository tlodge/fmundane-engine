
require('console-stamp')(console, 'dd-mm-yy HH:MM:ss.l');

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { execFile} = require('child_process');
var rp = require('request-promise-native')
const PORT = '9106';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const playIt = (media="")=>{
    return new Promise((resolve, reject)=>{
        execFile("afplay", [`media/${media}`], (error)=>{
            if (error){
                reject();
                return;
            }else{
                resolve();
                return;
            }
        });  
    })
}

app.post('/api/media', async function (req, res, next) {
    const {media=""} = req.body;
    await playIt(media);    
    res.status(200).send("OK");
});

http.createServer(app).listen(PORT);
console.log("listening on port: " + PORT);

