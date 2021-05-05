import{expand,snakeCollide} from "./snake.js"

let food = {x: Math.floor(Math.random() * 25) + 1 , 
    y : Math.floor(Math.random() * 25) + 1};
export function foodUpdate(){
    if(snakeCollide(food))
    {
        expand();
        food = {x: Math.floor(Math.random() * 25) + 1 , 
            y : Math.floor(Math.random() * 25) + 1};
    }
}
export function foodDraw(gameboard){
    const foodDiv = document.createElement('div');
    foodDiv.style.gridRowStart = food.y;
    foodDiv.style.gridColumnStart = food.x;
    foodDiv.classList.add('food');
    gameboard.appendChild(foodDiv);
}
