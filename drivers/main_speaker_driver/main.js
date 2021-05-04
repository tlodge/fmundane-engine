const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var rp = require('request-promise-native');


const PORT = '9093';
const PI_URL = "http://192.168.1.108:8080/" //ooi1pi.local
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/ui/api/play_1', function (req, res, next) {
	var options = {
    	method: 'GET',
    	uri: PI_URL + 'play_1',
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

app.get('/ui/api/play_2', function (req, res, next) {
	var options = {
    	method: 'GET',
    	uri: PI_URL + 'play_2',
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

app.get('/ui/api/play_3', function (req, res, next) {
  var options = {
      method: 'GET',
      uri: PI_URL + 'play_3',
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

app.get('/ui/api/pause', function (req, res, next) {
  var options = {
      method: 'GET',
      uri: PI_URL + 'pause',
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

app.get('/ui/api/play', function (req, res, next) {
  var options = {
      method: 'GET',
      uri: PI_URL + 'play',
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

app.get('/ui/api/stop', function (req, res, next) {
   var options = {
      method: 'GET',
      uri: PI_URL + 'stop',
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

app.get('/ui/api/mute', function (req, res, next) {
   var options = {
      method: 'GET',
      uri: PI_URL + 'mute',
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

app.get('/ui/api/unmute', function (req, res, next) {
  var options = {
      method: 'GET',
      uri: PI_URL + 'unmute',
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

