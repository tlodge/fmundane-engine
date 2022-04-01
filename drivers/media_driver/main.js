
require('console-stamp')(console, 'dd-mm-yy HH:MM:ss.l');

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const request = require('superagent');

const { execFile} = require('child_process');
const PORT = '9106';
const MEDIADIR = '../../media';
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
let processes = [];
const SPEECHSTOPURL = "http://localhost:9105/api/speech/stop";

const playIt = (media="")=>{
    return new Promise((resolve, reject)=>{
        
            const process = execFile("afplay", [`${MEDIADIR}/${media}`], (error)=>{
                if (error){
                    reject();
                    return;
                }else{
                    //processes = processes.filter(p=>p.pid != process.pid);
                    //console.log("processes now", processes.map(p=>p.pid));
                    resolve();
                    return;
                }
            })
            processes = [...processes, process];
            //console.log("processes now", processes.map(p=>p.pid));
        
    }).catch(function(err){
       //do nothing...this is thrown when processes are killed in media/stop
    });
}

app.get('/api/media/stop', function (req, res, next) {
    console.log("SEEN A STOP!!");

    for (const p of processes){
        try{
            p.kill();
        }catch(err){
           // console.log(err);
        }
    }

    //also send stop to speech driver incase it's running sounds too!
    console.log("calling",SPEECHSTOPURL);
    request.get(SPEECHSTOPURL).timeout({response:1000}).then(res=>{
      console.log(res.body);
    });

    res.status(200).send("OK");
});

app.post('/api/media', async function (req, res, next) {
    const {media="", nowait=false} = req.body;
    //don't wait for media to end before sending ok (i.e no await!)
    console.log("seen request to play media", media, nowait);
    try{
    if (nowait){
        playIt(media);
    }else{
        await playIt(media);
    }   }
    catch(err){

    } 
    res.status(200).send("OK");
});

http.createServer(app).listen(PORT);
console.log("listening on port: " + PORT);

