require('console-stamp')(console, 'dd-mm-yy HH:MM:ss.l');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var request = require('request');
var rp = require('request-promise-native');


const PORT = '9098';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

let jug_enabled = 0;

var urls = {
  "main_speaker_driver" : "http://127.0.0.1:9093/ui/api/",
  "monitor_driver" : "http://127.0.0.1:9096/ui/api/",
  "clock_audio_driver" : "http://127.0.0.1:9094/ui/api/",
  "obm_app" : "http://127.0.0.1:9000/ui/api/"
};

var send_monitor = function (text) {
  console.log("outputting to monitor " + text)
  let obj = {
    "text": text,
    "size": 1
  };
  var options = {
      method: 'POST',
      body: obj,
      uri: urls["monitor_driver"] + 'send',
      json: true
  };
  rp(options)
  .then(function (parsedBody) {
      console.log("success sending to monitor")
      return("OK")
  })
  .catch(function (err) {
      console.log("success sending to monitor", err)
      return("FAIL")
  });
}

var clock_audio = function(file_id) {
    let obj = {
    "file_id": file_id
    };
    var options = {
        method: 'POST',
        body: obj,
        uri: urls["clock_audio_driver"] + 'play_file',
        json: true
    };
    rp(options)
    .then(function (parsedBody) {
        console.log("success played file " + file_id)
        return("OK")
    })
    .catch(function (err) {
        console.log("failed playing file", err)
        return("FAIL")
    });
}

app.get('/ui/api/enable_jug', function (req, res, next) {
  jug_enabled = 1;
  res.json({status: "OK"});

});

app.get('/ui/api/disable_jug', function (req, res, next) {
  jug_enabled = 0; 
  res.json({status: "OK"});

});

app.post('/ui/api/set_cup_moved_l', function (req, res, next) {
  console.log('received call from left cup')
  console.log(req.body);
  var options = {
    method: 'GET',
    uri: urls["obm_app"] + 'water_used',
    json: false
  };
  rp(options)
  .then(function (parsedBody) {
      return("OK");
  })
  .catch(function (err) {
      console.log("failed to set water as used", err)
      return("FAIL")
  }); 
  console.log("left: " + req.body.moved);
  res.send("OK");  
});

app.post('/ui/api/set_cup_moved_r', function (req, res, next) {
  console.log('received call from right cup')
  console.log(req.body);
  var options = {
    method: 'GET',
    uri: urls["obm_app"] + 'water_used',
    json: false
  };
  rp(options)
  .then(function (parsedBody) {
      return("OK");
  })
  .catch(function (err) {
      console.log("failed to set water as used", err)
      return("FAIL")
  });

  res.send("OK");  
});

app.post('/ui/api/set_oyster_moved', function (req, res, next) {
  var options = {
    method: 'GET',
    uri: urls["obm_app"] + 'oyster_used',
    json: false
  };
  rp(options)
  .then(function (parsedBody) {
      return("OK");
  })
  .catch(function (err) {
      console.log("failed to set oyster card as used", err)
      return("FAIL")
  });
  res.send("OK");
});

app.post('/ui/api/set_book_moved', function (req, res, next) {
  var options = {
    method: 'GET',
    uri: urls["obm_app"] + 'book_used',
    json: false
  };
  rp(options)
  .then(function (parsedBody) {
      return("OK");
  })
  .catch(function (err) {
      console.log("failed to set book as used", err)
      return("FAIL")
  });
  res.send("OK");
});

app.post('/ui/api/set_jug_moved', function (req, res, next) {
  console.log('jug end point hit')
  if(jug_enabled) {
    var options = {
      method: 'GET',
      uri: urls["obm_app"] + 'jug_used',
      json: false
    };
    rp(options)
    .then(function (parsedBody) {
        return("OK");
    })
    .catch(function (err) {
        console.log("failed to set book as used", err)
        return("FAIL")
    });
  }
  console.log("jug: " + jug_moved);
  res.send("OK");
});

http.createServer(app).listen(PORT);
console.log("listening on port: " + PORT);

