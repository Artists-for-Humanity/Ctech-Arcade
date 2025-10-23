// import platform from "./asset/Platform.png";

// console.log(platform)

const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')

console.log(c);

const gravity = 0.5;
const score = 0;
class Enemies{
    constructor() {
        this.position = {
            x: 400,
            y: 500
        }
        this.width = 30;
        this.height = 30;
        this.velocity = {
            x: -1,
            y: 1
        }
    }
    draw() {
        c.fillStyle = "red";
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
    }

    update() {
        this.draw();
        
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        if (this.position.y + this.height + this.velocity.y <= canvas.height) 
            this.velocity.y += gravity

    }
}
class Player{
    constructor() {
        this.position = {
            x: 100,
            y: 100,
        }
        this.velocity = {
            x:0,
            y:1,
        }
        
        this.width = 30;
        this.height = 30;
    }

    draw() {
    c.fillStyle = "green";
     c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.draw()
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        if (this.position.y + this.height + this.velocity.y <= canvas.height) 
            this.velocity.y += gravity

    }
}

class Platform{
    constructor({x}) {
        this.position = {
            x: x,
            y: 600,
        }
        this.width = 200
        this.height = 20

    }

    
    draw() {
        c.fillStyle = "blue";
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
        console.log("Have been set")
    }
}

class PlatformBase{
    constructor({x,y, width}) {
        this.position = {
            x: x,
            y: y,
        }
        this.width = width
        this.height = 20

    }

    
    draw() {
        c.fillStyle = "blue";
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
        console.log("Have been set")
    }
}
let platformBases = [new PlatformBase({ x: 520, y: 300, width: 100 }),
    new PlatformBase({ x: 640, y: 400, width: 100 }),
    new PlatformBase({ x: 750, y: 500, width: 100 }), 
    new PlatformBase({ x: 810, y: 600, width: 100 }),
    new PlatformBase({ x: 900, y: 300, width: 100 }),

]
    let enemies = new Enemies()
    let player = new Player()
    let platforms = [new Platform({ x: 50, }),
    new Platform({ x: 250, }),
    new Platform({ x: 450, }),
    new Platform({ x: 650, }),
    new Platform({ x: 850, }),
    new Platform({ x: 1050, }),
    new Platform({ x: 1250, }),
    new Platform({ x: 1450, }),
    new Platform({ x: 1650, }),
    new Platform({ x: 1850, })]
        

    let keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        }
    }

    let scrollOffset = 0
function init() {
    platformBases = [new PlatformBase({ x: 520, y: 300, width: 100 }),
    new PlatformBase({ x: 640, y: 400, width: 100 }),
    new PlatformBase({ x: 750, y: 500, width: 100 }), 
    new PlatformBase({ x: 810, y: 600, width: 100 }),
    new PlatformBase({ x: 900, y: 300, width: 100 }),]

     enemies = new Enemies()
     player = new Player()
     platforms = [new Platform({ x: 50, }),
    new Platform({ x: 250, }),
    new Platform({ x: 450 + 100, }),
    new Platform({ x: 650, }),
    new Platform({ x: 850, }),
    new Platform({ x: 1050, }),
    new Platform({ x: 1250, }),
    new Platform({ x: 1450, }),
    new Platform({ x: 1650, }),
    new Platform({ x: 1850 + 200, }),
    new Platform({ x: 200 * 10, }),
    new Platform({ x: 200 * 11, }),
    new Platform({ x: 200 * 12, }),
    new Platform({ x: 200 * 13, }),
    new Platform({ x: 200 * 14, })]
 

     keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        }
    }

     scrollOffset = 0
}
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)
    platforms.forEach(platform => {
        platform.draw()
    })
    platformBases.forEach(PlatformBase => {
        PlatformBase.draw()
    })
    enemies.update()
    player.update()
    if (keys.right.pressed && player.position.x <  500) {
        player.velocity.x = 5
    } else if (keys.left.pressed && player.position.x > 100) {
        player.velocity.x = -5
    } else {
        player.velocity.x = 0

        if (keys.right.pressed) {
            scrollOffset += 5
            platformBases.forEach(platformBase => {
                platformBase.position.x -= 5
            })
            platforms.forEach(platform => {
                platform.position.x -= 5
            })
        } else if (keys.left.pressed) {
            scrollOffset -= 5
            platformBases.forEach(platformBase => {
                platformBase.position.x += 5
            })
            platforms.forEach(platform => {
                platform.position.x += 5
            })
        }
        console.log(scrollOffset)
        // Win situation
        if (scrollOffset > 2000) {
            console.log("You are win")
        }
        // Lose situation
        if (player.position.y > canvas.height || player.position.y < 0) {
            init()
        }

    }
    // Collison Block
    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.width + platform.position.x) {
            player.velocity.y = 0
        }
        if (enemies.position.y + enemies.height <= platform.position.y && enemies.position.y + enemies.height + enemies.velocity.y >= platform.position.y && enemies.position.x + enemies.width >= platform.position.x && enemies.position.x <= platform.width + platform.position.x) {
            enemies.velocity.y = 0
        }
        console.log("go")
    })
    platformBases.forEach(platformBase => {
        if (player.position.y + player.height <= platformBase.position.y && player.position.y + player.height + player.velocity.y >= platformBase.position.y && player.position.x + player.width >= platformBase.position.x && player.position.x <= platformBase.width + platformBase.position.x) {
            player.velocity.y = 0
        }
        if (enemies.position.y + enemies.height <= platformBase.position.y && enemies.position.y + enemies.height + enemies.velocity.y >= platformBase.position.y && enemies.position.x + enemies.width >= platformBase.position.x && enemies.position.x <= platformBase.width + platformBase.position.x) {
            enemies.velocity.y = 0
        }
        console.log("go")
    })
}
init()
animate()

addEventListener('keydown', ({ keyCode }) => {
    console.log(keyCode)
    switch (keyCode) {
        case 65: 
            console.log("left")
            keys.left.pressed = true;
            break
        case 68:
            console.log("right")
            keys.right.pressed = true;
            break
        case (32 || 87): 
            console.log("up")
            player.velocity.y -= 10
            break
        case 83:
            console.log("down")
    }
    console.log(keys.right.pressed);
})
addEventListener('keyup', ({ keyCode }) => {
    console.log(keyCode)
    switch (keyCode) {
        case 65: 
            console.log("left")
            keys.left.pressed = false;
            break
        case 68:
            console.log("right")
            keys.right.pressed = false;
            break
        case 87: 
            console.log("up")
            player.velocity.y -= 0
            break
        case 83:
            console.log("down")
    }
    console.log(keys.right.pressed);
})