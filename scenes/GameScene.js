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
        this.gridContainer = this.add.container(this.offsetX,this.offsetY);

        this.createGridData();
        this.drawGridVisuals();
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
                this.gridContainer.add(cell);
            }
        }
    }
}