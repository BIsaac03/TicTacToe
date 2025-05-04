const board = (function(){
    const layout = [];
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

function playGame(player1, player2, board){
    let activePlayer
    let squares = document.getElementsByClassName("square")

    for(let i = 0; i < squares.length; i++){
        squares[i].addEventListener("click", () => { 
            if(player1.isMyTurn){
                activePlayer = player1;
            }
            else {activePlayer = player2};   
            console.log(activePlayer.symbol); 
            board.gameState = activePlayer.makeMove(i);

            if (board.gameState != 1){
                player1.isMyTurn = !player1.isMyTurn;
                player2.isMyTurn = !player2.isMyTurn;

                if (board.gameState != "Ongoing"){
                    if (board.gameState.result == "Tie"){
                        console.log("No more valid moves. Tie game!");
                    }
                    const winningLine = [];
                    for (let i = 0; i < board.width; i++){
                        winningLine.push(document.querySelector(`.${CSS.escape(board.gameState.winningLine[i])}`));
                    }
                    for(let i = 0; i < winningLine.length; i++){
                        winningLine[i].style.fontWeight = 'bold';
                    }
                }
            }
        });
    };
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

        for (let i = 0; i < board.width; i++){
            if (board.layout[i*board.width + columnCheck].status != this.symbol){
                winningLine.length = 0;
                break;
            }
            winningLine.push(i*board.width + columnCheck);
            if (i == board.width - 1){
                return {result: "Win", winner: this.name, winningLine: winningLine};
            }
        }

        for (let i = 0; i < board.width; i++){
            if (board.layout[i + rowCheck*board.width].status != this.symbol){
                winningLine.length = 0;
                break;
            }
            winningLine.push(i + rowCheck*board.width);
            if (i == board.width - 1){
                return {result: "Win", winner: this.name, winningLine: winningLine};
            }
        }

        if (columnCheck == rowCheck){
            for (let i = 0; i < board.width; i++){
                if (board.layout[i*board.width + i].status != this.symbol){
                    winningLine.length = 0;
                    break;
                }
                winningLine.push(i*board.width + i);
                if (i == board.width - 1){
                    return {result: "Win", winner: this.name, winningLine: winningLine};
                }
            }
        }

        if (columnCheck == board.width - 1 - rowCheck){
            for (let i = 0; i < board.width; i++){
                if (board.layout[board.width*(board.width - i) - board.width + i].status != this.symbol){
                    winningLine.length = 0;
                    break;
                }
                winningLine.push(board.width*(board.width - i) - board.width + i);
                if (i == board.width - 1){
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
playGame(player1, player2, board);
