const ROW = 6, COLUMN = 8, PIECE_NUM = 4;
const UP = 0, FRONT = 1, RIGHT = 2, BEHIND = 3, LEFT = 4, DOWN = 5;


const POSITION_ZERO = 0, POSITION_ONE = 1, POSITION_TWO = 2, POSITION_THREE = 3;
const POSITION_FOUR = 4, POSITION_FIVE = 5, POSITION_SIX = 6, POSITION_SEVEN = 7;

const MOVE_ONE = 1, MOVE_TWO = 2, MOVE_THREE = 3;

const timeFactor = 1000; 

let stepIndex = -1;
let moveIndex = -1;
let play = -1;

import { moveU, moveD, moveR, moveL, moveF, moveB,
        cubeCopy, cubeCenterCopy,
        moveCube, moveCubeReverse, moveCubeTwice, 
        moveEntireCubeYNormal, moveEntireCubeYReverse, moveEntireCubeYTwice,
        moveEntireCubeXNormal, moveEntireCubeXReverse,
        moveMiddleNormal, moveMiddleReverse, colorCube, scrambleStep,
        makeWhiteCrossStep, orientWhiteCrossStep, makeWhiteCornersStep, makeSecondLayerStep,
        makeYellowCrossStep, makeYellowCornersStep,orientYellowCornersStep, orientYellowCrossStep
} from "./rubiksCubeMovements.js";


// These functions are used to solve the cube ------------------------------------------------------

// object used to pass varaibles by reference 
export const piece = 
{
    side : 0,
    position : 0,
    cornerTop : 0,
    cornerLeft : 0,
    edgeColor : 0,
    get_side : function()
    {
        return this.side;
    },
    get_position : function()
    {
        return this.position;
    },
    set_side : function(newSide)
    {
        this.side = newSide;
    },
    set_position : function(newPosition)
    {
        this.position = newPosition;
    }
}

// find the first edge: side and position
export const findEdge = function(array, color, object)
{
    let odd = 0;

    for(let indexRow = 0; indexRow < ROW ; indexRow++)
    {
        for(let indexCol = 0; indexCol < PIECE_NUM; indexCol++)
        {
            odd = (2*indexCol)+1;
            if(array[indexRow][odd] == color)
            {
                object.set_side(indexRow);
                object.set_position(odd);

                indexCol = PIECE_NUM;
                indexRow = ROW;
            }
        }
    }
}

// find the first corner: side and position
export const findCorner = function(array, color, object)
{
    let even = 0;

    for(let indexRow = 0; indexRow < ROW ; indexRow++)
    {
        for(let indexCol = 0; indexCol < PIECE_NUM; indexCol++)
        {
            even = 2*indexCol;
            if(array[indexRow][even] == color)
            {
                object.set_side(indexRow);
                object.set_position(even);

                indexCol = PIECE_NUM;
                indexRow = ROW;
            }
        }
    }
}

// returns the color index of a piece in a given side and position
export const sideIndex = function(array, arrayCenter, initialSide, positionIndex)
{
    let centerIndex = 0;

    for(let index = 0; index < ROW; index++)
    {
        if(array[initialSide][positionIndex] == arrayCenter[index])
        {
            centerIndex = index;
        }
    }

    return centerIndex;
}

// move any side to the front and update the index of the sides
export const moveSideToFront = function (array, arrayCenter, moveIndex, print, solutionObject)
{
    if(moveIndex === RIGHT)
        moveEntireCubeYNormal(array, arrayCenter, print, solutionObject);
    else if(moveIndex === BEHIND)
        moveEntireCubeYTwice(array, arrayCenter, print, solutionObject);
    else if(moveIndex === LEFT)
        moveEntireCubeYReverse(array, arrayCenter, print, solutionObject);
    else if(moveIndex === UP)
        moveEntireCubeXReverse(array, arrayCenter, print, solutionObject);
    else if(moveIndex === DOWN)
        moveEntireCubeXNormal(array, arrayCenter, print, solutionObject);
}

// move layer with the least movements possible 
export const adjustSide = function(array, arrayCenter, moveX, print, adjust, solutionObject)
{
    if(adjust == MOVE_ONE)
        moveCube(array, arrayCenter, moveX, print, solutionObject);
    else if(adjust == MOVE_TWO)
        moveCubeTwice(array, arrayCenter, moveX, print, solutionObject);
    else if (adjust == MOVE_THREE)
        moveCubeReverse(array, arrayCenter, moveX, print, solutionObject);
}

