import StartScene from './scenes/StartScene.js';
import GameScene from './scenes/GameScene.js';
import ScoreScene from './scenes/ScoreScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 600,
    parent: 'gameContainer',
    pixelArt: true,
    backgroundColor: '#7c0819',
    physics: {
        default: 'matter'
    },
    scene: [StartScene, GameScene, ScoreScene]
};

new Phaser.Game(config);