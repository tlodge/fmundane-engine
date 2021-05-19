

Dyson
-----

method: GET

**turn on**
http://[host]:9095/ui/api/fan?on=true

**turn off**
http://[host]:9095/ui/api/fan?on=false

**power (1-9)**
http://[host]:9095/ui/api/fan?power=8

**rotate fromdeg todeg**
http://[host]:9095/ui/api/fan?rotate=true&from=90&to=180

**stop rotating**
http://[host]:9095/ui/api/fan?rotate=false

**set heat value (deg)**
http://[host]:9095/ui/api/fan?heat=26

**set to cool**
http://[host]:9095/ui/api/fan?cool=true


NeoPixels
-------

NB: relies on mqtt broker running on caravan machine 192.168.1.113

```
docker run -d --name mosquitto --restart unless-stopped -p 1883:1883 eclipse-mosquitto:1.6)
```

method: GET

**turn blue**
http://[host]:9103/api/lights?value=BLUE

**turn blue**
http://[host]:9103/api/lights?value=RED

**turn green**
http://[host]:9103/api/lights?value=GREEN

**turn rainbow**
http://[host]:9103/api/lights?value=RAINBOW


Hue
---

NB: assumes hue bridge IP: 192.168.1.105
Also found api didn't kick in until ran app,then was fine

method: GET

**get status of lights**
http://[host]:9092/ui/api/lights

**turn lights on**
http://[host]:9092/ui/api/on

**turn lights off**
http://[host]:9092/ui/api/off

**turn lights red**
http://[host]:9092/ui/api/red

**turn lights white**
http://[host]:9092/ui/api/white

**turn brightness to 47**
http://[host]:9092/ui/api/20

**use lightscript**
method: POST

BODY: 
{"script_id":"ascriptid"}

http://[host]:9092/ui/api/light_script


Screen (display in web browser - dyson air quality and camera)
------

NB: relies on mqtt broker running:

```
docker run -d --name mosquitto --restart unless-stopped -p 1883:1883 eclipse-mosquitto:1.6)
```

method: GET

**switch to camera screen**
http://[host]:9102/api/camera

**switch to dyson air quality screen**
http://[host]:9102/api/air

**mock face scan**
http://[host]:9102/api/camera/scan


Label Printer
-------------

NB: relies on raspberry pi,connected to printer. Check pi's IP,defaults to 192.168.1.192 

method:POST
content-type: application/json

Body:

{"text":"sometext to print"}

http://[host]:9095/print


NanoLeaf Canvas
---------------

NB: assumes default nanoleaf IP: 192.168.1.151

method: GET

**on**
http://[host]:9104/ui/api/on

**off**
http://[host]:9104/ui/api/off

**saturation**
http://[host]:9104/ui/api/sat?value=20

**hue**
http://[host]:9104/ui/api/hue?value=120

**colour temperature values between 1200 and 6500**
http://[host]:9104/ui/api/ct?value=1200

**change brightness**
http://[host]:9104/ui/api/brightness?brightness=100&duration=5

