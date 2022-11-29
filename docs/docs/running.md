---
sidebar_position: 6
---

# Running code

## Running the fmundane-engine/src/server

The fmundane-engine is reliant on mqtt.  The easiest way to run mqtt on the device running the fmundane-engine:

```
sudo docker run -it --name mosquitto -p 1883:1883 eclipse-mosquitto:1.6
```

Next you can install your dependencies

```
npm install
```

Then run the server

```
npm start
```

And you should see the wizard of oz interface running at:

```
http://127.0.0.1:3001
```

## Running the client in dev mode:

in 
```
fmundane-engine/client/src
```

do a
```
npm install
```

then

```
npm run start
```

and then to build it and run in production

```
npm run build
```


## Building drivers

In most cases you'll just need to do an

```
npm install
```

in each directory.  The screen_driver has a client and server directory.  You can run the dev server in the client:

```
npm run dev
```

and you can build it (after an npm install)

```
npm run build
```

and in the server directory, run with

```
node main.js
```
## Autostarting drivers on Linux

We user supervisord to auto run the drivers at startup, see the drivers/supervisord directory for examples of conf files that will start your drivers and log to /var/ooi.
