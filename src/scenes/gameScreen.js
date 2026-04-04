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
