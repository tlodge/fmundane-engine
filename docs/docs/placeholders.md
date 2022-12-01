---
sidebar_position: 8
---

# Using placeholders

Placeholders are a new feature of the caravan, developed for the **Adaptive podcasts** project.  They allow us to attach variables to our experience scripts that will be evaluated at runtime.  The purpose is, for example to create an experience that has a few places in it that can be changed just before or even while an experience is running.  Examples include getting a voice to say something personal to a user (such as their name or address), or showing an image that has recently been taken (or provided by a participant).  At the moment the two places where placeholders are supported are with speech and images.  

## Using a speech placeholder


Consider the speech action in Twine:
<img src="https://tlodge.github.io/fmundane-engine/img/placeholder1.png"/> 
You can create a placeholder by putting a placeholder name (you can choose anything) inbetween a | and |.  So in the image above we have a placeholder called **somemorethings**.  This will be filled in with words at runtime.

## Using an image placeholder

Similarly, consider the the screen-image action in Twine:
<img src="https://tlodge.github.io/fmundane-engine/img/placeholder2.png"/> 
Again, can create a placeholder by putting an image placeholder name inbetween | and |.  So here we are saying load up the image tagged with myimageplaceholder.


## Setting placeholders in the Wizard of Oz interface.

When you load up an experience in the Wizard of Oz interface that has placeholders in it, you will see a bunch of pink dots.  These are show above all nodes that have placeholders in them:
<img src="https://tlodge.github.io/fmundane-engine/img/placeholder3.png"/> 

You can either click on a pink dot above a node to upadate the specific placeholder(s) for that node.  Else you can click on the **"placeholders"** circle on the top left of the screen.  When you click on it you will be shown a placeholder manager on the left-hand of the screen.
<img src="https://tlodge.github.io/fmundane-engine/img/placeholder4.png"/>

In our case we have already loaded up an image for the **myimageplaceholder** (the picture of the caravan), but if you click on **upload image for myimageplaceholder placeholder** and they you'll be shown a file upload dialogue.  Choose a file and this will be uploaded to the media directory and the placeholders file (in `fmundane-engine/placeholders`).  
<img src="https://tlodge.github.io/fmundane-engine/img/placeholder5.png"/>

It's a similar procedure for setting the **somemorethings** placeholder, click on "current text" and you will be provided with a textarea to add the text.
<img src="https://tlodge.github.io/fmundane-engine/img/placeholder6.png"/>

And that is it.  Now when you run the experience the chosen image will be shown and the chosen text will be spoken.