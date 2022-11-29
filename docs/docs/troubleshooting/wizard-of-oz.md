---
sidebar_position: 1
---

# No Wizard of Oz interface

The WoZ interface should be found at [http://192.168.1.204:3001/](http://192.168.1.204:3001/) If you are not getting anything, first double check that your machine is on the caravan network. If you are on the caravan network and see nothing then check to see if you can get the interface running on the actual Lenovo machine. Click on the browser in the Lenvo, open a tab and go to 127.0.0.1:3001. If you see something then the problem is with your machine and the network (or perhaps the browser – maybe try a different browser). If you do not see anything then the server software is not running (unlikely as we have not seen this before). Have a look at ```/var/log/fmundane.log``` and ```/var/log/fmundane.err``` to see if it has errored.

### WoZ interface runs, but after clicking on a button, the buttons disappear and the system doesn't move on

In most cases, the interface will not allow you to move onto the next state until the actions that it needs to perform have finished (i.e. the actions specified in the onstart part of the experience file). If, then a device endpoint is being called and is hanging or not returning success when it should, then the WoZ interface won't let you move on.

### WoZ interface runs, but events don't seem to fire

If events are not firing - check you have mqtt running!

```
docker ps
```
(and look for mosquitto) if not there do a
```
docker ps -a
```
and see if it has quit. To start a new instance do a:
```
sudo docker run -it --name mosquitto -p 1883:1883 eclipse-mosquitto:1.6
```