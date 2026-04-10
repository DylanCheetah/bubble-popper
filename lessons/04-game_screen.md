# Lesson 04: Game Screen

Now that we have created the title screen for our game, we need to create the game screen. Create `bubble-popper/src/scenes/gameScreen.js` with the following content:
```js
/*
 * gameScreen.js
 *
 * The game screen for the bubble popper game.
 */

import Phaser from "phaser";


// Game Screen Scene
export default class GameScreen extends Phaser.Scene {
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
        // Create bubble group
        const bubbles = this.physics.add.group({
            defaultKey: "Bubble-Pop",
            defaultFrame: 0,
            createCallback: (bubble) => {
                // Set physics body to a circle
                bubble.body.setCircle(16);

                // Randomize velocity
                const angle = Phaser.Math.DegToRad(Phaser.Math.FloatBetween(0, 360));
                const velocityX = Math.cos(angle);
                const velocityY = Math.sin(angle);
                const speed = 100;
                bubble.setVelocity(velocityX * speed, velocityY * speed);
            },
            collideWorldBounds: true,
            bounceX: 1,
            bounceY: 1,
            maxSize: 25
        });

        // Configure collision detection
        this.physics.add.collider(bubbles, bubbles);

        // Generate a random bubble every 500 ms
        this.time.addEvent({
            delay: 500,
            callback: () => {
                // Spawn a bubble
                bubbles.create(
                    Phaser.Math.FloatBetween(0, 800),
                    Phaser.Math.FloatBetween(0, 600)
                );
            },
            loop: true
        });
    }
}
```

The `preload` method of our game screen loads the font and spritesheet we will be using. The `create` method of our game screen calls the `group` method of the `physics.add` attribute to create a physics group for our bubbles and assigns it to the `bubbles` constant. The first parameter specifies the options for the group. `defaultKey` sets the default image or spritesheet to use for each new bubble, `defaultFrame` sets the default animation frame to use for each new bubble, `createCallback` specifies a function to be called for each new bubble, `collideWorldBounds` determines if each bubble will collide with the world bounds, `bounceX` determines how strongly bubbles will bounce along the X axis, `bounceY` determines how strongly bubbles will bounce along the Y axis, and `maxSize` determines the maximum number of bubbles that can be in the group at a time. Our create callback will first set the physics body for each new bubble to a circle with a radius of 16. Then it will generate a random angle in degrees by calling the `Phaser.Math.FloatBetween` method with the minimum and maximum values as parameters and passing the result to `Phaser.Math.DegToRad`. Next it will calculate the X and Y velocity using the `Math.cos` and `Math.sin` methods. Then it will set the speed to 100. And lastly it will set the velocity of the new bubble using the X and Y velocity values. After we create the physics group for our bubbles we need to configure collision detection for them. The `collider` method of the `physics.add` attribute takes 2 game objects and sets up collision detection between them. By passing our bubbles group as both parameters we can make bubbles collide with each other. Next we call the `addEvent` method of the `time` attribute to create a timer which will spawn a new bubble periodically. The first parameter is the options for the new timer. `delay` sets the number of milliseconds to wait, `callback` sets the function to call whenever the timer fires, and `loop` determines if the timer will continue to fire periodically until it is stopped. Our timer callback will call the `create` method of our bubbles group to create a new bubble. We pass random X and Y coordinates as parameters. Now we need to add our new `GameScreen` scene to our game config. Open `bubble-popper/src/main.js` and modify it like this:
```js
/*
 * main.js
 *
 * The main script for the bubble popper game.
 */

import Phaser from "phaser";

import GameOverScreen from "./scenes/gameOverScreen";
import GameScreen from "./scenes/gameScreen";
import TitleScreen from "./scenes/titleScreen";


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
    scene: [
        new TitleScreen("TitleScreen"),
        new GameScreen("GameScreen")
    ]
};
const game = new Phaser.Game(config);
```

Next, we need to modify `bubble-popper/src/scenes/titleScreen.js` like this:
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

        // Configure event handling
        this.input.on("pointerdown", () => {
            // Switch to the game screen
            this.scene.start("GameScreen");
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

The `on` method of the `input` attribute is used to assign a callback to an input event. In this case we want to handle the "pointerdown" event. The callback we assigned will call the `start` method of the `scene` attribute to stop the title screen scene and start the game screen scene. Now we should be able to click the title screen to start the game. Afterwards, you should see bubbles spawning randomly and bouncing around:
![game screen](https://github.com/DylanCheetah/bubble-popper/blob/main/lessons/screenshots/03-game_screen.png?raw=true)
