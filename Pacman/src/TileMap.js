import Pacman from "./Pacman.js";
import MovingDirection from "./MovingDirection.js";

export default class TileMap {
  constructor(tileSize) {
    this.tileSize = tileSize;

    this.yellowDot = new Image();
    this.yellowDot.src = "images/yellowDot.png";

    this.pinkStar = new Image();
    this.pinkStar.src = "images/pinkStar.png"; // Power dot

    this.blueWall = new Image();
    this.blueWall.src = "images/blueWall.png";

    this.powerDotAnimateTimerDefault = 30;
    this.powerDotAnimateTimer = this.powerDotAnimateTimerDefault;
    
    this.canvas = null; // Initialize canvas property
  }

  //1 - wall
  //0 - dot
  //4 - pacman
  //5 - power dot
  //6 - empty space
  map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 5, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 5, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 4, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1],
    [1, 5, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 5, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ];

  draw(ctx) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        let tile = this.map[row][column];
        if (tile === 1) {
          this.#drawWall(ctx, column, row, this.tileSize);
        } else if (tile === 0) {
          this.#drawDot(ctx, column, row, this.tileSize);
        } else if (tile === 5) {
          this.#drawPowerDot(ctx, column, row, this.tileSize);
        }
      }
    }
  }

  #drawDot(ctx, column, row, size) {
    ctx.drawImage(
      this.yellowDot,
      column * this.tileSize,
      row * this.tileSize,
      size,
      size
    );
  }

  #drawPowerDot(ctx, column, row, size) {
    this.powerDotAnimateTimer--;
    if (this.powerDotAnimateTimer === 0) {
      this.powerDotAnimateTimer = this.powerDotAnimateTimerDefault;
    }
    const pulse = this.powerDotAnimateTimer / this.powerDotAnimateTimerDefault;
    const pulseSize = size * (0.6 + pulse * 0.4); // Pulsate between 60% and 100% size
    const offset = (size - pulseSize) / 2;

    ctx.drawImage(
      this.pinkStar,
      column * this.tileSize + offset,
      row * this.tileSize + offset,
      pulseSize,
      pulseSize
    );
  }

  #drawWall(ctx, column, row, size) {
    ctx.drawImage(
      this.blueWall,
      column * this.tileSize,
      row * this.tileSize,
      size,
      size
    );
  }

  getPacman(velocity) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        let tile = this.map[row][column];
        if (tile === 4) {
          this.map[row][column] = 0; // Replace Pac-Man's start with a dot
          return new Pacman(
            column * this.tileSize,
            row * this.tileSize,
            this.tileSize,
            velocity,
            this // Pass the tileMap instance
          );
        }
      }
    }
  }

  setCanvasSize(canvas) {
    this.canvas = canvas; // <-- STORE THE CANVAS
    this.canvas.width = this.map[0].length * this.tileSize;
    this.canvas.height = this.map.length * this.tileSize;
  }

  didCollideWithEnvironment(x, y, direction) {
    if (direction == null) {
      return;
    }

    //Check if pacman is within the bounds of the map
    if (
      x < 0 ||
      x > this.canvas.width - this.tileSize || // <-- USE this.canvas
      y < 0 ||
      y > this.canvas.height - this.tileSize // <-- USE this.canvas
    ) {
      // Simple bounds check for this map
      // A more complex map (like with tunnels) would need different logic
      return true;
    }

    //Find the next tile based on direction
    let column = 0;
    let row = 0;

    switch (direction) {
      case MovingDirection.right:
        column = Math.floor((x + this.tileSize) / this.tileSize);
        row = Math.floor(y / this.tileSize);
        break;
      case MovingDirection.left:
        column = Math.floor((x - 1) / this.tileSize); // -1 to check the tile left of the current position
        row = Math.floor(y / this.tileSize);
        break;
      case MovingDirection.up:
        row = Math.floor((y - 1) / this.tileSize); // -1 to check the tile above
        column = Math.floor(x / this.tileSize);
        break;
      case MovingDirection.down:
        row = Math.floor((y + this.tileSize) / this.tileSize);
        column = Math.floor(x / this.tileSize);
        break;
    }

    const nextTile = this.map[row][column];
    if (nextTile === 1) { // 1 is a wall
      return true;
    }
    return false;
  }

  // Check for dot/power-dot collision and "eat" it
  eatDot(x, y) {
    // Find what tile pacman is currently in
    const row = Math.floor(y / this.tileSize);
    const col = Math.floor(x / this.tileSize);

    if (row >= 0 && row < this.map.length && col >= 0 && col < this.map[0].length) {
      const tile = this.map[row][col];
      if (tile === 0) { // 0 is a dot
        this.map[row][col] = 6; // 6 is empty space
        return "dot";
      }
      if (tile === 5) { // 5 is a power dot
        this.map[row][col] = 6; // 6 is empty space
        return "powerDot";
      }
    }
    return null; // Nothing eaten
  }

  // Check if all dots are eaten
  didWin() {
    for (let r = 0; r < this.map.length; r++) {
      for (let c = 0; c < this.map[r].length; c++) {
        if (this.map[r][c] === 0 || this.map[r][c] === 5) { // Still dots or power dots left
          return false;
        }
      }
    }
    return true; // No dots left
  }
}