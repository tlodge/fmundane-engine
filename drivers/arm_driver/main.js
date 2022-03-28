const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const SerialPort = require('serialport');
const { setTimeout } = require('timers');
const PORT = '9107';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

///dev/tty.usbserial-A10KME4J
const port = new SerialPort('/dev/ttyUSB0', {
    baudRate: 115200
},  (err)=>{
    if (err) {
        return console.log('Error: ', err.message)
    }
})

const waitFor = (timeout)=>{
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve();
        },timeout);
    })
}
const writeIt = (str)=>{
    return new Promise((resolve, reject)=>{
        port.write(str, function(err) {
            if (err) {
                console.log(err);
              reject(err);
              return;
            }
           else{
               resolve();
           }
        });
    })
}

app.get('/api/arm/collapse', async function (req, res, next) {
    console.log("collapse");
    await collapse();
    res.status(200).send("OK");
});

app.get('/api/arm/scan', async function (req, res, next) {
    console.log("scan");
    await scan();
    res.status(200).send("OK");
});

app.get('/api/arm/expand', async function (req, res, next) {
    console.log("expand");
    await expand();
    res.status(200).send("OK");
});

const collapse = async()=>{
   //return to base
    await waitFor(800);
    await(writeIt("#4 P1500\r"));
    await(writeIt("#2 P1500\r"));
    await(writeIt("#1 P1600\r")); 
    await waitFor(800);
    await(writeIt("#3 P1000\r"));
    await waitFor(800);
    await(writeIt("#3 P1300\r"));
    await waitFor(800);
    await(writeIt("#3 P1800\r")); 
    await waitFor(800);
    await(writeIt("#2 P1000\r")); 
    await waitFor(800);
    await(writeIt("#3 P2000\r"));
    await(writeIt("#2 P100\r")); 
    await waitFor(800);
   
    await(writeIt("#3 P2000\r")); 
    await(writeIt("#4 P1500\r"));
    await waitFor(800);
    await(writeIt("#3 P2300\r")); 
    await waitFor(800);
    await(writeIt("#3 P2500\r")); 
    await waitFor(800);
    await(writeIt("#5 P2500\r")); 
    await waitFor(800);
    await(writeIt("#4 P0\r")); 

}

const fullrun = async()=>{
   
    //expand
    await(writeIt("#1 P1500\r")); //center
    await(writeIt("#5 P1500\r")); //center
    await waitFor(1000);
    await(writeIt("#2 P1500\r"));
    await(writeIt("#3 P1500\r"));
    await(writeIt("#4 P1500\r"));
    await waitFor(1000);
    await(writeIt("#3 P800\r"));
    await(writeIt("#4 P1800\r"));
    await waitFor(1000);
    
    //eyes look round
    await(writeIt("#5 P2500\r")); //center
    await waitFor(800);
    await(writeIt("#5 P2000\r")); //center
    await waitFor(800);
    await(writeIt("#5 P1500\r")); //center
    await waitFor(800);
    await(writeIt("#5 P100\r")); //center
    await waitFor(800);
    await(writeIt("#5 P500\r")); //center
    await waitFor(800);
    await(writeIt("#5 P800\r")); //center
    await waitFor(800);
    await(writeIt("#5 P1500\r")); //center
    await waitFor(800);


    //return to base
    await waitFor(800);
    await(writeIt("#2 P1500\r"));
    await(writeIt("#1 P1500\r")); 
    await waitFor(800);
    await(writeIt("#3 P1000\r"));
    await waitFor(800);
    await(writeIt("#3 P1300\r"));
    await waitFor(800);
    await(writeIt("#3 P1800\r")); 
    await waitFor(800);
    await(writeIt("#2 P1000\r")); 
    await waitFor(800);
    await(writeIt("#3 P2000\r"));
    await(writeIt("#2 P100\r")); 
    await waitFor(800);
   
    await(writeIt("#3 P2000\r")); 
    await(writeIt("#4 P1500\r"));
    await waitFor(800);
    await(writeIt("#3 P2300\r")); 
    await waitFor(800);
    await(writeIt("#3 P2500\r")); 
    await waitFor(800);
    await(writeIt("#5 P2500\r")); 
}

const expand = async()=>{
    //expand
    await(writeIt("#4 P1500\r"));
    waitFor(800);
    await(writeIt("#1 P1500\r")); //center
    await(writeIt("#5 P1500\r")); //center
    await waitFor(1000);
    await(writeIt("#2 P1500\r"));
    await(writeIt("#3 P1500\r"));
    await(writeIt("#4 P1500\r"));
    await waitFor(1000);
    await(writeIt("#3 P800\r"));
    await(writeIt("#4 P1800\r"));
    await waitFor(1000);
}

const scan = async()=>{
    await(writeIt("#5 P2500\r")); //center
    await waitFor(800);
    await(writeIt("#5 P2000\r")); //center
    await waitFor(800);
    await(writeIt("#5 P1500\r")); //center
    await waitFor(800);
    await(writeIt("#5 P100\r")); //center
    await waitFor(800);
    await(writeIt("#5 P500\r")); //center
    await waitFor(800);
    await(writeIt("#5 P800\r")); //center
    await waitFor(800);
    await(writeIt("#5 P1500\r")); //center
    await waitFor(800);
}

const shrinkExpand = async ()=>{
    collapse();
    await waitFor(2000);
    expand();
}
//fullrun()
http.createServer(app).listen(PORT);
console.log("listening on port: " + PORT);