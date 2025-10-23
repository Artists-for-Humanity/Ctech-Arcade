const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const keys = {};
window.addEventListener("keydown", (e) => (keys[e.key.toLowerCase()] = true));
window.addEventListener("keyup", (e) => (keys[e.key.toLowerCase()] = false));

let bgX = 0;
const bgImg = new Image();
bgImg.src = "background.png";
//"https://cdn.gamedevmarket.net/wp-content/uploads/20191203192024/Desert.png";

class Player {
  constructor() {
    this.x = 150;
    this.y = 600;
    this.w = 90;
    this.h = 100;
    this.vx = 0;
    this.vy = 0;
    this.speed = 6;
    this.jumpPower = 16;
    this.onGround = false;
    this.health = 100;
    this.bullets = [];
    this.cooldown = 0;
    this.image = new Image();
    this.image.src = "Player.png";
  }

  update() {
    const left = keys["a"] || keys["arrowleft"];
    const right = keys["d"] || keys["arrowright"];
    const jump = keys["w"] || keys["arrowup"];
    const shoot = keys[" "] || keys["shift"];

    this.vx = 0;
    if (left) this.vx = -this.speed;
    if (right) this.vx = this.speed;

    // Jump
    if (jump && this.onGround) {
      this.vy = -this.jumpPower;
      this.onGround = false;
    }

    // Shooting
    if (shoot && this.cooldown <= 0) {
      this.shoot();
      this.cooldown = 15;
    }
    if (this.cooldown > 0) this.cooldown--;

    // Gravity
    this.vy += 0.8;
    this.x += this.vx;
    this.y += this.vy;

    if (this.y + this.h >= 700) {
      this.y = 700 - this.h;
      this.vy = 0;
      this.onGround = true;
    }

    this.x = Math.max(0, Math.min(canvas.width - this.w, this.x));

    this.bullets.forEach((b) => b.update());
    this.bullets = this.bullets.filter((b) => !b.offscreen);
  }

  shoot() {
    this.bullets.push(new Bullet(this.x + this.w - 10, this.y + this.h / 2));
  }

  draw() {
    if (this.image.complete) {
      ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    } else {
      ctx.fillStyle = "#3af";
      ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    this.bullets.forEach((b) => b.draw());
  }
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 20;
    this.h = 10;
    this.speed = 10;
    this.offscreen = false;
    this.image = new Image();
    this.image.src = "Group 2.png";
  }

  update() {
    this.x += this.speed;
    if (this.x > canvas.width) this.offscreen = true;
  }

  draw() {
    if (this.image.complete) {
      ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = "yellow";
      ctx.fill();
    }
  }
}

class Boss {
  constructor() {
    this.x = 850;
    this.y = 580;
    this.w = 200;
    this.h = 130;
    this.hp = 150;
    this.image = new Image();
    this.image.src = "enemy.png";
    this.bullets = [];
    this.cooldown = 0;
    this.flashTimer = 0;
  }

  update(player) {
    if (this.hp <= 0) return;

    if (this.cooldown <= 0) {
      this.shoot(player);
      this.cooldown = 100;
    } else {
      this.cooldown--;
    }

    if (this.flashTimer > 0) this.flashTimer--;

    this.bullets.forEach((b) => b.update());
    this.bullets = this.bullets.filter((b) => !b.offscreen);
  }

  shoot(player) {
    this.bullets.push(
      new BossBullet(this.x, this.y + this.h / 2, player.x, player.y)
    );
  }

  draw() {
    if (this.flashTimer > 0) {
      ctx.fillStyle = "red";
      ctx.fillRect(this.x, this.y, this.w, this.h);
    } else if (this.image.complete) {
      ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    } else {
      ctx.fillStyle = "darkred";
      ctx.fillRect(this.x, this.y, this.w, this.h);
    }

    this.bullets.forEach((b) => b.draw());
  }
}

class BossBullet {
  constructor(x, y, targetX, targetY) {
    this.x = x;
    this.y = y;
    this.r = 10;
    const dx = targetX - x;
    const dy = targetY - y;
    const len = Math.sqrt(dx * dx + dy * dy);
    this.vx = (dx / len) * 4;
    this.vy = (dy / len) * 4;
    this.offscreen = false;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width || this.y > canvas.height)
      this.offscreen = true;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = "orange";
    ctx.fill();
  }
}

function collides(a, b) {
  // Circle vs rect
  if (a.r !== undefined) {
    return (
      a.x + a.r > b.x &&
      a.x - a.r < b.x + b.w &&
      a.y + a.r > b.y &&
      a.y - a.r < b.y + b.h
    );
  } else {
    return (
      a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
    );
  }
}

const player = new Player();
const boss = new Boss();

let gameOver = false;
let win = false;

function update() {
  if (gameOver || win) return;

  player.update();
  boss.update(player);

  if (keys["d"] || keys["arrowright"]) bgX -= 2;
  if (keys["a"] || keys["arrowleft"]) bgX += 2;
  if (bgX <= -canvas.width) bgX = 0;
  if (bgX >= canvas.width) bgX = 0;

  player.bullets.forEach((b) => {
    if (collides(b, boss)) {
      boss.hp -= 5;
      b.offscreen = true;
      boss.flashTimer = 10;
      if (boss.hp <= 0) {
        boss.hp = 0;
        win = true;
      }
    }
  });

  boss.bullets.forEach((b) => {
    if (collides(b, player)) {
      player.health -= 10;
      b.offscreen = true;
      if (player.health <= 0) {
        player.health = 0;
        gameOver = true;
      }
    }
  });
}

function drawHUD() {
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(20, 20, 200, 30);
  ctx.fillRect(canvas.width - 220, 20, 200, 30);

  // Player Health
  ctx.fillStyle = "lime";
  ctx.fillRect(20, 20, (player.health / 100) * 200, 30);
  ctx.strokeStyle = "white";
  ctx.strokeRect(20, 20, 200, 30);
  ctx.fillStyle = "white";
  ctx.font = "18px sans-serif";
  ctx.fillText(`Health: ${player.health}`, 30, 42);

  ctx.fillStyle = "red";
  ctx.fillRect(canvas.width - 220, 20, (boss.hp / 150) * 200, 30);
  ctx.strokeStyle = "white";
  ctx.strokeRect(canvas.width - 220, 20, 200, 30);
  ctx.fillStyle = "white";
  ctx.fillText(`Boss HP: ${boss.hp}`, canvas.width - 210, 42);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Background
  ctx.drawImage(bgImg, bgX, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImg, bgX + canvas.width, 0, canvas.width, canvas.height);

  // Ground
  ctx.fillStyle = "#5ba985";
  ctx.fillRect(0, 700, canvas.width, 50);

  player.draw();
  boss.draw();
  drawHUD();

  if (gameOver || win) {
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = win ? "gold" : "red";
    ctx.font = "70px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      win ? "Boss Defeated!" : "Game Over!",
      canvas.width / 2,
      canvas.height / 2
    );
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

bgImg.onload = () => loop();
