export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image('hairdryer', 'assets/hairdryer.png');
        this.load.image('laptop', 'assets/laptop.png');
        this.load.image('flipH', 'assets/flip.png');
        this.load.image('flipV', 'assets/rotate.png');
    }

    create() {
        this.box = this.add.rectangle(200, 250, 300, 400, 0xb8b3ae);
        const {x, y, width: boxW, height: boxH} = this.box;
        const halfW = boxW/2;
        const halfH = boxH/2;
        this.stroke = 10;
        this.touchingBorders = new Map();
        this.box.setStrokeStyle(this.stroke, 0x614d3c);
        this.packed = new Set();
        this.sprites = [];
        this.flipH = this.add.image(1150, 550, 'flipH');
        this.flipV = this.add.image(1100, 550, 'flipV');
        this.leftWall = this.matter.add.rectangle(
            x - halfW,
            y,
            this.stroke,
            boxH,
            { isStatic: true, isSensor: true }
        );

        this.rightWall = this.matter.add.rectangle(
            x + halfW,
            y,
            this.stroke,
            boxH,
            { isStatic: true, isSensor: true }
        );

        this.topWall = this.matter.add.rectangle(
            x,
            y - halfH,
            boxW,
            this.stroke,
            { isStatic: true, isSensor: true }
        );

        this.bottomWall = this.matter.add.rectangle(
            x,
            y + halfH,
            boxW,
            this.stroke,
            { isStatic: true, isSensor: true }

        );

        this.flipH.setInteractive();
        this.flipV.setInteractive();

        this.hairdryer = this.add.sprite(700, 200, 'hairdryer');
        this.hairdryer.setScale(0.6);
        this.hairdryer.setInteractive();
        this.input.setDraggable(this.hairdryer);
        this.sprites.push(this.hairdryer);

        this.laptop = this.add.sprite(800, 200, 'laptop');
        this.laptop.setScale(0.5);
        this.laptop.setInteractive();
        this.input.setDraggable(this.laptop);
        this.sprites.push(this.laptop);

        this.selected = this.laptop;

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            dragY= Phaser.Math.Clamp(dragY, 24, 600-24);
            dragX = Phaser.Math.Clamp(dragX, 24, 1200-24);

            gameObject.x = dragX;
            gameObject.y = dragY;
            this.selected = gameObject;
        });

        this.input.on('pointerover', () => {
            this.input.manager.canvas.style.cursor = 'pointer';
        });

        this.input.on('pointerout', () => {
            this.input.manager.canvas.style.cursor = 'default';
        });

        this.flipH.on('pointerdown', () => {
            this.selected.setFlipX(!this.selected.flipX);
            console.log(this.selected);
            if (this.selected === this.hairdryer) {

            }
        });

    }

    /*scoring system here later*/
    update() {
        const isInBox = (sprite) => {
            const bounds = sprite.getBounds(); // no body required
            const boxBounds = this.box.getBounds();

            const inside = bounds.right < boxBounds.right &&
                bounds.left > boxBounds.left &&
                bounds.bottom < boxBounds.bottom &&
                bounds.top > boxBounds.top;

            if (inside && (sprite.tintTopLeft !== 0xFF0000)) {
                this.packed.add(sprite);
            } else if (!inside && this.packed.has(sprite)) {
                this.packed.delete(sprite);
            }
            return inside;
        };
        this.sprites.forEach(sprite => isInBox(sprite));
    }
}