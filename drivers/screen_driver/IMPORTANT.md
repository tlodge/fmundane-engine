# IMPORTANT regarding face mesh code (making face recognition work offline!!)

When you rebuild the client screen driver, it will pull down the @tensorflow-models node_module which will access its models online.  There is a copy of these models that can be served locally.  So to make it work you'll need to modify the node_modules/@tensorflow-models directory.  This is fiddly and I'm aiming to fix it soon. The process is as follows:

## making facemesh work offline

rebuild the screen driver (client)
rebuild the main client

before you do this:

open: 

/Users/tlodge/futuremundane/fmundane-engine/drivers/screen_driver/client/node_modules/@tensorflow-models/facemesh/dist/facemesh.js

AND REPLACE

https://tfhub.dev/tensorflow/tfjs-model/blazeface/1/default/1/model.json?tfjs-format=file with http://localhost:9102/blazeface

https://tfhub.dev/mediapipe/tfjs-model/facemesh/1/default/1/model.json?tfjs-format=file  with http://localhost:9102/facemesh

open:

/Users/tlodge/futuremundane/fmundane-engine/drivers/screen_driver/client/node_modules/@tensorflow-models/facemesh/dist/facemesh.esm.js

AND REPLACE

https://tfhub.dev/tensorflow/tfjs-model/blazeface/1/default/1/model.json?tfjs-format=file with http://localhost:9102/blazeface

https://tfhub.dev/mediapipe/tfjs-model/facemesh/1/default/1/model.json?tfjs-format=file  with http://localhost:9102/facemesh