// find the other index colors of an corner given its side and position
export const cornerIndex = function(array, arrayCenter, nSide, nPosition, pieceObject, solutionObject)
{
    let moveBackStr = arrayCenter[FRONT];   // get color of the front face now

    moveSideToFront(array, arrayCenter, nSide, false, solutionObject); 

    let turnsFInt = 0;

    while(nPosition != 0)           // make sure corner is in position 0 (top left)
    {
        moveCube(array, arrayCenter, moveF, false, solutionObject);
        nPosition = (nPosition + 2) % COLUMN;
        turnsFInt++;
    }

    let tempCornerTopStr = array[UP][POSITION_SIX];        // get color only
    let tempCornerLeftStr = array[LEFT][POSITION_TWO];     // since the index will change back

    let moveBackInt = 0;

    for(let index = 0; index < ROW; index++)
    {
        if(arrayCenter[index] == moveBackStr)   // compare the color
        {
            moveBackInt = index;        // cahnge the color to the index
        }
    }

    while(turnsFInt > 0)
    {
        moveCubeReverse(array, arrayCenter, moveF, false, solutionObject);
        turnsFInt--; 
    }

    moveSideToFront(array, arrayCenter, moveBackInt, false, solutionObject);    // original cube orientation

    for(let index = 0; index < ROW; index++)        // get index of the colors
    {
        if(arrayCenter[index] == tempCornerTopStr)
        {
            pieceObject.cornerTop = index;
        }

        if(arrayCenter[index] == tempCornerLeftStr)
        {
            pieceObject.cornerLeft = index;
        }
    }

}

// returns the other index color of the edge givin its side and position
export const edgeIndex = function(array, arrayCenter, nSide, nPosition, solutionObject)
{
    let moveBackStr = arrayCenter[FRONT];   // get string of the front

    moveSideToFront(array, arrayCenter, nSide, false, solutionObject);

    let turnsFInt = 0;

    while(nPosition != 1)
    {
        moveCube(array, arrayCenter, moveF, false, solutionObject);
        nPosition = (nPosition + 2)%COLUMN;
        turnsFInt++;
    }

    let edgeColorStr = array[UP][POSITION_FIVE];   // color string, since the index will change

    while(turnsFInt > 0)
    {
        moveCubeReverse(array, arrayCenter, moveF, false, solutionObject);
        turnsFInt--;
    }

    let moveCubeBackInt = 0;

    for(let index = 0; index < ROW; index++)
    {
        if(arrayCenter[index] == moveBackStr)
        {
            moveCubeBackInt = index;    // change the color to the index
        }
    }

    moveSideToFront(array, arrayCenter, moveCubeBackInt, false, solutionObject);

    let edgeIndexInt = 0;

    for(let index = 0; index < ROW; index++)
    {
        if(arrayCenter[index] == edgeColorStr)
        {
            edgeIndexInt = index;
        } 
    }

    return edgeIndexInt;

}

// -------------------------------------------------------------------
export const resetSolution = function()
{
    scrambleStep.reset();
    makeWhiteCrossStep.reset();
    orientWhiteCrossStep.reset();
    makeWhiteCornersStep.reset();
    makeSecondLayerStep.reset();
    makeYellowCrossStep.reset();
    makeYellowCornersStep.reset();
    orientYellowCornersStep.reset();
    orientYellowCrossStep.reset();
}

export const chooseSolution = function(stepNumber)
{
    let solutionName;

    if(stepNumber == 0)
        solutionName = scrambleStep;
    else if(stepNumber == 1)
        solutionName = makeWhiteCrossStep;
    else if(stepNumber == 2)
        solutionName = orientWhiteCrossStep;
    else if(stepNumber == 3)
        solutionName = makeWhiteCornersStep;
    else if(stepNumber == 4)
        solutionName = makeSecondLayerStep;
    else if(stepNumber == 5)
        solutionName = makeYellowCrossStep;
    else if(stepNumber == 6)
        solutionName = makeYellowCornersStep;
    else if(stepNumber == 7)
        solutionName = orientYellowCornersStep;
    else if(stepNumber == 8)
        solutionName = orientYellowCrossStep;
        
    return solutionName;
}

// These functions are used to animate the left cube --------------------------------------------------
class Animate
{
    constructor
    (
        arrayPosition, orientation, move
    )
    {
        this.arrayPosition = arrayPosition;
        this.orientation = orientation
        this.move = move;
    }
}

