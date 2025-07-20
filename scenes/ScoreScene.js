export default class ScoreScene extends Phaser.Scene {
    constructor() {
        super('ScoreScene');
    }

    //data from previous scene
    init(data) {
        this.score = data.score;
        this.text = data.text;
        this.packed = data.packed;
        this.music = data.music;
    }

    preload() {
        this.load.image('mute', 'assets/sound icon.png');
        this.load.image('unmute', 'assets/mute icon.png');
    }

    create() {
        this.add.text(100, 100, 'Score: '+ this.score, {
            fontSize: '32px',
            color: '0xff0000'
        });

        this.add.text(100, 200, this.text, {
            fontSize: '32px',
            color: '0xff0000',
            wordWrap: {
                width: 1000,
                useAdvancedWrap: true
            }
        });

        const labelList = this.packed.map((p) => p.texture.key).join(', ');

        this.add.text(100, 400, labelList, {
            fontSize: '12px',
            color: '#000000',
            wordWrap: {
                width: 1000,
                useAdvancedWrap: true
            },
            align: 'left'
        });


        this.replay = this.add.text(100, 500, 'replay?', {
            fontSize: '32px',
            color: '0xff0000'
        }).setInteractive();

        this.replay.on('pointerover', () => {
            this.input.setDefaultCursor('pointer');
            this.replay.setStroke('#f1a6a6', 1);
        })

        this.replay.on('pointerout', () => {
            this.input.setDefaultCursor('default');
            this.replay.setStroke('#ff0000', 0);
        });

        this.replay.on('pointerdown', () => {
            this.tweens.add({
                targets: this.music,
                volume: 0,
                duration: 1000,
                onComplete: () => {
                    this.music.stop();
                    this.scene.start('StartScene');
                }
            });
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
    }
}
