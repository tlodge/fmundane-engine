const express = require('express')
const app = express()
const path = require('path')
const PORT = '9097';


const FAN_CONFIG  = require("./config.json");

const DysonLinkDevice = require("./libs/DysonLinkDevice").DysonLinkDevice;
let timer;

function fan_off(cb) {
	device.setFanState(0, (data) => {
		cb(data);
	});
}

function fan_auto(cb) {
	device.setFanState(1, (data) => {
		cb(data);
	});
}

function fan_heat_high(cb) {
	device.setFanState(2, (data) => {
		cb(data);
	});

}

function fan_cool_high(cb) {
	device.setFanState(3, (data) => {
		cb(data);
	});

}

function fan_heat_low(cb) {
	device.setFanState(4, (data) => {
		cb(data);
	});

}

function fan_cool_low(cb) {
	device.setFanState(5, (data) => {
		cb(data);
	});

}

function fan_power(power, cb) {
	device.setFanPower(power, (data)=>{
		cb(data);
	})
}

function fan_rotate(value, cb) {
	const  _value = value === "true" ? 1 : 0;
	device.setRotate(_value);
}

function fan_cool(cb) {
	device.setCool();
}

function fan_heat(value) {
	device.setHeat(value);

}


function focus_jet_off(cb) {
	device.setFocusedJet("OFF", (data) => {
		cb(data);
	});
}

function focus_jet_on(cb) {
	device.setFocusedJet("ON", (data) => {
		cb(data);
	});
}


function getdata(){
	timer = setInterval(()=>{
		device.requestForCurrentUpdate();
	},1000);
}

function stopreading(){
	clearInterval(timer);
}


let device = new DysonLinkDevice(FAN_CONFIG.id, FAN_CONFIG.ip, FAN_CONFIG.serial, FAN_CONFIG.password,  1, () => {
	console.log("Fan is now connected");
});


app.use('/ui', express.static(path.join(__dirname, 'static')))

app.get('/ui/api/fan_off', (req,res) => {
	fan_off((data)=>{
		console.log(data);
	});
	res.status(200).send();
})

app.get('/ui/api/data_read', (req,res) => {
	getdata();
	res.status(200).send();
})

app.get('/ui/api/data_stop', (req,res) => {
	stopreading();
	res.status(200).send();
})

app.get('/ui/api/fan_auto', (req,res) => {
	fan_auto((data)=>{
		console.log(data);
	});
	res.status(200).send();
})

app.get('/ui/api/fan_heat_high', (req,res) => {
	fan_heat_high((data)=>{
		console.log(data);
	});
	res.status(200).send();
})

app.get('/ui/api/fan_cool_high', (req,res) => {
	fan_cool_high((data)=>{
		console.log(data);
	});
	res.status(200).send();
})

app.get('/ui/api/fan_heat_low', (req,res) => {
	fan_heat_low((data)=>{
		console.log(data);
	});
	res.status(200).send();
})

app.get('/ui/api/fan_cool_low', (req,res) => {
	fan_cool_low((data)=>{
		console.log(data);
	});
	res.status(200).send();
})

app.get('/ui/api/fan', (req,res) => {
	
	const {power=0} = req.query;
	const {rotate=null} = req.query;
	const {cool=null} = req.query;
	const {heat=null} = req.query;

	console.log(req.query);

	/*if (power > 0){
		fan_power(power);
	}
	if (rotate){
		fan_rotate(rotate); 
	}

	if (cool){
		fan_cool();
	}

	if (heat){
		console.log("heatimg", heat);
		fan_heat(heat);
	}*/

	res.status(200).send();
})

app.listen(PORT);
console.log("listening on port: " + PORT);


