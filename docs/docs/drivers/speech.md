---
sidebar_position: 10
---

# Speech driver

This is the driver that currently runs on the mac and uses its 'say' command line. This is (at the time of writing) still the best quality local real-time speech synthesis engine we have found. Note that this driver is set to autostart on the mac using pm2.

| **endpoint** | **method** | **description** | **params** |
| --- | --- | --- | --- |
| /api/speech | POST | Play speech (with the option of background media). | <ul><li>**speech:** [array of words] where a word is: ```{words: "something to say"voice: "Serena",rate: 150,delay: 400}``` Note that voice refers to voices supported on the mac so is mac dependent good male voice is Daniel and good female is Serena. If it doesn't recognise a voice it will use a default. Note the delay option is how many ms it should pause AFTER the voice has spoken (to stop one sentence running into the next).</li><li> **background** : a background media file to play (rarely used) – taken from the fmundane-engine/media directory on the mac.</li></ul> |