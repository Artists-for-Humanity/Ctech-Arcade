const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Load images
const playerImg = new Image();
playerImg.src = 'assets/mario.png';

const platformImg = new Image();
platformImg.src = 'assets/platform.png';

const backgroundImg = new Image();
backgroundImg.src = 'assets/background.png';

// Track if images are loaded
let imagesLoaded = 0;
const totalImages = 3;

playerImg.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        startGame();
    }
};

platformImg.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        startGame();
    }
};

backgroundImg.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        startGame();
    }
};

// Game constants
const GRAVITY = 0.4;
const JUMP_VELOCITY = -25;
const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 50;
const PLATFORM_WIDTH = 100;
const PLATFORM_HEIGHT = 18;
const PLATFORM_COUNT = 10;

// Player object
let player = {
    x: canvas.width / 2 - PLAYER_WIDTH / 2,
    y: canvas.height - PLAYER_HEIGHT - 10,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT,
    vy: 0,
    vx: 0,
    score: 0
};

// Platforms array
let platforms = [];

// Initialize platforms
function createPlatforms() {
    platforms = [];
    // Add multiple ground platforms at the bottom to cover the width
    let groundY = canvas.height - PLATFORM_HEIGHT;
    let numGroundPlatforms = Math.ceil(canvas.width / PLATFORM_WIDTH);
    for (let i = 0; i < numGroundPlatforms; i++) {
        platforms.push({
            x: i * PLATFORM_WIDTH,
            y: groundY,
            width: PLATFORM_WIDTH,
            height: PLATFORM_HEIGHT,
            isGround: true // Mark as ground platform
        });
    }
    
    // Add regular single-image platforms
    let spacing = (canvas.height - PLATFORM_HEIGHT) / (PLATFORM_COUNT - 1);
    for (let i = 1; i < PLATFORM_COUNT; i++) {
        let x = Math.random() * (canvas.width - PLATFORM_WIDTH);
        let y = canvas.height - PLATFORM_HEIGHT - i * spacing;
        platforms.push({ 
            x, 
            y, 
            width: PLATFORM_WIDTH, // Single image width
            height: PLATFORM_HEIGHT,
            isGround: false // Regular platform
        });
    }
}

// Reset game
function resetGame() {
    player.x = canvas.width / 2 - PLAYER_WIDTH / 2;
    player.y = canvas.height - PLAYER_HEIGHT - 10;
    player.vy = 0;
    player.score = 0;
    createPlatforms();
}

// Handle input
let keys = {};
document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);


// Game loop
function gameLoop() {
    // Move left/right
    if (keys['ArrowLeft'] || keys['a']) player.x -= 7;
    if (keys['ArrowRight'] || keys['d']) player.x += 7;

    // Apply gravity
    player.vy += GRAVITY;
    player.y += player.vy;

    // Wrap around horizontally
    if (player.x < -PLAYER_WIDTH) player.x = canvas.width;
    if (player.x > canvas.width) player.x = -PLAYER_WIDTH;

    // Platform collision (only when falling)
    for (let plat of platforms) {
        if (
            player.vy > 0 &&
            player.x + player.width > plat.x &&
            player.x < plat.x + plat.width &&
            player.y + player.height > plat.y &&
            player.y + player.height < plat.y + plat.height
        ) {
            player.vy = JUMP_VELOCITY;
            player.score++;
        }
    }

    // Scroll platforms and player up if player is high enough
    if (player.y < canvas.height / 2) {
        let diff = (canvas.height / 2) - player.y;
        player.y = canvas.height / 2;
        for (let plat of platforms) {
            plat.y += diff;
            // If platform goes off bottom, respawn at top (only for regular platforms)
            if (plat.y > canvas.height && !plat.isGround) {
                plat.x = Math.random() * (canvas.width - PLATFORM_WIDTH);
                plat.y = 0;
                plat.width = PLATFORM_WIDTH; // Ensure single image width
                plat.height = PLATFORM_HEIGHT;
                plat.isGround = false;
            }
        }
    }

    // Game over if player falls off
    if (player.y > canvas.height) {
        resetGame();
    }

    // Draw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background with reduced opacity
    ctx.globalAlpha = 0.6; // Set opacity to 60%
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1.0; // Reset opacity to full for other elements

    // Draw player
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);

    // Draw platforms
    for (let plat of platforms) {
        ctx.drawImage(platformImg, plat.x, plat.y, plat.width, plat.height);
    }

    // Draw score with black background
    ctx.font = 'bold 28px Arial';
    const scoreText = 'Score: ' + player.score;
    const textMetrics = ctx.measureText(scoreText);
    const textWidth = textMetrics.width;
    const textHeight = 28;
    const padding = 10;
    
    // Draw black rounded background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.beginPath();
    ctx.roundRect(15, 15, textWidth + padding * 2, textHeight + padding, 8);
    ctx.fill();
    
    // Draw white text
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(scoreText, 20 + padding, 40);

    requestAnimationFrame(gameLoop);
}

// Start game function (called after images load)
function startGame() {
    resetGame();
    gameLoop();
}