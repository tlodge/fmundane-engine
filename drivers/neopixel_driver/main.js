const express = require('express');
const http = require('http');
const mqtt = require('./mqttlib');
const app = express();

app.get('/api/lights', (req,res) => {
    const {value="OFF"} = req.query;
    console.log(`sending fmundane/lights/${value}`);
    mqtt.send("fmundane/lights/", value);
	res.status(200).send();
})
//initialize a simple http server
const server = http.createServer(app);

//start our server
server.listen(process.env.PORT || 9103, () => {
    console.log(`Server started on port ${server.address().port}`);
});
