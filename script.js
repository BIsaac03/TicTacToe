class Player{
    constructor(name, symbol, first){
        this.name = name;
        this.symbol = symbol;
        this.isMyTurn = first;
    }
}

const player1 = new Player('Sarah', 'X', true);
const player2 = new Player('Nadezhda', 'O', false);

const board = (function(){
    const layout = [];
    let gameState = "Ongoing";

    const clearBoard = () => {
        for (let i = 0; i < layout.length; i++){
            layout[i].status = "Empty"
            let square = document.querySelector(`.${CSS.escape(i)}`);
            square.textContent = "";
            square.style.fontWeight = '400';
        }
        gameState = "Ongoing";
    }

    const markSquare = (square) => {
        if(player1.isMyTurn){
            activePlayer = player1;
        }
        else {activePlayer = player2};   
    
        if (layout[square].status != "Empty"){
            console.log("Square already marked!");
            return 1;
        }
    
        player1.isMyTurn = !player1.isMyTurn;
        player2.isMyTurn = !player2.isMyTurn;
    
        layout[square].status = activePlayer.symbol;
        let squareDOM = document.querySelector(`.${CSS.escape(square)}`);
        squareDOM.textContent = activePlayer.symbol;
        displayResults(square, activePlayer);
    }

    const checkWin = (move, activePlayer) => {
        let width = Math.sqrt(layout.length);
        let columnCheck = layout[move].column;
        let rowCheck = layout[move].row;
        let winningLine = [];

        // check for column win
        for (let i = 0; i < width; i++){
            if (layout[i*width + columnCheck].status != activePlayer.symbol){
                winningLine.length = 0;
                break;
            }
            winningLine.push(i*width + columnCheck);
            if (i == width - 1){
                console.log("WON")
                return {result: "Win", winner: activePlayer.name, winningLine: winningLine};
            }
        }

        // check for row win
        for (let i = 0; i < width; i++){
            if (layout[i + rowCheck*width].status != activePlayer.symbol){
                winningLine.length = 0;
                break;
            }
            winningLine.push(i + rowCheck*width);
            if (i == width - 1){
                return {result: "Win", winner: activePlayer.name, winningLine: winningLine};
            }
        }

        // check for diagonal win
        if (columnCheck == rowCheck){
            for (let i = 0; i < width; i++){
                if (layout[i*width + i].status != activePlayer.symbol){
                    winningLine.length = 0;
                    break;
                }
                winningLine.push(i*width + i);
                if (i == width - 1){
                    return {result: "Win", winner: activePlayer.name, winningLine: winningLine};
                }
            }
        }
        if (columnCheck == width - 1 - rowCheck){
            for (let i = 0; i < width; i++){
                if (layout[width*(width - i) - width + i].status != activePlayer.symbol){
                    winningLine.length = 0;
                    break;
                }
                winningLine.push(width*(width - i) - width + i);
                if (i == width - 1){
                    return {result: "Win", winner: activePlayer.name, winningLine: winningLine};
                }
            }
        }

        //check for tie
        const blankSquare = layout.find((square) => square.status == "Empty")
        if (blankSquare == undefined) {
            return {result: "Tie"};
        }

        return "Ongoing";
    }

    const displayResults = (square, activePlayer) => {
        gameState =  checkWin(square, activePlayer);
        const winningLine = [];
        if (gameState != "Ongoing"){
            if (gameState.result == "Tie"){
                console.log("No more valid moves. Tie game!");
            }
            for (let i = 0; i < Math.sqrt(layout.length); i++){
                winningLine.push(document.querySelector(`.${CSS.escape(gameState.winningLine[i])}`));
            }
            for(let i = 0; i < winningLine.length; i++){
                winningLine[i].style.fontWeight = 'bold';
            } 
        }
    }

    const createBoard = (width) => {
        layout.length = 0;
        const playingField = document.getElementById("board")
        playingField.innerHTML = "";

        width = prompt("What width?")
        let gridTemplate = '1fr '.repeat(width) + "/" + '1fr '.repeat(width[0]);
        playingField.style.gridTemplate = gridTemplate;
        for (let i = 0; i < width; i++){
            for (let j = 0; j < width; j++){
                layout.push({row: i, column: j, status: "Empty"});
            }
        }
        for(let i = 0; i < width*width; i++){
            const square = document.createElement("p")
            square.classList.add("square", i)
            playingField.appendChild(square);
            square.addEventListener("click", function(){
                if (gameState == "Ongoing"){
                    markSquare(i);
                }
            });
        }

        gameState = "Ongoing"
    }

    return {clearBoard, createBoard};
})();

board.createBoard(3)

const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", () => {board.clearBoard()}); 

const resizeButton = document.getElementById("resize");
resizeButton.addEventListener("click", () => {board.createBoard()});