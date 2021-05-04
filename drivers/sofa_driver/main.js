require('console-stamp')(console, 'dd-mm-yy HH:MM:ss.l');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var request = require('request');

const PORT = '9099';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let sat_down = 0;

app.post('/ui/api/set_sat_down', function (req, res, next) {
  console.log('request received from arduino')
  console.log(req.body);
  sat_down = req.body.sat_down;
  console.log(sat_down)  
  res.json({state: sat_down})
  
});

app.get('/ui/api/get_sat_down', function (req, res, next) {
  console.log('return if someone has sat down')
  res.json({state: sat_down})
});

http.createServer(app).listen(PORT);
console.log("listening on port: " + PORT);

