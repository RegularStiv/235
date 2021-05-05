
export const snakeSpeed = 5;
let direction = {x: 0, y: 0};
let newParts = 0;
const snakeBody = [{x: 11, y:11}];

    export function update(){
        addParts();
        for(let i = snakeBody.length - 2; i>=0;i--){
        
            snakeBody[i + 1] = { ...snakeBody[i] };
        }
        //console.log("plz work");
        snakeBody[0].x += direction.x;
        snakeBody[0].y += direction.y;
    }

    export function snakeDraw(gameBoard){
        //console.log("adsfjhlaks");
        snakeBody.forEach(segment => {
            const snakePart = document.createElement('div');
            snakePart.style.gridRowStart = segment.y;
            snakePart.style.gridColumnStart = segment.x;
            snakePart.classList.add('snake');
            gameBoard.appendChild(snakePart);
        });
    }

    window.addEventListener('keydown', e => {
        switch (e.key){
            case('w'):
            if(direction.y == 1 || direction.y == -1) 
            {
                break;
            }
                direction.y = -1;
                direction.x = 0;
            break;
            case('a'):
            if(direction.x == 1 || direction.x == -1) 
            {
                break;
            }
            direction.y = 0;
            direction.x = -1;
            break;
            case('s'):
            if(direction.y == 1 || direction.y == -1) 
            {
                break;
            }
            direction.y = 1;
            direction.x = 0;
            break;
            case('d'):
            if(direction.x == 1 || direction.x == -1) 
            {
                break;
            }
            direction.y = 0;
            direction.x = 1;
        }
    });
    export function snakeCollide(position){
        return snakeBody.some(segment => {
            return (samePosition(segment, position));
        })
    }
    function samePosition(pos1,pos2){
        return pos1.x === pos2.x && pos1.y === pos2.y;
    }
    export function expand(){
        newParts += 1;
    }
    
    function addParts(){
        for (let i = 0; i < newParts; i++) {
            snakeBody.push({...snakeBody[snakeBody.length -1]})
        }
        newParts = 0;
    }