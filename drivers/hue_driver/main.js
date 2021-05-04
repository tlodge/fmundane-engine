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

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/ui/api/on', function (req, res, next) {
  console.log('turning lights on')
  let obj = {"on": true, "bri": 254};
  var options = {
    method: 'PUT',
    uri: api_url + "/lights/1/state",
    body: obj,
    json: true 
  };
  rp(options)
  .then(function (parsedBody) {
      console.log(parsedBody);
  })
  .catch(function (err) {
      console.log(err);
  });

  var options2 = {
    method: 'PUT',
    uri: api_url + "/lights/2/state",
    body: obj,
    json: true 
  };
  rp(options2)
  .then(function (parsedBody) {
      console.log(parsedBody);
  })
  .catch(function (err) {
      console.log(err);
  });
  var options3 = {
    method: 'PUT',
    uri: api_url + "/lights/3/state",
    body: obj,
    json: true 
  };
  rp(options3)
  .then(function (parsedBody) {
      console.log(parsedBody);
  })
  .catch(function (err) {
      console.log(err);
  });
  res.status(200).send("OK");
});

app.get('/ui/api/20', function (req, res, next) {
  console.log('setting lights to 20')
  let obj = {"on": true, "bri": 47};
   var options = {
    method: 'PUT',
    uri: api_url + "/lights/1/state",
    body: obj,
    json: true 
  };
  rp(options)
  .then(function (parsedBody) {
      console.log(parsedBody);
  })
  .catch(function (err) {
      console.log(err);
  });

  var options2 = {
    method: 'PUT',
    uri: api_url + "/lights/2/state",
    body: obj,
    json: true 
  };
  rp(options2)
  .then(function (parsedBody) {
      console.log(parsedBody);
  })
  .catch(function (err) {
      console.log(err);
  });

  var options3 = {
    method: 'PUT',
    uri: api_url + "/lights/3/state",
    body: obj,
    json: true 
  };
  rp(options3)
  .then(function (parsedBody) {
      console.log(parsedBody);
  })
  .catch(function (err) {
      console.log(err);
  });
  res.status(200).send("OK");
});

app.get('/ui/api/off', function (req, res, next) {
  console.log('turning lights off')
  let obj = {"on": false};
  var options = {
    method: 'PUT',
    uri: api_url + "/lights/1/state",
    body: obj,
    json: true 
  };
  rp(options)
  .then(function (parsedBody) {
      console.log(parsedBody);
  })
  .catch(function (err) {
      console.log(err);
  });

  var options2 = {
    method: 'PUT',
    uri: api_url + "/lights/2/state",
    body: obj,
    json: true 
  };
  rp(options2)
  .then(function (parsedBody) {
      console.log(parsedBody);
  })
  .catch(function (err) {
      console.log(err);
  });

  var options3 = {
    method: 'PUT',
    uri: api_url + "/lights/3/state",
    body: obj,
    json: true 
  };
  rp(options3)
  .then(function (parsedBody) {
      console.log(parsedBody);
  })
  .catch(function (err) {
      console.log(err);
  });
  res.status(200).send("OK");
});

app.get('/ui/api/red', function (req, res, next) {
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
  var options = {
    method: 'PUT',
    uri: api_url + "/lights/1/state",
    body: obj,
    json: true 
  };
  rp(options)
  .then(function (parsedBody) {
      console.log(parsedBody);
  })
  .catch(function (err) {
      console.log(err);
  });

  var options2 = {
    method: 'PUT',
    uri: api_url + "/lights/2/state",
    body: obj,
    json: true
  };
  rp(options2)
  .then(function (parsedBody) {
      console.log(parsedBody);
  })
  .catch(function (err) {
      console.log(err);
  });

  var options3 = {
    method: 'PUT',
    uri: api_url + "/lights/3/state",
    body: obj,
    json: true 
  };
  rp(options3)
  .then(function (parsedBody) {
      console.log(parsedBody);
  })
  .catch(function (err) {
      console.log(err);
  });
  res.status(200).send("OK");
});

app.post('/ui/api/light_script', function (req, res, next) {
  ref = req.body.script_id
  let obj = lightscript[ref]
  var options = {
    method: 'PUT',
    uri: api_url + "/lights/1/state",
    body: obj,
    json: true 
  };
  rp(options)
  .then(function (parsedBody) {
      console.log(parsedBody);
  })
  .catch(function (err) {
      console.log(err);
  });

  var options2 = {
    method: 'PUT',
    uri: api_url + "/lights/2/state",
    body: obj,
    json: true
  };
  rp(options2)
  .then(function (parsedBody) {
      console.log(parsedBody);
  })
  .catch(function (err) {
      console.log(err);
  });

  var options3 = {
    method: 'PUT',
    uri: api_url + "/lights/3/state",
    body: obj,
    json: true 
  };
  rp(options3)
  .then(function (parsedBody) {
      console.log(parsedBody);
  })
  .catch(function (err) {
      console.log(err);
  });
  res.status(200).send("OK");
});

app.get('/ui/api/white', function (req, res, next) {
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
  var options = {
    method: 'PUT',
    uri: api_url + "/lights/1/state",
    body: obj,
    json: true 
  };
  rp(options)
  .then(function (parsedBody) {
      console.log(parsedBody);
  })
  .catch(function (err) {
      console.log(err);
  });

  var options2 = {
    method: 'PUT',
    uri: api_url + "/lights/2/state",
    body: obj,
    json: true 
  };
  rp(options2)
  .then(function (parsedBody) {
      console.log(parsedBody);
  })
  .catch(function (err) {
      console.log(err);
  });

  var options3 = {
    method: 'PUT',
    uri: api_url + "/lights/3/state",
    body: obj,
    json: true 
  };
  rp(options3)
  .then(function (parsedBody) {
      console.log(parsedBody);
  })
  .catch(function (err) {
      console.log(err);
  });
  res.status(200).send("OK");
});

http.createServer(app).listen(PORT);
console.log("listening on port: " + PORT);

