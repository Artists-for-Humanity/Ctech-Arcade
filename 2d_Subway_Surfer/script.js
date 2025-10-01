function moveLeft(){
    let left = 
    parseInt(window.getComputedStyle(player)
    .getPropertyValue("left"));
    left -= 200;
    if(left>=25){
        player.style.left = left + "px";
    }
}

function moveRight(){
    let left = 
    parseInt(window.getComputedStyle(player)
    .getPropertyValue("left"));
    left += 200;
    if(left<=575){
        player.style.left = left + "px";
    }
}

document.addEventListener("keydown", event => {
    if(event.key==="ArrowLeft"){moveLeft();}
    if(event.key==="ArrowRight"){moveRight();}
});

var block = document.getElementById("barrier_1");
var counter = 0;
barrier_1.addEventListener('animationiteration', () => {
    var random = Math.floor(Math.random() * 3);
    left = random * 200;
    block.style.left = left + "px";
    counter++;
});

setInterval(function(){
    var playerLeft = 
    parseInt(window.getComputedStyle(player)
    .getPropertyValue("left"));
    var blockLeft = 
    parseInt(window.getComputedStyle(block)
    .getPropertyValue("left"));
    var blockTop = 
    parseInt(window.getComputedStyle(block)
    .getPropertyValue("top"));
    if(playerLeft == blockLeft && blockTop<900&& blockTop>600){
        alert("Game Over. Score: " + counter)
        block.style.animation = "none";
    }
}, 1);