---
sidebar_position: 8
---

# Media driver

This isn't used that often. It plays media out of the Lenovo (or mac's) media player. The preference tends to be to play the media through the browser using the screen\_driver; however if you want to play out the audio through a different device or want to run other media in parallel with media being played on the screen then this is a good choice. It assumed that 'play' is installed (if linux) or afplay (if mac) – though you'll need to manually switch the command that is called dependent on the device. It assumes that the requested media files exist in the top-level media directory (fmundane-engine/media)

| **endpoint** | **method** | **description** | **params** |
| --- | --- | --- | --- |
| /api/media | GET | Play media in the top level media directory | <ul><li>**media:** name of the media file</li> <li>**nowait:** true or false. false (default) means that the media is started and the calling function returns success immediately.</li><li> **true** means that the calling function will only return once the media has played out.</li></ul> |
| /api/media/stop | GET | Stop (playing) ALL media early |

