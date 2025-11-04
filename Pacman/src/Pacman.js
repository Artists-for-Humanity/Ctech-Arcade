import MovingDirection from "./MovingDirection.js";

export default class Pacman {
  constructor(x, y, tileSize, velocity, tileMap) {
    this.x = x;
    this.y = y;
    this.tileSize = tileSize;
    this.velocity = velocity;
    this.tileMap = tileMap; // Store the tileMap reference

    this.currentMovingDirection = null;
    this.requestedMovingDirection = null;

    this.pacmanAnimationTimerDefault = 10;
    this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
    this.pacmanAnimationCounter = 0;

    this.score = 0;
    this.powerDotActive = false;
    this.powerDotTimer = 0;

    document.addEventListener("keydown", this.keydown);

    // Load images for animation
    this.pacmanImages = [];
    this.pacmanImages[MovingDirection.right] = [new Image(), new Image(), new Image()];
    this.pacmanImages[MovingDirection.right][0].src = "images/pac0.png"; // Closed
    this.pacmanImages[MovingDirection.right][1].src = "images/pac1.png"; // Half open
    this.pacmanImages[MovingDirection.right][2].src = "images/pac2.png"; // Full open

    this.pacmanImages[MovingDirection.up] = [new Image(), new Image(), new Image()];
    this.pacmanImages[MovingDirection.up][0].src = "images/pacU0.png";
    this.pacmanImages[MovingDirection.up][1].src = "images/pacU1.png";
    this.pacmanImages[MovingDirection.up][2].src = "images/pacU2.png";
    
    this.pacmanImages[MovingDirection.left] = [new Image(), new Image(), new Image()];
    this.pacmanImages[MovingDirection.left][0].src = "images/pacL0.png";
    this.pacmanImages[MovingDirection.left][1].src = "images/pacL1.png";
    this.pacmanImages[MovingDirection.left][2].src = "images/pacL2.png";
    
    this.pacmanImages[MovingDirection.down] = [new Image(), new Image(), new Image()];
    this.pacmanImages[MovingDirection.down][0].src = "images/pacD0.png";
    this.pacmanImages[MovingDirection.down][1].src = "images/pacD1.png";
    this.pacmanImages[MovingDirection.down][2].src = "images/pacD2.png";
    
    // You will need to create these images (pac0, pac1, pac2, pacU0, etc.)
    // For now, we will draw a circle as a fallback.
  }

  draw(ctx, gameOver, gameWin) {
    if (gameOver || gameWin) {
      return;
    }

    // Determine which image to use for animation
    let imgIndex = this.pacmanAnimationCounter % this.pacmanImages[MovingDirection.right].length;
    let img = this.pacmanImages[this.currentMovingDirection]?.[imgIndex];

    // Fallback to drawing a circle if images are missing or not loaded
    if (!img || !img.complete || img.height === 0) {
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        
        let angle = this.getPacmanRotation(); // CHANGED
        let mouthOpen = Math.sin(this.pacmanAnimationTimer * 0.5) * 0.2 + 0.2; // Simple chomp

        ctx.save();
        ctx.translate(this.x + this.tileSize / 2, this.y + this.tileSize / 2);
        ctx.rotate(angle);
        
        ctx.arc(0, 0, this.tileSize / 2.5, mouthOpen * Math.PI, Math.PI * 2 - (mouthOpen * Math.PI));
        ctx.lineTo(0, 0); // Line to center to close the "pac-man" shape
        ctx.fill();
        ctx.restore();
    } else {
        // Draw the sprite image
        ctx.drawImage(img, this.x, this.y, this.tileSize, this.tileSize);
    }

    // Update score display in the HTML
    const scoreElement = document.getElementById("score");
    if (scoreElement) {
        scoreElement.innerText = this.score;
    }
  }

  getPacmanRotation() { // CHANGED
      switch(this.currentMovingDirection) {
          case MovingDirection.right: return 0;
          case MovingDirection.down: return Math.PI / 2;
          case MovingDirection.left: return Math.PI;
          case MovingDirection.up: return -Math.PI / 2;
          default: return 0; // Default facing right if not moving
      }
  }

