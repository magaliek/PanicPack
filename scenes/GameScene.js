export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {

    }

    create() {
        this.box = this.add.rectangle(200, 250, 300, 400, 0xb8b3ae);
        this.boxBounds = this.box.getBounds();


        this.rect = this.add.rectangle(600, 300, 48, 48, 0xedcaad)
            .setStrokeStyle(2, 0xedbf9a)
            .setInteractive();
        this.input.setDraggable(this.rect);

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            dragY= Phaser.Math.Clamp(dragY, 24, 600-24);
            dragX = Phaser.Math.Clamp(dragX, 24, 1200-24);

            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', (pointer, gameObject) => {
            const bounds = gameObject.getBounds();

            const fits =
                bounds.left >= this.boxBounds.left &&
                bounds.right <= this.boxBounds.right &&
                bounds.top >= this.boxBounds.top &&
                bounds.bottom <= this.boxBounds.bottom;

            if (!fits) {
                gameObject.setStrokeStyle(1, 0xff0000);
            } else {
                gameObject.setStrokeStyle(2, 0xedbf9a);
            }
        });

    }
}