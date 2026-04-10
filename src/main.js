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
