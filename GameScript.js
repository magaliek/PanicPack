import StartScene from './scenes/StartScene.js';
import GameScene from './scenes/GameScene.js';
import ScoreScene from './scenes/ScoreScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 600,
    parent: 'gameContainer',
    pixelArt: true,
    backgroundColor: '#cdb4db',
    physics: {
        default: 'matter',
        matter: {
            debug: true
        }
    },
    scene: [StartScene, GameScene, ScoreScene]
};

const game = new Phaser.Game(config);