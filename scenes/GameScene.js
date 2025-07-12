export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image('hairdryer', 'assets/hairdryer.png');
        this.load.json('hairdryerShape', 'assets/hairdryer.json');
        this.load.image('laptop', 'assets/laptop.png');
        this.load.json('laptopShape', 'assets/laptop.json');
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

        const hairdryerShapes = this.cache.json.get('hairdryerShape');
        this.hairdryer = this.matter.add.sprite(700, 200, 'hairdryer', null, {
            shape: hairdryerShapes['hairdryer'],
            isStatic: false,
            restitution: 0,
            friction: 0,
            frictionStatic: 0,
            frictionAir: 0,
            inertia: Infinity
        });
        this.hairdryer.setScale(0.6);
        this.hairdryer.setInteractive();
        this.hairdryer.setIgnoreGravity(true);
        this.input.setDraggable(this.hairdryer);
        this.sprites.push(this.hairdryer);

        const laptopShapes = this.cache.json.get('laptopShape');
        this.laptop = this.matter.add.sprite(800, 200, 'laptop', null, {
            shape: laptopShapes['laptop'],
            isStatic: false,
            restitution: 0,
            friction: 0,
            frictionStatic: 0,
            frictionAir: 0,
            inertia: Infinity
        });
        this.laptop.setScale(0.5);
        this.laptop.setInteractive();
        this.laptop.setIgnoreGravity(true);
        this.input.setDraggable(this.laptop);
        this.sprites.push(this.laptop);

        this.selected = this.laptop;
        this.matter.world.on('collisionstart', (event) => {
            event.pairs.forEach(({bodyA, bodyB}) => {
                const borders = [this.leftWall, this.rightWall, this.topWall, this.bottomWall];

                const isBorderA = borders.includes(bodyA);
                const isBorderB = borders.includes(bodyB);

                const objA = bodyA.gameObject;
                const objB = bodyB.gameObject;

                if (isBorderA && objB?.setTint) {
                    const count = this.touchingBorders.get(objB) || 0;
                    this.touchingBorders.set(objB, count+1);
                    objB.setTint(0xFF0000);
                } else if (isBorderB && objA?.setTint) {
                    const count = this.touchingBorders.get(objA) || 0;
                    this.touchingBorders.set(objA, count+1);
                    objA.setTint(0xFF0000);
                }
            });
        });

        this.matter.world.on('collisionend', (event) => {
            event.pairs.forEach(({ bodyA, bodyB }) => {
                const borders = [this.leftWall, this.rightWall, this.topWall, this.bottomWall];

                const isBorderA = borders.includes(bodyA);
                const isBorderB = borders.includes(bodyB);

                const objA = bodyA.gameObject;
                const objB = bodyB.gameObject;

                if (isBorderA && objB?.clearTint) {
                    let count = this.touchingBorders.get(objB) -1;
                    this.touchingBorders.set(objB, count);
                    if (count === undefined) {
                        console.warn("Unexpected: collisionend fired without collisionstart.");
                        count = 1;
                    }
                    if (count <= 0) {
                        this.touchingBorders.delete(objB);
                        objB.clearTint();
                    }
                } else if (isBorderB && objA.clearTint) {
                    let count = this.touchingBorders.get(objA) - 1;
                    this.touchingBorders.set(objA, count);
                    if (count === undefined) {
                        console.warn("Unexpected: collisionend fired without collisionstart.");
                        count = 1;
                    }
                    if (count <= 0) {
                        this.touchingBorders.delete(objA);
                        objA.clearTint();
                    }
                }
            });
        });

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
            const bounds = sprite.body.bounds;
            const boxBounds = this.box.getBounds();

            const inside = bounds.max.x < boxBounds.right &&
                bounds.min.x > boxBounds.left &&
                bounds.max.y > boxBounds.top &&
                bounds.min.y < boxBounds.bottom;

            if (inside && (sprite.tintTopLeft !== 0xFF0000)) {
                this.packed.add(sprite);
            } else if (!inside && this.packed.has(sprite)) {
                this.packed.delete(sprite);
            }
            return inside;
        }
        this.sprites.forEach(sprite => isInBox(sprite));
    }
}
