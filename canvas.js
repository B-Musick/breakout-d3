class GameScreen {
    constructor(array, level) {

        /***** GAME *****/
        this.level = level;
        this.score = 0;
        this.gameOver = false;
        this.win = false;

        /***** CANVAS *****/
        this.canvas = this.createCanvas();
        this.canvasWidth = this.getWidth();
        this.canvasHeight = this.getHeight();

        /***** BALL *****/

        this.x = this.canvasWidth/2+'';
        this.y = 390;
        this.xNegative = false;
        this.yNegative = true;
        this.ball = this.drawBall();

         /***** BLOCKS *****/

        this.blocks = array; // Holds which blocks are drawn
        this.blockCoordinates = []; // holds all the coordinates used to checkBallOverBlocks()
        this.blockWidth= this.setBlockWidth();
        this.blockHeight = this.setBlockHeight();
        this.blockSpacing = this.setPadding(); 

        /***** PADDLE *****/

        this.paddleWidth = '60';
        this.paddleHeight = '15';
        this.paddleX = ((parseFloat(this.canvasWidth) / 2) - this.paddleWidth / 2) + '';
        this.paddleY = '400';
        this.paddle = this.drawPaddle();

    }

    /*************************** CANVAS ***************************************/

    createCanvas() {
        let width = 600;
        let height = 500;
        let body = d3.select('body');
        let canvas
            = body.append('svg')
                .attr('width', width+'')
                .attr('height', height+'')
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

    /*************************** BALL LOGIC ***********************************/
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
        this.checkPaddleHit();

        // Set the new coordinates on the image
        d3.select("circle")
            .attr("cx", this.x)
            .attr('cy', this.y)

        this.setCoordinates(x, y);
        
    }

    /************************* CHECK WALLS ************************************/

    checkRightWall() {
        // If the ball is at the right edge of the canvas, reflect it back
        if (this.x > this.canvasWidth) this.xNegative = true; // true
    }

    checkLeftWall() {
        // If the ball is at the left edge of the canvas, reflect it back
        if (this.x < 0) this.xNegative = false; // false
    }

    checkTopWall() {
        // If the ball is at the top edge of the canvas, reflect it back
        if (this.y < 0) this.yNegative = false; // false
    }

    checkBottomWall() {
        // If the ball is at the bottom edge of the canvas, the game is over
        if (this.y > this.canvasHeight) this.gameOver = true; // true
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
        return this.canvasWidth / (this.blocks[0].length+1);
    }

    setBlockHeight() {
        // Set heights of the individual blocks trying to breakthrough
        return this.canvasHeight / (this.blocks.length*5);
    }

    setPadding(){
        // Get the rest of the space after the blocks take up their space and divide
        // it by one more than the number of blocks to get the padding space
        return (this.canvasWidth - (this.blockWidth*this.blocks[0].length)) / (this.blocks[0].length+1);
    }

    drawBlocks(){
        
        let blockCoord = [];
        for(let i=0; i< this.blocks.length; i++){
            let row = [];
            for (let j = 0; j < this.blocks[0].length; j++) {             
                    // Only print block if it hasnt been deleted from hitting it
                    let y = this.blockSpacing + (i * (this.blockHeight + this.blockSpacing)) + "";
                    let x = this.blockSpacing + (j * (this.blockWidth + this.blockSpacing)) + "";

                    // Used to be abe to determine of ball is within bounds of a block
                    row.push(this.boundsObject(x,y,i,j));
                    // Draw the block
                    this.drawBlock(x,y,i,j);
                    
            }
            blockCoord.push(row);
        }
        this.drawScoreAndLevelInfo(); 
        this.blockCoordinates = blockCoord;
        
    }

    boundsObject(xCoord,yCoord, row, col){
         // Add values which will be used to check if ball hits block and is within its bounds
        return {
            print: (this.blocks[row][col] === 1 ? true : false), // If block exists, print it
            leftX: parseFloat(xCoord),
            topY: parseFloat(yCoord),
            rightX: parseFloat(xCoord) + this.blockWidth,
            bottomY: parseFloat(yCoord) + this.blockHeight
        }
    }

    drawBlock(xCoord,yCoord,row,col){
        // Draw individual block (called in drawBlocks())
        if (this.blocks[row][col] === 1) {
            // Only draw the block if array value is 1
            d3.select('svg').append('rect')
                .attr('class','block')
                .attr('x', xCoord)
                .attr('y', yCoord)
                .attr('width', this.blockWidth + "")
                .attr('height', this.blockHeight + "")
                .style('fill', 'yellow')
        }
    }

    changeBlocks(i,j){
        // If the ball hits a certain block then remove it from the array and 
        // reprint the blocks on the screen with drawBlocks()
        // If no block has been hit
        // If ball is hitting the block then reverse movement and delete
        this.yNegative = !this.yNegative; // Move ball opposite direction
        this.blocks[i].splice(j, 1, 0); // Take out block hit
        d3.select('svg').selectAll('.block').remove(); // Remove blocks, which are redrawn in interval
        return false; // Dont continue check
    }

    checkBallOverBlocks(){
        // Called in playGame
        let continueCheck = true; // Check if should check any more blocks (if ball hits then false)
        
        for(let i=0; i < this.blockCoordinates.length;i++){
            for (let j = 0; j < this.blockCoordinates[0].length; j++) {
                // If hit a block, check ball not within bounds
                if (
                    this.blockCoordinates[i][j].print // If this block is still not hit
                    && continueCheck // If a block wasnt hit this check yet
                    && this.y < this.blockCoordinates[i][j].bottomY 
                    && this.x > this.blockCoordinates[i][j].leftX 
                    && this.x < this.blockCoordinates[i][j].rightX
                    && this.y > this.blockCoordinates[i][j].topY 
                    ){
                        continueCheck = this.changeBlocks(i, j); // Dont check any more blocks in this instance
                        this.scoreIncrement();
                        
                }
            }
        }       
        return continueCheck; // Return this so blocks are redrawn if false
    }

    /***************************** PADDLE *************************************/
    movePaddle(){
        // Paddle will follow mouse movement
        d3.select('svg').on('mousemove',()=>{
            d3.select('#paddle').remove() // Remove last location
            let xCoord = d3.event.pageX;
            this.paddleX = xCoord;
            this.drawPaddle()
            
        })
    }

    drawPaddle(){
        d3.select('svg').append('rect')
            .attr('id','paddle')
            .attr('x', this.paddleX+"")
            .attr('y', this.paddleY) // y coordinate always the same
            .attr('width', this.paddleWidth)
            .attr('height', this.paddleHeight)
            .style('fill', 'yellow')
    }

    checkPaddleHit(){
        // Check that the ball hit the paddle
        if(
            this.paddleX < this.x // Greater than the left side
            && this.y < parseFloat(this.paddleY) + parseFloat(this.paddleHeight) // Less than bottom of paddle
            && this.y > parseFloat(this.paddleY)  // Greater than top of the paddle
            && this.x < (this.paddleX+parseFloat(this.paddleWidth) // Less than right side of paddle
            
            )){
            this.yNegative = true; // Reflect ball back up
        }
        
    }

    /**************************** GAME LOGIC *********************************/
    scoreIncrement(){
        // Increment the score
        this.score += 10;
    }
    gameDone(){
        // Called in playGame and will stop game and change level when true
        // Game is over if all blocks are destroyed or ball leaves the bottom of screen (this.checkBottomWall())
        let checkBlocksGone = this.blocks.every((val1) => val1.every((val2) => val2 === 0));
        if(checkBlocksGone){
            this.win = true;
        }
        return this.gameOver || this.blocks.every((val1) => val1.every((val2) => val2 === 0));
    }

    gameWon(){
        return this.win;
    }


    drawScoreAndLevelInfo(){
        d3.select('#score-value').remove();
        // Called in drawBall()
        d3.select('svg').append('text')
            .attr('id','score-value')
            .text('SCORE: '+this.score)
            .attr('x', 10+"")
            .attr('y', (this.canvasHeight - 10)+"")
            .attr("font-size", "30")
            .style('fill', 'yellow')
            .style('z-index','1');
        
        d3.select('svg').append('text')
            .attr('id', 'level-value')
            .text('LEVEL: ' + this.level)
            .attr('x', (this.canvasWidth-150)+'')
            .attr('y', (this.canvasHeight - 10) + "")
            .attr("font-size", "30")
            .style('fill', 'yellow')
            .style('z-index', '1');
    }
}

