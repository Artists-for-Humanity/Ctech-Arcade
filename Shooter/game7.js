const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;

const playerImg = new Image();
playerImg.src = "Ronaldo.png";

const enemyImg = new Image();
enemyImg.src = "Messi.png"; 

const projectile = new Image();
projectile.src = "ball.png";

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});


// player object
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 80,
  speed: 4,
  turnSpeed: 1,     // radians per second
  dx: 0,
  dy: 0,
  angle: 0,          // current facing angle (radians)
  targetAngle: 0,    // where we want to face
  turnSpeed: 10      // higher = faster smoothing
};

// state objects
const bullets = [];
const enemies = [];
let score = 0;


//highscore
let highScore = Number(localStorage.getItem("game7HighScore")) || 0;
const highScoreEl = document.getElementById("highScore");
if (highScoreEl) highScoreEl.textContent = "High Score: " + highScore;

// controls
const keys = {};
document.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
  if (e.code === "Space") { e.preventDefault(); shoot(); }
});
document.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});
document.addEventListener("click", shoot);

// helper
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function shoot() {
  // fire in the player's current facing angle
  const speed = 8;
  const bulletSize = 10;
  const bx = player.x + Math.cos(player.angle) * (player.size * 0.6);
  const by = player.y + Math.sin(player.angle) * (player.size * 0.6);
  bullets.push({
    x: bx,
    y: by,
    size:20 ,
    dx: Math.cos(player.angle) * speed,
    dy: Math.sin(player.angle) * speed
  });
}

function spawnEnemy() {
  // spawn around edges and move toward player
  const edge = Math.floor(Math.random() * 4); // 0 top,1 right,2 bottom,3 left
  let x = Math.random() * canvas.width;
  let y = Math.random() * canvas.height;
  if (edge === 0) { y = -20; }
  if (edge === 1) { x = canvas.width + 20; }
  if (edge === 2) { y = canvas.height + 20; }
  if (edge === 3) { x = -20; }

//   const speed = 1 + Math.random() * 2;
const speed = 0.5 + Math.random() * 1; // slower enemies

  enemies.push({
    x, y,
    size: 60,
    speed
  });
}

// shortest signed angular difference (a -> b)
function angleDiff(a, b) {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return d;
}

// update and draw loop
let lastTime = performance.now();

function update(dt) {
  // Face cursor
  player.angle = Math.atan2(mouseY - player.y, mouseX - player.x);

  // Move toward cursor if WASD or arrow keys are pressed
  let move = 0;
  if (keys["arrowup"] || keys["w"]) move = 1;
  if (keys["arrowdown"] || keys["s"]) move = -1;

  player.dx = Math.cos(player.angle) * player.speed * move;
  player.dy = Math.sin(player.angle) * player.speed * move;

  player.x += player.dx;
  player.y += player.dy;

  // stay in bounds
  const half = player.size / 2;
  player.x = clamp(player.x, half, canvas.width - half);
  player.y = clamp(player.y, half, canvas.height - half);


  // bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.x += b.dx;
    b.y += b.dy;
    if (b.x < -10 || b.x > canvas.width + 10 || b.y < -10 || b.y > canvas.height + 10) {
      bullets.splice(i, 1);
    }
  }



  // enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    const en = enemies[i];
    const ang = Math.atan2(player.y - en.y, player.x - en.x);
    en.x += Math.cos(ang) * en.speed;
    en.y += Math.sin(ang) * en.speed;

    // hit player?
    if (Math.hypot(player.x - en.x, player.y - en.y) < (player.size * 0.5 + en.size * 0.4)) {
      if (score > highScore) {
        highScore = score;
        localStorage.setItem("game7HighScore", highScore);
        if (highScoreEl) highScoreEl.textContent = "High Score: " + highScore;
      }
      document.location.reload();
      return;
    }

    // bullet hits enemy?
    for (let j = bullets.length - 1; j >= 0; j--) {
      const b = bullets[j];
      if (Math.hypot(b.x - en.x, b.y - en.y) < en.size * 0.5) {
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score++;
        const scoreEl = document.getElementById("score");
        if (scoreEl) scoreEl.textContent = "Score: " + score;
        break;
      }
    }
  }
}

function drawPlayer() {
  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.angle);

  // body
  // Draw player image centered
  if (playerImg.complete) {
    ctx.drawImage(playerImg, -player.size/2, -player.size/2, player.size, player.size);
  } else {
    // fallback: draw shape if image not loaded
    ctx.fillStyle = "lime";
    ctx.fillRect(-player.size/2, -player.size/2, player.size, player.size);
  }

  // gun (visible facing)
  const barrelW = player.size * 0.65;
  const barrelH = player.size * 0.18;
  ctx.fillStyle = "yellow";
  ctx.fillRect(player.size * 0.1, -barrelH/2, barrelW, barrelH);


  ctx.restore();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // bullets
    bullets.forEach(b => {
    if (projectile.complete) {
      ctx.drawImage(projectile, b.x - 10, b.y - 10, 30, 30); // 20x20 size
    } else {
      ctx.fillStyle = "yellow";
      ctx.fillRect(b.x - 3, b.y - 3, 6, 6);
    }
  });

  // enemies
    enemies.forEach(en => {
    if (enemyImg.complete) {
      ctx.drawImage(enemyImg, en.x - en.size/2, en.y - en.size/2, en.size, en.size);
    } else {
      ctx.fillStyle = "red";
      ctx.fillRect(en.x - en.size/2, en.y - en.size/2, en.size, en.size);
    }
  });

  // Player last so it draws on top
  drawPlayer();
}

function loop(now = performance.now()) {
  const dt = Math.min(0.033, (now - lastTime) / 1000); // clamp to ~30ms
  lastTime = now;

  update(dt);
  draw();
  requestAnimationFrame(loop);
}


setInterval(spawnEnemy, 1600);
loop();
