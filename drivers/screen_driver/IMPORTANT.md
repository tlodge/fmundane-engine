# IMPORTANT regarding face mesh code (making face recognition work offline!!)

When you rebuild the client screen driver, it will pull down the @tensorflow-models node_module which will access its models online.  There is a copy of these models that can be served locally.  So to make it work you'll need to modify the node_modules/@tensorflow-models directory.  This is fiddly and I'm aiming to fix it soon. The process is as follows:

## making facemesh work offline

The standard @tensorflow/models package pulls its models off the cloud.  The future mundane engine has copies of the models in the public directory so that they can be locally served (i.e. without internet access).  To make this work, go to the client dir and run:

```
sh install-local.sh
```

and this will install a modified package off github.