---
sidebar_position: 1
---
# Try this first

In general, if you find that a sensor is NOT responding as it should, the first check should be to see if it is on the network. We have given descriptive names for all sensors so it should be reasonably easy to see if the name comes up on the router. If you are unsure if a device is the one you are looking for, check the IP address against the src/actions/IPs.json. At the time of writing the allocated IPs are:

| **Device** | **Description** | **Static IP** |
| --- | --- | --- |
| **lenovo** | the main caravan machine | 192.168.1.204 |
| **speech** | the mac mini | 192.168.1.240 |
| **hue** | the hue lights hub | 192.168.1.105 |
| **dyson** | the dyson fan | 192.168.1.45 |
| **receip** | the pi that drives the receipt printer | 192.168.1.192 |
| **windows** | the arduino that sends the window signal | 192.168.1.244 |
| **smell-left** | the feather connected to the lefthand side smell pod | 192.168.1.189 |
| **smell-right** | the feather connected to the righthand side smell pod | 192.168.1.185 |
| **arm** | the nodemcu connected to the door servo and the drawer motor | 192.168.1.250 |
| **miniscreen-left**  | the pi connected to the touchscreen on the left | 192.168.1.100 |
| **miniscreen-right**  | the pi connected to the touchscreen on the right | 192.168.1.101 |

To check devices on the network, login to the ampfli router interface: [http://192.168.1.1](http://192.168.1.1/) Usual password.
