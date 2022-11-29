---
sidebar_position: 3
---

# Dyson driver

The dyson fan uses MQTT to communicate. It reads credentials in a (top-level) config.json file:

```
FAN\_CONFIG.model,

FAN\_CONFIG.id,

FAN\_CONFIG.ip,

FAN\_CONFIG.username,

FAN\_CONFIG.password,

FAN\_CONFIG.clientid,

FAN\_CONFIG.MQTT\_IP
```

Unfortunately there is no easy way to get these credentials, other than just doing a wireguard packet sniff on the MQTT port. Full details on how to do this can be found in the README.md of this driver. Once running, the (node) server accepts the following:

| **endpoint** | **method** | **description** | **params** |
| --- | --- | --- | --- |
| /ui/api/data\_read | GET | Poll in the air quality stats from the fan every 5 seconds. |
| /ui/api/data\_stop | GET | Stop polling the fan every 5 seconds |
| /ui/api/fan | GET | Control the fan | **subject**: <ul><li>**on**: true or false (i.e turn the fan on or off) </li> <li>**power**: set the fan power (i.e. how strength of airflow) from 1 to 9</li><li>**rotate**</li><li>**from, to** set rotation</li><li>**from**: degrees</li><li>**to**: degrees, eg:?rotate=true&from=0&to=90</li><li>**cool** set fan to cooling</li><li>**heat**: set fan to heating</li></ul> |
| /api/arm/status | GET | Return status information on the drawer and the door. |
| /api/arm/toggledoor| GET | Open / close the door |