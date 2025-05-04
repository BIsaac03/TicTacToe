const board = (function(){
    let layout = [];
    const width = prompt("What width?")

    const playingField = document.getElementById("board")
    const gridTemplate = '1fr '.repeat(width) + "/" + '1fr '.repeat(width);
    playingField.style.gridTemplate = gridTemplate;
    for(let i = 0; i < width*width; i++){
        const square = document.createElement("p")
        square.classList.add("square", i)
        playingField.appendChild(square);
    }

    for (let i = 0; i < width; i++){
        for (let j = 0; j < width; j++){
            layout.push({row: i, column: j, status: "Empty"});
        }
    }
    let gameState = "Ongoing";
    return {layout: layout, gameState: gameState, width: width};
})();