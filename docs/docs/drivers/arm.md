---
sidebar_position: 4
---

#  Arm driver

The arm driver handles the door opening, the drawer opening and the arm movement for the webcam in the caravan. It communicates with a nodemcu ESP8266 controller ([https://www.amazon.co.uk/AZDelivery-NodeMcu-ESP8266-Development-including/dp/B074Q2WM1Y/](https://www.amazon.co.uk/AZDelivery-NodeMcu-ESP8266-Development-including/dp/B074Q2WM1Y/))

The controller code can be found in the [https://github.com/tlodge/fmundane-arduino](https://github.com/tlodge/fmundane-arduino) repo in the arm directory. The controller handles the door and drawer opening (it does **not** communicate with the arm, which is done directly by the arm driver.

It listens for (GET) requests to the following:
```
/drawer/open

/drawer/close

/door/open

/door/close

/status
```
Note that the controller reads from the rear and front drawer switches and the door switch to determine the current state of the system.

## Wiring

Two wires connect the nodeMCU controller to the Arduino GRBL NANO controller ([https://www.amazon.co.uk/dp/B078S8BJ8T](https://www.amazon.co.uk/dp/B078S8BJ8T)) on the stepper and servo control board ([https://www.aliexpress.com/item/1005002035301194.html](https://www.aliexpress.com/item/1005002035301194.html)). The serial out pin is connected to the serial IN of the GRBL NANO control board. The nodeMCU then just sends serial GRBL commands to control the stepper. The second wire is between the nodeMCU ground and the GRBL NANO ground. The rest of the wires going to the controller are just from the switches.

<img src="/img/wiring.jpg"/>

## The node (server) endpoints

| **endpoint** | **method** | **description** | **params** |
| --- | --- | --- | --- |
| /api/arm/expand | GET | Run through the full routine to end with the camera extended at the end of the arm (i.e. open door, open drawer, expand arm) |
| /api/arm/collapse | GET | Run through the full routine to end with the camera back in the box (collapse arrm, close drawer, close door) |
| /api/arm/scan | GET | Once expanded, look left and right as though scanning faces. |
| /api/arm/lights | GET | Turn the servo lights a particular colour. | **colour**: an integer from 0-7:0=Off; 1=Red; 2=Green; 3=Blue; 4=Yellow; 5=Cyan; 6=Magenta; 7=White |
| /api/arm/flash | GET | Flash the servo lights various colours | <ul> <li> **colours** : an array of colours e.g. [1,2] to flash red and green</li><li> **speed** : the time is ms between colour change </li> <li> **repetitions** : the number of repetitions (i.e. how many times the lights flash) </li></ul>
| /api/arm/yes| GET | Nod the camera as though saying yes |
| /api/arm/no | GET | Nod the camera as though saying no |
| /api/arm/home | GET | Move the camera into the position it is first in when expanded. |
| /api/arm/point | GET | Point at various things in the caravan | **subject**: <ul><li> **dyson**: point at the dyson fan</li> <li> **windows**: point left and right at the windows</li><li>**door**: point at the caravan door</li><li> **screen**: point (backwards) at the screen</li><li>**down**: look down</li><li> **forward**: reach forward</li><li> **mad**: spin and generally behave erratically</li></ul> |
| /api/arm/status | GET | Return status information on the drawer and the door. |
| /api/arm/toggledoor | GET | Open / close the door |