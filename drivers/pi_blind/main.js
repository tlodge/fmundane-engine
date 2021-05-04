const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const PORT = 8080;

const app = express();

//let exec = require('process-promises').exec;

let exec = require('child-process-promise').exec;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/up', function (req, res, next) {
  exec('sudo /usr/bin/python /home/pi/blinds/control.py -t E9:8A:6D:0A:E0:F7 -c move_up')
    .then(function (result) {
        console.log('stdout: ', result.stdout);
        console.log('stderr: ', result.stderr);
    })
    .catch(function (err) {
        console.error('ERROR: ', err);
    });
  res.status(200).send("OK");
});

app.get('/down', function (req, res, next) {
  exec('sudo /usr/bin/python /home/pi/blinds/control.py -t E9:8A:6D:0A:E0:F7 -c move_down')
    .then(function (result) {
        console.log('stdout: ', result.stdout);
        console.log('stderr: ', result.stderr);
    })
    .catch(function (err) {
        console.error('ERROR: ', err);
    });
  res.status(200).send("OK");
});


http.createServer(app).listen(PORT);
console.log("listening on port: " + PORT);

