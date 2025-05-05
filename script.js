const board = (function(){
    const layout = [];
    const width = [prompt("What width?")];

    const playingField = document.getElementById("board")
    let gridTemplate = '1fr '.repeat(width[0]) + "/" + '1fr '.repeat(width[0]);
    playingField.style.gridTemplate = gridTemplate;
    for(let i = 0; i < width[0]*width[0]; i++){
        const square = document.createElement("p")
        square.classList.add("square", i)
        square.addEventListener("click", () => { 
            markSquare(i);
        });
        playingField.appendChild(square);
    }

    for (let i = 0; i < width[0]; i++){
        for (let j = 0; j < width[0]; j++){
            layout.push({row: i, column: j, status: "Empty"});
        }
    }
    let gameState = "Ongoing";

    const clearButton = document.getElementById("clear")
    clearButton.addEventListener("click", () => {         
        for (let i = 0; i < width[0]*width[0]; i++){
            layout[i].status = "Empty"
            let square = document.querySelector(`.${CSS.escape(i)}`);
            square.textContent = "";
            square.style.fontWeight = '400';
        }
        gameState = "Ongoing";
    }); 

    const resizeButton = document.getElementById("resize")
    resizeButton.addEventListener("click", () => {     
        for (let i = 0; i < width[0]*width[0]; i++){
            let square = document.querySelector(`.${CSS.escape(i)}`);
            square.textContent = "";
            square.style.fontWeight = '400';
        }
        layout.length = 0;
        playingField.innerHTML = "";

        width[0] = prompt("What width?")
        gridTemplate = '1fr '.repeat(width[0]) + "/" + '1fr '.repeat(width[0]);
        playingField.style.gridTemplate = gridTemplate;
        for(let i = 0; i < width[0]*width[0]; i++){
            const square = document.createElement("p")
            square.classList.add("square", i)
            square.addEventListener("click", markSquare(i));
            playingField.appendChild(square);
        }
        for (let i = 0; i < width[0]; i++){
            for (let j = 0; j < width[0]; j++){
                layout.push({row: i, column: j, status: "Empty"});
            }
        }
        gameState = "Ongoing"
    }); 
    return {layout: layout, gameState: gameState, width: width};
})();

function markSquare(square){
    if(player1.isMyTurn){
        activePlayer = player1;
    }
    else {activePlayer = player2};   
    board.gameState = activePlayer.makeMove(square);

    if (board.gameState != 1){
        player1.isMyTurn = !player1.isMyTurn;
        player2.isMyTurn = !player2.isMyTurn;

        if (board.gameState != "Ongoing"){
            if (board.gameState.result == "Tie"){
                console.log("No more valid moves. Tie game!");
            }
            const winningLine = [];
            for (let i = 0; i < board.width[0]; i++){
                winningLine.push(document.querySelector(`.${CSS.escape(board.gameState.winningLine[i])}`));
            }
            for(let i = 0; i < winningLine.length; i++){
                winningLine[i].style.fontWeight = 'bold';
            } 
        }
    }
}

class Player{
    constructor(name, symbol, first){
        this.name = name;
        this.symbol = symbol;
        this.isMyTurn = first;
    }

    makeMove(move){
        if (!this.isMyTurn){
            console.log("It's not your turn!")
            return 1;
        }
        if (board.layout[move].status != "Empty"){
            console.log("Square already marked!");
            return 1;
        }
        board.layout[move].status = this.symbol;
        let square = document.querySelector(`.${CSS.escape(move)}`);
        square.textContent = this.symbol;
        return this.checkWin(move);
    }

    checkWin(move){
        let columnCheck = board.layout[move].column;
        let rowCheck = board.layout[move].row;
        let winningLine = [];

        for (let i = 0; i < board.width[0]; i++){
            if (board.layout[i*board.width[0] + columnCheck].status != this.symbol){
                winningLine.length = 0;
                break;
            }
            winningLine.push(i*board.width[0] + columnCheck);
            if (i == board.width[0] - 1){
                return {result: "Win", winner: this.name, winningLine: winningLine};
            }
        }

        for (let i = 0; i < board.width[0]; i++){
            if (board.layout[i + rowCheck*board.width[0]].status != this.symbol){
                winningLine.length = 0;
                break;
            }
            winningLine.push(i + rowCheck*board.width[0]);
            if (i == board.width[0] - 1){
                return {result: "Win", winner: this.name, winningLine: winningLine};
            }
        }

        if (columnCheck == rowCheck){
            for (let i = 0; i < board.width[0]; i++){
                if (board.layout[i*board.width[0] + i].status != this.symbol){
                    winningLine.length = 0;
                    break;
                }
                winningLine.push(i*board.width[0] + i);
                if (i == board.width[0] - 1){
                    return {result: "Win", winner: this.name, winningLine: winningLine};
                }
            }
        }

        if (columnCheck == board.width[0] - 1 - rowCheck){
            for (let i = 0; i < board.width[0]; i++){
                if (board.layout[board.width[0]*(board.width[0] - i) - board.width[0] + i].status != this.symbol){
                    winningLine.length = 0;
                    break;
                }
                winningLine.push(board.width[0]*(board.width[0] - i) - board.width[0] + i);
                if (i == board.width[0] - 1){
                    return {result: "Win", winner: this.name, winningLine: winningLine};
                }
            }
        }

        const blankSquare = board.layout.find((square) => square.status == "Empty")
        if (blankSquare == undefined) {
            return {result: "Tie"};
        }
        return "Ongoing";
    }
}

const player1 = new Player('Sarah', 'X', true);
const player2 = new Player('Nadezhda', 'O', false);