const animateR = new Animate([".h14", ".h13", ".h12", ".h04", ".h03", ".h02"], "orientation", "R");
const animateL = new Animate([".h00", ".h07", ".h06", ".h10", ".h17", ".h16"], "orientation", "L");
const animateU = new Animate([".h22", ".h21", ".h20", ".h12", ".h11", ".h10"], "orientation", "U");
const animateD = new Animate([".h16", ".h15", ".h14", ".h26", ".h25", ".h24"], "orientation", "D");
const animateF = new Animate([".h06", ".h05", ".h04", ".h20", ".h27", ".h26"], "orientation", "L");
const animateB = new Animate([".h24", ".h23", ".h22", ".h02", ".h01", ".h00"], "orientation", "L");
const animateM = new Animate([".h01", ".hcenter0", ".h05", ".h11", ".hcenter1", ".h15"], "orientation", "M");
const animateH = new Animate([".h17", ".hcenter1", ".h13", ".h27", ".hcenter2", ".h23"], "orientation", "H");

const chooseAnimate = function(move)
{
    let animateObject;

    if(move[0] == "R" || move[0] == "X")
        animateObject = animateR;
    else if(move[0] == "L")
        animateObject = animateL;
    else if(move[0] == "U" || move[0] == "Y")
        animateObject = animateU;
    else if(move[0] == "D")
        animateObject = animateD;
    else if(move[0] == "F")
        animateObject = animateF;
    else if(move[0] == "B")
        animateObject = animateB;
    else if(move[0] == "M")
        animateObject = animateM;
    else if(move[0] == "H")
        animateObject = animateH;

    if(move[1] == "'")
    {
        animateObject.orientation = "reverse";
    }
    else
    {
        animateObject.orientation = "normal";
    }

    return animateObject;


}

const animateOneLayer = function(animateObject, index)
{

    for(let indexClean = 0; indexClean < 6; indexClean++)
    {
        document.querySelector(animateObject.arrayPosition[indexClean]).style.backgroundColor = "white";
    }

    if(animateObject.orientation == "normal")
    {
        document.querySelector(animateObject.arrayPosition[index%3]).style.backgroundColor = "red";
        document.querySelector(animateObject.arrayPosition[(index%3) + 3]).style.backgroundColor = "red";
    }
    else if(animateObject.orientation == "reverse")
    {
        document.querySelector(animateObject.arrayPosition[2 - (index%3)]).style.backgroundColor = "red";
        document.querySelector(animateObject.arrayPosition[5 - (index%3)]).style.backgroundColor = "red";
    }

}

const animateEntireCube = function(animateOne, animateTwo, animateThree, index)
{

    for(let indexClean = 0; indexClean < 6; indexClean++)
    {
        document.querySelector(animateOne.arrayPosition[indexClean]).style.backgroundColor = "white";
        document.querySelector(animateTwo.arrayPosition[indexClean]).style.backgroundColor = "white";
        document.querySelector(animateThree.arrayPosition[indexClean]).style.backgroundColor = "white";

    }

    if(animateOne.orientation == "normal")
    {
        document.querySelector(animateOne.arrayPosition[index%3]).style.backgroundColor = "red";
        document.querySelector(animateTwo.arrayPosition[2 - (index%3)]).style.backgroundColor = "red";
        document.querySelector(animateThree.arrayPosition[2 - (index%3)]).style.backgroundColor = "red";

        document.querySelector(animateOne.arrayPosition[(index%3) + 3]).style.backgroundColor = "red";
        document.querySelector(animateTwo.arrayPosition[5 - (index%3)]).style.backgroundColor = "red";
        document.querySelector(animateThree.arrayPosition[5 - (index%3)]).style.backgroundColor = "red";
    }
    else if(animateOne.orientation == "reverse")
    {
        document.querySelector(animateOne.arrayPosition[2 - (index%3)]).style.backgroundColor = "red";
        document.querySelector(animateTwo.arrayPosition[index%3]).style.backgroundColor = "red";
        document.querySelector(animateThree.arrayPosition[index%3]).style.backgroundColor = "red";

        document.querySelector(animateOne.arrayPosition[5 - (index%3)]).style.backgroundColor = "red";
        document.querySelector(animateTwo.arrayPosition[(index%3) + 3]).style.backgroundColor = "red";
        document.querySelector(animateThree.arrayPosition[(index%3) + 3]).style.backgroundColor = "red";
    }

}

