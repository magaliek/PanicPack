export default class ScoreScene extends Phaser.Scene {
    constructor() {
        super('ScoreScene');
    }

    init(data) {
        this.score = data.score;
        this.text = data.text;
        this.packed = data.packed;
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
            align: 'left' // or 'center'
        });


        this.replay = this.add.text(100, 500, 'replay?', {
            fontSize: '32px',
            color: '0xff0000'
        }).setInteractive();

        this.replay.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
