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