const animateCube = function(move)
{
    let index = 0; 
    let animateOne = chooseAnimate(move);
    let animateTwo;
    let animateThree;

    if(move[0] == "X")
    {
        animateTwo = chooseAnimate("M")
        animateThree = chooseAnimate("L")
    }
    else if(move[0] == "Y")
    {
        animateTwo = chooseAnimate("H")
        animateThree = chooseAnimate("D")
    }   

    for(let indexTime = 0; indexTime < 8; indexTime++)         // change number here if time changes
    {
        setTimeout( function() 
        {

            if(move[0] == "X" || move[0] == "Y")
                animateEntireCube(animateOne, animateTwo, animateThree, index);
            else 
                animateOneLayer(animateOne, index);

            index++;

        }, (indexTime*timeFactor/8));                               // change number here if time changes
    }
    
    setTimeout( function() 
    {
        for(let indexClean = 0; indexClean < 6; indexClean++)
        {
            document.querySelector(animateOne.arrayPosition[indexClean]).style.backgroundColor = "white";

            if(move[0] == "X" || move[0] == "Y")
            {
                document.querySelector(animateTwo.arrayPosition[indexClean]).style.backgroundColor = "white";
                document.querySelector(animateThree.arrayPosition[indexClean]).style.backgroundColor = "white";
            }

        }
    },(timeFactor));                          // change number here if time changes 

}

// These functions are used for the controlling buttons ---------------------------------------------------

// Output the formula and bold the move used.
// It also animate the left cube and change the color on the right one.
const outputFormula = function(indexStep, indexMove)
{
    let solutionObject = chooseSolution(indexStep);
    let temp = "";

    console.log("indexStep:", indexStep, "   indexMove:", indexMove, "   skip:", solutionObject.skip, 
        "   sumIndex:", indexMove + solutionObject.skip);
    // if(solutionObject.formula[indexMove + solutionObject.skip] == "<br>")
    //     solutionObject.skip++;

    temp = solutionObject.formula[indexMove + solutionObject.skip];
    solutionObject.formula[indexMove + solutionObject.skip] = '<b style="font-size: 50px;">' + temp + "</b>";

    document.querySelector(".formulaControl").innerHTML = `${solutionObject.text} : ${solutionObject.formula.join(" ")}`

    solutionObject.formula[indexMove + solutionObject.skip] = temp;
    
    if(solutionObject.arrayCenter.length != 0)  // only color and animate cube if there is a move
    {                                           // there might be times that a step is alredy done
        colorCube(solutionObject.arrayCube[indexMove], solutionObject.arrayCenter[indexMove]);
        animateCube(solutionObject.formula[indexMove + solutionObject.skip]);
    }
}

// Previous move button
const controlPreviousMove = function()
{
    moveIndex--;

    if(moveIndex == -1 || moveIndex == -2)
    {
        stepIndex--;
        if(stepIndex >= 0)
        {
            moveIndex = chooseSolution(stepIndex).arrayCube.length - 1;
            // console.log("Move index start: ", moveIndex);
            // console.log("Lenght of formula: ", chooseSolution(stepIndex).formula.length - 1);
        }
        else
        {
            stepIndex = -1;
            moveIndex = 0;
        }
    }


    if(moveIndex > -1 && stepIndex > -1)
    {
        let solutionObject = chooseSolution(stepIndex);

        solutionObject.skip = 0;

        for(let index = 0; index <= moveIndex + solutionObject.skip; index++)
        {
            if(solutionObject.formula[index] == "<br>")
            {
                // console.log(solutionObject.formula[index], 'at index', index);
                solutionObject.skip++;
            }
        }

        // console.log("This is the piece: ", solutionObject.formula[moveIndex + solutionObject.skip]);

        if(solutionObject.formula[moveIndex + solutionObject.skip] == "<br>")
        {            
            solutionObject.skip--;
            // console.log("This is the real piece: ", solutionObject.formula[moveIndex + solutionObject.skip]);
        }

        // console.log("This is the skipIndex on PreviousMove: ", solutionObject.skip);

        outputFormula(stepIndex, moveIndex);
    }
    else
    {
        controlPreviousStep();
    }
    

}

// Next move button
const controlNextMove = function()
{
    moveIndex++;

    if(stepIndex == -1)
    {
        stepIndex = 0;
        moveIndex = 0;
    }

    if(stepIndex == 10)
        stepIndex = 9;

    console.log(stepIndex);

    if(stepIndex < 9)
    {
        let solutionObject = chooseSolution(stepIndex);

        if(solutionObject.formula[moveIndex + solutionObject.skip] == "<br>")
            solutionObject.skip++;

        if(moveIndex < solutionObject.arrayCube.length)
        {
            outputFormula(stepIndex, moveIndex);    // same step
        }
        else
        {
            controlNextStep();
        }
    }
}

