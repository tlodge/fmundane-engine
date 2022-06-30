# Future mundane engine

The future mundane engine consists of a statemachine and a set of drivers that it communicates with to perform actions.  The state machine reads a json file that tells it how to behave. The json file can be generated using a bespoke twine app or it can be crafted by hand.  The engine also has a frontend 'wizard of oz' interface that allows you to manually trigger events, load new experiences and track where people are in an experience.

The engine uses mqtt (mosquitto) to communicate between drivers and the statemachine.  It uses websockets to communicate with the screen driver, which can do a variety of things such as play media, show environmental data from the dyson fan, show a webcamera and a qrcode for letting users use their own devices to run webapps as part of an experience.

For more info on how to get the server running see the README in the server directory.

## Future mundane webapps

Webapps are websites that are served from the machine running the future mundane engine.  
They can then be served up to devices connected to the caravan's network.
You can place them in the fmundane-engine/server/webapps directory and they will be served under the /wa subdirectory.
So for example the puzzle webapp is under

fmundane-engine/server/webapps/puzzle

and can be found at:

http://[fmundanemachine]:3001/wa/puzzle

getting webapps on a device's phone:

The screen driver has a screen that can display a qr code.  So if you call:

http://FMUNDANEMACHINEIP:9102/api/qrcode?qrcode=http://FMUNDANEMACHINEIP:3001/wa/puzzle

Then it will display a qrcode on the screen that will take the user to:

http://FMUNDANEMACHINEIP:3001/wa/puzzle

There is an action in fmundane-engine/server/src/actions.json:

```
"qrcode":{
      "type":"request",
      "data":{
         "url": "http://[lenovo]:9102/api/qrcode",
         "type":"GET",
         "contenttype":"application/json"
      },
      "query":{}
}
```

which can be called in a script as follows:

```
"actions": [
    [
        {
            "action": "qrcode",
            "params": {
                "query": {
                    "qrcode": "http://FMUNDANEMACHINEIP:3001/wa/puzzle"
                }
            },
            "method": "GET",
            "delay": 0
        }
    ]
]
```

so this will then show the qrcode on the screen.


### Triggering events from a webapp.

We now have a new event called webhook, that can be listened on.

So if we are currently on the following node:

{
    "type": "webhook",
    "name": "bespoketest",
    "id": "bespoketest",
    "subscription": "/webhook",
    "onstart": {
        "actions": [
            [
                {
                    "action": "qrcode",
                    "params": {
                        "query": {
                            "qrcode": "http://192.168.1.11:3001/wa/puzzle"
                        }
                    },
                    "method": "GET",
                    "delay": 0
                }
            ]
        ]
    },
    "rules": [
        {
            "rule": {
                "operator": "equals",
                "operand": "green"
            },
            "next": "startup",
            "actions": []
        }
    ],
    "data": [
        "green"
    ]
},

Then if our webapp calls:

/event/webhook?trigger=green

Then this will trigger the webhook event!