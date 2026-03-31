/*
 * main.js
 *
 * The main script for the bubble popper game.
 */

import Phaser from "phaser";

import GameScreen from "./scenes/gameScreen";
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
        new TitleScreen("TitleScreen"),
        new GameScreen("GameScreen")
    ]
};
const game = new Phaser.Game(config);
