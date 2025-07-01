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
        this.stroke = 10;
        this.box.setStrokeStyle(this.stroke, 0x614d3c);
        this.leftWall = this.matter.add.rectangle(
            x - halfW,
            y,
            this.stroke,
            boxHeight,
            { isStatic: true, isSensor: true }
        );

        this.rightWall = this.matter.add.rectangle(
            x + halfW,
            y,
            this.stroke,
            boxHeight,
            { isStatic: true, isSensor: true }
        );

        this.topWall = this.matter.add.rectangle(
            x,
            y - halfH,
            boxWidth,
            this.stroke,
            { isStatic: true, isSensor: true }
        );

        this.bottomWall = this.matter.add.rectangle(
            x,
            y + halfH,
            boxWidth,
            this.stroke,
            { isStatic: true, isSensor: true }

        );

        this.matter.world.on('collisionstart', (event) => {

        });

        this.matter.world.on('collisionend', (event) => {
            event.pairs.forEach(({ bodyA, bodyB }) => {
                const borders = [this.leftWall, this.rightWall, this.topWall, this.bottomWall];

                const isBorderA = borders.includes(bodyA);
                const isBorderB = borders.includes(bodyB);

                const objA = bodyA.gameObject;
                const objB = bodyB.gameObject;

                if (isBorderA && objB?.clearTint) {
                    objB.clearTint();
                } else if (isBorderB && objA.clearTint) {
                    objA.clearTint();
                }
            });
        });


        const hairdryerShapes = this.cache.json.get('hairdryerShape');
        this.hairdryer = this.matter.add.sprite(700, 200, 'hairdryer', null, {
            shape: hairdryerShapes['hairdryer'],
            isStatic: true,
            restitution: 0,
            friction: 1,
            frictionStatic: 1,
            frictionAir: 0.05
        });
        this.hairdryer.setScale(0.6);
        this.hairdryer.setInteractive();

        this.input.setDraggable(this.hairdryer);

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            dragY= Phaser.Math.Clamp(dragY, 24, 600-24);
            dragX = Phaser.Math.Clamp(dragX, 24, 1200-24);

            gameObject.x = dragX;
            gameObject.y = dragY;
        });

    }
}