import {snakeDraw, update as snakeUpdate, snakeSpeed, snakeCollide} from "./snake.js"
import {foodUpdate, foodDraw} from "./food.js"
let delta = 0;

const gameBoard = document.querySelector('#gridContainer');
function GameLoop(currentTime){
    window.requestAnimationFrame(GameLoop);
    const secondsSinceLastRender = (currentTime- delta) / 1000;
    if(secondsSinceLastRender < 1 / snakeSpeed) return;
    
    console.log("render")
    delta = currentTime;

    update();
    draw(gameBoard);
}

window.requestAnimationFrame(GameLoop);


function update(){
    snakeUpdate();
    foodUpdate();
}
function draw(){
    gameBoard.innerHTML = "";
    snakeDraw(gameBoard);
    foodDraw(gameBoard);
}

