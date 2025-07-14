export default class ScoreScene extends Phaser.Scene {
    constructor() {
        super('ScoreScene');
    }

    init(data) {
        this.score = data.score;
        this.text = data.text;
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
    }
}
