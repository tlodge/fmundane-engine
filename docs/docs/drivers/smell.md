---
sidebar_position: 5
---

# Smell driver

The smell code just runs directly on controllers (Feather M0) – the code for the controllers can be found at: [https://github.com/tlodge/fmundane-arduino/blob/main/smell/air\_freshner\_v3.ino](https://github.com/tlodge/fmundane-arduino/blob/main/smell/air_freshner_v3.ino)

To smell controllers can be called as follows:

| **endpoint** | **method** | **description** | **params** |
| --- | --- | --- | --- |
| /on1 | GET | Set smell fan on at low speed |
| /on1 | GET | Set smell fan on at medium speed |
| /on1 | GET | Set smell fan on at high speed |
| /off | GET | Turn off the fan |