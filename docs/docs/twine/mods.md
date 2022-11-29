---
sidebar_position: 2
---

# Modifications to core Twine

The repo for the modified version of Twine can be found [here](https://github.com/tlodge/fmundane-twine) 

These are the places in the src tree where modifications have been made to core twine

* src/components/rules 

the files that deal with the rule creation interface

* src/components/onstart 

the files that deal with the onstart creation interface

* src/util/caravan 

the code that translated between twine and the format required by the future mundane state machine

* src/routes/story-list/toolbar/story/export-stories-button 

the code for the ui that handles exporting to the caravan

* src/routes/story-list/toolbar/story/story-actions


## Building for static twine site (i.e. on github pages)

This should happen automatically when you push to git.  There is a git workflow at: `fmundane-twine/.github/workflows/deploy.yml` which deploys the dist/web subtree to the gh-pages branch.




