const BOARD_NUM = 9;
const boardColor = [];
const MAX_TURN = 9;
let turn = 1;
let turnColor = "yellow";
let haveWinner = false;

// creates a list which is changed to a board using CSS
// updates elements in the boardColor to be all white
const createBoard = function () {

    document.querySelector(".board").innerHTML = `<ul class="boardList"></ul>`;

    for(let i = 0; i < BOARD_NUM; i++)
    {
        document.querySelector(".boardList").innerHTML += `<li class = "boardSquare board` +i+`"></li>`;
        boardColor[i] = "white";
    }
}

// check if there is any more turn (maximum of 9 turns)
// return true if there is more turn
// return false if there is no more turn
const turnOn = function () {
    if (turn > MAX_TURN)
        return false;
    return true;
}

// change color of the square according to the turn
// odd turns are for player one; yellow
// even turns are for player two; blue
const changeColor = function () {
    let turnPlayer = document.querySelector(".turn");
    if (turn % 2 == 1)
    {
        turnColor = "yellow";
        turnPlayer.innerHTML = `Player 1 turn`;
        // console.log("This is working!")
    }
    else
    {    
        turnColor = "blue"
        turnPlayer.innerHTML = `Player 2 turn`;
    }
}

// check if there is a winner
const isWinner = function (array) {
    // 0 1 2
    // 3 4 5
    // 6 7 8

    // check horizontals: increments of 1
    // check verticals: increments of 3
    // check diagonal 0 4 8
    // check diagonal 2 4 6 

    // check for horizontal and vertical winner
    for (let i = 0; i < 3; i++)
    {
        // check for horizontal winner
        // starts at 0 3 and 6, with increments of 1
        let indexH = i*3;
        if (array[indexH] == array[indexH+1] && array[indexH] == array[indexH+2] && array[indexH] != "white")
            return true;
        
        // check for vertical winner
        // starts at 0 1 and 2, with increments of 3
        let indexV = i;
        if (array[indexV] == array[indexV+3] && array[indexV] == array[indexV+6] && array[indexV] != "white")
            return true;
    }

    // check for diagonal 0 4 8
    if (array[0] == array[4] && array[0] == array[8] && array[0] != "white")
        return true;

    // check for diagonal 2 4 6
    if (array[2] == array[4] && array[2] == array[6] && array[2] != "white")
        return true;

    return false;
}


// check for tie
// board needs to be full
const isTie = function (winner) {
    if(!turnOn())
    {
        if(!winner)
            document.querySelector(".error").innerHTML = `<b>Tie! No Winner!</b>`;
        return true;
    }
    return false
}

// this update the board with the colors
// checks for winner and turns possible
// checks for invalid inputs ()
// update status, colors, and turns.
const updateBoard = function (index) {
    let errorMessage = document.querySelector(".error");
    let playerTurn = document.querySelector(".player");
    
    // check if ther is more turn 
    if(!turnOn())
        return false;

    console.log(turn);
    // check if the square is valid 
    if(boardColor[index] != "white")
    {
        errorMessage.innerHTML = `The selected square has already been filled. Select a different square.`
        return false;
    }
    else // delete message on a right move
        errorMessage.innerHTML = ``;

    // the square selected was valid
    // update color on board
    // update color on array, so it won't be used again

    document.querySelector(".board" + index).style.backgroundColor = turnColor;
    boardColor[index] = turnColor;

    // check for winner
    haveWinner = isWinner(boardColor);

    if(haveWinner)
    {
        // output winner message
        playerTurn.innerHTML = `<b>Player ` + ( (turn+1)%2 + 1 ) + ` is the winner!</b>`;
        
        // change turn so game stop
        turn = MAX_TURN;
        return true;
    }

    // no winner, game continues
    turn++;
    changeColor();

    // check for tie after turn increment
    // board full, no more entries, tie game
    // tie message should be outputed right after board is full
    isTie();

    return true;
}


// this is the status of the game
let status = document.querySelector(".infoGame");
status.innerHTML =`
    <p>Game Info</p>
    <p>Player 1: Yellow</p>
    <p>Player 2: Blue</p>
    <p class="turn">Player 1 turn</p>
    <p class="player"></p>
    <p class="error"></p>
    <button class="resetGame">Reset Game</button>
`;

// initialize board
createBoard();

// I tried to run this inside createBoard, but only the last item was working
// addEventListener on all squares 
for(let i = 0; i < BOARD_NUM; i++)
{
    document.querySelector(".board" + i).addEventListener("click", () => {updateBoard(i)})
}


// reset all variables and states
const reset = function () {
    turn = 1;
    turnColor = "yellow";
    haveWinner = false;
    createBoard();
    document.querySelector(".player").innerHTML = ``;
    document.querySelector(".error").innerHTML = ``;
    for(let i = 0; i < BOARD_NUM; i++)
    {
        document.querySelector(".board" + i).addEventListener("click", () => {updateBoard(i)})
    }


}

document.querySelector(".resetGame").addEventListener("click", () => {reset()} )