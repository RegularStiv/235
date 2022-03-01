function update(){
    //calls the update methods
    foodUpdate();
    snake.snakeUpdate();

}
function draw(){
    //clears the board and redraws the snake and the food
    gameBoard.innerHTML = "";
    foodDraw(gameBoard);
    snake.snakeDraw(gameBoard);
}
//initializes the food
let food = {x: Math.floor(Math.random() * 25) + 1 , 
    y : Math.floor(Math.random() * 25) + 1};
function foodUpdate(){
    //on collision with the snake the food changes places and adjusts count and score
    if(snake.snakeCollide(food))
    {
        food = {x: Math.floor(Math.random() * 25) + 1 , 
            y : Math.floor(Math.random() * 25) + 1};
        count++;
        score += 5;
        //if level increase resets count position and changes speed
        if(count >= level * 5){
            levelup.play();
            snake.snakeSpeed += 2;
            level++;
            //alert('level is now: ' + level);
            count = 0;
            // snake.direction = {x: 0, y: 0};
            // snake.snakeBody =[{x: 13,y: 13}];
            snake.reset = true;
        }
        //expands the snake if it isnt reset or increase level
        if(!snake.reset)
        {
            pickup.play();
            
        }
        snake.expand();
    }
}
function foodDraw(gameboard){
    //makes the food and draws it
    const foodDiv = document.createElement('div');
    foodDiv.style.gridRowStart = food.y;
    foodDiv.style.gridColumnStart = food.x;
    foodDiv.classList.add('food');
    gameboard.appendChild(foodDiv);
}

//snake class
class Snake{
    //makes the variables
    constructor(x = 13,y = 13, snakeSpeed = 5){
        this.snakeBody = [{x,y}];
        this.snakeSpeed = snakeSpeed;
        this.direction = {x: 0, y: 0};
        this.newParts = 0;
        this.reset = false;
    }
    //checks collisions
    snakeCollide(position, isHead = false){
        return this.snakeBody.some((segment, index)=> {
            if(isHead == true && index === 0) return false;
            return (snake.samePosition(segment, position));
        })
    }
    //checks if things are in the same spot
    samePosition(pos1,pos2){
        return pos1.x === pos2.x && pos1.y === pos2.y;
    }
    //changes the new parts
    expand(){
        this.newParts += 1;
    }
    //checks collisions on itself
    selfCollide(){
            return this.snakeCollide(this.snakeBody[0], true);
    }
    //adds the parts onto the snake 
    addParts(){
        for (let i = 0; i < this.newParts; i++) {
            this.snakeBody.push({...this.snakeBody[this.snakeBody.length -1]})
        }
        this.newParts = 0;
    }

    snakeUpdate(){
        //adds parts
        this.addParts();
        //puts the snake parts to the parts infront of it
        for(let i = this.snakeBody.length - 2; i>=0;i--){
            this.snakeBody[i + 1] = { ...this.snakeBody[i] };
        }
        //console.log("plz work");
        this.snakeBody[0].x += this.direction.x;
        this.snakeBody[0].y += this.direction.y;

        //stops if ontop of itself or out of bounds
        if(this.snakeBody[0].x > 25 || this.snakeBody[0].x < 1 
            || this.snakeBody[0].y > 25 || this.snakeBody[0].y < 1)
        {
            gameover = true;
        }
        if(this.selfCollide() && !this.reset)
        {
            gameover = true;
        }
    }

    snakeDraw(gameBoard){
       //draws each segment of the snake
        this.snakeBody.forEach(segment => {
            const snakePart = document.createElement('div');
            snakePart.style.gridRowStart = segment.y;
            snakePart.style.gridColumnStart = segment.x;
            snakePart.classList.add('snake');
            gameBoard.appendChild(snakePart);
        });
    }

   
}

    //adds input availablity
    window.addEventListener('keydown', input, true);
    function input(e){
        switch (e.key){
            case('w'):
            if(snake.direction.y == 1 || snake.direction.y == -1) 
            {
                break;
            }
                snake.direction.y = -1;
                snake.direction.x = 0;
            break;
            case('a'):
            if(snake.direction.x == 1 || snake.direction.x == -1) 
            {
                break;
            }
            snake.direction.y = 0;
            snake.direction.x = -1;
            break;
            case('s'):
            if(snake.direction.y == 1 || snake.direction.y == -1) 
            {
                break;
            }
            snake.direction.y = 1;
            snake.direction.x = 0;
            break;
            case('d'):
            if(snake.direction.x == 1 || snake.direction.x == -1) 
            {
                break;
            }
            snake.direction.y = 0;
            snake.direction.x = 1;
        }
    }

    //initializes variables
    let delta = 0;
    let count = 0;
    let score = 0;
    let level = 1;
    let playing = true;
    let gameover = false
    let lose, pickup, levelup;
const gameBoard = document.querySelector('#gridContainer');
let snake = new Snake();
let highscore = 0;
//sound set up
function setup()
{
    lose = new Howl({
	src: ['sounds/lose.wav']
    });

    pickup = new Howl({
	src: ['sounds/pickup.wav']
    });

    levelup = new Howl({
	src: ['sounds/levelup.wav']
    });
}
    //if not first time the score is set to the highscore in local storage
if(localStorage.getItem("score") != null)
{
    highscore = localStorage.getItem("score");
}

//runs tghe game loop
function GameLoop(currentTime){
    //updates the animation in comparison to the snake speed
    window.requestAnimationFrame(GameLoop);
    const secondsSinceLastRender = (currentTime- delta) / 1000;
    if(secondsSinceLastRender < 1 / snake.snakeSpeed) return;
    
    delta = currentTime;

    //playing the game
    if(playing)
    {
        //if moving the snake isnt reseting
        if(snake.direction.x != 0 || snake.direction.y != 0)
        {
            snake.reset = false;
        }
        //updates and draws the screen
    update();
    draw(gameBoard);
    }
    //updates the score and the top score
    document.querySelector('#scorelevel').innerHTML = 
    "<h2>Level<br>" + level + "<br>Score<br>" + score + "</h2><br>" + "<p> DIRECTIONS: Move the green snake to collect the red food use WASD to move the snake. <br>Don't eat yourself and dont hit the walls.<br> The game will get faster for every level you beat.<br> Try to beat your old scores!";
   
    document.querySelector('#highscore').innerHTML = 
"<h1>Top Score <br>" + highscore + "</h1>"
//adjusts the top score if the score is higher than the highscore
    if(score > highscore)
    {
        highscore = score;
    }
    if(gameover){   
        //stores the highscore in localstorage if score was larger than the highscore
        if(score >= highscore)
            localStorage.setItem("score", score);
            lose.play();
        //on loss 
            if(confirm('You lost. \nYour score was: ' + score 
        +'\nLevel Reached: ' + level+ 
        '\nPress ok to restart')){
            
            //if pressed ok the game resets
            snake.snakeBody =[{x: 13,y: 13}];
            score = 0;
            level = 1;
            count = 0;
            snake.direction = {x: 0, y: 0};
            snake.snakeSpeed = 5;
            gameover = false;
            
        }
        //else it stops moving and gets rid of inputs
        else
        {
        snake.direction = {x: 0, y: 0};
        playing= false;
        gameover = false;
        }
    }
    
}
//gets the sounds working
setup();
//if playing the game the game animates and updates
if(playing)
{
window.requestAnimationFrame(GameLoop);
}
