import MovingDirection from "./Movingdirection.js";

export default class Pacman {
    constructor(x,y,tileSize, velocity,tileMap){
        this.x = x;
        this.y = y;
        this.tileSize = tileSize;
        this.velocity = velocity;
        this.tileSize = tileMap;
    }
}
