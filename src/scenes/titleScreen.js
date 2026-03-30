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
