# Lesson 03: Title Screen

Now that we have setup the basic project structure for our game we need to create the title screen. Our title screen will have a heading, a bubble sprite, and some help text. First, create a `bubble-popper/src/assets/` folder. Then create a `bubble-popper/src/assets/fonts/` folder and a `bubble-popper/src/assets/sprites/` folder. Next, download the font we will be using from https://www.dafont.com/pixel-operator.font, extract the downloaded zip file, and move `PixelOperatorMono.ttf` to `bubble-popper/src/assets/fonts/`. Then download the bubble spritesheet from https://github.com/DylanCheetah/bubble-popper/blob/main/src/assets/sprites/Bubble-Pop.png?raw=true and move it to `bubble-popper/src/assets/sprites/`. Next, open `bubble-popper/package.json` and modify the build:copy script like this:
```json
   "build:copy": "copyfiles -f src/index.html dist/ && copyfiles -u 1 src/assets/fonts/*.ttf src/assets/sprites/*.png dist/",
```

Now restart the development server if it is already running and you should see that the assets folder has been copied to the dist folder. Next, create a `bubble-popper/src/scenes/` folder. Then create `bubble-popper/src/scenes/titleScreen.js` with the following content:
```js
/*
 * titleScreen.js
 *
 * The title screen for the bubble popper game.
 */

import Phaser from "phaser";


// Title Screen Scene
export default class TitleScreen extends Phaser.Scene {
    init() {
        this.fadeInc = -.001;
    }

    preload() {
        // Load fonts
        this.load.font("PixelOperatorMono", "assets/fonts/PixelOperatorMono.ttf");

        // Load spritesheets
        this.load.spritesheet("Bubble-Pop", "assets/sprites/Bubble-Pop.png", {
            frameWidth: 32,
            frameHeight: 32
        });
    }

    create() {
        // Create heading
        this.add.text(0, 16, "Bubble Popper", {
            fontFamily: "PixelOperatorMono",
            fontSize: 64,
            fixedWidth: 800,
            fixedHeight: 64,
            align: "center"
        });

        // Create bubble
        this.add.image(400, 300, "Bubble-Pop", 0).setScale(4, 4);

        // Create help text
        this.helpText = this.add.text(0, 600 - 32 - 16, "Click to Start", {
            fontFamily: "PixelOperatorMono",
            fontSize: 32,
            fixedWidth: 800,
            fixedHeight: 32,
            align: "center"
        });
    }

    update(time, delta) {
        // Fade the help text in/out
        this.helpText.alpha += this.fadeInc * delta;

        if(this.helpText.alpha <= 0 || this.helpText.alpha >= 1) {
            this.fadeInc = -this.fadeInc;
        }
    }
}
```

Games made with Phaser are divided into scenes. Each scene consists of a class which extends the `Phaser.Scene` class. Each scene class has an `init` method which is called to initialize variables used by the scene, a `preload` method which is called to load resources used by the scene, a `create` method which is called to create the content for the scene, and an `update` method which is called once per frame to update the scene. The `init` method of our `TitleScreen` class sets the `fadeInc` attribute to -.001. This value is used to fade the help text in/out. The `preload` method of our `TitleScreen` class calls the `font` method of the `load` attribute to load the font we will be using. The first parameter is the name we will use to refer to the font and the second parameter is the URL of the font file. Next we call the `spritesheet` method of the `load` attribute to load the spritesheet for the bubble. The first parameter is the name we will use to refer to the spritesheet, the second parameter is the URL of the image file, and the third parameter is additional options. We pass the additional options `frameWidth` and `frameHeight` to set the size of each animation frame in the spritesheet. The `create` method of our `TitleScreen` class calls the `text` method of the `add` attribute to create the heading for the title of our game. The first parameter is the X coordinate, the second parameter is the Y coordinate, the third parameter is the text to display, and the fourth parameter is additional options. We pass the additional option `fontFamily` to set the font to use, the `fontSize` option to set the size of the font, the `fixedWidth` option to set the width of the texture to render the text to, the `fixedHeight` option to set the height of the texture to render the text to, and the `align` option to set the horizontal alignment of the text. Next we call the `image` method of the `add` attribute to create the bubble for the title screen. The first parameter is the X coordinate, the second parameter is the Y coordinate, the third parameter is the name of the image or spritesheet to use, and the fourth parameter is the index of the frame to use. We also call the `setScale` method of the bubble to set the scale. Then we call the `text` method of the `add` attribute again to create the help text for our title screen and assign the new text object to the `helpText` attribute of our scene. The `update` method of our `TitleScreen` class multiplies the fade increment by the delta time and adds the result to the current alpha value of the help text. If the alpha value ends up outside of the 0 to 1 range, we invert the fade increment. Next we need to open `bubble-popper/src/main.js` and modify it like this:
```js
/*
 * main.js
 *
 * The main script for the bubble popper game.
 */

import Phaser from "phaser";

import TitleScreen from "./scenes/titleScreen";


// Configure Phaser
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade"
    },
    scene: [
        new TitleScreen("TitleScreen")
    ]
};
const game = new Phaser.Game(config);
```

Each scene in our game needs to be added to the list of scenes in our game config. Now our game should look like this:
![title screen](https://github.com/DylanCheetah/bubble-popper/blob/main/lessons/screenshots/02-title_screen.png?raw=true)
