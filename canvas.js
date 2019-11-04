class GameScreen {
    constructor() {
        this.canvas = this.createCanvas();
        this.canvasWidth = this.getWidth();
        this.canvasHeight = this.getHeight();
        this.x = 30;
        this.y = 400;
        this.xNegative = false;
        this.yNegative = false;
        this.ball = this.drawBall();
        this.blocks = [[1, 1, 1, 1, 1], [1, 1, 1, 1, 1]];
        this.blockCoordinates = []; // holds all the coordinates used to checkBallOverBlocks()
        this.blockWidth= this.setBlockWidth();
        this.blockHeight = this.setBlockHeight();
        this.blockSpacing = 16.66;
    
    }

    createCanvas() {
        let body = d3.select('body');
        let canvas
            = body.append('svg')
                .attr('width', '600')
                .attr('height', '500')
                .style('background-color', 'red');

        return canvas;
    }

    getWidth() {
        // Get the width of the canvas
        // Used in the checkWall() methods
        return parseFloat(d3.select('svg').attr('width'));
    }

    getHeight(){
        // Return the height of the canvas
        // Used in the checkWall methods
        return parseFloat(d3.select('svg').attr('height'));
    }

    drawBall() {
        // Used in the to draw the ball for every increment
        d3.select('svg')
            .append('circle')
            .attr('r', '10')
            .style('fill', 'yellow')
            .attr('cx', this.x + '')
            .attr('cy', this.y + "");

    }

    moveBall() {
        let increment = 1;
        // Increment the coordinate to simulate movement
        let x = parseFloat(this.x) + (this.xNegative ? (-increment) : increment) + "";
        let y = parseFloat(this.y) + (this.yNegative ? (-increment) : increment) + "";

        // Check if ball hits wall then change its coordinate direction
        this.checkRightWall();
        this.checkLeftWall();
        this.checkTopWall();
        this.checkBottomWall();

        // Set the new coordinates on the image
        d3.select("circle")
            .attr("cx", this.x)
            .attr('cy', this.y)

        this.setCoordinates(x, y);
    }

    /************************* CHECK WALLS ************************************/

    checkRightWall() {
        // If the ball is at the right edge of the canvas, reflect it back
        if (this.x > this.canvasWidth) this.xNegative = true;
    }

    checkLeftWall() {
        // If the ball is at the left edge of the canvas, reflect it back
        if (this.x < 0) this.xNegative = false;
    }

    checkTopWall() {
        // If the ball is at the top edge of the canvas, reflect it back
        if (this.y < 0) this.yNegative = false;
    }

    checkBottomWall() {
        // If the ball is at the bottom edge of the canvas, reflect it back up
        if (this.y > this.canvasHeight) this.yNegative = true;
    }

    /************************* COORDINATES ************************************/
    setCoordinates(x, y) {
        // moveBall() calls this to set the incremented coordinates
        this.x = x;
        this.y = y;
    }

    get xCoord() {
        // Return x coordinate
        return this.x;
    }
    get yCoord() {
        // Return y coordinate
        return this.y;
    }

    /************************** BLOCKS ****************************************/

    setBlockWidth() {
        // Set widths of the individual blocks trying to breakthrough
        return this.canvasWidth / 6;
    }

    setBlockHeight() {
        // Set heights of the individual blocks trying to breakthrough
        return this.canvasHeight / 30;
    }
    drawBlocks(){
        let blockCoord = [];
        for(let i=0; i< this.blocks.length; i++){
            let row = [];
            for (let j = 0; j < this.blocks[0].length; j++) {
                
                    // Only print block if it hasnt been deleted from hitting it
                    let y = this.blockSpacing + (i * (this.blockHeight + this.blockSpacing)) + "";
                    let x = this.blockSpacing + (j * (this.blockWidth + this.blockSpacing)) + "";
                    row.push({
                        // Add values which will be used to check if ball hits block
                        print: (this.blocks[i][j]===1 ? true:false), // If block exists, print it
                        leftX:parseFloat(x),
                        topY:parseFloat(y),
                        rightX:parseFloat(x)+this.blockWidth,
                        bottomY:parseFloat(y)+this.blockHeight
                    });
                if (this.blocks[i][j]===1) {
                    // Only draw the block if array value is 1
                    d3.select('svg').append('rect')
                        .attr('x', x)
                        .attr('y', y)
                        .attr('width', this.blockWidth + "")
                        .attr('height', this.blockHeight + "")
                        .style('fill', 'yellow')
                }

            }
            blockCoord.push(row);

        }
        // console.log(this.blocks)
        this.blockCoordinates = blockCoord;
        

    }

    changeBlocks(){
        // If the ball hits a certain block then remove it from the array and 
        // reprint the blocks on the screen with drawBlocks()
    }

    checkBallOverBlocks(){
        let continueCheck = true;
        
        for(let i=0; i < this.blockCoordinates.length;i++){
            for (let j = 0; j < this.blockCoordinates[0].length; j++) {
                if (this.blockCoordinates[i][j].print && continueCheck && this.y < this.blockCoordinates[i][j].bottomY && this.x > this.blockCoordinates[i][j].leftX && this.x < this.blockCoordinates[i][j].rightX ){
                    // If no block has been hit
                    // If ball is hitting the block then reverse movement and delete
                    this.yNegative = false;
                    this.blocks[i].splice(j,1,0);
                    d3.select('svg').selectAll('rect').remove();
                    continueCheck = false;
                    
                    
                }
            }
        }
        
        return continueCheck;
        

    }
}

let screen = new GameScreen();
screen.drawBlocks();
setInterval(() => {
    screen.moveBall();
    let redraw = screen.checkBallOverBlocks();
    if(!redraw){
        screen.drawBlocks();
    }
    
}, 1);





