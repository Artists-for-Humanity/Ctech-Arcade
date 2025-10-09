// filepath: /simple-jump-platformer/simple-jump-platformer/src/game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 600;

let player = {
    x: canvas.width / 2 - 15,
    y: canvas.height - 60,
    width: 30,
    height: 30,
    dy: 0,
    gravity: 0.5,
    jumpPower: -10,
    isJumping: false
};

let platforms = [];
const platformCount = 5;

function createPlatforms() {
    for (let i = 0; i < platformCount; i++) {
        platforms.push({
            x: Math.random() * (canvas.width - 60),
            y: i * 120 + 400,
            width: 60,
            height: 10
        });
    }
}

function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
    ctx.fillStyle = 'green';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y + player.height >= canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.isJumping = false;
    }

    platforms.forEach(platform => {
        if (player.y + player.height <= platform.y + platform.height &&
            player.y + player.height + player.dy >= platform.y &&
            player.x + player.width >= platform.x &&
            player.x <= platform.x + platform.width) {
            player.dy = player.jumpPower;
            player.isJumping = true;
        }
    });

    if (player.y < 0) {
        player.y = 0;
        player.dy = 0;
    }

    drawPlayer();
    drawPlatforms();
}

function jump() {
    if (!player.isJumping) {
        player.dy = player.jumpPower;
        player.isJumping = true;
    }
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        jump();
    }
});

function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

createPlatforms();
gameLoop();