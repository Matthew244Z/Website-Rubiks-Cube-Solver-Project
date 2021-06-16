const BOARD_NUM = 9;

console.log("This is the javascript tic tac toe")

const createBoard = function () {

    document.querySelector(".board").innerHTML = '<ul class="boardList"></ul>';

    for(let i = 0; i < BOARD_NUM; i++)
    {
        document.querySelector(".boardList").innerHTML += '<li class = "boardSquare board' +i+'"></li>';

    }
}

createBoard();
