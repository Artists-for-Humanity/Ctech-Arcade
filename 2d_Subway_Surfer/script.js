function slide(){
    let width = 
    parseInt(window.getComputedStyle(player)
    .getPropertyValue("width"));
    let left = 
    parseInt(window.getComputedStyle(player)
    .getPropertyValue("left"));
    if(width=150){
        width -= 20;
        player.style.width = width + "px";
    }
    if(left % 25 === 0){
        left += 10;
        player.style.left = left + "px";
    }
    setTimeout(function() {
    width += 20;
    left -= 10;
    player.style.width = width + "px";
    player.style.left = left + "px";
    }, 1000);
}

function moveLeft(){
    let left = 
    parseInt(window.getComputedStyle(player)
    .getPropertyValue("left"));
    let width = 
    parseInt(window.getComputedStyle(player)
    .getPropertyValue("width"));
    if(width<150){
        left -= 200;
        if(left>=25){
            player.style.left = left + "px";
        }
    }
}

function moveRight(){
    let left = 
    parseInt(window.getComputedStyle(player)
    .getPropertyValue("left"));
    let width = 
    parseInt(window.getComputedStyle(player)
    .getPropertyValue("width"));
    if(width<150){
        left += 200;
        if(left<=575){
            player.style.left = left + "px";
        }
    }
}

document.addEventListener("keydown", event => {
    if(event.key==="ArrowLeft"){moveLeft();}
    if(event.key==="ArrowRight"){moveRight();}
    if(event.key==="ArrowDown"){slide();}
});

var barrier_1 = document.getElementById("barrier_1");
var barrier_2 = document.getElementById("barrier_2");
var barrier_3 = document.getElementById("barrier_3");
var counter = 0;
barrier_1.addEventListener('animationiteration', () => {
    var random = Math.floor(Math.random() * 3);
    left = 25 + random * 200;
    barrier_1.style.left = left + "px";
    counter++;
});
barrier_2.addEventListener('animationiteration', () => {
    var random = Math.floor(Math.random() * 3);
    left = 25 + random * 200;
    barrier_2.style.left = left + "px";
    counter++;
});
barrier_3.addEventListener('animationiteration', () => {
    var random = Math.floor(Math.random() * 3);
    left = 25 + random * 200;
    barrier_3.style.left = left + "px";
    counter++
})

setInterval(function(){
    var playerLeft = 
    parseInt(window.getComputedStyle(player)
    .getPropertyValue("left"));
    var barrier_1Left = 
    parseInt(window.getComputedStyle(barrier_1)
    .getPropertyValue("left"));
    var barrier_1Top = 
    parseInt(window.getComputedStyle(barrier_1)
    .getPropertyValue("top"));
    var barrier_2Left = 
    parseInt(window.getComputedStyle(barrier_2)
    .getPropertyValue("left"));
    var barrier_2Top = 
    parseInt(window.getComputedStyle(barrier_2)
    .getPropertyValue("top"));
    var barrier_3Left = 
    parseInt(window.getComputedStyle(barrier_3)
    .getPropertyValue("left"));
    var barrier_3Top = 
    parseInt(window.getComputedStyle(barrier_3)
    .getPropertyValue("top"));
    if(playerLeft == barrier_1Left && 
        barrier_1Top<900&& 
        barrier_1Top>650){
        alert("Game Over. Score: " + counter);
        barrier_1.style.animation = "none";
        barrier_2.style.animation = "none";
        barrier_3.style.animation = "none";
        }
    if(playerLeft == barrier_2Left &&
        barrier_2Top<900&&
        barrier_2Top>450){
        alert("Game Over. Score:" + counter);
        barrier_2.style.animation = "none";
        barrier_1.style.animation = "none";
        barrier_3.style.animation = "none";
        }
    if(playerLeft == barrier_3Left &&
        barrier_3Top<900&&
        barrier_3Top>350){
        alert("Game Over. Score:" + counter);
        barrier_3.style.animation = "none";
        barrier_2.style.animation = "none"
        barrier_1.style.animation = "none";
        }
    
} ,1);