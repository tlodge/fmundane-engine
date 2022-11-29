
require('console-stamp')(console, 'dd-mm-yy HH:MM:ss.l');

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { execFile} = require('child_process');
const PORT = '9105';
const MEDIADIR = '../../media';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let processes = [];

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

const sayIt = (words="", voice="Daniel", rate=150)=>{
    return new Promise((resolve, reject)=>{
        execFile("say", ["-v", voice, `[[rate ${rate}]] ${words}`], (error)=>{
            if (error){
                reject();
                return;
            }else{
                resolve();
                return;
            }
        });
    }).catch((err)=>{
        return new Promise((resolve, reject)=>{
            execFile("say", ["-v", "Daniel", `[[rate ${rate}]] ${words}`], (error)=>{
                if (error){
                    reject();
                    return;
                }else{
                    resolve();
                    return;
                }
            });
        }).catch((err)=>{
            console.log("failed to speak",err);
        })
    });
}

const waitFor = (delay)=>{
    return new Promise((resolve, reject)=>{
        if (delay <= 0){
            resolve();
            return;
        }
        setTimeout(()=>{
            resolve();
            return;
        },delay)
    });
}

app.get('/api/speech/stop', function (req, res, next) {
    console.log("SEEN A STOP!!");

    for (const p of processes){
        try{
            p.kill();
        }catch(err){
            //console.log(err);
        }
    }
    res.status(200).send("OK");
});


app.post('/api/speech', async function (req, res, next) {
    const {speech=[]} = req.body;
    
    console.log("seen speech", JSON.stringify(speech,null,4));

    for (const item of speech){
        console.log(item);
        const {words="", voice="Daniel", delay=0, background, rate} = item;

        if (background){
            playIt(background);    
        }
        await sayIt(words, voice, rate);    
        await waitFor(delay);
    }
    console.log("finished talking!")
    res.status(200).send("OK");
});

http.createServer(app).listen(PORT);
console.log("listening on port: " + PORT);

