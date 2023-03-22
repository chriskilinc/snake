//  Board
const blockSize = 25;
const rows = 20;
const columns = 30;
let board;
let context;
let gameOver = false;

//  Snake
let snakeX;
let snakeY;

let velocityX = 0;
let velocityY = 0;

const snakeBody = [];

//  Food
let foodX;
let foodY;

const getRandomCoordinate = (axisLength) => {
    return Math.floor(Math.random() * axisLength) * blockSize;;
}

const calculateFoodCoordinates = () => {
    foodX = getRandomCoordinate(columns);
    foodY = getRandomCoordinate(rows);

    if (foodX === snakeX && foodY === snakeY) {
        calculateFoodCoordinates();
    }
}

const calculateSnakeStart = () => {
    snakeX = getRandomCoordinate(columns);
    snakeY = getRandomCoordinate(rows);
}

const handleInput = (event) => {
    //  Move snake
    if (event.code == "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (event.code == "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (event.code == "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    }
    else if (event.code == "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }

    //  Reset Game
    if (event.code == "Space" && gameOver) {
        resetGame();
    }
}

const update = () => {
    const score = document.getElementById("score");
    score.innerText = `SCORE: ${snakeBody.length}`

    if (gameOver) {
        const messages = document.getElementById("messages");
        messages.classList.add("visible");
        return;
    }

    //  Background
    context.fillStyle = "#000";
    context.fillRect(0, 0, board.width, board.height);

    //  Place food
    context.fillStyle = "#FF5900";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    //  Ate food
    if (foodX === snakeX && foodY === snakeY) {
        snakeBody.push([foodX, foodY]);
        calculateFoodCoordinates();
    }

    //  Move snake
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    //  Draw Snake
    context.fillStyle = "#00FF00";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize);
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize)
    }

    //  GameOver:   Out of bounds 
    if (snakeX < 0 || snakeX > columns * blockSize - 1 || snakeY < 0 || snakeY > rows * blockSize - 1) {
        gameOver = true;
    }

    //  GameOver:   Ate itself
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
            gameOver = true;
        }
    }
}

const resetGame = () => {
    gameOver = false;
    snakeBody.length = 0;
    velocityX = 0;
    velocityY = 0;

    calculateSnakeStart();
    calculateFoodCoordinates();

    const messages = document.getElementById("messages");
    messages.classList.remove("visible");
}

window.onload = () => {
    board = document.getElementById("canvas");
    board.height = rows * blockSize;
    board.width = columns * blockSize;
    context = board.getContext("2d");

    calculateSnakeStart();
    calculateFoodCoordinates();

    document.addEventListener("keyup", handleInput);

    setInterval(update, 100);
}
