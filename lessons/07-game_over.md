# Lesson 07: Game Over

Now that we are able to pop bubbles and keep score we need to determine when the game is over. For this game, we will add a timer which will count down and end the game when it hits 0. We will also need to create a suitable game over screen. Let's start by creating `bubble-popper/src/scenes/gameOverScreen.js` with the following content:
```js
/*
 * gameOverScreen.js
 *
 * The game over screen for the bubble popping game.
 */

import Phaser from "phaser";


// Game Over Screen
export default class GameOverScreen extends Phaser.Scene {
    preload() {
        // Load fonts
        this.load.font("PixelOperatorMono", "assets/fonts/PixelOperatorMono.ttf");
    }

    create() {
        // Create heading
        this.add.text(400, 300, "Game Over", {
            fontFamily: "PixelOperatorMono",
            fontSize: 64
        }).setOrigin(.5, .5);

        // Configure input
        this.input.on("pointerdown", () => {
            // Return to the title screen
            this.scene.stop("GameScreen")
                .stop("GameOverScreen")
                .launch("TitleScreen");
        });
    }
}
```

Most of the concepts used to create the game over screen are ones we already learned for our title screen. However, you will notice that this time we omitted the `fixedWidth`, `fixedHeight`, and `align` options for our heading text. Instead we called `setOrigin`. The `setOrigin` method is used to set the point by which a game object will be positioned, rotated, and scaled. The origin is given as a fraction of the width and height of the game object. For example, (0, 0) is always the upper left corner of the game object, (.5, .5) is always the center, and (1, 1) is always the lower right corner. Also, we need to stop the game screen and game over screen before launching the title screen because we will be overlaying the game over screen on top of the game screen. Next we need to add our game over screen to our game config in `bubble-popper/src/main.js`:
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
        new GameScreen("GameScreen"),
        new GameOverScreen("GameOverScreen")
    ]
};
const game = new Phaser.Game(config);
```

Now we need to open `bubble-popper/src/scenes/gameScreen.js` and modify it like this:
```js
/*
 * gameScreen.js
 *
 * The game screen for the bubble popper game.
 */

import Phaser from "phaser";


// Game Screen Scene
export default class GameScreen extends Phaser.Scene {
    init() {
        this.score = 0;
    }

    preload() {
        // Load fonts
        this.load.font("PixelOperatorMono", "assets/fonts/PixelOperatorMono.ttf");

        // Load spritesheets
        this.load.spritesheet("Bubble-Pop", "assets/sprites/Bubble-Pop.png", {
            frameWidth: 32,
            frameHeight: 32
        });

        // Load images
        this.load.image("Needle", "assets/sprites/Needle.png");

        // Load audio
        this.load.audio("Bubble-Pop", "assets/sfx/Bubble-Pop.wav");
    }

    create() {
        // Hide the mouse cursor
        this.input.setDefaultCursor("none");

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

        // Create needle
        this.needle = this.physics.add.sprite(0, 0, "Needle", 0)
            .setDepth(1)
            .setDirectControl();

        // Create score display
        const score_display = this.add.text(8, 8, "Score: 0", {
            fontFamily: "PixelOperatorMono",
            fontSize: 24
        }).setDepth(100);

        // Create time display
        this.time_display = this.add.text(400, 8, "300", {
            fontFamily: "PixelOperatorMono",
            fontSize: 24
        }).setDepth(100).setOrigin(.5, 0);

        // Create animations
        this.anims.create({
            key: "Bubble-Pop",
            frames: this.anims.generateFrameNumbers("Bubble-Pop", {start: 0, end: 7}),
            frameRate: 12
        });

        // Configure collision detection
        this.physics.add.collider(bubbles, bubbles);
        this.physics.add.overlap(this.needle, bubbles, (needle, bubble) => {
            // Disable physics for the bubble and play the popping animation
            bubble.body.enable = false;
            bubble.play("Bubble-Pop");
            bubble.on("animationcomplete", () => {
                // Destroy the bubble
                bubble.destroy();
            });

            // Play popping sound effect
            this.sound.play("Bubble-Pop");

            // Update the score
            this.score += 100;
            score_display.setText(`Score: ${this.score}`);
        });

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

        // End the game after 3000 ms (about 5 minutes)
        this.game_timer = this.time.addEvent({
            delay: 300000,
            callback: () => {
                // Restore the default cursor, pause the game, and show the game over screen on top
                this.input.setDefaultCursor("default");
                this.scene.pause("GameScreen")
                    .launch("GameOverScreen");
            }
        });
    }

    update(time, delta) {
        // Move the needle to the mouse position
        const pointer = this.input.activePointer;
        this.needle.setPosition(pointer.x, pointer.y);

        // Update the game timer
        this.time_display.setText(`${Phaser.Math.RoundTo(this.game_timer.getRemainingSeconds(), 0)}`);
    }
}
```

In our `create` method we create a text object for our timer. This time we will set its origin to the upper center in addition to setting the depth. We also assign it to the `time_display` attribute so we can access it from our `update` method later. Then we create a new timer which will fire after 5 minutes (300000 milliseconds) have elapsed. The callback for this timer will set the default mouse cursor to the default arrow, pause the game screen, and launch the game over screen. We also assign this timer to the `game_timer` attribute so we can access it from our `update` method. In our `update` method we will set the time display to the remaining seconds rounded to the nearest second. If we play our game at this point it should show the game over screen once the timer has reached 0. And we can click to return to the title screen:
![game over](https://github.com/DylanCheetah/bubble-popper/blob/main/lessons/screenshots/06-game_over.png?raw=true)
