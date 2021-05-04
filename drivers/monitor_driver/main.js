const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var rp = require('request-promise-native');

settings = require('./settings.json');


const PORT = '9096';
const CLIENT_KEY = settings.client;
const SERVER_KEY = settings.server;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/ui/api/send', function (req, res, next) {
  console.log('sending text to monitor: ' + req.body.text)
  let sendText = req.body.text;
  let textSize = req.body.size
  var options = {
    method: 'POST',
    uri: 'https://fcm.googleapis.com/fcm/send',
    headers: {
      "Authorization": SERVER_KEY
    },
    body: {
      to: CLIENT_KEY,
      notification: {
        body: {
          command: "add_text",
          text: sendText,
          size: textSize
        }
      }
    },
    json: true // Automatically stringifies the body to JSON
	};
 
	rp(options)
    .then(function (parsedBody) {
        console.log(parsedBody)
    })
    .catch(function (err) {
        console.log(err);
    });
	res.json({status: "ok"});

});

app.get('/ui/api/clear', function (req, res, next) {
  console.log('clearing monitor screen')
  let sendText = req.body.text;
  var options = {
    method: 'POST',
    uri: 'https://fcm.googleapis.com/fcm/send',
    headers: {
      "Authorization": SERVER_KEY
    },
    body: {
      to: CLIENT_KEY,
      notification: {
        body: {
          command: "clear_screen"
        }
      }
    },
    json: true // Automatically stringifies the body to JSON
  };
 
  rp(options)
    .then(function (parsedBody) {
        console.log(parsedBody)
    })
    .catch(function (err) {
        console.log(err);
    });
  res.json({status: "ok"});

});

app.get('/ui/api/red', function (req, res, next) {
  console.log('setting screen to red')
  let sendText = req.body.text;
  var options = {
    method: 'POST',
    uri: 'https://fcm.googleapis.com/fcm/send',
    headers: {
      "Authorization": SERVER_KEY
    },
    body: {
      to: CLIENT_KEY,
      notification: {
        body: {
          command: "screen_red"
        }
      }
    },
    json: true // Automatically stringifies the body to JSON
  };
 
  rp(options)
    .then(function (parsedBody) {
        console.log(parsedBody)
    })
    .catch(function (err) {
        console.log(err);
    });
  res.json({status: "ok"});

});

app.get('/ui/api/black', function (req, res, next) {
  console.log('setting screen to black')
  let sendText = req.body.text;
  var options = {
    method: 'POST',
    uri: 'https://fcm.googleapis.com/fcm/send',
    headers: {
      "Authorization": SERVER_KEY
    },
    body: {
      to: CLIENT_KEY,
      notification: {
        body: {
          command: "screen_black"
        }
      }
    },
    json: true // Automatically stringifies the body to JSON
  };
 
  rp(options)
    .then(function (parsedBody) {
        console.log(parsedBody)
    })
    .catch(function (err) {
        console.log(err);
    });
  res.json({status: "ok"});

});

http.createServer(app).listen(PORT);
console.log("listening on port: " + PORT);

