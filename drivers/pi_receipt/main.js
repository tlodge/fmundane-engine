const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const PORT = 8080;

const app = express();

let exec = require('child-process-promise').exec;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/print', function (req, res, next) {
  toprint = req.body.text;
  exec('echo \"' + toprint + '\" | lp')
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

