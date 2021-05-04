//var Omx = require('node-omxplayer');
var Mplayer = require('mplayer'); 



const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const PORT = process.env.port || '8080';

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var player = new Mplayer();
let mute = 0;


app.get('/play_1', function(req, res, next) {
  player.stop();
  setTimeout(function () {
    player.openFile('/home/pi/audio-main-speakers-mixed/ID012-01.wav');
    res.send("ok");
  },10);   
});

app.get('/play_2', function(req, res, next) {
  player.stop();
  setTimeout(function (){
    player.openFile('/home/pi/audio-main-speakers-mixed/ID032-02.wav');
    res.send("ok")
  }, 10); 
});

app.get('/play_3', function(req, res, next) {
  player.stop();
  setTimeout(function (){
    player.openFile('/home/pi/audio-main-speakers-mixed/ID055-03.wav');
    res.send("ok")
  }, 10); 
});

app.get('/pause', function(req, res, next) {
  player.pause();
  res.send("ok");
});

app.get('/stop', function(req, res, next) {
  player.stop();
  res.send("ok");
});

app.get('/mute', function(req, res, next) {
  if(mute == 0){
    player.mute()
    mute = 1;
  }
  else{
    console.log("already muted")
  }
  res.send("ok");
});

app.get('/unmute', function(req, res, next) {
  if(mute == 1){
    player.mute()
    mute = 0;
  }
  else{
    console.log("already unmuted")
  }
  res.send("ok");
});

app.get('/play', function(req, res, next) {
  player.play();
  res.send("ok");
});

http.createServer(app).listen(PORT);
