---
sidebar_position: 15
---

# Future work, fixes and improvements

This is a list of all of the things that could be improved given time.

## In the caravan

### Caravan network 

We have seen the local caravan network struggle with bandwidth. In areas where there is lots of interference the system slows right down. We have found, for example, having the go-pro on the network is one device too far. We have also found that when the apple mac (speech machine) is on the wireless network it can take a very long time for the speech commands to be transmitted to the mac, which throws out the timings of the experience. This is why the mac is now wired to the router **. At some point it may be worth looking to upgrade to a more performant router if the issues persist.**

### The arm / drawer / door

This has consistently been problematic. Here is a list of issues and how they might be fixed.

* Button press does not open the door

We still see this from time to time, but we have found that once it works it continues to work. When it doesn't work, the working theory is that it's due to signal interference. We need to look at switching the door directly. Alternatively the new laser cutter control board that runs the motor that opens and closes the door has another motor output which could be used with another stepper motor that opens and closes the door (i.e. get rid of the current cupboard door opening system altogether). This would probably be much more reliable.

* The arm sometimes doesn't work

As already mentioned, in the interests of getting the arm to work before a deployment we had to write a hack to get round a race condition problem. When the Lenovo boots up, it assigns addresses to the devices connected to its USB ports. However (probably dependent on what device it discovers first), it sometimes gives the arm address /dev/ttyUSB0 and at other times it gives it /dev/ttyUSB1. I'm not entirely convinced that it won't use numbers higher than this too. The fix has just been to write the robot arm commands to both outputs in parallel, so that it will work for the one that is connected and be disregarded by the other. Clearly this is not ideal. Instead the system should interrogate the port info, find out which one the arm is connected to and use that. Should be easy enough using a few linux system commands. Another option is to try and query the arm on various ports and if you get a response on one then you know it is the correct port. I briefly tried sending a serial command that should get a response, i.e: `("#1 QT\r")`, but wasn't able to get one.

* Drawer sometimes gets confused whether it's open or closed.

The stepper motor that opens and closes the drawer is controlled using GCODE. Sometimes the stepper motor thinks that it is in one position (i.e. closed) when it is actually in the other. This tends to happen if the system is powered off when the drawer is open, for example. Need to obtain system feedback to make sure that the driver and the controller and motor remain in sync (which will mean having a wire from the NANO Tx to the NodeMCU Rx)

## Future mundane software (WoZ, engine, drivers)

### Code tidy

There is a bunch of refactoring that could be done and basic tidying of the code – it has more or less developed as the project has so is overdue a first refactor.

### WoZ and moving between states

In general, the WoZ interface will only show a button for moving to a next state once all actions have completed. Actions are seen as completed once a request to an endpoint returns. There is one exception, video/media, which runs in the browser and there is currently no neat way for the browser to feed back to the engine that the video has finished. We'd need to make it work by having the engine call the /play endpoint, the /play endpoint tell the browser to play a video, and then wait until the browser says the video is finished before returning. But having a long running query like this feels wrong, so some other notification system might be better.

### Error reporting

By default all drivers should be written with a /status endpoint that can be interrogated by the WoZ as a way of providing status updates and troubleshooting. The arm driver has this support but other drivers need it. Would also be good to stream the logs from /var/log/ooi to the WoZ for easy realtime debugging/feedback.

### Hue lights

Currently the lights API offers colour changes. It would be nice to have some higher level api calls that do things such as 'flicker', 'flash', 'fade up' – should be quite easy to add these in!

### Nanoleaf lights

These sit under the caravan seats on the floor. They don't quite sync in colour with the hue lights. Double check the code that sets the colours and see if the formula is correct.

### WoZ interface

Lots of improvements could be made here. The motion between nodes is a little clunky. There need to be an option to manage the experiences that are available. There should be a standard 'testing' panel that allows a user to manually test all devices in the caravan.

## Future mundane authoring environment

As noted – this is a modified version of Twine. Twine is great for some things, but it is still not a brilliant experience creating new experiences. A couple of things would hugely improve the authoring process.

* Better timing support

Twine is great for creating the branching paths, but we have found that a significant amount of authoring effort goes into coordinating times, making sure for example that the voice speaks at the right time when media is playing or that the lights change colour in sync with playing media and so on and so forth. Ideally what we want is an interface within each node (or in twine parlance – passage) that looks more like an audio/video editing track, i.e. where it's easy to click markers on a timeline to set when events need to happen.

* Simulated run throughs

There is currently no easy way to test an experience properly outside the caravan. Usually the thing that needs to be tested is the timing and the interplay between sensors. It would be great (and a really nice project) to write a Twine story-format that does this. In essence, once a user has created a bunch of passages they'd click on 'play' and all of the device actions would be simulated alongside the WoZ interface.