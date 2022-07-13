# Things to look out for

**NO events firing**

If events are not firing - check you have mqtt running!  

```
sudo docker run -it --name mosquitto -p 1883:1883 eclipse-mosquitto:1.6

```

**No speech**

Check that the mac mini is on and running.  Also check the audio output settings on the Lenovo -- needs to be set to the soundblaster card (top right menu -> settings -> sound) is set to the soundblaster card.

**No communication with device x**

If events do not fire, it may be because the calls to the urls are not working (i.e. driver is not working or IP address is wrong - check these first).Make sure that the IPs.txt and actions.json files (under server/src/actions) reflect the correct IPS of the devices in the caravan.  To check the IPS of devices in teh caravan, go http://ampli.fi (or) http://192.168.1.1

**QRCode not working**

Make sure you have rebuilt the client (npm run build in the client dir). Check that the IPs referred to in qrcode actions are correct (i.e. that they point to the future mundane engine machine)


**Media not displaying on screen**

Chrome requires user interaction before it will autoplay. When the caravan first boots the browser screen must be clicked (just once) to demonstrate user interaction (a chrome feature to prevent media from autoplaying without permission from users)

**Other things to check**

* Check that the machine that is running the 'wizard of oz' interface is on the caravan network
* Check that the machine running this (future mundane engine) code is on the caravan network
