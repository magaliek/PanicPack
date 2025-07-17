export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.json('shapes', 'assets/shapes.json');
        this.load.image('hairdryer', 'assets/hairdryer.png');
        this.load.image('laptop', 'assets/laptop.png');
        this.load.image('survival book', 'assets/survival book.png');
        this.load.image('batteries', 'assets/batteries.png');
        this.load.image('beer', 'assets/beer.png');
        this.load.image('cologne', 'assets/cologne.png');
        this.load.image('dog food', 'assets/dog food.png');
        this.load.image('first aid kit', 'assets/first aid kit.png');
        this.load.image('flashlight', 'assets/flashlight.png');
        this.load.image('gas mask', 'assets/gas mask.png');
        this.load.image('jewelry box', 'assets/jewelry box.png');
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
        this.load.image('tent bag', 'assets/tent bag.png');
        this.load.image('thermos', 'assets/thermos.png');
        this.load.image('toilet paper', 'assets/toilet paper.png');
        this.load.image('toothbrush', 'assets/toothbrush.png');
        this.load.image('wallet', 'assets/wallet.png');
    }

    create() {
        this.box = this.add.rectangle(180, 300, 300, 400, 0x120001);
        this.box.setStrokeStyle(10, 0x421922);

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

        this.hairdryer = this.makeSprite(0.4, this.sprites, 400, 100, 'hairdryer');
        this.laptop = this.makeSprite(0.3, this.sprites, 500, 100, 'laptop');
        this.book = this.makeSprite(0.1, this.sprites, 600, 100, 'survival book');
        this.batteries = this.makeSprite(0.1, this.sprites, 700, 100, 'batteries');
        this.beer = this.makeSprite(0.1, this.sprites, 800, 100, 'beer');
        this.cologne = this.makeSprite(0.1, this.sprites, 900, 100, 'cologne');
        this.dogfood = this.makeSprite(0.1, this.sprites, 1000, 100, 'dog food');
        this.firstaidkit = this.makeSprite(0.15, this.sprites, 1100, 100, 'first aid kit');
        this.flashlight = this.makeSprite(0.08, this.sprites, 400, 200, 'flashlight');
        this.gasmask = this.makeSprite(0.1, this.sprites, 500, 200, 'gas mask');
        this.jewelrybox = this.makeSprite(0.1, this.sprites, 600, 200, 'jewelry box');
        this.makeupbag = this.makeSprite(0.1, this.sprites, 700, 200, 'makeup bag');
        this.matches = this.makeSprite(0.05, this.sprites, 800, 200, 'matches');
        this.mouthwash = this.makeSprite(0.09, this.sprites, 900, 200, 'mouthwash');
        this.mre = this.makeSprite(0.09, this.sprites, 1000, 200, 'mre');
        this.passport = this.makeSprite(0.05, this.sprites, 1100, 200, 'passport');
        this.portablepowergen = this.makeSprite(0.15, this.sprites, 400, 300, 'portable power gen');
        this.portablestove = this.makeSprite(0.1, this.sprites, 500, 300, 'portable stove');
        this.pot = this.makeSprite(0.1, this.sprites, 600, 300, 'pot');
        this.powerbank = this.makeSprite(0.05, this.sprites, 700, 300, 'power bank');
        this.proteinbar = this.makeSprite(0.05, this.sprites, 800, 300, 'protein bar');
        this.ps5 = this.makeSprite(0.13, this.sprites, 900, 300, 'ps5');
        this.rope = this.makeSprite(0.1, this.sprites, 1000, 300, 'rope');
        this.soap = this.makeSprite(0.07, this.sprites, 1100, 300, 'soap');
        this.swissknife = this.makeSprite(0.05, this.sprites, 400, 400, 'swiss knife');
        this.teddybear = this.makeSprite(0.1, this.sprites, 500, 400, 'teddy bear');
        this.tent = this.makeSprite(0.1, this.sprites, 600, 400, 'tent bag');
        this.thermos = this.makeSprite(0.05, this.sprites, 700, 400, 'thermos');
        this.toilet = this.makeSprite(0.1, this.sprites, 800, 400, 'toilet paper');
        this.toothbrush = this.makeSprite(0.05, this.sprites, 900, 400, 'toothbrush');
        this.wallet = this.makeSprite(0.05, this.sprites, 1000, 400, 'wallet');

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
        }).setOrigin(0.5).setDepth(100);
        this.warning.setVisible(this.warningshown);
        myText.setInteractive();

        this.tooltip = this.add.text(0, 0, 'hairdryer', {
            fontFamily: 'Bebas Neue',
            fontSize: '24px',
            color: '#ffffff',
            align: 'center'
        }).setDepth(10).setVisible(false);
        this.tooltipFollow = this.hairdryer;

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            dragY = Phaser.Math.Clamp(dragY, 48, 600 - 48);
            dragX = Phaser.Math.Clamp(dragX, 48, 1200 - 48);

            this.matter.body.setPosition(gameObject.body, { x: dragX, y: dragY });
            this.selected = gameObject;

            if (this.tooltip.visible && this.tooltipFollow === gameObject) {
                this.tooltip.setPosition(
                    dragX - gameObject.displayWidth / 2,
                    dragY + gameObject.displayHeight / 2
                );
            }

        });

        this.input.on('pointerover', () => {
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
                    score += this.calcScore(p);
                })
            }

            if (score < 50) {
                text = "you survived 3 days before dying";
            } else if (score >= 50 && score <= 100) {
                text = 'you survived 2 weeks before managing to find shelter. Most of your things were taken by the surviving authorities. You received some compensation for it and will probably survive if you keep your wits about you.';
            } else if (score >= 100 && score <= 180) {
                text = 'you survived 3 months so far. You made your own little shelter somewhere in the forest and managed to stay there for now. The future is uncertain.';
            } else {
                text = 'Not only did you survive, you managed to rescue people and together you guys created a micro community with a very high chance of survival and growth. However, always beware of social dynamics.'
            }

            if (!this.warningshown) {
                this.scene.start('ScoreScene', {score: score, text: text, packed: Array.from(this.packed)});
            }
        });
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

    makeSprite(scale, list, x, y, key) {
        const sprite = this.matter.add.sprite(x, y, key, null, {
            shape: this.cache.json.get('shapes')[key]
        });

        sprite.setScale(scale);
        sprite.setFixedRotation();
        sprite.setIgnoreGravity(true);
        sprite.setInteractive();

        this.input.setDraggable(sprite);
        list.push(sprite);
        return sprite;
    }

    calcScore(sprite) {
        if (sprite===this.hairdryer) {
            return -8;
        }
        if (sprite===this.laptop) {
            return 8;
        }
        if (sprite===this.batteries) {
            return 2;
        }
        if (sprite===this.beer) {
            return -10;
        }
        if (sprite===this.book) {
            return 5;
        }
        if (sprite===this.cologne) {
            return -8;
        }
        if (sprite===this.dogfood) {
            return 1;
        }
        if (sprite===this.firstaidkit) {
            return 15;
        }
        if (sprite===this.flashlight) {
            return 6;
        }
        if (sprite===this.gasmask) {
            return 4;
        }
        if (sprite===this.jewelrybox) {
            return 6;
        }
        if (sprite===this.makeupbag) {
            return -2;
        }
        if (sprite===this.matches) {
            return 5;
        }
        if (sprite===this.mouthwash) {
            return -3;
        }
        if (sprite===this.mre) {
            return 3;
        }
        if (sprite===this.passport) {
            return 1;
        }
        if (sprite===this.portablepowergen) {
            return 18;
        }
        if (sprite===this.portablestove) {
            return 15;
        }
        if (sprite===this.pot) {
            return 5;
        }
        if (sprite===this.powerbank) {
            return 5;
        }
        if (sprite===this.proteinbar) {
            return 3;
        }
        if (sprite===this.ps5) {
            return -17;
        }
        if (sprite===this.rope) {
            return 5;
        }
        if (sprite===this.soap) {
            return 2;
        }
        if (sprite===this.swissknife) {
            return 10;
        }
        if (sprite===this.teddybear) {
            return -8;
        }
        if (sprite===this.tent) {
            return 7;
        }
        if (sprite===this.thermos) {
            return 1;
        }
        if (sprite===this.toilet) {
            return -6;
        }
        if (sprite===this.toothbrush) {
            return 1;
        }
        if (sprite===this.wallet) {
            return -10;
        }
        return 0;
    }
}
