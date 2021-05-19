  require('console-stamp')(console, 'dd-mm-yy HH:MM:ss.l');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
var rp = require('request-promise-native');

const PORT = '9100';
const PLUG_IP = "192.168.1.138";
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let uvplug = null

const { Client } = require('tplink-smarthome-api');
const client = new Client();
const plug = client.getDevice({host: PLUG_IP}).then((device)=>{
  uvplug = device;  
  uvplug.getSysInfo().then(console.log);
  uvplug.setPowerState(true);
});

app.get('/ui/api/on', function (req, res, next) {
  console.log('turning uv light on')
  uvplug.setPowerState(true);
  res.status(200).send("OK")
});

app.get('/ui/api/off', function (req, res, next) {
  console.log('turning uv light off')
  uvplug.setPowerState(false);
  res.status(200).send("OK")
});

http.createServer(app).listen(PORT);
console.log("listening on port: " + PORT);

