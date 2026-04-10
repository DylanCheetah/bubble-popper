# Lesson 02: Project Setup

Now that we have installed the software we will need, let's start setting up our game project. Create a folder for your project. I will be naming mine `bubble-popper`. Then open your project folder inside Visual Studio Code. Next, click Terminal > New Terminal to open a new terminal inside Visual Studio Code. Then execute the following command and follow the prompts:
```sh
npm init
```

Next, execute the following command to install the dependencies we will need for our game:
```sh
npm install --save-dev copyfiles browserify babelify @babel/core @babel/preset-env uglify-js watchify budo phaser
```

Now we need to create a `bubble-popper/src/` folder for our source code and a `bubble-popper/dist/` folder for the files which will be produced by building our project. Afterwards, we need to create `bubble-popper/src/index.html` with the following content:
```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Bubble Popper</title>
        <script src="/vendor.js"></script>
    </head>
    <body>
        <div id="root"></div>
        <script src="/bundle.js"></script>
    </body>
</html>
```

This file will be the homepage for our game. It sets the viewport width to the width of the screen, sets the initial scale to 1, sets the title of our game, loads the `vendor.js` script, creates a root `div` element, and runs the `bundle.js` script. `vendor.js` will contain the dependencies for our game and `bundle.js` will contain all the code for our game. Next we need to create `bubble-popper/src/main.js` with the following content:
```js
/*
 * main.js
 *
 * The main script for the bubble popper game.
 */

import Phaser from "phaser";


// Configure Phaser
const config = {
    parent: "root",
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade"
    },
    scene: []
};
const game = new Phaser.Game(config);
```

This code will create a new Phaser game. The `div` element with the "root" ID will be used as the container for our game. If WebGL is available it will be used as the renderer. Otherwise, we will use the canvas renderer as a fallback. The size of the game display is set to 800x600. We set the scale mode to `FIT` and center the game display on the webpage. We set the physics engine to arcade physics. And for now we leave the list of scenes empty. Now we need to open `bubble-popper/package.json` and modify the scripts list like this:
```json
  "scripts": {
    "build": "npm run build:copy && npm run build:vendor && npm run build:bundle",
    "serve": "npm run build:copy && npm run build:vendor && npm run serve:budo",
    "build:copy": "copyfiles -f src/index.html dist/",
    "build:vendor": "browserify -r phaser | uglifyjs --compress --mangle > dist/vendor.js",
    "build:bundle": "browserify src/main.js -x phaser | uglifyjs --compress --mangle > dist/bundle.js",
    "serve:budo": "budo src/main.js -p 8000 --serve /bundle.js --live --dir dist/ -d -- -x phaser"
  },
```

The build script is used to create a production build of our project. The serve script is used to start a development server. We use `copyfiles` to copy `bubble-popper/src/index.html` to `bubble-popper/dist/`. `browserify` is used to build our project. `uglifyjs` is used to compress and mangle our code. `budo` is used to serve our code for development purposes. Next we need to add the following section to `bubble-popper/package.json`:
```json
  "browserify": {
    "transform": [
      [
        "babelify",
        {
          "presets": [
            "@babel/preset-env"
          ]
        }
      ]
    ]
  }
```

This will tell `browserify` to use `babelify` to transform our code. And it tells `babelify` to use the `@babel/preset-env` preset when transforming our code. This allows us to use modern ES6 features even if our target browser doesn't support them natively. Now we can execute the following command to start our development server:
```sh
npm run serve
```

If you visit http://127.0.0.1:8000/ in a web browser, you should see this:
![homepage](https://github.com/DylanCheetah/bubble-popper/blob/main/lessons/screenshots/01-homepage.png?raw=true)
