const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var rp = require('request-promise-native');

settings = require('./settings.json');
const CLIENT_KEY = settings.client;
const SERVER_KEY = settings.server;

const PORT = '9094';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/ui/api/play_file', function (req, res, next) {
  let file_id = req.body.file_id;
  console.log("playing " + file_id);
  var options = {
    method: 'POST',
    uri: 'https://fcm.googleapis.com/fcm/send',
    headers: {
      "Authorization": SERVER_KEY
    },
    body: {
      to: CLIENT_KEY,
      notification: {
        body: file_id
      }
    },
    json: true // Automatically stringifies the body to JSON
	};

	rp(options)
    .then(function (parsedBody) {
    	res.json({status: "OK"});
        console.log(parsedBody)
    })
    .catch(function (err) {
    	res.json({status: "FAILED"});
        console.log(err);
    });
	
});

app.get('/ui/api/stop', function (req, res, next) {
  console.log('stopping playback')
  var options = {
    method: 'POST',
    uri: 'https://fcm.googleapis.com/fcm/send',
    headers: {
      "Authorization": SERVER_KEY
    },
    body: {
      to: CLIENT_KEY,
      notification: {
        body: "stop"
      }
    },
    json: true // Automatically stringifies the body to JSON
	};

	rp(options)
    .then(function (parsedBody) {
    	res.json({status: "OK"});
        console.log(parsedBody)
    })
    .catch(function (err) {
    	res.json({status: "FAILED"});
        console.log(err);
    });
});

http.createServer(app).listen(PORT);
console.log("listening on port: " + PORT);