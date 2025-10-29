// import platform from "./asset/Platform.png";

// console.log(platform)

const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')
const platformImg = new Image();
platformImg.src = "Platform.png";

const gravity = 0.5;
const score = 0;
class Enemies{
    constructor({x, spot}) {
        this.position = {
            x: x,
            y: 500
        }
        this.width = 30;
        this.height = 30;
        this.velocity = {
            x: 0,
            y: 1
        }

        this.spot = spot

        this.status = true

        this.InitialX = this.position.x
    }
    draw() {
        c.fillStyle = "red";
        c.fillRect(this.position.x,this.position.y,this.width,this.height)
    }

    update() {
   
        if (this.status) {
            this.draw();        
            this.position.y += this.velocity.y
            this.position.x += this.velocity.x

            if (this.position.y + this.height + this.velocity.y <= canvas.height)
                this.velocity.y += gravity

            // if (this.position.x <= this.InitialX - 200 ){
            if (this.position.x <= platforms[this.spot].position.x) {
                this.velocity.x += 2
            } else if (this.position.x >= platforms[this.spot].position.x + 100) {
                this.velocity.x -= 2
            }
    
            if (this.velocity.x > 1) {
                this.velocity.x = 1
            }
        } else {
            this.position.x = null
        }
    }
}
class Player{
    constructor() {
        this.position = {
            x: 100,
            y: 500,
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
    }
}
let platformBases = [new PlatformBase({ x: 520, y: 300, width: 100 }),
    new PlatformBase({ x: 640, y: 400, width: 100 }),
    new PlatformBase({ x: 750, y: 500, width: 100 }), 
    new PlatformBase({ x: 810, y: 600, width: 100 }),
    new PlatformBase({ x: 900, y: 300, width: 100 }),

]
let enemies = [new Enemies({ x: 200, spot: 1 }),
    new Enemies({ x: 450, spot: 3 }),
    new Enemies({ x: 850, spot: 5 }),
    new Enemies({ x: 1250, spot: 7 }),
    new Enemies({ x: 1650, spot: 9 })]
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

    enemies = [new Enemies({ x: 200, spot: 1 }),
    new Enemies({ x: 450, spot: 3 }),
    new Enemies({ x: 850, spot: 5 }),
    new Enemies({ x: 1250, spot: 7 }),
    new Enemies({ x: 1650, spot: 9 })]
    player = new Player()
    platforms = [new Platform({ x: 50, }),
    new Platform({ x: 250, }),
    new Platform({ x: 450 + 100 }),
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
    enemies.forEach(enemie =>{enemie.update()})
    player.update()
    movePlatform()
    handleAttack()
    // Collison Block
    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.width + platform.position.x) {
            player.velocity.y = 0
        }
       enemies.forEach(enemy => {
            if (enemy.position.y + enemy.height <= platform.position.y && enemy.position.y + enemy.height + enemy.velocity.y >= platform.position.y && enemy.position.x + enemy.width >= platform.position.x && enemy.position.x <= platform.width + platform.position.x) {
                enemy.velocity.y = 0
            }
        })
    })
    platformBases.forEach(platformBase => {
        if (player.position.y + player.height <= platformBase.position.y && player.position.y + player.height + player.velocity.y >= platformBase.position.y && player.position.x + player.width >= platformBase.position.x && player.position.x <= platformBase.width + platformBase.position.x) {
            player.velocity.y = 0
        }
    })
    // console.log(player.position.y + 10 == enemies.position.y)
    // (player.position.y + 5 == enemies.position.y)
    // (player.position.x == enemies.position.x || player.position.x == enemies.position.x + 20 || player.position.x == enemies.position.x - 20)
    // (player.velocity.y != 0)
    // console.log(player.velocity.y)

}

function movePlatform(){
if (keys.right.pressed && player.position.x < 1000) {
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
            enemies.forEach(enemy => {
                enemy.position.x -= 5
            })
        } else if (keys.left.pressed) {
            scrollOffset -= 5
            platformBases.forEach(platformBase => {
                platformBase.position.x += 5
            })
            platforms.forEach(platform => {
                platform.position.x += 5
            })
            enemies.forEach(enemy => {
                enemy.position.x += 5
            })
        }
        // platforms.forEach(platform => {
        // })
        // console.log("scrolloffset:", scrollOffset)
        // Win situation
        if (scrollOffset > 2000) {
            // console.log("You are win")
        }
        // Lose situation
        if (player.position.y > canvas.height || player.position.y < 0) {
            init()
        }

    }
}


function handleAttack() {
    enemies.forEach(enemy => {
        if (!enemy.status) return;

        const yCollision = (player.position.y + player.height) >= enemy.position.y && (player.position.y + player.height) <= enemy.position.y + enemy.height;
        const xCollision = Math.abs(player.position.x - enemy.position.x) < enemy.width; 

        if (yCollision && xCollision && player.velocity.y > 0) {
            enemy.status = false
            player.velocity.y -= 10
        } else if (xCollision && Math.abs(player.position.y - enemy.position.y) <= enemy.height && enemies.status) {
            init()
        }
    })
}


init()
animate()
addEventListener('keydown', ({ keyCode }) => {
    switch (keyCode) {
        case 65: 
            // console.log("left")
            keys.left.pressed = true;
            break
        case 68:
            // console.log("right")
            keys.right.pressed = true;
            break
        case (32 || 87): 
            // console.log("up")
            player.velocity.y -= 10
            break
        case 83:
            // console.log("down")
    }

})
addEventListener('keyup', ({ keyCode }) => {
    switch (keyCode) {
        case 65: 
            // console.log("left")
            keys.left.pressed = false;
            break
        case 68:
            // console.log("right")
            keys.right.pressed = false;
            break
        case 87: 
            // console.log("up")
            player.velocity.y -= 0
            break
        case 83:
            // console.log("down")
    }
})

