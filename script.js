class Player{
    constructor(name, symbol, first){
        this.name = name;
        this.symbol = symbol;
        this.isMyTurn = first;
    }
}

const player1 = new Player('Player 1', 'X', true);
const player2 = new Player('Player 2', 'O', false);

const board = (function(){
    const layout = [];
    let gameState = "Ongoing";

    const createBoard = (width) => {
        clearBoard();
        layout.length = 0;
        const playingField = document.getElementById("board")
        playingField.innerHTML = "";

        width = prompt("How many squares wide should the game be?")
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
                return {result: "Win", winner: activePlayer, winningLine: winningLine};
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
                return {result: "Win", winner: activePlayer, winningLine: winningLine};
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
                    return {result: "Win", winner: activePlayer, winningLine: winningLine};
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
                    return {result: "Win", winner: activePlayer, winningLine: winningLine};
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
        const winningMessage = document.getElementById("winningMessage");
        const winningLine = [];
        if (gameState != "Ongoing"){
            if (gameState.result == "Tie"){
                winningMessage.textContent = ("No more valid moves. Tie game!");
            }

            else{
                for (let i = 0; i < Math.sqrt(layout.length); i++){
                    winningLine.push(document.querySelector(`.${CSS.escape(gameState.winningLine[i])}`));
                }
                for(let i = 0; i < winningLine.length; i++){
                    winningLine[i].style.fontWeight = 'bold';
                    winningLine[i].style.fontSize = '80px';
                }
                
                winningMessage.textContent = (gameState.winner.name + " wins!");
                if (gameState.winner == player1){
                    const winnerBanner = document.getElementById("victory1");
                    winnerBanner.textContent = "WINNER!"
                }
                else{
                    const winnerBanner = document.getElementById("victory2");
                    winnerBanner.textContent = "WINNER!"
                }
            }  
        }
    }

    const clearBoard = () => {
        for (let i = 0; i < layout.length; i++){
            layout[i].status = "Empty"
            let square = document.querySelector(`.${CSS.escape(i)}`);
            square.textContent = "";
            square.style.fontWeight = '400';
            square.style.fontSize = '64px';
        }
        gameState = "Ongoing";

        const winningMessage = document.getElementById("winningMessage");
        winningMessage.textContent = "";
        const victoryBanner = document.getElementsByClassName("victory");
        victoryBanner[0].textContent = "";
        victoryBanner[1].textContent = "";
    }

    return {clearBoard, createBoard};
})();

board.createBoard(3);

const clearButton = document.getElementById("clear");
clearButton.addEventListener("click", () => {board.clearBoard()}); 

const resizeButton = document.getElementById("resize");
resizeButton.addEventListener("click", () => {board.createBoard()});

const player1Name = document.getElementById("name1");
player1Name.addEventListener("change", () => {player1.name = player1Name.value});

const player1Symbol = document.getElementById("symbol1");
player1Symbol.addEventListener("change", () => {player1.symbol = player1Symbol.value});

const player2Name = document.getElementById("name2");
player2Name.addEventListener("change", () => {player2.name = player2Name.value});

const player2Symbol = document.getElementById("symbol2");
player2Symbol.addEventListener("change", () => {player2.symbol = player2Symbol.value});