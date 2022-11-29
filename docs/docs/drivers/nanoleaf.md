---
sidebar_position: 6
---

# Nanoleaf driver

This controls the panel of lights under the caravan settee.

| **endpoint** | **method** | **description** | **params** |
| --- | --- | --- | --- |
| /ui/api/hex | GET | change the hex colour of the panels | **hex:** a hex string without the # |
| /ui/api/hue | GET | change the hue value of the panels | **hue:** int |
| /ui/api/brightness | GET | change the brightness value of the panels | **brightness:** int **duration** : speed of brightness change in seconds |
| /ui/api/sat | GET | change the saturation value of the panels | **sat:** int |
| /ui/api/ct | GET | change the ct (colour) value of the panels | **ct:** int |
| /ui/api/on | GET | turn panels on |
| /ui/api/off | GET | turn panels off |
| /ui/api | GET | set multiple values at once. | **hue, brightness, sat, ct, on, duration:** descriptions as above |