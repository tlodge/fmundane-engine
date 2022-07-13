FAN Details
-----------

You have to know the IP address of the dyson fan, which is tricky to find - it MAY show up in DHCP leases, but doesn't on my home router.  NMAP also fails to find it. If you fail to connect to fan - make sure you're not running two drivers at the same time - they'll subscibe and unsubscribe each other!

More info
---------

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
