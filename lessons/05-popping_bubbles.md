# Lesson 05: Popping Bubbles

Now that we are able to start the game and spawn bouncing bubbles, we need to add a way to pop them. First we need to create a `bubble-popper/src/assets/sfx/` folder. Then we need to download the bubble popping sound effect from *link* and move it to `bubble-popper/src/assets/sfx/`. We also need to download the sewing needle image from *link* and move it to `bubble-popper/src/assets/sprites/`. Next we need to open `bubble-popper/package.json` and modify the build:copy script like this:
```json
    "build:copy": "copyfiles -f src/index.html dist/ && copyfiles -u 1 src/assets/fonts/*.ttf src/assets/sfx/*.wav src/assets/sprites/*.png dist/",
```

You will need to restart the development server for this change to take effect. Then open `bubble-popper/src/scenes/gameScreen.js` and modify it like this:
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
    }

    update(time, delta) {
        // Move the needle to the mouse position
        const pointer = this.input.activePointer;
        this.needle.setPosition(pointer.x, pointer.y);
    }
}
```

In our `preload` method we call the `image` method of the `load` attribute to load a sewing needle image. The first parameter is the name we will use to refer to the image and the second parameter is the URL of the image to load. Then we call the `audio` method of the `load` attribute to load our bubble pop sound effect. The first parameter is the name we will use to refer to the sound effect and the second parameter is the URL of the audio file. In our `create` method we call the `setDefaultCursor` of the `input` attribute to set the default mouse cursor. By passing "none" as the first parameter we can hide the mouse cursor. This will allow us to use a game object as a custom mouse cursor. Next we need to create a sprite for the sewing needle by calling the `sprite` method of the `physics.add` attribute. The first parameter is the X coordinate, the second parameter is the Y coordinate, the third parameter is the name of the image or spritesheet to use, and the fourth parameter is the index of the frame to use. Then we call the `setDepth` method of the needle to give it a depth greater than the bubbles. This will ensure that the needle is always on top of the bubbles. Next we call the `setDirectControl` method of the needle. This will allow us to move the needle by directly setting its position instead of letting the physics engine move it. We also store the needle into the `needle` attribute to use later in our `update` method. Afterwards we need to call the `create` method of the `anims` attribute to create the popping animation for the bubble. The first parameter is an object containing the options for the animation. `key` sets the name of the animation, `frames` is the frames for the animation, and `frameRate` is the playback rate for the animation. We call the `generateFrameNumbers` method of the `anims` attribute to generate the frames for the bubble pop animation. The first parameter is the name of the image or spritesheet to use and the second parameter is an object containing options for the frame to be generated. `start` sets the index of the first frame and `end` sets the index of the last frame. Next we call the `overlap` method of the `physics.add` attribute to configure collision detection between the needle and bubbles. Unlike `collider`, the `overlap` method sets up collision detection which will not affect the physics of either colliding object. The first parameter is the first object, the second parameter is the second object, and the third parameter is the function to call when the 2 objects collide. The callback function disables the physics body for the bubble, plays the bubble popping animation, assigns a function to be called when the animation finishes playing, and plays the bubble popping sound effect. When the animation finishes, the second callback function will destroy the bubble by calling its `destroy` method. Our `update` method will set the position of the needle to the current mouse position. If we play our game at this point, we should be able to move the needle around with the mouse and use it to pop the bubbles:
*screenshot*
