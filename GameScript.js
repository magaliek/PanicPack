import StartScene from './scenes/StartScene.js';
import GameScene from './scenes/GameScene.js';
import ScoreScene from './scenes/ScoreScene.js';

const config = {
    type: Phaser.AUTO,
    parent: 'gameContainer',
    pixelArt: true,
    backgroundColor: '#7c0819',
    physics: {
        default: 'matter',
        matter: {
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1200,
        height: 600
    },
    scene: [StartScene, GameScene, ScoreScene]
};

new Phaser.Game(config);