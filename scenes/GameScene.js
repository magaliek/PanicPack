export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {
        this.load.image('hairdryer', 'assets/hairdryer.png');
        this.load.json('hairdryerShape', 'assets/hairdryer.json');
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

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            dragY= Phaser.Math.Clamp(dragY, 24, 600-24);
            dragX = Phaser.Math.Clamp(dragX, 24, 1200-24);

            gameObject.x = dragX;
            gameObject.y = dragY;
        });

    }

    update() {
        const isInBox = (sprite) => {
            const bounds = sprite.body.bounds;
            const boxBounds = this.box.getBounds();
            const width = bounds.max.x - bounds.min.x;
            const height = bounds.max.y - bounds.min.y;

            const isInBox = bounds.max.x < boxBounds.right &&
                            bounds.min.x > boxBounds.left &&
                            bounds.max.y > boxBounds.top &&
                            bounds.min.y < boxBounds.bottom;


        }
    }
}