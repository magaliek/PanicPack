export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    preload() {

    }

    create() {
        this.gridCols=6;
        this.gridRows=9;
        this.cellSize = 48;
        this.grid=[];
        this.offsetX = 120;
        this.offsetY = 120;
        const gridW = this.gridCols * this.cellSize;
        const gridH = this.gridRows * this.cellSize;
        this.gridContainer = this.add.container(this.offsetX,this.offsetY);

        this.createGridData();
        this.drawGridVisuals();

        const gridZone = this.add.zone(this.offsetX,this.offsetY, gridW, gridH);
        const gridBounds = this.gridContainer.getBounds();
        console.log(gridBounds.width, gridBounds.height);
        const rect = this.add.rectangle(600, 300, this.cellSize,
                                        this.cellSize, 0xedcaad)
            .setStrokeStyle(2, 0xedbf9a)
            .setInteractive();
        this.input.setDraggable(rect);

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
           dragY= Phaser.Math.Clamp(dragY, 0, 600);
           dragX = Phaser.Math.Clamp(dragX, 0, 1200);

           gameObject.x = dragX;
           gameObject.y = dragY;
        });

        this.input.on('drop', (pointer, gameObject, dropZone) => {
            const localX = pointer.worldX - this.offsetX;
            const localY = pointer.worldY - this.offsetY;

            const col = Math.floor(localX/this.cellSize);
            const row = Math.floor(localY/this.cellSize);

            const snappedX = col * this.cellSize + this.offsetX + this.cellSize/2;
            const snappedY = row * this.cellSize + this.offsetY + this.cellSize/2;

            this.grid[row][col] = gameObject;
            if (row >=0 && row <= this.gridRows && col >= 0 && col <= this.gridCols) {
                gameObject.x = snappedX;
                gameObject.y = snappedY;
            } else {
                gameObject.x = 600;
                gameObject.y = 300;
            }
        });

    }

    createGridData() {
        for (let row=0; row<this.gridRows; row++) {
            this.grid[row] = [];
            for (let col=0; col<this.gridCols; col++) {
                this.grid[row][col] = null;
            }
        }
    }

    drawGridVisuals() {
        for (let row=0; row<this.gridRows; row++) {
            for (let col=0; col<this.gridCols; col++) {
                let x=col*this.cellSize;
                let y=row*this.cellSize;
                const cell = this.add.rectangle(x, y, this.cellSize-2, this.cellSize-2, 0xa07956);

                cell.row = row;
                cell.col = col;

                this.gridContainer.add(cell);
            }
        }
    }
}