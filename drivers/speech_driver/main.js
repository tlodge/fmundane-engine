
require('console-stamp')(console, 'dd-mm-yy HH:MM:ss.l');

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const { execFile} = require('child_process');
var rp = require('request-promise-native')
const PORT = '9105';

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
    })
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

app.post('/api/speech', async function (req, res, next) {
    const {speech=[]} = req.body;
    for (const item of speech){
        console.log(item);
        const {words="", voice="Daniel", delay=0, background, rate} = item;

        if (background){
            playIt(background);    
        }
        await sayIt(words, voice, rate);    
        await waitFor(delay);
    }
    res.status(200).send("OK");
});

http.createServer(app).listen(PORT);
console.log("listening on port: " + PORT);

