const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mqtt = require('./mqttlib');
const cors = require('cors');
const app = express();
const sockets = [];

app.use(cors()) 
app.use(express.static("public"));

app.get('/send', (req,res)=>{
    send("hello and welcome!!!");
})
//app.get('/',  (req, res)=>{
//    res.sendFile(path.join(__dirname, 'client', 'index.html'));
//});
//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

mqtt.subscribe("miniscreen",  (message)=>{
    try{     
        const msg = JSON.parse(message);
        send(message.toString());
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
server.listen(process.env.PORT || 9107, () => {
    console.log(`Server started on port ${server.address().port}`);
});
  
