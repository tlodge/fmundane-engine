Future mundane engine
---------------------

This is the backend that deals with a future mundane experience.  Note that it requires that the client is running and it requires that the drivers that communicate with the devices are also running.  To run the server:

To run in DEV mode

```
cd [root]/server
npm run startdev
```

to run the client (runs on http://localhost:3000)

```
cd [root]/client
npm start
```
 
To run in PROD mode

First you *must build the client*
```
cd [root]/client
npm run build
```

then

```
cd [root]/server
npm run start
```

To run an mqtt server

```
docker run -it --name mosquitto -p 1883:1883 eclipse-mosquitto
```

or version specific:

```
sudo docker run -it --name mosquitto -p 1883:1883 eclipse-mosquitto:1.6
```

or auto restart

docker run -d --name mosquitto --restart unless-stopped -p 1883:1883 eclipse-mosquitto:1.6


Gotchas
-------


**NO events firing**

If events are not firing - check you have mqtt running!  

i.e.:

```
sudo docker run -it --name mosquitto -p 1883:1883 eclipse-mosquitto:1.6

```

**No speech**

You have to be connected to the internet for speech to work, as it uses google's speech API!
You may also have gone over usage limits if it just stops working - wait a bit and try again

**Dyson**

You have to know the IP address of the dyson fan, which is tricky to find - it MAY show up in DHCP leases, but doesn't on my home router.  NMAP also fails to find it.
If you fail to connect to fan - make sure you're not running two drivers at the same time - they'll subscibe and unsubscribe each other!

**Pipsta**
Looks like support is no longer available, but got working on the pi with details from the following:

https://www.raspberrypi.org/forums/viewtopic.php?p=1736425



FAN Details
-----------


You communicate with DYSON over mqtt - to find the fan details, I had to do the following:

ssh -i .ssh/id_openwrt root@192.168.1.1 tcpdump -i br-lan -U -s0 -w - 'dst 192.168.1.125 and port 1883' | wireshark -k -i -

#on mac...!

ssh -i .ssh/id_openwrt root@192.168.1.50 tcpdump -i br-lan -U -s0 -w - 'dst 192.168.1.32 and port 1883' | /Applications/Wireshark.app/Contents/MacOS/wireshark -k -i -

Where 192.168.1.44 is the IP of the mobile phone!

Then once have found the correct IP - call this to get connection packet!

ssh -i .ssh/id_openwrt root@192.168.1.50 tcpdump -i br-lan -U -s0 -w - 'dst 192.168.1.45 and port 1883' | /Applications/Wireshark.app/Contents/MacOS/wireshark -k -i -

DYSON MAC ADDRESS IS: c8:ff:77:34:3f:e4
Client ID: paho9690699779914
User Name: B3H-UK-NKA0373A
Password: jNAiFBy+0jkOAV8khMjFKUxuWLhM+seqlGUdH6RW9qQlCI+JIbQZTRlJPj9kcEL6byNu7q+Q0D+0m3PRGooF5A==

Then you can run an mqtt client to test: (MQTTfx)

Supported MQTT SUBSCRIPTIONS:

527/B3H-UK-NKA0373A/status/current
527/B3H-UK-NKA0373A/status/software
527/B3H-UK-NKA0373A/status/connection
527/B3H-UK-NKA0373A/status/faults

Supported PUBLISH commands:

527/B3H-UK-NKA0373A/command

//set fan to 10 (note that timestring is not used, but needs to be there!)

{
    "data":{
        "fnsp" : "0010"
    },
    "mode-reason": "LAPP",
    "time" : "2020-11-12T14:00:99Z",
    "msg" : "STATE-SET"
}
{"msg":"STATE-SET","time":"2021-05-06T14:15:05.907Z","mode-reason":"LAPP","data":{"hmod":"HEAT","hmax":3010}}
//turn on heat, 23 degrees
{
    "data":{
        "hmod" : "HEAT",
        "hmax" : "2962"
    },
    "mode-reason": "LAPP",
    "time" : "2020-11-12T14:00:99Z",
    "msg" : "STATE-SET"
}

//350
{
    "data":{
        "osal" : "0005",
        "ossau" : "0355",
        "oson" : "OION",
        "fpwr" : "ON",
        "ancp" : "CUST"
    },

    "mode-reason": "LAPP",
    "time" : "2020-11-12T14:00:99Z",
    "msg" : "STATE-SET"
}

//fdir on or off

//180
{
    "data":{
        "osal" : "0090",
        "ossau" : "0270",
        "oson" : "OION",
        "fpwr" : "ON",
        "ancp" : "CUST"
    },

    "mode-reason": "LAPP",
    "time" : "2020-11-12T14:00:99Z",
    "msg" : "STATE-SET"
}

//90

{
    "data":{
        "osal" : "0135",
        "ossau" : "0225",
        "oson" : "OION",
        "fpwr" : "ON",
        "ancp" : "CUST"
    },

    "mode-reason": "LAPP",
    "time" : "2020-11-12T14:00:99Z",
    "msg" : "STATE-SET"
}


//45
{
    "data":{
        "osal" : "0158",
        "ossau" : "0203",
        "oson" : "OION",
        "fpwr" : "ON",
        "ancp" : "CUST"
    },

    "mode-reason": "LAPP",
    "time" : "2020-11-12T14:00:99Z",
    "msg" : "STATE-SET"
}


//get environmental data
{
    "mode-reason": "LAPP",
    "time" : "2020-11-12T14:00:99Z",
    "msg" : "REQUEST-PRODUCT-ENVIRONMENT-CURRENT_SENSOR-DATA"
}

{
   "mode-reason": "LAPP",
    "time" : "2020-11-12T14:00:99Z",
    "msg" : "REQUEST-CURRENT-STATE"
}

//turn off 
{
    "data":{
        "fpwr" : "OFF",
    },
    "mode-reason": "LAPP",
    "time" : "2020-11-12T14:00:99Z",
    "msg" : "STATE-SET"
}


How it all hooks together
-------------------------

There is a basic rule engine that runs off json config files.  It sets out what must happen each time an event occurs.  So for example events might be a person saying something, or, when the camera is on performing a gesture.  The event is sent from the client (web browser), to the server, which immediately sends it out over mqtt for anyone to see.  The server itself subscribes to all events that are in the json config files, and will do *something* if the rules in the config file match the event.  So take the following slice from a config file:

```
"events": [{
    "id": "e0",
    "subscription" : "/speech",
    "type": "speech",
    "rules": [{
        "rule": {
          "operator": "contains",
          "operand": ["yes"]
        },
        "actions": [
          ["turningonfan", "fanhot"],
          ["redlights"]
        ],
        "next": "asknames"
      },
      {
        "rule": {
          "operator": "contains",
          "operand": ["no"]
        },
        "actions": [
          ["askagain", "greet"]
        ],
        "next": "e0"
      }
    ],
    "default": {
      "rule": {
        "operator": "timeout",
        "operand": 3000
      },
      "actions": ["greet"],
      "next": "e0"
    }
  }
  ...
]
```

So here the server is subscribed to the 'speech' event.  When the client sends a speech event, as a GET request with a speech parameter containing the words said, the rule states that if the word "yes" is seen, then the actions "turningonfan' and "fanhot" must occur sequentially and in parallel with "redlights".  These labels correspond to actions in the actions.json file, which describe what must happen (i.e. a GET or POST request).

```
"pinklights": {
    "type": "request",
    "data": {
      "url": "http://localhost:9097/ui/api/fan?rotate=false&power=1&cool=true",
      "type": "GET",
      "contenttype": "application/json",
      "body": {
        "id": "28282:1292920-2;"
      }
    }
}
```

Note that the json configuration files are known as layers, and we can run multiple layers at the same time, so that we can incrementally build richer experiences.
