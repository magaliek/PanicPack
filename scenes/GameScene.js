import {GameConfiguration} from "../config/GameConfiguration.js";
import {SPRITES} from "../config/sprites.js";
import {TIMERTYPE} from "../config/TimerType.js";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    //loading all assets
    preload() {
        SPRITES.forEach(sprite => {
            this.load.image(sprite.key, sprite.file);
        });

        this.load.audio('gamemusic', 'assets/game music.mp3');


        this.load.json('shapes', 'assets/shapes.json');
        this.load.image('mute', 'assets/sound icon.png');
        this.load.image('unmute', 'assets/mute icon.png');
    }

    create() {
        //box that serves as the "backpack"
        this.box = this.add.rectangle(180, 300, 300, 400, 0x120001);
        this.box.setStrokeStyle(10, 0x421922);

        const {x, y, width: boxW, height: boxH} = this.box;
        const halfW = boxW / 2;
        const halfH = boxH / 2;
        this.stroke = 10;
        this.selected = null;
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //to check collision with multiple borders at once
        this.touchingBorders = new Map();
        //sprites packed
        this.packed = new Set();
        //all sprites, optimised
        this.sprites = SPRITES.map(sprite =>
            this.makeSprite(sprite.scale, sprite.x, sprite.y, sprite.key));

        this.music = this.sound.add('gamemusic', {
            loop: true,
            volume: 0
        });

        this.SCORE_BY_KEY = new Map(SPRITES.map(s => [s.key, s.score]));

        this.music.play();

        //fade in
        this.tweens.add({
            targets: this.music,
            volume: 1,
            duration: 1000
        });

        //borders with bodies for collision check (for backpack). made as sensor so the sprites can go through
        this.leftWall = this.matter.add.rectangle(
            x - halfW,
            y,
            this.stroke,
            boxH,
            {isStatic: true, isSensor: true}
        );

        this.rightWall = this.matter.add.rectangle(
            x + halfW,
            y,
            this.stroke,
            boxH,
            {isStatic: true, isSensor: true}
        );

        this.topWall = this.matter.add.rectangle(
            x,
            y - halfH,
            boxW,
            this.stroke,
            {isStatic: true, isSensor: true}
        );

        this.bottomWall = this.matter.add.rectangle(
            x,
            y + halfH,
            boxW,
            this.stroke,
            {isStatic: true, isSensor: true}
        );

        //this is invisible static walls to prevent sprites from being pushed out of bounds accidentally
        const {width, height} = this.scale;
        const thickness = 50;

        //left wall
        this.matter.add.rectangle(-thickness / 2, height / 2, thickness, height, {
            isStatic: true
        });

        // Right wall
        this.matter.add.rectangle(width + thickness / 2, height / 2, thickness, height, {
            isStatic: true
        });

        // Top wall
        this.matter.add.rectangle(width / 2, -thickness / 2, width, thickness, {
            isStatic: true
        });

        // Bottom wall
        this.matter.add.rectangle(width / 2, height + thickness / 2, width, thickness, {
            isStatic: true
        });

        //need a selection for labels
        this.selected = this.laptop;

        const myText = this.add.text(950, 550, 'Done?', {
            fontFamily: 'roboto',
            fontSize: '32px',
            fontWeight: '100',
            fill: 'black',
            color: '#b4f8f3',
        });

        myText.on('pointerover', () => {
            this.input.setDefaultCursor('pointer');
            myText.setStroke('#f1a6a6', 1);
        })

        myText.on('pointerout', () => {
            this.input.setDefaultCursor('default');
            myText.setStroke('#fff', 0);
        });

        //if not in the borders (fitted)
        this.warningshown = false;
        this.warning = this.add.text(600, 300, 'Overflow of objects! Remove something.', {
            fontFamily: 'roboto',
            fontSize: '48px',
            color: '#ff0000',
            backgroundColor: '#fff0f0',
            padding: {x: 10, y: 5},
            align: 'center'
        }).setOrigin(0.5).setDepth(1000);
        this.warning.setVisible(this.warningshown);

        this.timesUpText = this.add.text(600, 300, 'Times Up!', {
            fontFamily: 'roboto',
            fontSize: '32px',
            color: '#f8c7c7',
            padding: {x: 10, y: 5},
            align: 'center'
        }).setOrigin(0.5).setDepth(1000);
        this.timesUpText.setStroke('#ffffff', 2);

        const tbounds = this.timesUpText.getBounds();
        const tubg = this.add.rectangle(tbounds.centerX, tbounds.centerY, tbounds.width, tbounds.height, 0x000, 0.5);
        this.timesUpText.setVisible(false);
        tubg.setVisible(false);

        if (!this.onboarded) {
            this.onboarding = this.add.text(600, 300, GameConfiguration.onboardingText, {
                fontFamily: 'roboto',
                fontSize: '32px',
                color: '#ffffff',
                padding: {x: 10, y: 5},
                align: 'center',
                wordWrap: {
                    width: width / 1.5,
                    useAdvancedWrap: true
                }
            }).setStroke('#000', 5);
            this.onboarding.setOrigin(0.5).setDepth(100);
            const bounds = this.onboarding.getBounds();
            this.onboardingBg = this.add.rectangle(bounds.centerX, bounds.centerY, bounds.width, bounds.height, 0x000000, 0.5);

            this.onboarded = true;
        }

        this.input.on('pointerdown', () => {
            this.onboarding.setVisible(false);
            this.onboardingBg.setVisible(false);
        });

        myText.setInteractive();

        //label
        this.tooltip = this.add.text(0, 0, 'hairdryer', {
            fontFamily: 'Bebas Neue',
            fontSize: '24px',
            color: '#ffffff',
            align: 'center'
        }).setDepth(10).setVisible(false);
        this.tooltipFollow = this.hairdryer;
        this.tooltip.setShadow(1,1, '#000', 0, true, true);
        this.tooltip.setStroke('#000', 3);

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            dragY = Phaser.Math.Clamp(dragY, 0, this.scale.height);
            dragX = Phaser.Math.Clamp(dragX, 0, this.scale.width);

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

        //label and making the label follow the sprite
        this.sprites.forEach(sprite => {
            sprite.on('pointerover', () => {
                this.tooltip.setText(sprite.texture.key);
                this.tooltip.setPosition(sprite.x - sprite.displayWidth/4, sprite.y+sprite.displayHeight/3);
                this.tooltip.setVisible(true);
                this.tooltipFollow = sprite;
            });

            sprite.on('pointerout', () => {
                this.tooltip.setVisible(false);
                this.tooltipFollow = null;
            })
        });

        //showing warning. the delay is so it's not immediately destroyed so it looks like it never appeared
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

            if (!this.warningshown) {
                this.finalise();
            }
        });

        //timer
        if (GameConfiguration.timer) {
            this.timeAmount = GameConfiguration.timerType === TIMERTYPE.FORWARD ? 0 : GameConfiguration.seconds;
            this.countText = this.add.text(width/2, 0, `${this.timeAmount}`, {fontSize: '32px', fill: '#fff'});
            if (GameConfiguration.timerType === TIMERTYPE.FORWARD) {
                this.timerEvent = this.time.addEvent({
                    delay: 1000,
                    loop: true,
                    callback: () => {
                        if (this.timeAmount < GameConfiguration.seconds) {
                            this.timeAmount++;
                            this.countText.setText(`${this.timeAmount}`);
                            if (this.timeAmount === GameConfiguration.seconds) {
                                this.timerEvent.paused = true;
                                this.timesUpText.setVisible(true);
                                tubg.setVisible(true);
                                this.time.delayedCall(2000, () => {
                                    this.finalise();
                                });
                            }
                        }
                    }
                });
            } else if (GameConfiguration.timerType === TIMERTYPE.BACKWARD) {
                this.timerEvent = this.time.addEvent({
                    delay: 1000,
                    loop: true,
                    callback: () => {
                        if (this.timeAmount > 0) {
                            this.timeAmount--;
                            this.countText.setText(`${this.timeAmount}`);
                            if (this.timeAmount === 0) {
                                this.timerEvent.paused = true;
                                this.timesUpText.setVisible(true);
                                tubg.setVisible(true);
                                this.time.delayedCall(2000, () => {
                                    this.finalise();
                                });
                            }
                        }
                    }
                });
            }
        }

        this.mute = this.add.sprite(1150, 550, 'mute', null).setInteractive();
        this.mute.on('pointerdown', () => {
            if (this.mute.texture.key === 'mute') {
                this.mute.setTexture('unmute');
            } else {
                this.mute.setTexture('mute');
            }

            if (this.music.isPlaying) {
                this.music.pause();
            } else {
                this.music.resume();
            }
        });

    }

    update() {
        this.sprites.forEach(sprite => {
            const touchingLeft = this.matter.overlap(sprite, this.leftWall);
            const touchingRight = this.matter.overlap(sprite, this.rightWall);
            const touchingTop = this.matter.overlap(sprite, this.topWall);
            const touchingBottom = this.matter.overlap(sprite, this.bottomWall);

            //this checks collision properly
            const touchingBorders = new Set();
            if (touchingLeft) touchingBorders.add('left');
            if (touchingRight) touchingBorders.add('right');
            if (touchingTop) touchingBorders.add('top');
            if (touchingBottom) touchingBorders.add('bottom');

            //adding it as a set makes it easy to track
            if (touchingBorders.size > 0) {
                this.touchingBorders.set(sprite, touchingBorders);
                sprite.setTint(0xff0000);
            } else {
                this.touchingBorders.delete(sprite);
                sprite.clearTint();
            }

            const bodyBounds = sprite.body.bounds;
            const boxBounds = this.box.getBounds();

            //checking that the sprite isn't added to this.packed unless fully inside and not touching any borders
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

        //rotation logic
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey) && this.selected) {
            const Body = Phaser.Physics.Matter.Matter.Body;
            Body.setAngle(
                this.selected.body,
                this.selected.body.angle + Phaser.Math.DegToRad(90)
            );
        }
    }

    //helper method to make sprites. helpful to declutter bc there were so many sprites. made my life easier. optimisation babyyy
    makeSprite(scale, x, y, key) {
        const sprite = this.matter.add.sprite(x, y, key, null, {
            shape: this.cache.json.get('shapes')[key]
        });
        //not a runtime issue
        sprite.setScale(scale);
        sprite.setFixedRotation();
        sprite.setIgnoreGravity(true);
        sprite.setInteractive();

        this.input.setDraggable(sprite);
        sprite.setInteractive;
        sprite.on('pointerdown', () => {
            this.selected = sprite;
        })
        return sprite;
    }

    finalise() {
        let score = 0;
        let text = '';

        this.packed.forEach(p => {
            const key = p.texture?.key;
            score += this.SCORE_BY_KEY.get(key) ?? 0;
        })



        if (score < GameConfiguration.score1) {
            text = GameConfiguration.ending1;
        } else if (score >= GameConfiguration.score1 && score <= GameConfiguration.score2) {
            text = GameConfiguration.ending2;
        } else if (score >= GameConfiguration.score2 && score <= GameConfiguration.score3) {
            text = GameConfiguration.ending3;
        } else if (score >= GameConfiguration.score3 && score <= GameConfiguration.score4) {
            text = GameConfiguration.ending4;
        } else {
            text = GameConfiguration.ending5;
        }

        //if the warning isn't shown you can go to the scoring.
        if (!this.warningshown) {
            this.scene.start('ScoreScene', {score: score, text: text, packed: Array.from(this.packed), music: this.music});
        }
    }
}
