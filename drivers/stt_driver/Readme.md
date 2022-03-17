# Stt driver

This is based off:

https://github.com/coqui-ai/STT-examples

This driver streaming microphone audio from the browser to a NodeJS server.  The server sends the speech back to the browser as text
and sends it to MQTT, where it is picked up by the future mundane engine and evaluated against rules.  So far aduid capture acnnot autostart
(perhaps a browser secuirty policy?) so you need to explicitly click a button to start listening.

To get started you need to download the pretrained model:

#### You will need to download the pre-trained model (1.8GB):

```
wget https://github.com/coqui-ai/STT/releases/download/v0.9.3/coqui-stt-0.9.3-models.pbmm
wget https://github.com/coqui-ai/STT/releases/download/v0.9.3/coqui-stt-0.9.3-models.scorer
```

#### Install:

```
yarn install
```

#### Build ReactJS Client:

```
yarn build
```
#### Run NodeJS Server (in a separate terminal window):

```
node main.js
```

#### Run ReactJS Client in dev mode:

```
yarn build
```