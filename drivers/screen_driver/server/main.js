const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mqtt = require('./mqttlib');
const cors = require('cors');
const app = express();
const sockets = [];

app.use(cors()) 
app.use(express.static("public"));
app.use(express.static("../../../media"));

app.get('/api/camera/scan', (req,res) => {
    console.log("seen camera scan request");
    send(JSON.stringify({type:"camera", state:"scan"}));
    res.status(200).send();
})

app.get('/api/camera', (req,res) => {
    console.log("seen scan request");
    const {type=null} = req.query;
    send(JSON.stringify({type:"camera"}));
	res.status(200).send();
})

app.get('/api/home', (req,res) => {
    console.log("seen home");
    const {type=null} = req.query;
    send(JSON.stringify({type:"url", url:"/"}));
	res.status(200).send();
})

app.get('/api/web', (req, res)=>{
    console.log("seen web");
    const {snippet=""} = req.query;
    send(JSON.stringify({type:"web", snippet}));
	res.status(200).send();
});

app.get('/api/media/play',  (req,res) => {
    console.log("seen media play request");
    const {media="", delay=500} = req.query;
    send(JSON.stringify({type:"media", media, delay}));
    res.status(200).send();
});

app.get('/api/media', (req,res) => {
    console.log("seen media request!");
    send(JSON.stringify({type:"url", url:"/media"}));
    res.status(200).send();
})

app.get('/api/air', (req,res) => {
    console.log("seen air request!");
    send(JSON.stringify({type:"url", url:"/air"}));
    res.status(200).send();
})

app.get('/api/qrcode', (req,res) => {
    console.log("seen qrcode request!");
    const {qrcode} = req.query;
    send(JSON.stringify({type:"qrcode", data:qrcode}));
    res.status(200).send();
})

app.get('/api/image', (req,res) => {
    console.log("seen image request!", req.query);
    const {image} = req.query;
    send(JSON.stringify({type:"image", image}));
    res.status(200).send();
})


app.get('/api/message', (req,res)=>{
    const {message=""} = req.query;
    console.log("seen message", message);
    send(JSON.stringify({type:"message", message}));
    res.status(200).send();
})
//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

/*wss.on('connection', (ws) => {

    ws.isAlive = true;

    ws.on('pong', () => {
        ws.isAlive = true;
    });

    //connection is up, let's add a simple simple event
    ws.on('message', (message) => { 
      console.log(message);
    });
});

setInterval(() => {
    wss.clients.forEach((ws) => {
        
        if (!ws.isAlive) return ws.terminate();
        
        ws.isAlive = false;
        ws.ping(null, false, true);
    });
}, 10000);*/


//pass through mqtt events to "camera" to the browser over websocket
//not sure dyson va10 and noxl are correct, though same interpretation as: https://github.com/Grizzelbee/ioBroker.dysonairpurifier
mqtt.subscribe("screen",  (message)=>{
    try{    
        
        const msg = JSON.parse(message);
        console.log(msg);
        if (msg.type === "dyson"){
            if (msg.msg==="ENVIRONMENTAL-CURRENT-SENSOR-DATA"){
                const {p10r="0000", p25r="0000", noxl="0000", va10="0000"} = msg.data;
                const pm10 = Number(p10r);
                const pm25 = Number(p25r);
                const no2  = Math.floor((Number(noxl) / 10));
                const voc  = Math.floor((Number(va10) / 10));    
                send(JSON.stringify({type:"dyson", data: {time:msg.time, pm10, pm25, voc, no2}}));
                
            }
        }
        else{
            send(message.toString());
        }
    }catch(err){    
        console.log(err);
    }
});

const send = (msg)=>{
    for (const s of sockets){
        try{
            s.send(msg);
        }catch(err){
            console.log(err);
        }
    }
}

wss.on('connection', (_ws) => {
    sockets.push(_ws);
    //connection is up, let's add a simple simple event
    _ws.on('message', (message) => {
        console.log('received: %s', message);
    });

    _ws.on("disconnect", ()=>{
        let i = sockets.indexOf(_ws);
        sockets.splice(i, 1);
     });
    //send immediatly a feedback to the incoming connection    
   
});

//start our server
server.listen(process.env.PORT || 9102, () => {
    console.log(`Server started on port ${server.address().port}`);
});
  