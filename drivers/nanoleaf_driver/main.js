const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var rp = require('request-promise-native')
let nano_user = "8KTkwu3iqBHzzqr8xEOBjkSd7UdF8wu5"
let nano_url = "http://192.168.1.216:16021/api/v1"
let nano_api = nano_url + '/' + nano_user
const PORT = '9104';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const putter = async (obj={})=>{
  const options = {
    method: 'PUT',
    uri: nano_api + `/state`,
    body: obj,
    json: true 
  };
  parsedBody = await rp(options)
}


app.get('/ui/api/ct', async function (req, res, next) {
  const {value} = req.query;
  console.log('changing colour',value);
  let obj = {"ct": {"value":Number(value)}}
  await putter(obj); 
  res.status(200).send("OK");
});

app.get('/ui/api/sat', async function (req, res, next) {
  const {value} = req.query;
  console.log('changing saturation',value);
  const obj = {"sat": {"value":Number(value)}}
  await putter(obj); 
  res.status(200).send("OK");
});

app.get('/ui/api/hue', async function (req, res, next) {
  const {value} = req.query;
  console.log('changing hue',value);
  const obj = {"hue": {"value":Number(value)}}
  await putter(obj); 
  res.status(200).send("OK");
});

app.get('/ui/api/on', async function (req, res, next) {
  console.log('turning on!');
  const obj = {"on": {"value":true}}
  await putter(obj); 
  res.status(200).send("OK");
});

app.get('/ui/api/off', async function (req, res, next) {
  console.log('turning off!');
  const obj = {"on": {"value":false}}
  await putter(obj); 
  res.status(200).send("OK");
});

app.get('/ui/api/brightness', async function (req, res, next) {
  const {brightness,duration=2} = req.query;
  console.log('changing brightness to',brightness,' over ',duration,' s');
  const obj = {"brightness": {"value":Number(brightness), duration:Number(duration)}}
  await putter(obj); 
  res.status(200).send("OK");
});

const hexttoHSB = (hex)=>{
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(`#${hex}`);
  var r = parseInt(result[1], 16);
  var g = parseInt(result[2], 16);
  var b = parseInt(result[3], 16);

  r /= 255, g /= 255, b /= 255;
  var max = Math.max(r, g, b), min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2;

  if(max == min){
      h = s = 0; // achromatic
  } else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch(max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
  }

  s = s*100;
  s = Math.round(s);
  l = l*100;
  l = Math.round(l);
  h = Math.round(360*h);

   return {hue:h, sat:s, bri:l};
  
}

app.get('/ui/api/hex', async function(req, res){
  let {hex="000000"} = req.query;
  const {hue,sat,bri} = hexttoHSB(hex);
  
  const obj = {
    hue,
    sat,
    bri,
    on:true,
  }
  console.log("sending", JSON.stringify(obj,null,4))
  await putter(obj); 
  res.status(200).send("OK");
});

app.get('/ui/api', async function(req,res){
  let {brightness,duration,on,hue,sat,ct} = req.query;
  console.log(req.query);
  let obj = {}

  if (brightness) { obj.brightness = {value: Number(brightness)}};
  if (on) { obj.on = {value: on=="true"? true:false}};
  if (hue) { obj.hue = {value: Number(hue)}};
  if (sat) { obj.sat = {value: Number(sat)}};
  if (ct) { obj.ct = {value: Number(ct)}};
  if (duration) { obj.duration = {value: Number(duration)}};

  console.log("sending", JSON.stringify(obj,null,4))
  await putter(obj); 
  res.status(200).send("OK");

});

http.createServer(app).listen(PORT);
console.log("listening on port: " + PORT);

