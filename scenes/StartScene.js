export default class StartScene extends Phaser.Scene {
    constructor() {
        super('StartScene');
    }

    create() {
        this.input.setDefaultCursor('default');
        const { width, height } = this.scale;
        this.cameras.main.setBackgroundColor('#270b0b');

        this.add.text(width / 2, height / 4, 'Disaster has hit! You must pack your bags and leave your house immediately!', {
            font: '32px Chalkboard SE',
            fill: '#9a2727',
            wordWrap: {
                width: 1000,
                useAdvancedWrap: true
            },
            align: 'center'
        }).setOrigin(0.5);

        const startText = this.add.text(width / 2, height / 2, 'Start Game', {
            font: '32px Chalkboard SE',
            fill: '#000'
        }).setOrigin(0.5).setInteractive();

        startText.on('pointerover', () => {
            this.input.setDefaultCursor('pointer');
            startText.setStroke('#611d1d', 1);
        });

        startText.on('pointerout', () => {
            this.input.setDefaultCursor('default');
            startText.setStroke('#611d1d', 0);
        });

        startText.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
