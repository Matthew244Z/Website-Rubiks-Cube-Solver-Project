const BOARD_NUM = 9;

console.log("This is the javascript tic tac toe");

const boardColor = [];

const createBoard = function () {

    document.querySelector(".board").innerHTML = '<ul class="boardList"></ul>';

    for(let i = 0; i < BOARD_NUM; i++)
    {
        document.querySelector(".boardList").innerHTML += '<li class = "boardSquare board' +i+'"></li>';
        boardColor[i] = "white";
    }
}

const paintBoard = function (array) {

    for(let i = 0; i < BOARD_NUM; i++)
    {
        document.querySelector(".board" + i).style.backgroundColor = array[i];
    }

}

createBoard();
boardColor[0] = "yellow";
paintBoard(boardColor);

// document.querySelector(".board").innerHTML = "<p> Hello World! </p>";
// addEventListener
// removeEventListener