  update() {
    // Animation timer
    this.pacmanAnimationTimer--;
    if (this.pacmanAnimationTimer <= 0) {
      this.pacmanAnimationTimer = this.pacmanAnimationTimerDefault;
      this.pacmanAnimationCounter = (this.pacmanAnimationCounter + 1) % 3; // Cycle through 0, 1, 2
    }

    // Handle movement
    this.handleInput(); // CHANGED
    this.move();        // CHANGED
    
    // Handle collisions / eating
    this.eatDot();      // CHANGED
  }

  keydown = (event) => { // CHANGED (no #)
    // Handle arrow key inputs
    if (event.keyCode == 38 || event.keyCode == 87) {
      // Up key or W
      if (this.currentMovingDirection !== MovingDirection.up)
        this.requestedMovingDirection = MovingDirection.up;
    } else if (event.keyCode == 40 || event.keyCode == 83) {
      // Down key or S
      if (this.currentMovingDirection !== MovingDirection.down)
        this.requestedMovingDirection = MovingDirection.down;
    } else if (event.keyCode == 37 || event.keyCode == 65) {
      // Left key or A
      if (this.currentMovingDirection !== MovingDirection.left)
        this.requestedMovingDirection = MovingDirection.left;
    } else if (event.keyCode == 39 || event.keyCode == 68) {
      // Right key or D
      if (this.currentMovingDirection !== MovingDirection.right)
        this.requestedMovingDirection = MovingDirection.right;
    }
  };

  move() { // CHANGED
    // Check if we can move in the requested direction
    if (this.requestedMovingDirection !== null && this.isAtTileCenter()) { // CHANGED
      if (!this.tileMap.didCollideWithEnvironment(this.x, this.y, this.requestedMovingDirection)) {
        this.currentMovingDirection = this.requestedMovingDirection;
      }
    }

    // If we can't move in the current direction (hit a wall), stop.
    if (this.tileMap.didCollideWithEnvironment(this.x, this.y, this.currentMovingDirection)) {
      this.currentMovingDirection = MovingDirection.none;
      return;
    }

    // Keep moving in the current direction
    switch (this.currentMovingDirection) {
      case MovingDirection.up:
        this.y -= this.velocity;
        break;
      case MovingDirection.down:
        this.y += this.velocity;
        break;
      case MovingDirection.left:
        this.x -= this.velocity;
        break;
      case MovingDirection.right:
        this.x += this.velocity;
        break;
    }
  }

  // Helper to check if Pac-Man is centered on a tile (for smooth turning)
  isAtTileCenter() { // CHANGED
      const precision = this.velocity; // Allow turning within a small range
      return (
          this.x % this.tileSize < precision &&
          this.y % this.tileSize < precision
      );
  }

  eatDot() { // CHANGED
    // Check the tile Pac-Man is currently on
    const col = Math.floor(this.x / this.tileSize);
    const row = Math.floor(this.y / this.tileSize);

    // Use a small offset to check the center of the tile
    const centerX = this.x + this.tileSize / 2;
    const centerY = this.y + this.tileSize / 2;
    
    const eatenItem = this.tileMap.eatDot(centerX, centerY);
    if (eatenItem) {
        if (eatenItem === "dot") {
            this.score += 10;
        } else if (eatenItem === "powerDot") {
            this.score += 50;
            // TODO: Add power-up logic (e.g., make ghosts vulnerable)
            // this.powerDotActive = true;
            // this.powerDotTimer = 600; // 10 seconds at 60fps
        }
    }
  }
  
  // This was missing from the previous file, adding it here.
  handleInput() { // CHANGED
    if (this.requestedMovingDirection !== null) {
      if (
        this.currentMovingDirection !== this.requestedMovingDirection &&
        !this.tileMap.didCollideWithEnvironment(
          this.x,
          this.y,
          this.requestedMovingDirection
        ) &&
        this.isAtTileCenter()
      ) {
        this.currentMovingDirection = this.requestedMovingDirection;
      }
      this.requestedMovingDirection = null;
    }
  }

  checkWin() {
    return this.tileMap.didWin();
  }
}