// Previous step button
const controlPreviousStep = function ()
{
    stepIndex--;
    moveIndex = 0;

    if(stepIndex == -2)
        stepIndex = -1;

    if(stepIndex == -1)
    {
        document.querySelector(".formulaControl").innerHTML = `Start Solving`;
        colorCube(cubeCopy, cubeCenterCopy);
    }
    else
    {
        let solutionObject = chooseSolution(stepIndex);
        solutionObject.skip = 0;

        if(solutionObject.formula[moveIndex + solutionObject.skip] == "<br>")
            solutionObject.skip++;

        outputFormula(stepIndex, moveIndex);
    }

}

// Next step button
const controlNextStep = function ()
{
    stepIndex++;
    moveIndex = 0;

    if(stepIndex == 10)
        stepIndex = 9;

    // let solutionObject = chooseSolution(stepIndex);

    if(stepIndex == 9)
    {
        document.querySelector(".formulaControl").innerHTML = `Cube is Done!`;

        let stepOrientYellowCross = 8;
        let solutionObject = chooseSolution(stepOrientYellowCross);
        let index = (solutionObject.arrayCenter.length) - 1;    // get the last index

        colorCube(solutionObject.arrayCube[index], solutionObject.arrayCenter[index]);
    }
    else
    {
        let solutionObject = chooseSolution(stepIndex);

        solutionObject.skip = 0;

        if(solutionObject.formula[moveIndex + solutionObject.skip] == "<br>")
            solutionObject.skip++;

        outputFormula(stepIndex, moveIndex);
    }

}

// Play/pause button
const controlPlay = function()
{
    if(stepIndex == 9)
    {
        play = -1;
        document.querySelector(".playPause").innerHTML = `Play`;
    }

    if(play == 1)   // going to play
    {
        setTimeout( function ()
        {
            controlNextMove();
            controlPlay();
        }, 1*timeFactor);
    }
}

// print formula when it is selected from the steps directly
const printFormula = function(solutionObject)
{
    document.querySelector(".formulaControl").innerHTML = `${solutionObject.text} : ${solutionObject.formula.join(" ")}`;
}

// initialize the controlling bar and steps

let initiateButtons = true;

document.querySelector("#scrambleButton").addEventListener("click", function()
{

    document.querySelector(".formulaControl").innerHTML = `Start Solving`;

    stepIndex = -1;
    moveIndex = -1;
    colorCube(cubeCopy, cubeCenterCopy);

    if(initiateButtons)
    {


        document.querySelector("#scrambleFormula").addEventListener("click", function(){printFormula(scrambleStep);
             stepIndex = 0; moveIndex = -1;});
        document.querySelector("#makeWhiteCross").addEventListener("click", function(){printFormula(makeWhiteCrossStep);
             stepIndex = 1; moveIndex = -1;});
        document.querySelector("#orientWhiteCross").addEventListener("click", function(){printFormula(orientWhiteCrossStep);
             stepIndex = 2; moveIndex = -1;});
        document.querySelector("#makeWhiteCorners").addEventListener("click", function(){printFormula(makeWhiteCornersStep);
             stepIndex = 3; moveIndex = -1;});
        document.querySelector("#makeSecondLayer").addEventListener("click", function(){printFormula(makeSecondLayerStep);
             stepIndex = 4; moveIndex = -1;});
        document.querySelector("#makeYellowCross").addEventListener("click", function(){printFormula(makeYellowCrossStep);
             stepIndex = 5; moveIndex = -1;});
        document.querySelector("#makeYellowCorners").addEventListener("click", function(){printFormula(makeYellowCornersStep);
             stepIndex = 6; moveIndex = -1;});
        document.querySelector("#orientYellowCorners").addEventListener("click", function(){printFormula(orientYellowCornersStep);
             stepIndex = 7; moveIndex = -1;});
        document.querySelector("#orientYellowCross").addEventListener("click", function(){printFormula(orientYellowCrossStep);
             stepIndex = 8; moveIndex = -1;});

        document.querySelector(".nextStep").addEventListener("click", function() {controlNextStep();});
        document.querySelector(".previousStep").addEventListener("click", function() {controlPreviousStep();});
        document.querySelector(".nextMove").addEventListener("click", function() {controlNextMove();});
        document.querySelector(".previousMove").addEventListener("click", function() {controlPreviousMove();});
        document.querySelector(".playPause").addEventListener("click", function() 
        {
            if(play == 1)
                document.querySelector(".playPause").innerHTML = `Play`;
            else
                document.querySelector(".playPause").innerHTML = `Pause`;

            play = play*(-1); 
            controlPlay();
            console.log("play: ", play)
        });

    initiateButtons = false;
    }

});