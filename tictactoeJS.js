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

const playerOnePlaying = function () {
    if (playerOneTurn)
        updateColor = "yellow";
    else 
        updateColor = "blue";

    playerOneTurn = !playerOneTurn;
}


const paintBoard = function (array) {

    for(let i = 0; i < BOARD_NUM; i++)
    {
        document.querySelector(".board" + i).style.backgroundColor = array[i];
    }

}

const turnOn = function () {
    if (turn > MAX_TURN)
        return false;
    
}

const changeColor = function () {
    // player one = yellow
    // player two = blue
    if (turn % 2 == 1)
        turnColor = "yellow";
    else
        turnColor = "blue"
}
const updateBoard = function (index) {
    // game is over, no more space 
    if(turnOn())
        return false;

    // if winner

    if(boardColor[index] !== "white")
    {
        document.querySelector(".error").innerHTML = `The selected square has already been filled. Select a different square.`
        return false;
    }

    document.querySelector(".board" + index).style.backgroundColor = turnColor;
    
    turn++;
    changeColor();

    return true;
}

let status = document.querySelector(".infoGame");
status.innerHTML =`
    <p>Info Game</p>
    <p class="error"></p>
`;
createBoard();
paintBoard(boardColor);

// I tried to run this inside createBoard, but only the last item was working
for(let i = 0; i < BOARD_NUM; i++)
{
    document.querySelector(".board" + i).addEventListener("click", () => {updateBoard(i)})
}

// document.querySelector(".board").innerHTML = "<p> Hello World! </p>";
// addEventListener
// removeEventListener