/******************************** PLAY GAME ***********************************/
class Game{
    constructor(){
        this.level = 1;
        this.score = 0;
        this.gameOver = false;
        this.start = false;
        this.levels = {
            '1': [[1, 1, 1, 1, 1], [1, 1, 1, 1, 1]],
            '2': [[1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1]],
            '3': [[1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1]],
            '4': [[1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1]],
            '5': [[1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1]],
            '6': [[1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 1]]

        }
    }

    playGame = (array,level) => {
        let screen = new GameScreen(array, level);
        screen.drawBlocks();
        
        d3.select('svg').on('click', () => {
            d3.select('#lose-banner').remove();
            // When user clicks screen the game starts
            this.start = true;
            
        });
        // Start game logic
        let game = setInterval(() => {this.afterClick(screen)}, 1);
    }

    afterClick(screen){
        // After user clicks, this.start === true and the ball starts moving
        if (this.start) {
            screen.moveBall(); // Start moving ball

            let redraw = screen.checkBallOverBlocks(); // Check if ball hit block
            screen.checkPaddleHit(); // Check if ball hit paddle
            if (!redraw) {
                // If the ball hit a block, then redraw the board
                screen.drawBlocks();
                screen.movePaddle();
            }
            screen.movePaddle(); // Paddle follows mouse
            // If gameOver === true
            this.gameRestart(screen);
        }
    }
    gameRestart(screen){
        // This will restart the game if gameOver or switching to next level
        if (screen.gameDone()) {
            this.start = false; // Stop the game
            if(!screen.gameWon()){
                // If ball falls below bottom of screen
                this.level = 1;
                d3.select('svg').append('text')
                    .attr('id', 'lose-banner')
                    .text('YOU LOSE! CLICK TO PLAY AGAIN.')
                    .attr('x','52')
                    // .attr('x', (this.canvasWidth - 150) + '')
                    .attr('y', (d3.select('svg').attr('height')/2) + "")
                    .attr("font-size", "30")
                    .style('fill', 'yellow')
                    .style('z-index', '1');
                
                d3.select('svg').on('click',()=>{
                    d3.select('svg').remove();
                    this.startGame();
                })
                console.log('YOU LOSE!')

            }else if (screen.gameWon()) {
                this.level = this.level += 1;
                // If all blocks are hit then clear screen and move to next level
                // Move ball and paddle to center of screen
                console.log('WIN');
                d3.select('svg').remove();
                this.startGame();
            }
        }
    }

    getLevel(){
        return this.level;
    }

    startGame(){
        let game = new Game();
        // playGame([[1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1]]);
        if (game.getLevel() <= (Object.keys(this.levels).length)) {
            game.playGame(this.levels[this.level], this.level);

            d3.select('svg').append('text')
                .attr('id', 'lose-banner')
                .text('LEVEL ' + this.level + " - CLICK TO PLAY")
                .attr('x', '112')
                .attr('y', (d3.select('svg').attr('height') / 2) + "")
                .attr("font-size", "30")
                .style('fill', 'yellow')
                .style('z-index', '1');
        }
    }
}

let game = new Game();
game.startGame();








