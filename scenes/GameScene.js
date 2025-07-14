export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image('hairdryer', 'assets/hairdryer.png');
        this.load.json('hairdryerShape', 'assets/hairdryer.json');
        this.load.image('laptop', 'assets/laptop.png');
        this.load.json('laptopShape', 'assets/laptop.json');
    }

    create() {
        this.box = this.add.rectangle(250, 300, 400, 500, 0xb8b3ae);
        this.box.setStrokeStyle(10, 0x614d3c);

        const { x, y, width: boxW, height: boxH } = this.box;
        const halfW = boxW / 2;
        const halfH = boxH / 2;
        this.stroke = 10;
        this.touchingBorders = new Map();
        this.packed = new Set();
        this.sprites = [];

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

        this.hairdryer = this.matter.add.sprite(600, 200, 'hairdryer', null, {
            shape: this.cache.json.get('hairdryerShape')['hairdryer']
        });

        this.hairdryer.setScale(0.6);
        this.hairdryer.setFixedRotation();
        this.hairdryer.setIgnoreGravity(true);
        this.hairdryer.setInteractive();

        this.laptop = this.matter.add.sprite(800, 200, 'laptop', null, {
            shape: this.cache.json.get('laptopShape')['laptop']
        });

        this.laptop.setScale(0.5);
        this.laptop.setFixedRotation();
        this.laptop.setIgnoreGravity(true);
        this.laptop.setInteractive();

        this.sprites.push(this.hairdryer, this.laptop);
        this.input.setDraggable(this.hairdryer);
        this.input.setDraggable(this.laptop);

        this.selected = this.laptop;

        const myText = this.add.text(950, 550, 'Done?', {
            fontFamily: 'roboto',
            fontSize: '32px',
            fontWeight: '100',
            fill: 'black',
            color: '#b4f8f3',
        });

        this.warningshown = false;
        this.warning = this.add.text(600, 300, 'Overflow of objects! Remove something.', {
            fontFamily: 'roboto',
            fontSize: '48px',
            color: '#ff0000',
            backgroundColor: '#fff0f0',
            padding: { x: 10, y: 5 },
            align: 'center'
        }).setOrigin(0.5).setDepth(10);
        this.warning.setVisible(this.warningshown);
        myText.setInteractive();

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            dragY = Phaser.Math.Clamp(dragY, 24, 600 - 24);
            dragX = Phaser.Math.Clamp(dragX, 24, 1200 - 24);

            this.matter.body.setPosition(gameObject.body, { x: dragX, y: dragY });
            this.selected = gameObject;
        });

        this.input.on('pointerover', () => {
            this.input.manager.canvas.style.cursor = 'pointer';
        });

        this.input.on('pointerout', () => {
            this.input.manager.canvas.style.cursor = 'default';
        });

        myText.on('pointerdown', () => {
            const anyOverflow = this.sprites.some(sprite => this.touchingBorders.has(sprite));

            if (anyOverflow && !this.warningshown) {
                this.warningshown = true;
                this.warning.setVisible(this.warningshown);

                this.time.delayedCall(100, () => {
                    this.input.once('pointerdown', () => {
                        this.warningshown = false;
                        this.warning.setVisible(false);
                    });
                });
            }

            let score=0;
            let text='';
            if (!this.warningshown) {
                this.packed.forEach(p => {
                    if (p===this.hairdryer) {
                        score += 10;
                    }
                    if (p===this.laptop) {
                        score += 7;
                    }
                })
            }

            if (score < 10) {
                text = "you survived 3 days. You are dead";
            } else if (score >= 10) {
                text = 'you survived 2 weeks. You managed to find shelter';
            } else {
                text = 'you survived 3 months. You are thriving';
            }

            console.log(score);
            this.scene.start('ScoreScene', {score: score, text: text});
        });

        this.graphics = this.add.graphics();
        this.graphics.lineStyle(2, 0xff0000, 1);
    }

    update() {
        this.sprites.forEach(sprite => {
            const bounds = sprite.getBounds();

            const touchingLeft = this.matter.overlap(sprite, this.leftWall);
            const touchingRight = this.matter.overlap(sprite, this.rightWall);
            const touchingTop = this.matter.overlap(sprite, this.topWall);
            const touchingBottom = this.matter.overlap(sprite, this.bottomWall);

            const touchingBorders = new Set();
            if (touchingLeft) touchingBorders.add('left');
            if (touchingRight) touchingBorders.add('right');
            if (touchingTop) touchingBorders.add('top');
            if (touchingBottom) touchingBorders.add('bottom');

            if (touchingBorders.size > 0) {
                this.touchingBorders.set(sprite, touchingBorders);
                sprite.setTint(0xff0000);
            } else {
                this.touchingBorders.delete(sprite);
                sprite.clearTint();
            }

            const overlapsBox = Phaser.Geom.Intersects.RectangleToRectangle(bounds, this.box.getBounds());
            const fullyInside = overlapsBox && touchingBorders.size === 0;

            if (fullyInside) {
                this.packed.add(sprite);
            } else {
                this.packed.delete(sprite);
            }
        });
    }
}
