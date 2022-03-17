const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mqtt = require('./mqttlib');
const cors = require('cors');
const app = express();
const sockets = [];

app.use(cors()) 
app.use(express.static("public"));

app.get('/api/update', (req,res)=>{
    const {html=""} = req.query; 
    try{
        send(html);
    }finally{
        console.log("returning success!!");
        res.send({success:true});
    }
})

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

mqtt.subscribe("/miniscreen",  (message)=>{
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
    
    _ws.on('message', (message) => {
        console.log('received: %s', message);
    });

    _ws.on("disconnect", ()=>{
        let i = sockets.indexOf(_ws);
        sockets.splice(i, 1);
     });
      
   
});

//start our server
server.listen(process.env.PORT || 9107, () => {
    console.log(`Server started on port ${server.address().port}`);
});
  
