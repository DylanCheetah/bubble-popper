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
