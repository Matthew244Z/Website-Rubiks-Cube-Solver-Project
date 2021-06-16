const BOARD_NUM = 9;
const boardColor = [];
const MAX_TURN = 9;
let turn = 1;
let playerOneTurn = true;
let turnColor = "yellow";


const createBoard = function () {

    document.querySelector(".board").innerHTML = `<ul class="boardList"></ul>`;

    for(let i = 0; i < BOARD_NUM; i++)
    {
        document.querySelector(".boardList").innerHTML += `<li class = "boardSquare board` +i+`"></li>`;
        boardColor[i] = "white";
        // document.querySelector(".board" + i).addEventListener("click", () => {console.log("Clicked")})
    }
}

// const playerOnePlaying = function () {
//     if (playerOneTurn)
//         updateColor = "yellow";
//     else 
//         updateColor = "blue";

//     playerOneTurn = !playerOneTurn;
// }


// const paintBoard = function (array) {

//     for(let i = 0; i < BOARD_NUM; i++)
//     {
//         document.querySelector(".board" + i).style.backgroundColor = array[i];
//     }

// }

const turnOn = function () {
    if (turn > MAX_TURN)
        return false;
    return true;
}

const changeColor = function () {
    // player one = yellow
    // player two = blue
    if (turn % 2 == 1)
        turnColor = "yellow";
    else
        turnColor = "blue"
}

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
}

const updateBoard = function (index) {
    let errorMessage = document.querySelector(".error");
    let playerTurn = document.querySelector(".player");
    
    // game is over, no more space 
    if(!turnOn())
        return false;



    // check if the square is valid 
    if(boardColor[index] != "white")
    {
        errorMessage.innerHTML = `The selected square has already been filled. Select a different square.`
        return false;
    }
    else 
        errorMessage.innerHTML = ``;

    // update color on board
    document.querySelector(".board" + index).style.backgroundColor = turnColor;

    // update color on array, so it won't be used again
    boardColor[index] = turnColor;

    // game is over, there is a winner
    if(isWinner(boardColor))
    {
        playerTurn.innerHTML = `Player ` + ( (turn+1)%2 + 1 ) + ` won!`;
        turn = MAX_TURN;
    }

    turn++;
    changeColor();

    return true;
}

let status = document.querySelector(".infoGame");
status.innerHTML =`
    <p>Info Game</p>
    <p class="player"></p>
    <p class="error"></p>
`;
createBoard();

// I tried to run this inside createBoard, but only the last item was working
for(let i = 0; i < BOARD_NUM; i++)
{
    document.querySelector(".board" + i).addEventListener("click", () => {updateBoard(i)})
}

// document.querySelector(".board").innerHTML = "<p> Hello World! </p>";
// addEventListener
// removeEventListener