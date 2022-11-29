---
sidebar_position: 1
---

# Screen driver

The screen driver has been added to overtime and is a little overloaded with functionality. It is the driver that displays stuff in the web browser (on the main screen in the caravan). The driver is split into server and clientYou can also run the client in dev mode using:
```
npm run start
```
and when you are happy, run
```
npm run build
```
Which will put the newly compiled files in the relevant directory for the server. To run the server, in the server directory just run
```
node main.js
```
Then point your browser at [http://localhost:9102](http://localhost:9102/)

The server communicates with the browser over web-sockets. It also communicates with the main engine over MQTT. By calling endpoints on the server, the content being displayed in the browser can be changed. The following is a list of possibilities:

| **endpoint** | **method** | **description** | **params** |
| --- | --- | --- | --- |
| /api/home | GET | Show the future mundane log on a black background |
| /api/camera | GET | Stream the output from the browser webcam |
| /api/camera/scan | GET | Show the output from the browser webcam and overlay face scan results |
| /api/web | GET | Display arbitrary HTML | **snippet:** name of an arbitrary bit of html. Stored in the screen\_driver/server/public/snippets directory |
| /api/media/play | GET | Play some media | <ul><li>**media:** name of a media file in the media directory</li><li> **delay** : number of milliseconds to wait before playing (defaults to 500).</li></ul> |
| /api/air | GET | Show the dyson air quality screen |
| /api/qrcode | GET | Show a large qrcode on the screen | **qrcode:** the url to be encoded as a qrcode. |
| /api/image | GET | Show an image, fullscreen | **image:** the url of the image |
| /api/message | GET | Flash up a message on the bottom of the screen for a few seconds | **message:** the message to display |



