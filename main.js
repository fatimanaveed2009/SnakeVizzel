// 🐍 Game Constants & Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');

let speed = 7;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

// 🎯 High Score Logic
let highScore = localStorage.getItem("highScore") ? JSON.parse(localStorage.getItem("highScore")) : 0;
const board = document.getElementById("board");
const scoreBox = document.getElementById("scoreBox");
const hiscoreBox = document.getElementById("hiscoreBox");

hiscoreBox.innerHTML = "High Score: " + highScore;

// 🎮 Main Game Loop
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

// 🚨 Check for Collision
function isCollide(snake) {
    // Snake collides with itself
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            return true;
        }
    }
    // Snake collides with walls
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) {
        return true;
    }
    return false;
}

// 🎮 Game Engine
function gameEngine() {
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        alert("Game Over! Press any key to restart.");

        // ✅ Update High Score
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", JSON.stringify(highScore));
            hiscoreBox.innerHTML = "High Score: " + highScore;
        }

        // Reset Game
        inputDir = { x: 0, y: 0 };
        score = 0;
        scoreBox.innerHTML = "Score: " + score;
        snakeArr = [{ x: 13, y: 15 }];
        return;
    }

    // 🍎 Food Collision
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score += 1;
        scoreBox.innerHTML = "Score: " + score;

        // ✅ Update High Score if needed
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", JSON.stringify(highScore));
            hiscoreBox.innerHTML = "High Score: " + highScore;
        }

        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });

        let a = 2, b = 16;
        food = { x: Math.floor(a + (b - a) * Math.random()), y: Math.floor(a + (b - a) * Math.random()) };
    }

    // 🐍 Move the Snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // 🏗️ Display Snake & Food
    board.innerHTML = "";

    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// 🚀 Start Game When Page Loads
document.addEventListener("DOMContentLoaded", () => {
    window.requestAnimationFrame(main);
});

// 🎹 Control Snake Movement
window.addEventListener('keydown', e => {
    if (musicSound.paused) {
        musicSound.play().catch(err => console.log("Autoplay blocked:", err));
    }

    moveSound.play();
    
    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y === 0) { // Prevent reversing direction
                inputDir.x = 0;
                inputDir.y = -1;
            }
            break;
        case "ArrowDown":
            if (inputDir.y === 0) {
                inputDir.x = 0;
                inputDir.y = 1;
            }
            break;
        case "ArrowLeft":
            if (inputDir.x === 0) {
                inputDir.x = -1;
                inputDir.y = 0;
            }
            break;
        case "ArrowRight":
            if (inputDir.x === 0) {
                inputDir.x = 1;
                inputDir.y = 0;
            }
            break;
    }
});
