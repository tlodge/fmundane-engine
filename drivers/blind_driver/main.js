require('console-stamp')(console, 'dd-mm-yy HH:MM:ss.l');

const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
var rp = require('request-promise-native');


const PORT = '9091';
const PI_URL = "http://192.168.1.139:8080/"; // ooi2pi
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/ui/api/up', function (req, res, next) {
  console.log('putting blind up')
  var options = {
    	method: 'GET',
    	uri: PI_URL + 'up',
    	json: false
	};

	rp(options)
  .then(function (parsedBody) {
      res.status(200).send("OK")
  })
  .catch(function (err) {
      res.status(200).send("Failed")
  });
});

app.get('/ui/api/down', function (req, res, next) {
  console.log('putting blind down')
  var options = {
    	method: 'GET',
    	uri: PI_URL + 'down',
    	json: false
	};

	rp(options)
  .then(function (parsedBody) {
      res.status(200).send("OK")
  })
  .catch(function (err) {
      res.status(200).send("Failed")
  });
});

http.createServer(app).listen(PORT);
console.log("listening on port: " + PORT);

