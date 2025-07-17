export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image('hairdryer', 'assets/hairdryer.png');
        this.load.json('hairdryerShape', 'assets/hairdryer.json');
        this.load.image('laptop', 'assets/laptop.png');
        this.load.json('laptopShape', 'assets/laptop.json');
        this.load.image('book', 'assets/book.png');
        this.load.json('shapes', 'assets/shapes.json');
        this.load.image('batteries', 'assets/batteries.png');
        this.load.image('beer', 'assets/beer.png');
        this.load.image('cologne', 'assets/cologne.png');
        this.load.image('dog food', 'assets/dog food.png');
        this.load.image('first aid kit', 'assets/first aid kit.png');
        this.load.image('flashlight', 'assets/flashlight.png');
        this.load.image('gasmask', 'assets/gasmask.png');
        this.load.image('jewelrybox', 'assets/jewelrybox.png');
        this.load.image('makeup bag', 'assets/makeup bag.png');
        this.load.image('matches', 'assets/matches.png');
        this.load.image('mouthwash', 'assets/mouthwash.png');
        this.load.image('mre', 'assets/mre.png');
        this.load.image('passport', 'assets/passport.png');
        this.load.image('portable power gen', 'assets/portable power gen.png');
        this.load.image('portable stove', 'assets/portable stove.png');
        this.load.image('pot', 'assets/pot.png');
        this.load.image('power bank', 'assets/power bank.png');
        this.load.image('protein bar', 'assets/protein bar.png');
        this.load.image('ps5', 'assets/ps5.png');
        this.load.image('rope', 'assets/rope.png');
        this.load.image('soap', 'assets/soap.png');
        this.load.image('swiss knife', 'assets/swiss knife.png');
        this.load.image('teddy bear', 'assets/teddy bear.png');
        this.load.image('tent', 'assets/tent.png');
        this.load.image('thermos', 'assets/thermos.png');
        this.load.image('toilet', 'assets/toilet.png');
        this.load.image('toothbrush', 'assets/toothbrush.png');
        this.load.image('wallet', 'assets/wallet.png');
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

        this.hairdryer = this.makeSprite(0.5, this.sprites, 600, 200, 'hairdryerShape', 'hairdryer');
        this.laptop = this.makeSprite(0.4, this.sprites, 800, 200, 'laptopShape', 'laptop');
        this.book = this.makeSprite(0.1, this.sprites, 1000, 200, 'shapes', 'book');

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

        this.tooltip = this.add.text(0, 0, 'hairdryer', {
            fontFamily: 'roboto',
            fontSize: '32px',
            fontWeight: '100',
            color: '#000000',
            align: 'center',
            padding: { x: 6, y: 4 }
        }).setDepth(10).setVisible(false);
        this.tooltipFollow = this.hairdryer;

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            dragY = Phaser.Math.Clamp(dragY, 24, 600 - 24);
            dragX = Phaser.Math.Clamp(dragX, 24, 1200 - 24);

            this.matter.body.setPosition(gameObject.body, { x: dragX, y: dragY });
            this.selected = gameObject;

            if (this.tooltip.visible && this.tooltipFollow === gameObject) {
                this.tooltip.setPosition(
                    dragX - gameObject.displayWidth / 4,
                    dragY + gameObject.displayHeight / 2
                );
            }

        });

        this.input.on('pointerover', (pointer) => {
            this.input.manager.canvas.style.cursor = 'pointer';
        });

        this.input.on('pointerout', () => {
            this.input.manager.canvas.style.cursor = 'default';
        });

        this.sprites.forEach(sprite => {
            sprite.on('pointerover', () => {
                this.tooltip.setText(sprite.texture.key);
                this.tooltip.setPosition(sprite.x - sprite.displayWidth/4, sprite.y+sprite.displayHeight/2);
                this.tooltip.setVisible(true);
                this.tooltipFollow = sprite;
            });

            sprite.on('pointerout', () => {
                this.tooltip.setVisible(false);
                this.tooltipFollow = null;
            })
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

            this.scene.start('ScoreScene', {score: score, text: text, packed: Array.from(this.packed)});
        });

        this.graphics = this.add.graphics();
        this.graphics.lineStyle(2, 0xff0000, 1);
    }

    update() {
        this.sprites.forEach(sprite => {
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

            const bodyBounds = sprite.body.bounds;
            const boxBounds = this.box.getBounds();

            const fullyInside =
                bodyBounds.min.x >= boxBounds.x &&
                bodyBounds.max.x <= boxBounds.x + boxBounds.width &&
                bodyBounds.min.y >= boxBounds.y &&
                bodyBounds.max.y <= boxBounds.y + boxBounds.height &&
                !this.touchingBorders.has(sprite);

            if (fullyInside) {
                this.packed.add(sprite);
            } else {
                this.packed.delete(sprite);
            }
        });
    }

    makeSprite(scale, list, x, y, shape, key) {
        const sprite = this.matter.add.sprite(x, y, key, null, {
            shape: this.cache.json.get(shape)[key]
        });

        sprite.setScale(scale);
        sprite.setFixedRotation();
        sprite.setIgnoreGravity(true);
        sprite.setInteractive();

        this.input.setDraggable(sprite);
        list.push(sprite);
        return sprite;
    }
}
