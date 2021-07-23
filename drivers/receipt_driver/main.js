require('console-stamp')(console, 'dd-mm-yy HH:MM:ss.l');

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var request = require('request');
var rp = require('request-promise-native');


const PORT = '8080';
const PI_URL = "http://192.168.1.192:8080/"
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/print', function (req, res, next) {
  print_text = req.body.text;
  console.log('printing: ' + print_text);
  /*let obj = {"text": print_text};
  var options = {
    method: 'POST',
    uri: PI_URL + "print",
    body: obj,
    json: true 
  };
  rp(options)
  .then(function (parsedBody) {
      console.log(parsedBody);
  })
  .catch(function (err) {
      console.log(err);
  });*/
  res.json({"status": "printed"});
});

http.createServer(app).listen(PORT);
console.log("listening on port: " + PORT);

