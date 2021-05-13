const express = require('express')
const app = express()
const path = require('path')
const PORT = '9097';


const FAN_CONFIG  = require("./config.json");

const DysonLinkDevice = require("./libs/DysonLinkDevice").DysonLinkDevice;
let timer;

getdata();

function fan_on(on) {
	if (on=="true"){
		device.setFanOn();
	}else{
		device.setFanOff();
	}
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

function fan_power(power, cb=()=>{}) {
	device.setFanPower(power, (data)=>{
		cb(data);
	})
}

function fan_rotate(from,to, cb=()=>{}) {
	
	device.setRotate(from, to);
}
function fan_stop_rotate(cb=()=>{}) {
	device.setStopRotate();
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
	},3000);
}

function stopreading(){
	clearInterval(timer);
}


let device = new DysonLinkDevice(FAN_CONFIG.model, FAN_CONFIG.id, FAN_CONFIG.ip, FAN_CONFIG.username, FAN_CONFIG.password,  FAN_CONFIG.clientid, FAN_CONFIG.MQTT_IP, () => {
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
	
	const {on=null} = req.query;
	const {power=0} = req.query;
	const {rotate=null} = req.query;
	const {cool=null} = req.query;
	const {heat=null} = req.query;

	console.log(req.query);

	if (on != null){
		fan_on(req.query.on);
	}
	if (power > 0){
		fan_power(power,()=>{
			console.log("set power to", power)
		});
	}
	if (rotate){
		const {from=null, to=null} = req.query;
		if (!from || !to){
			fan_stop_rotate();
		}else{
			fan_rotate(from,to);
		}
	}

	if (cool){
		fan_cool();
	}

	if (heat){
		fan_heat(heat);
	}

	res.status(200).send();
})

app.listen(PORT);
console.log("listening on port: " + PORT);


