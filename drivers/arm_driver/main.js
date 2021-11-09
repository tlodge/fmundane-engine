const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const SerialPort = require('serialport');
const { setTimeout } = require('timers');
const PORT = '9107';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const port = new SerialPort('/dev/tty.usbserial-A10KME4J', {
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

app.get('/api/arm/test', async function (req, res, next) {
    console.log("test");
    await testIt();
    res.status(200).send("OK");
});

app.get('/api/arm/expand', async function (req, res, next) {
    console.log("expand");
    await expand();
    res.status(200).send("OK");
});

const collapse = async()=>{
    await(writeIt("#1 P1500\r")); //center
    await(writeIt("#2 P0\r")); //90g behind
    await(writeIt("#3 P3000\r"))
}

const expand = async()=>{
    await(writeIt("#1 P1500\r")); //center
    await(writeIt("#2 P1800\r")); //center
    await(writeIt("#3 P0\r")); 
}

const testIt = async ()=>{
   // await(writeIt("#0 P1500\r"));

    await(writeIt("#1 P1500\r"));
    await(writeIt("#2 P1500\r"));
    await(writeIt("#3 P1500\r"));
    await(writeIt("#4 P1500\r"));
    await(writeIt("#5 P1500\r"));

    await(writeIt("#1 P1500\r")); //center
    await waitFor(1000);
    await(writeIt("#1 P0\r")); //90deg
    await waitFor(1000);
    await(writeIt("#1 P1500\r")); //center
    await waitFor(1000);
    await(writeIt("#1 P3000\r")); //-90deg
    await waitFor(1000);
    await(writeIt("#1 P1500\r")); //center
    
    await(writeIt("#2 P1500\r")); //center
    await waitFor(1000);
    await(writeIt("#2 P0\r")); //90g behind
    await waitFor(1000);
    await(writeIt("#2 P2000\r")); //forward (max with #1 at 90deg)
    await waitFor(1500);
    await(writeIt("#2 P1500\r")); //forward (max with #1 at 90deg)

    await(writeIt("#3 P1500\r")); //center
    await waitFor(1000);
    await(writeIt("#3 P0\r")); //fully pointing up
    await waitFor(1000);
    await(writeIt("#3 P1500\r")); //center
    await waitFor(1000);
    await(writeIt("#3 P3000\r")); //fully pointing down
    await waitFor(1000);
    await(writeIt("#3 P1500\r")); //center

    await(writeIt("#4 P1500\r")); //center
    await waitFor(1000);
    await(writeIt("#4 P0\r")); //fully pointing up
    await waitFor(1000);
    await(writeIt("#4 P1500\r")); //center
    await waitFor(1000);
    await(writeIt("#4 P3000\r")); //fully pointing down
    await waitFor(1000);
    await(writeIt("#4 P1500\r")); //center

} 

const shrinkExpand = async ()=>{
    collapse();
    await waitFor(2000);
    expand();
}

collapse();
http.createServer(app).listen(PORT);
console.log("listening on port: " + PORT);

