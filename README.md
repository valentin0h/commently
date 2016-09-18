# Commently

A simple text commentig app for the web.

## Installation

This app is created with [Meteor.js](https://www.meteor.com/) and utilizes [rangy](https://github.com/timdown/rangy).

To install the app, first follow the [instructions](https://www.meteor.com/install) to install Meteor

```
curl https://install.meteor.com/ | sh
```

and then:

```
1. git clone https://github.com/valeviolin/commently.git
2. meteor npm install
3. meteor 
```

the following will have the app running on [localhost:3000](http://localhost:3000)

## Approach

The main logic of the app can be found in [main.js](https://github.com/valeviolin/commently/blob/master/client/main.js).

The approach taken roughly follows the following:

1. Before each action "restore" the DOM state of the text. E.g remove highlights
2. For new comments, create a Mongo document with the comment's text and the serialized range of the selected text.
3. After clicking on a comment, deserialize the range of the comment and highlight it.

There are some bugs here and there (which I could not spot easily) due to either rangy or myself not fully getting rangy's way of working. 

## TODOs

This is only tested on the latest Chrome browser.

1. Introduce users and assign comments to users
2. Reply/Accept/Ignore comments
3. Make it usable on mobile.
4. Problems with big DOMs?

