---
sidebar_position: 1
---

# Caravan Intro

The Future Mundane engine brings together the sensors, devices and actuators in our caravan platform to enable us to create engaging, immersive experiences for small groups (1-4) of participants. Thanks to Matt Pilling for the following architecture diagram.
<img src="../../../img/architecture.png"/>


There are several components to the software that is used to create and deploy new experiences.  It fits together as follows:

1.	The engine.  This is the underlying (state machine) that takes an experience file then runs it on the caravan.  It is responsible for firing actions when particular events occur.
2.	The WoZ interface – this is the (browser) interface that is used to load, control and monitor experiences.
3.	The drivers.  These are all of the bits of code that communicate with sensors and devices in the caravan.  They are all triggered by (RESTful) web calls
4.	The sensors.  There are a bunch of custom sensors (arduinos and feathers) that connect to the caravan network that can be called by a webhook to do something.
5.	The authoring  environment – this is a variant of Twine that supports the authoring of new experiences in the caravan.

## The engine.

The drivers, the engine and the WoZ interface can be found in the fmundane-engine repository ([https://github.com/tlodge/fmundane-engine](https://github.com/tlodge/fmundane-engine)). The backend engine that runs an experience can be found in the server directory. The server directory is set out as follows:

- authored – this is the directory of the experiences that have been authored. Files in this directory will be made available to the WoZ interface.
- src – the server code. The main entry point is app.js, and express server
- webapps – these are apps that can be called and run inside the caravan (more on this later)
- scripts – some utility scripts used in the past – safely ignored