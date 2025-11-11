import TileMap from "./TileMap.js";

const tileSize = 32;
const velocity = 2; // Pac-Man's speed

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const tileMap = new TileMap(tileSize);
const pacman = tileMap.getPacman(velocity);

const gameStatusEl = document.getElementById("game-status");

let gameOver = false;
let gameWin = false;

function gameLoop(){
    // 1. Update game state
    if (!gameOver && !gameWin) {
        pacman.update();
        checkGameEnd();
    }

    // 2. Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 3. Draw game elements
    tileMap.draw(ctx);
    pacman.draw(ctx, gameOver, gameWin); // Pass game state to draw function

    // 4. Display Game Over or Win Message
    if (gameWin) {
        displayGameStatus("You Win!");
    }
    // Note: gameOver condition is not set here, as there are no ghosts yet.
}

function checkGameEnd() {
    // Check for win
    if (!gameWin && tileMap.didWin()) {
        gameWin = true;
    }
    
    // TODO: Add game over check (e.g., collision with ghosts)
    // if (pacman.lives <= 0) {
    //     gameOver = true;
    // }
}

function displayGameStatus(text) {
    if(gameStatusEl) {
        gameStatusEl.textContent = text;
    }
}


tileMap.setCanvasSize(canvas);
// Set the game loop to run 60 times per second
setInterval(gameLoop, 1000 / 60);