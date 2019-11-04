console.log(d3);

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
        // Increment the coordinate to simulate movement
        let x = parseFloat(this.x) + (this.xNegative ? (-0.5) : 0.5) + "";
        let y = parseFloat(this.y) + (this.yNegative ? (-0.5) : 0.5) + "";

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
}

let screen = new GameScreen();
setInterval(() => {
    screen.moveBall();
}, 0.0001);




// console.log(screen.xCoord);
// screen.moveBall();
// screen.moveBall();
// screen.moveBall();
// screen.moveBall();
// console.log(screen.xCoord);


