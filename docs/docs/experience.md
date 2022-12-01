---
sidebar_position: 2
---

# Creating Experiences

Note that experiences can be created using a modified version of [Twine](https://tlodge.github.io/fmundane-twine/).  Though it is worth reading through this to get an idea of the file structure.  However, to get started with authoring, take a look at the [Future Mundane Twine Repo](https://github.com/tlodge/fmundane-twine), and read our docs here.


An experience consists of one or more **layers.** A layer can be thought of as a set of nodes and branching paths (i.e. a tree). A **node** is a point in an experience where things ( **actions** ) happen. So a node might turn lights white, turn the fan on and put something on the screen. 

Once a node has done all that it is meant to do, it will wait for an **event** , which will then cause it to optionally perform more actions and then move onto another node. The actions that are performed and the node that is moved onto will be determined by a set of **rules.** And that is basically it. There are one or more layers, so that you can have lots of different branching paths that run in parallel and which each respond to different events. In practice its most common to just have the one layer, but there are experiences that have a couple of layers (which we'll get to later).

The piece of code that handles a layer is src/statemachine.js. At any point it time, the state machine will be at a particular state (i.e. node). When the state machine moves to a new node (upon seeing an event that matches a rule), it will trigger a bunch of actions. Those actions may run sequentially or in parallel. Once the actions are complete, the state machine will wait for a new event, evaluate it against a rule and move to a new node if the rule holds. The actions that the statemachine performs are calls to url endpoints. 
The most common event is a 'button press', which is triggered by a user pressing a button on the WoZ interface. Events are sent and received over mqtt. Thus sensors and devices can trigger events by writing messages to the mqtt broker that the server is listening to. The mqtt broker in run in Docker, and info on how to start it can be found in README.md in the server directory. Layers are created by reading a json 'experience' file. We'll provide more detail now:

## A Caravan 'experience' file

Experience files are written in json. They are reasonably easy to understand but very fiddly to write. Here is an example:

```json
[
   {
      "id":"tests",
      "start":{
         "actions":[
            [
               
            ]
         ],
         "event":"start"
      },
      "events":[
         {
            "type":"button",
            "name":"start",
            "id":"start",
            "subscription":"/press",
            "onstart":{
               "actions":[
                  [
                     {
                        "action":"http://[lenovo]:9102/api/media/play",
                        "params":{
                           "query":{
                              "media":"TV.mp4"
                           }
                        },
                        "method":"GET",
                        "delay":0
                     }
                  ],
                  [
                     {
                        "action":"http://[speech]:9105/api/speech",
                        "params":{
                           "body":{
                              "speech":[
                                 {
                                    "words":"Welcome this is me!",
                                    "voice":"Daniel",
                                    "rate":"180",
                                    "delay":"0"
                                 }
                              ]
                           }
                        },
                        "method":"POST",
                        "delay":0
                     }
                  ]
               ]
            },
            "rules":[
               {
                  "rule":{
                     "operator":"equals",
                     "operand":"next"
                  },
                  "next":"saythings",
                  "actions":[
                     
                  ]
               }
            ],
            "data":[
               "next"
            ]
         },
         {
            "type":"button",
            "name":"saythings",
            "id":"saythings",
            "subscription":"/press",
            "onstart":{
               "actions":[
                  [
                     {
                        "action":"http://[speech]:9105/api/speech",
                        "params":{
                           "body":{
                              "speech":[
                                 {
                                    "words":"This is a person talking to you |address|",
                                    "voice":"Daniel",
                                    "rate":"180",
                                    "delay":"0"
                                 }
                              ]
                           }
                        },
                        "method":"POST",
                        "delay":0
                     }
                  ]
               ]
            },
            "rules":[
               {
                  "rule":{
                     "operator":"equals",
                     "operand":"webcam"
                  },
                  "next":"webcam",
                  "actions":[
                     
                  ]
               }
            ],
            "data":[
               "webcam"
            ]
         },
         {
            "type":"button",
            "name":"webcam",
            "id":"webcam",
            "subscription":"/press",
            "onstart":{
               "actions":[
                  [
                     {
                        "action":"http://[lenovo]:9102/api/camera",
                        "params":{
                           
                        },
                        "method":"GET",
                        "delay":0
                     }
                  ]
               ]
            },
            "rules":[
               {
                  "rule":{
                     "operator":"equals",
                     "operand":""
                  },
                  "next":"",
                  "actions":[
                     
                  ]
               }
            ],
            "data":[
               ""
            ]
         }
      ]
   }
]
```

The "events" array consists of all of the nodes that are in an experience (it should probably be called nodes, but there you go). Each node in the events array has an id, the endpoint that it listens on new events from (the "subscription" label), a set of actions that need to be performed when this node is triggered and a set of things that need to happen when an event comes in that matches a rule. You'll notice that the actions is a multidimensional array. This allows you specify that your actions run in sequence or parallel. So the following:

```json
"actions": [

["a","b","c"],

["d", "e"]

]
```

Would run a then b then c at the same time as d then e. Actions also have a delay in milliseconds which is how long they'll wait before firing. So for example, if you had a video playing and you wanted the caravan voice to say something 5 seconds in, your action might look like:

```json
"actions":[

[{"action":_url-to-play-something_, "delay":0}],

[{"action": _url-to-say-something_, "delay":5000}],

]
```

You'll notice that the urls called by actions have parts of them within square brackets. These are just address placeholders that are filled in at runtime, they relate to the labels defined in src/actions/IPs.json. Note also that actions have options parameters: "params" which can be used to send additional JSON parameters in a POST or query strings in a GET.  You may also find that some (older) experiences have actions that are not urls but are simple labels (e.g. fanoff).  These are looked up in the `server/src/actions.json` file and translated to full urls.

Finally there is a "start" level at the top level of the JSON file which just tells the WoZ interface which node it should load up at start (and any pre-actions that need to occur, such as resetting lights, collapsing the camera and so on).