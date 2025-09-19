export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    preload() {
        this.load.audio('intromusic', 'assets/startmusic.mp3');
        this.load.image('mute', 'assets/sound icon.png');
        this.load.image('unmute', 'assets/mute icon.png');
    }

    create() {
        this.music = this.sound.add('intromusic', {
            loop: true,
            volume: 0
        })
        this.music.play();

        this.tweens.add({
            targets: this.music,
            volume: 0.5,
            duration: 2000
        });

        this.input.setDefaultCursor('default');
        const { width, height } = this.scale;
        this.cameras.main.setBackgroundColor('#270b0b');

        //test
        console.log(window.innerWidth, window.innerHeight, width, height, this.isPortrait());

        this.add.text(width / 2, height / 4, 'Disaster has hit! You must pack your bags and leave your house immediately!', {
            font: '32px Chalkboard SE',
            fill: '#9a2727',
            wordWrap: {
                width: width/1.5,
                useAdvancedWrap: true
            },
            align: 'center'
        }).setOrigin(0.5);

        const startText = this.add.text(width / 2, height / 2, 'Start Game', {
            font: '32px Chalkboard SE',
            fill: '#c8c8c8'
        }).setOrigin(0.5).setInteractive();

        startText.on('pointerover', () => {
            this.input.setDefaultCursor('pointer');
            startText.setStroke('#f1a6a6', 1);
        });

        startText.on('pointerout', () => {
            this.input.setDefaultCursor('default');
            startText.setStroke('#611d1d', 0);
        });

        this.mute = this.add.sprite(1150, 550, 'mute', null).setInteractive();
        this.mute.on('pointerdown', () => {
            if (this.mute.texture.key === 'mute') {
                this.mute.setTexture('unmute');
            } else {
                this.mute.setTexture('mute');
            }

            if (this.music.isPlaying) {
                this.music.pause();
            } else {
                this.music.resume();
            }
        });
        this.mute.on('pointerover', () => {
            this.input.setDefaultCursor('pointer');
        });

        startText.on('pointerdown', () => {
            this.tweens.add({
                targets: this.music,
                volume: 0,
                duration: 1000,
                onComplete: () => {
                    this.music.stop();
                    this.scene.start('GameScene');
                }
            });
        });
    }

    //test
    isPortrait() {
        return window.innerHeight > window.innerWidth;
    }
}
