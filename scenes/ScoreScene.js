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
            color: '0xff0000'
        });

        let currentX = 100;
        this.packed.forEach((p, i) => {
            const isLast = this.packed[i] === this.packed[this.packed.length-1];
            const label = isLast ? p.texture.key : p.texture.key + ',';

            const text = this.add.text(currentX, 300, label, {
                fontSize: '12px',
                color: '#000000',
                wordWrap: {
                    width: 1000,
                    useAdvancedWrap: true
                }
            });
            currentX += text.width + 5;
        })

        this.replay = this.add.text(100, 500, 'replay?', {
            fontSize: '32px',
            color: '0xff0000'
        }).setInteractive();

        this.replay.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
