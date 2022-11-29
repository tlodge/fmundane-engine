---
sidebar_position: 2
---

# The door, drawer and arm

This is by far and away the most irritating thing to troubleshoot (and probably the most likely to go wrong!). It has been broken down into 5 possible issues.

### Nothing happens

If nothing happens when the camera is meant to come out, the first thing to check is that the wifi controller board is on the network. Make sure your machine is in the Dynamic 2Ghz network and then go to:
```
192.168.1.250/status
```

If that reports back, then it's on the network. If not, it's probably not. You can double check this by looking at the amplify settings and see if you see a 'drawer nodemcu' device come up. If not then that confirms the device isn't on the network.

Try unplugging the device and plugging it in again. It is currently plugged into the front of the Lenovo (I think the bottom right usb port). I have found that it consistently works when I plug it into my laptop; and also than once found on the network that you might be able to replug it in to the Lenovo and it will be found.

### Nothing happens and the nodemcu is on the network

Try: 
```
192.168.1.250/door/open
```
You should hear the servo click in and the door should open. If it doesn't open but you hear the servo then be patient – I have found that to begin with sometimes the door doesn't open, but then it settles and works consistently after that. Try calling the above url a few times and see if it starts to work!

### Door opens, drawer doesn't

Do a  ```192.168.1.250/status``` and check if the system thinks the drawer is open or closed. It may be that the drawer hasn't pushed back against the switch. Make sure it is pressed back against the switch then try a:

```
192.168.1.250/drawer/open
```
If that doesn't work, it's also possible that the drawer thinks it's open when it's not. So do a:

```
192.168.1.250/drawer/close
```

Then a subsequent ```192.168.1.250/drawer/open``` will work!

###  Drawer doesn't close

Drawer is probably in an inconsistent state and thinks that it is already closed. Do a:

```
192.168.1.250/drawer/open
```

Then try a:

```
192.168.1.250/drawer/close
```

### Arm doesn't move

Argghh! This will most likely be because at startup the Lenovo assigned a port id to the arm that is not /dev/ttyUSB0 and is not /dev/ttyUSB1. Try rebooting and hope that this time the arm is given one of these ports. The fix will be to get more port info and to figure out which port has been assigned to the arm. See the TODO section!

NB: Before rebooting do a:

```
192.168.1.250/drawer/close
```

to get the system back into a consistent state.
