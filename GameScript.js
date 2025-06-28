import StartScene from './scenes/StartScene.js';
import GameScene from './scenes/GameScene.js';

const config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 600,
    parent: 'gameContainer',
    pixelArt: true,
    backgroundColor: '#cdb4db',
    scene: [/*StartScene,*/ GameScene]
};

const game = new Phaser.Game(config);