export default class LivingRoomScene extends Phaser.Scene {
    constructor() {
        super('LivingRoomScene');
    }

    preload() {
        this.load.image('livingroom', 'assets/livingroombg.png');
        this.load.image('table', 'assets/table.png');
        this.load.spritesheet('bubble', 'assets/speech bubble sprite.png', {
            frameWidth: 45,
            frameHeight: 45,
        });
    }

    create() {
        const w= this.scale.width;
        const h= this.scale.height;
        const tableW = (w/2)-150;
        const tableH = (h/2)+150;
        this.add.image(w/2, h/2, 'livingroom').setDisplaySize(w, h);
        this.add.image(tableW, tableH, 'table').setScale(1.25);

        this.anims.create({
            key: 'shake',
            frames: this.anims.generateFrameNumbers('bubble', {start:0, end: 7}),
            frameRate: 4,
            repeat: -1
        });
        this.bubble = this.add.sprite(tableW, tableH-75, 'bubble').setScale(2);
        this.bubble.anims.play('shake', true);

        this.cameras.main.setBackgroundColor('#cdb4db');
        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }
}