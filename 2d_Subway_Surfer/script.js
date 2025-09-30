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
