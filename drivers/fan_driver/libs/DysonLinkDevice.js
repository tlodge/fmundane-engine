"use strict";

const mqtt = require('mqtt');
const crypto = require('crypto');
const EventEmitter = require("events").EventEmitter;

class DysonLinkDevice {
    static get SENSOR_EVENT() { return "sensor-updated"; }
    static get STATE_EVENT() { return "state-updated"; }

    constructor(displayName, ip, serialNumber, password, sensitivity, cb) {
        this.sensitivity = sensitivity;
        this.displayName = displayName;
        let serialRegex = /DYSON-(\w{3}-\w{2}-\w{8})-(\w{3})/;
        let [, id, model] = serialNumber.match(serialRegex) || [];
        if (!id || !model) {
            console.log("[ERROR] Incorrect serial number");
            this._valid = false;
        }

        else {
            this._id = id;
            this._model = model;
            this._valid = true;
            this._ip = ip;
            this._password = crypto.createHash('sha512').update(password, "utf8").digest("base64");
        }

        if (this.valid) {

            this.mqttEvent = new EventEmitter();
            // There can be 11 listeners for this at the same time
            this.mqttEvent.setMaxListeners(15);
            this.environmentEvent = new EventEmitter();

            this.mqttClient = mqtt.connect("mqtt://" + this._ip, {
                username: this._id,
                password: this._password
            });

            this.statusSubscribeTopic = this._model + "/" + this._id + "/status/current";
            this.commandTopic = this._model + "/" + this._id + "/command";

            this.mqttClient.on('connect', () => {
                console.log("[INFO] Connected to " + this._id + ". subscribe now");
                this.mqttClient.subscribe(this.statusSubscribeTopic);
                cb();
            });

            this.mqttClient.on('message', (topic, message) => {
                console.log("[info] " +  message.toString());
                //let result = JSON.parse(message);
            });
        }
    }
 //pact == particles? (micorgrams per cubic metre of air)
 //vact == volatile (volatile organic compounds) (1-10)

    requestForCurrentUpdate() {
        // Only do this when we have less than one listener to avoid multiple call        
        let senorlisternerCount = this.environmentEvent.listenerCount(this.SENSOR_EVENT);
        let fanlisternerCount = this.mqttEvent.listenerCount(this.STATE_EVENT);
        console.log("[DEBUG] Number of listeners - sensor:"+ senorlisternerCount + " fan:" + fanlisternerCount);
        if(senorlisternerCount <=1 && fanlisternerCount <=1) {
            console.log("Request for current state update");
            this.mqttClient.publish(this.commandTopic, '{"msg":"REQUEST-CURRENT-STATE"}');
        }
    }

    setState(state) {
        let currentTime = new Date();
        let message = { msg: "STATE-SET", time: currentTime.toISOString(), data: state };
       // console.log("[info] " +  this.displayName + " - Set State:" + JSON.stringify(state));
        this.mqttClient.publish(this.commandTopic, JSON.stringify(message));
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
            console.log("ok heat is ", heat);

            if (heat >= 1 && heat <= 37){
                this.setState({ fmod: "FAN" });
                this.setState({ hmod: "HEAT" });
                this.setState({ hmax: (heat+ 273)*10 }); // set temperature to 35
            }
        }catch(err){
            console.err(err);
        }
    }

    setCool(){
        this.setState({ fmod: "FAN" });
        this.setState({ hmod: "OFF" });
    }

    setRotate(value) {
        this.setState({ oson: value==1 ? "ON" : "OFF" });
    }

    notUpdatedRecently() {
        let currentTime = new Date();
        return !this.environment.lastUpdated || (currentTime.getTime() - this.environment.lastUpdated.getTime()) > (60 * 1000);
    }

    get valid() { return this._valid; }
}

module.exports = { DysonLinkDevice };
