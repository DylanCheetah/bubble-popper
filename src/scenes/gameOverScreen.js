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
