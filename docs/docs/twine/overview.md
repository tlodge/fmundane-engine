---
sidebar_position: 1
---

# Overview

We have created a version of twine that makes it easier to construct experiences for the caravan.  Have a [play](https://tlodge.github.io/fmundane-twine/) with it.   The following is a very quick run-through of a simple authoring workflow.  When you first go to Twine you will be show a welcome screen; at the bottom just click skip.   You will then see the following window:

<img src="https://tlodge.github.io/fmundane-engine/img/screen1.png"/> 

Click on new to create your first experience.  You will then be presented with the main passage editing screen: 

<img src="https://tlodge.github.io/fmundane-engine/img/screen2.png"/> 

Click on the Untitled Passage and click on "Rename", and give the passage a name, such as "nodeone":

<img src="https://tlodge.github.io/fmundane-engine/img/screen3.png"/> 

Now double click on the "nodeone" passage and you will be presented with the following screen:

<img src="https://tlodge.github.io/fmundane-engine/img/screen4.png"/> 

There are two features that you will use when you create experiences: **"onstart"** and **"rules"**.  **"onstart"** allows you to say what you want to happen when the node is first loaded, whether playing media, saying something with the caravan's automated voice, changing the colour of lights and so on and so forth.  **rules** allows you to specify what must happen to move onto the next node.  Let's look at **"onstart"** first.

<img src="https://tlodge.github.io/fmundane-engine/img/screen5.png"/>


## Creating actions that fire when a node loads

When you click on it, you are presented with a dialogue, which will prompt you to add a new action.  Click on it, and you will be presented with the following.  You will see an **"action profiles** dropdown, where you can select from a list of all of the things that the caravan can currently support.

<img src="https://tlodge.github.io/fmundane-engine/img/screen6.png"/> 

Choose **"speech"** and then write something in the words textarea.  If you want to say something else, click on **"add more speech"** and add more dialogue.  To avoid one sentence running into the next you can add a pause in the second text area (next to the voice drop down).  It is in milliseconds (1000 milliseconds = 1 second).  You will also see that there is a **"delay"** input at the bottom of the dialogue - use this if you want the 
speech to only start after a period of time (also specified in milliseconds).

<img src="https://tlodge.github.io/fmundane-engine/img/screen7.png"/> 

Once you are happy with your speech settings, click on the tick.  This will then list your new action.  At this point, you can either add an action that you want to follow the speech **(which will start once the speech has finished)** or you can create an action that will run **in parallel** with your speech action (by clicking on) **add parallel action(s)**.  Have a play and get a feel for it.  

<img src="https://tlodge.github.io/fmundane-engine/img/screen8.png"/> 

Once you are done, click on **+Add** to add your action/actions.  This will then autogenerate the actual Twine script that will be used to drive the experience.  Once you get a feel for the script, feel free to edit it directly rather than using the **"onstart"** and **"rules"** buttons.

<img src="https://tlodge.github.io/fmundane-engine/img/screen9.png"/>

## Setting the events that trigger a move to a new node.

This can (to begin with) seem a little confusing.  The main event that triggers a move to a new node is when a button is pressed on the Wizard of Oz interface.  This is the place where you say what that button's name is, and which node is next run.  Click on **"add another rule"**

<img src="https://tlodge.github.io/fmundane-engine/img/screen10.png"/>

This is the place where you set the button name and the name of the new node (passage) that is triggered next.  The statement reads "when **[button name]** is pressed call **[some actions]** then goto **[name of a node]**.  For now, don't worry about the call **[some actions]** bit; this allows you to call trigger more sensors immediately that a button is pressed (and is not used that often).  In the "then goto **[name of a node]** part, type in a new node name (e.g. nodetwo).  Because nodetwo doen not exist, it will be created automatically.

<img src="https://tlodge.github.io/fmundane-engine/img/screen11.png"/> 

Click on **"update"** and you will then be shown the newly generated script.  Note that the [rules] section has now been populated.

<img src="https://tlodge.github.io/fmundane-engine/img/screen12.png"/> 

Close the passage, and you will see that a new node has been created.  Now go through it all again to give the second node the desired functionality.

<img src="https://tlodge.github.io/fmundane-engine/img/screen13.png"/> 


# Getting the experience onto the caravan.

To export your new experience, click in the **Back** menu item, and it will bring you to the main screen.  Your experience is currently untitled. Select it, and the click in **Rename**

<img src="https://tlodge.github.io/fmundane-engine/img/screen14.png"/> 

Now give your experience a name and click on **OK**

<img src="https://tlodge.github.io/fmundane-engine/img/screen15.png"/>

Finally, click on "export stories" and choose the story you want to export.  The twine file is turned into a Caravan (json) experience file.  If you are running twine on the caravan, it will automatically place the new experience in the Wizard of Oz menubar.  If you are running Twine out of the cloud (most likely), then when you are in teh caravan you can manually upload using the **upload** meu item on the Wizard of Oz interface.

<img src="https://tlodge.github.io/fmundane-engine/img/screen16.png"/> 