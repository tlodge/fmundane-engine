require('console-stamp')(console, 'dd-mm-yy HH:MM:ss.l');

const http = require('http');
const express = require('express');
const lightscript = require('./light-script.json');
const bodyParser = require('body-parser');
var path = require('path');
var rp = require('request-promise-native')

let hue_user = "pMouRfgbuQFC5VGtWysTe4cDmcWsZ1mThTNtKmOI"
let hue_url = "http://192.168.1.105/api"
let api_url = hue_url + '/' + hue_user
const PORT = '9092';

const lights = ["1","2","3","4","5","6","7"];

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const putter = async (light,obj={})=>{
  const options = {
    method: 'PUT',
    uri: api_url + `/lights/${light}/state`,
    body: obj,
    json: true 
  };
  parsedBody = await rp(options)
  console.log(parsedBody);
}

app.get('/ui/api/lights',function (req,res,next){
  var options = {
    method: 'GET',
    uri: api_url + "/lights",
    json: true 
  };
  rp(options)
  .then(function (parsedBody) {
      console.log(parsedBody);
      res.status("200").send(parsedBody);
  })
  .catch(function (err) {
      console.log(err);
  });
});

app.get('/ui/api/on', async function (req, res, next) {
  console.log('turning lights on')

  let obj = {"on": true, "bri": 254};
  
  for (light of lights){
    await putter(light,obj); 
  }

  res.status(200).send("OK");
});

app.get('/ui/api/20', async function (req, res, next) {
  console.log('setting lights to 20')
  let obj = {"on": true, "bri": 47};

  for (light of lights){
    await putter(light,obj);
  }

  res.status(200).send("OK");
});

app.get('/ui/api/off', async function (req, res, next) {
  console.log('turning lights off')
  let obj = {"on": false};
  for (light of lights){
    await putter(light,obj);
  }
  res.status(200).send("OK");
});

app.get('/ui/api/red', async function (req, res, next) {
  console.log('making lights red')
  let obj = {
            "on": true,
            "bri": 254,
            "hue": 64776,
            "sat": 254,
            "effect": "none",
            "xy": [
                0.6693,
                0.2976
            ],
            "ct": 153
        }

  for (light of lights){
    await putter(light,obj);
  }
  res.status(200).send("OK");
});

app.get('/ui/api/light_script', async function (req, res, next) {
  ref = req.query.script_id
  let obj = lightscript[ref]

  for (light of lights){
    await putter(light,obj);
  }
  res.status(200).send("OK");
});

app.get('/ui/api/white', async function (req, res, next) {
  console.log('making lights white')
  let obj = {
            "on": true,
            "bri": 235,
            "hue": 8574,
            "sat": 57,
            "transitiontime" : 200,
            "effect": "none",
            "xy": [
                0.411,
                0.3909
            ],
            "ct": 292
        }

  for (light of lights){
    await putter(light,obj);
  }
  res.status(200).send("OK");
});

http.createServer(app).listen(PORT);
console.log("listening on port: " + PORT);

