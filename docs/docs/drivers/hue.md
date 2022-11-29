---
sidebar_position: 6
---

# Hue driver

The hue driver simply interfaces with the hub hub. It adds credentials to each API call. The supported calls are as follows:

| **endpoint** | **method** | **description** | **params** |
| --- | --- | --- | --- |
| /ui/api/hex | GET | Change the hue lights to a hex colour | **hex:** a hex string (without #) eg 4c00b0 |
| /ui/api/on | GET | Turn lights on |
| /ui/api/off | GET | Turn lights off |
| /ui/api/red | GET | Make lights red (just used for testing really) |
| /ui/api/white| GET | Make lights white (just used for testing really) |
| /ui/api/light\_script | GET | Run a more complex light script | **script\_id** : an id corresponding to a script in light\_script.json |