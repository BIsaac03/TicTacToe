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
                    console.log("GAME OVER");
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
        let square = document.querySelector(`.${CSS.escape(move)}`);;
        square.textContent = this.symbol;
        return this.checkWin(move);
    }

    checkWin(move){
        const blankSquare = board.layout.find((square) => square.status == "Empty")
        if (blankSquare == undefined) {
            console.log("No more valid moves. Tie game!")
            return "Tie";
        }
        console.log(blankSquare);
        return "Ongoing";
    }
}

const player1 = new Player('Sarah', 'X', true);
const player2 = new Player('Nadezhda', 'O', false);
playGame(player1, player2, board);
