---
sidebar_position: 5
---

# Future mundane webapps

Webapps are websites that are served from the machine running the future mundane engine. They can then be served up to devices connected to the caravan's network. You can place them in the fmundane-engine/server/webapps directory and they will be served under the /wa subdirectory.  In the edge of reality experience, for example, three webapps have been created to run on user's phones to get users to solve puzzles.

So for example the puzzle webapp is under

fmundane-engine/server/webapps/puzzle

and can be found at:

http://192.168.1.204:3001/wa/puzzle

## Getting webapps on to a (user's) phone:

The screen driver has a screen that can display a qr code. So if you call:
```
http://192.168.1.204:9102/api/qrcode?qrcode=http://192.168.1.204:3001/wa/puzzle
````
Then it will display a qrcode on the screen that will take the user to:
```
http:// 192.168.1.204:3001:3001/wa/puzzle
```
There is an action in fmundane-engine/server/src/actions.json:

And this will then show the qrcode on the screen. The twine authoring tool makes it easy to create QRCodes, so you can use that. Alternatively if you are writing it by hand you would do something like:

```json
[
   {
      "action":"http://[lenovo]:9102/api/qrcode",
      "params":{
         "query":{
            "qrcode":"http://[lenovo]:3001/wa/optionschooser"
         }
      },
      "method":"GET",
      "delay":0
   }
]
```json
{
   "type":"webhook",
   "name":"bespoketest",
   "id":"bespoketest",
   "subscription":"/webhook",
   "onstart":{
      "actions":[
         [
            {
               "action":"http://[lenovo]:9102/api/qrcode",
               "params":{
                  "query":{
                     "qrcode":"http://[lenovo]:3001/wa/optionschooser"
                  }
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
            "operand":"green"
         },
         "next":"startup",
         "actions":[
            
         ]
      }
   ],
   "data":[
      "green"
   ]
}
```

**Triggering events from a webapp.**

There is an event called "webhook", that can be listened on.

So if we are currently on the following node:

Then if our webapp calls:
```
/event/webhook?trigger=green
````

Then this will trigger the webhook event (i.e., in this case move onto the "startup" node.)