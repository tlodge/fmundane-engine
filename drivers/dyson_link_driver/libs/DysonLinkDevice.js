"use strict";

const mqtt = require('mqtt');
const crypto = require('crypto');
const EventEmitter = require("events").EventEmitter;

class DysonLinkDevice {
    static get SENSOR_EVENT() { return "sensor-updated"; }
    static get STATE_EVENT() { return "state-updated"; }

    /*"id": "DYSON LINK",
    "ip": "192.168.1.45",
    "username": "B3H-UK-NKA0373A",
    "password": "jNAiFBy+0jkOAV8khMjFKUxuWLhM+seqlGUdH6RW9qQlCI+JIbQZTRlJPj9kcEL6byNu7q+Q0D+0m3PRGooF5A==",
    "clientid": */
    
    constructor(model, id, ip, username, password, clientid, mqttrelayaddr="127.0.0.1", cb) {
        
        this._model = model;
        this._id = id;
        this._username = username;
        this._ip = ip;
        this._clientid = clientid;
        this._password = password;
        this.mqttEvent = new EventEmitter();
        // There can be 11 listeners for this at the same time
        this.mqttEvent.setMaxListeners(15);
        this.environmentEvent = new EventEmitter();


        this.mqttClient = mqtt.connect("mqtt://" + this._ip, {
            username: this._username,
            password: this._password,
            clientId:this._clientid,
        });

        this.mqttRelay =  mqtt.connect("mqtt://" + mqttrelayaddr);

        this.statusSubscribeTopic = this._model + "/" + this._id + "/status/current";
        this.commandTopic = this._model + "/" + this._id + "/command";

        this.mqttClient.on('connect', () => {
            console.log("[INFO] Connected to " + this._id + ". subscribe now");
            this.mqttClient.subscribe(this.statusSubscribeTopic);
            cb();
        });

        this.mqttRelay.on('connect', () => {
            console.log("[INFO] Connected to relay mqtt!");
        });

        this.mqttClient.on('message', (topic, message) => {
            const msg = JSON.parse(message);
            console.log("[info] " +  message.toString());
            this.mqttRelay.publish("screen", JSON.stringify(({type:"dyson", ...msg})));
            //let result = JSON.parse(message);
        });
        
    }
 //pact == particles? (micorgrams per cubic metre of air)
 //vact == volatile (volatile organic compounds) (1-10)

    requestForCurrentUpdate() {
        // Only do this when we have less than one listener to avoid multiple call        
        let senorlisternerCount = this.environmentEvent.listenerCount(this.SENSOR_EVENT);
        let fanlisternerCount = this.mqttEvent.listenerCount(this.STATE_EVENT);
        console.log("[DEBUG] Number of listeners - sensor:"+ senorlisternerCount + " fan:" + fanlisternerCount);
        let currentTime = new Date();
        if(senorlisternerCount <=1 && fanlisternerCount <=1) {
            this.mqttClient.publish(this.commandTopic, `{
                "mode-reason": "LAPP",
                "time" : "${currentTime.toISOString()}",
                "msg" : "REQUEST-CURRENT-STATE"
            }`);
        }
    }


    setState(state) {
        let currentTime = new Date();
        let message = { msg: "STATE-SET", time: currentTime.toISOString(), "mode-reason":"LAPP", data: state };
        console.log(JSON.stringify(message));
       // console.log("[info] " +  this.displayName + " - Set State:" + JSON.stringify(state));
        this.mqttClient.publish(this.commandTopic, JSON.stringify(message));
    }

    setFanOff(){
        console.log("setting fan OFF!")
        this.setState({ "fpwr" : "OFF"});
    }

    setFanOn(){
        console.log("setting fan ON!")
        this.setState({ "fpwr" : "ON"});
    }


    setFanPower(power, callback){
        if (power < 10){
            this.setState({ fnsp: `000${power}`});
        }else{
            this.setState({ fnsp: "0010" });
        }
    }

    //temperature provided is in kelvin...
    setFanState(value, callback) {
        switch (value) {
            case 0: // fan off
                this.setState({ fmod: "OFF" });
                break;
            case 1: // fan on auto
                this.setState({ hmax: (22 + 273)*10 }); // set temperature to 35
                this.setState({ hmod: "HEAT" });
                this.setState({ fmod: "AUTO" });
                break;
            case 2: // fan heat high
                this.setState({ fmod: "FAN" });
                this.setState({ hmod: "HEAT" });
                this.setState({ hmax: (35 + 273)*10 }); // set temperature to 35
                this.setState({ fnsp: "0010" });

                break;
            case 3: // fan cool high
                this.setState({ fmod: "FAN" });
                this.setState({ hmod: "OFF" });
                this.setState({ fnsp: "0010" });
                this.setState({ oson: "ON" });
                break;
            case 4: // fan heat low
                this.setState({ fmod: "FAN" });
                this.setState({ hmod: "HEAT" });
                this.setState({ hmax: (35 + 273)*10 }); // set temperature to 35
                this.setState({ fnsp: "0002" });
                break;
            case 5: // fan cool low
                this.setState({ fmod: "FAN" });
                this.setState({ hmod: "OFF" });
                this.setState({ fnsp: "0001" });
                break;

        }

    }

    setFocusedJet(value) {
        this.setState({ ffoc: value ? "ON" : "OFF" });
    }

    setHeat(value) {
        try{        
            const heat = Number(value);
            if (heat >= 1 && heat <= 37){
                this.setState({ hmod: "HEAT",hmax: `${(heat+ 273)*10}`});
            }
        }catch(err){
            console.err(err);
        }
    }

    setCool(){
        this.setState({ hmod: "OFF" });
    }

    setStopRotate(){
        this.setState({"oson":"OFF"});
    }

    setRotate(from, to) {
        const fpadding = 4 - `${from}`.length;
        const tpadding = 4 - `${to}`.length;

        let fzeros = "";
        let tzeros = "";
        
        for (let i=0; i < fpadding; i++){
            fzeros += "0";
        }
        for (let i=0; i < tpadding; i++){
            tzeros += "0";
        }

        this.setState(
            {
                "oson": "ON",
                "osau": `${fzeros}${from}`,
                "osal": `${tzeros}${to}`,
                "ancp": "CUST",
            }
        );

       
    }

    notUpdatedRecently() {
        let currentTime = new Date();
        return !this.environment.lastUpdated || (currentTime.getTime() - this.environment.lastUpdated.getTime()) > (60 * 1000);
    }

    get valid() { return this._valid; }
}

module.exports = { DysonLinkDevice };
