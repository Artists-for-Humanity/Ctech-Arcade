const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

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
    // Add ground platform at the very bottom
    platforms.push({
        x: 0,
        y: canvas.height - PLATFORM_HEIGHT,
        width: canvas.width,
        height: PLATFORM_HEIGHT * 1.5
    });
    let spacing = (canvas.height - PLATFORM_HEIGHT) / (PLATFORM_COUNT - 1);
    for (let i = 1; i < PLATFORM_COUNT; i++) {
        let x = Math.random() * (canvas.width - PLATFORM_WIDTH);
        let y = canvas.height - PLATFORM_HEIGHT - i * spacing;
        platforms.push({ x, y, width: PLATFORM_WIDTH, height: PLATFORM_HEIGHT });
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
            // If platform goes off bottom, respawn at top
            if (plat.y > canvas.height) {
                plat.x = Math.random() * (canvas.width - PLATFORM_WIDTH);
                plat.y = 0;
            }
        }
    }

    // Game over if player falls off
    if (player.y > canvas.height) {
        resetGame();
    }

    // Draw everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = '#43a047';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw platforms
    ctx.fillStyle = '#1976d2';
    for (let plat of platforms) {
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
    }

    // Draw score
    ctx.fillStyle = '#000';
    ctx.font = '28px Arial';
    ctx.fillText('Score: ' + player.score, 20, 40);

    requestAnimationFrame(gameLoop);
}

// Start game
resetGame();
gameLoop();