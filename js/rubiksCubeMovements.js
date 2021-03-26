const ROW = 6, COLUMN = 8, CENTER = 12, PIECE_NUM = 4;
const UP = 0, FRONT = 1, RIGHT = 2, BEHIND = 3, LEFT = 4, DOWN = 5;

const ONE_SIDE = 8; 


export const cube = [
    ["yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow"],
    ["blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue"],
    ["red", "red", "red", "red", "red", "red", "red", "red"],
    ["green", "green", "green", "green", "green", "green", "green", "green"],
    ["orange", "orange", "orange", "orange", "orange", "orange", "orange", "orange"],
    ["white", "white", "white", "white", "white", "white", "white", "white"]
];

export const cubeCopy = [
    ["yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", "yellow"],
    ["blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue"],
    ["red", "red", "red", "red", "red", "red", "red", "red"],
    ["green", "green", "green", "green", "green", "green", "green", "green"],
    ["orange", "orange", "orange", "orange", "orange", "orange", "orange", "orange"],
    ["white", "white", "white", "white", "white", "white", "white", "white"]
];

export const cubeCenter = ["yellow", "blue", "red", "green", "orange", "white"];

export const cubeCenterCopy = ["yellow", "blue", "red", "green", "orange", "white"];


export const copyArray = function (arrayCube, arrayCenter, arrayCubeSolution, arrayCenterSolution)  // move this to useful functions?
{
    for(let indexCenter = 0; indexCenter < ROW; indexCenter++)
    {
        arrayCenterSolution[indexCenter] = arrayCenter[indexCenter];

        for(let indexPosition = 0; indexPosition < COLUMN; indexPosition++)
        {
            arrayCubeSolution[indexCenter][indexPosition] = arrayCube[indexCenter][indexPosition];
        }
    }

}

class Solution      // move to useful functions?
{
    constructor(formula, arrayCube, arrayCenter, id, text, skip)
    {
        this.formula = formula;
        this.arrayCube = arrayCube;
        this.arrayCenter = arrayCenter;
        this.id = id;
        this.text = text;
        this.skip = skip;
    }
    update(cube, center, move)
    {
        this.formula.push(move);
        this.arrayCube.push([[],[],[],[],[],[]]);
        this.arrayCenter.push([]);
        copyArray(cube, center, this.arrayCube[this.arrayCube.length - 1], this.arrayCenter[this.arrayCenter.length - 1]);
    }
    print()
    {
        if(this.formula == undefined)
        {
            this.formula = "setp already done!";
        }
        document.querySelector(this.id).innerHTML = `${this.text}: ${this.formula.join(" ")}`;
    }
    reset()
    {
        this.formula = [];
        this.arrayCube = [];
        this.arrayCenter = [];
        this.skip = 0;
    }

}


export const scrambleStep = new Solution ([],[],[], "#scrambleFormula", "Scramble Formula", 0);
export const makeWhiteCrossStep = new Solution ([],[],[], "#makeWhiteCross", "1 - Make White Cross", 0); 
export const orientWhiteCrossStep = new Solution ([],[],[], "#orientWhiteCross", "2 - Orient White Cross", 0); 
export const makeWhiteCornersStep = new Solution ([],[],[], "#makeWhiteCorners", "3 - Make White Corners", 0); 
export const makeSecondLayerStep = new Solution ([],[],[], "#makeSecondLayer", "4 - Make Second Layer", 0); 
export const makeYellowCrossStep = new Solution ([],[],[], "#makeYellowCross", "5 - Make Yellow Cross", 0); 
export const makeYellowCornersStep = new Solution ([],[],[], "#makeYellowCorners", "6 - Make Yellow Corners", 0); 
export const orientYellowCornersStep = new Solution ([],[],[], "#orientYellowCorners", "7 - Orient Yellow Corners", 0); 
export const orientYellowCrossStep = new Solution ([],[],[], "#orientYellowCross", "8 - Orient Yellow Cross", 0); 

// --------------------------------------

class Movement 
{
    constructor
    (                               // array[sideX][sideXn]
        sideA0, sideA1, sideA2,     // sideX: which side of the cube
        sideB0, sideB1, sideB2,     // sideXn: which piece of the side
        sideC0, sideC1, sideC2,     // side: move the face of the side we are moving
        sideD0, sideD1, sideD2,     // moveSide: output which movement we are doing
        sideA, sideB, sideC, sideD,
        side,
        moveSide                // parameters
    )
    {                           // "function"
        this.sideA0 = sideA0;
        this.sideA1 = sideA1;
        this.sideA2 = sideA2;
        this.sideB0 = sideB0;
        this.sideB1 = sideB1;
        this.sideB2 = sideB2;
        this.sideC0 = sideC0;
        this.sideC1 = sideC1;
        this.sideC2 = sideC2;
        this.sideD0 = sideD0;
        this.sideD1 = sideD1;
        this.sideD2 = sideD2;
        this.sideA = sideA;
        this.sideB = sideB;
        this.sideC = sideC;
        this.sideD = sideD;
        this.side = side;
        this.moveSide = moveSide;
    }
    get_sideA() { return this.sideA;}
    get_sideB() { return this.sideB;}
    get_sideC() { return this.sideC;}
    get_sideD() { return this.sideD;}
    get_sideA0() { return this.sideA0;}    
    get_sideA1() { return this.sideA1;}
    get_sideA2() { return this.sideA2;}
    get_sideB0() { return this.sideB0;}
    get_sideB1() { return this.sideB1;}
    get_sideB2() { return this.sideB2;}
    get_sideC0() { return this.sideC0;}
    get_sideC1() { return this.sideC1;}
    get_sideC2() { return this.sideC2;}
    get_sideD0() { return this.sideD0;}
    get_sideD1() { return this.sideD1;}
    get_sideD2() { return this.sideD2;}
    get_side() { return this.side;}
    get_move() { return this.moveSide;}
}

export const moveU = new Movement(0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 1, 2, 3, 4, 0, "U");
export const moveD = new Movement(4, 5, 6, 4, 5, 6, 4, 5, 6, 4, 5, 6, 1, 4, 3, 2, 5, "D");
export const moveR = new Movement(2, 3, 4, 2, 3, 4, 2, 3, 4, 6, 7, 0, 0, 1, 5, 3, 2, "R");
export const moveL = new Movement(6, 7, 0, 2, 3, 4, 6, 7, 0, 6, 7, 0, 0, 3, 5, 1, 4, "L");
export const moveF = new Movement(4, 5, 6, 2, 3, 4, 0, 1, 2, 6, 7, 0, 0, 4, 5, 2, 1, "F");
export const moveB = new Movement(0, 1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 0, 0, 2, 5, 4, 3, "B");

// -----------------------------------

export const colorCube = function(array, arrayCenter)       // move this to useful functions?
{
    let index = "";

    for(let indexCenter = 0; indexCenter < ROW/2 ; indexCenter++)
    {
        document.querySelector(".center" + indexCenter).style.backgroundColor = arrayCenter[indexCenter];

        for(let indexPosition = 0; indexPosition < PIECE_NUM*2; indexPosition++)
        {
            index = ".s" + indexCenter + indexPosition;
            document.querySelector(index).style.backgroundColor = array[indexCenter][indexPosition];
        }
    }


}

colorCube(cube, cubeCenter);        // print cube without scramble

// -------------------------------------------------------------------------------------------------------

export const moveLayer = function(array, moveX)
{
    let copy = [];

    copy[0] = array[moveX.get_sideA()][moveX.get_sideA0()];
    copy[1] = array[moveX.get_sideA()][moveX.get_sideA1()];
    copy[2] = array[moveX.get_sideA()][moveX.get_sideA2()];

    copy[3] = array[moveX.get_sideB()][moveX.get_sideB0()];
    copy[4] = array[moveX.get_sideB()][moveX.get_sideB1()];
    copy[5] = array[moveX.get_sideB()][moveX.get_sideB2()];

    copy[6] = array[moveX.get_sideC()][moveX.get_sideC0()];
    copy[7] = array[moveX.get_sideC()][moveX.get_sideC1()];
    copy[8] = array[moveX.get_sideC()][moveX.get_sideC2()];

    copy[9] = array[moveX.get_sideD()][moveX.get_sideD0()];
    copy[10] = array[moveX.get_sideD()][moveX.get_sideD1()];
    copy[11] = array[moveX.get_sideD()][moveX.get_sideD2()];

    // change 

    array[moveX.get_sideA()][moveX.get_sideA0()] = copy[3];
    array[moveX.get_sideA()][moveX.get_sideA1()] = copy[4];
    array[moveX.get_sideA()][moveX.get_sideA2()] = copy[5];

    array[moveX.get_sideB()][moveX.get_sideB0()] = copy[6];
    array[moveX.get_sideB()][moveX.get_sideB1()] = copy[7];
    array[moveX.get_sideB()][moveX.get_sideB2()] = copy[8];

    array[moveX.get_sideC()][moveX.get_sideC0()] = copy[9];
    array[moveX.get_sideC()][moveX.get_sideC1()] = copy[10];
    array[moveX.get_sideC()][moveX.get_sideC2()] = copy[11];

    array[moveX.get_sideD()][moveX.get_sideD0()] = copy[0];
    array[moveX.get_sideD()][moveX.get_sideD1()] = copy[1];
    array[moveX.get_sideD()][moveX.get_sideD2()] = copy[2];

}

export const moveSide = function(array, moveX)
{
    let copySide = [];

    for(let index = 0; index < ONE_SIDE; index++)
    {
        copySide[index] = array[moveX.get_side()][index];
    }

    for(let index = 0; index < ONE_SIDE; index++)
    {
        array[moveX.get_side()][(index+2)%ONE_SIDE] = copySide[index];
    }
}

export const moveCube = function(array, arrayCenter, moveX, print, solutionObject)
{
    moveLayer(array, moveX);
    moveSide(array, moveX);
    if(print)
    {
        let move = moveX.get_move();
        solutionObject.update(array, arrayCenter, move);
    }

}

export const moveCubeTwice = function(array, arrayCenter, moveX, print, solutionObject)
{

    moveLayer(array, moveX);
    moveSide(array, moveX);
    moveLayer(array, moveX);
    moveSide(array, moveX);
    if(print)
    {
        let move = moveX.get_move()+"2";
        solutionObject.update(array, arrayCenter, move);
    }

}

export const moveCubeReverse = function(array, arrayCenter, moveX, print, solutionObject)
{
    moveLayer(array, moveX);
    moveSide(array, moveX);
    moveLayer(array, moveX);
    moveSide(array, moveX);
    moveLayer(array, moveX);
    moveSide(array, moveX);
    if(print)
    {
        let move = moveX.get_move()+"'";
        solutionObject.update(array, arrayCenter, move);
    }

}

// ---------------------------------------------------------------------------------------------------------------------------

const moveEntireCubeY = function(array, arrayCenter)
{
    let temp = [];

    for(let indexCol = 0; indexCol < COLUMN; indexCol++)
    {
        temp[indexCol] = array[FRONT][indexCol];
    }

    for(let indexRow = 1; indexRow < ROW - 1; indexRow++)
    {
        for(let indexCol = 0; indexCol < COLUMN; indexCol++)
        {
            array[indexRow][indexCol] = array[indexRow + 1][indexCol];
        }
    }

    for(let indexCol = 0; indexCol < COLUMN; indexCol++)
    {
        array[LEFT][indexCol] = temp[indexCol];
    }

    let tempCenter = "";
    tempCenter = arrayCenter[FRONT];

    for(let index = 1; index < ROW - 1; index++)
    {
        arrayCenter[index] = arrayCenter[index + 1];
    }

    arrayCenter[LEFT] = tempCenter;

    moveSide(array, moveU);
    moveSide(array, moveD);
    moveSide(array, moveD);
    moveSide(array, moveD);


}

export const moveEntireCubeYNormal = function (array, arrayCenter, print, solutionObject)
{
    moveEntireCubeY(array, arrayCenter)
    if(print)
    {
        let move = "Y";
        solutionObject.update(array, arrayCenter, move);
    }
}

export const moveEntireCubeYReverse = function (array, arrayCenter, print, solutionObject)
{
    moveEntireCubeY(array, arrayCenter)
    moveEntireCubeY(array, arrayCenter)
    moveEntireCubeY(array, arrayCenter)
    if(print)
    {
        let move = "Y'";
        solutionObject.update(array, arrayCenter, move);
    }
}

export const moveEntireCubeYTwice = function (array, arrayCenter, print, solutionObject)
{
    moveEntireCubeY(array, arrayCenter)
    moveEntireCubeY(array, arrayCenter)
    if(print)
    {
        let move = "Y2";
        solutionObject.update(array, arrayCenter, move);
    }
}

// -----------------------------------------------------------------------------------------------------------------------


const moveEntireCubeX = function (array, arrayCenter)
{
	let temp = [];	
	
	//make copy of yellow
	for(let indexCol = 0; indexCol < COLUMN; indexCol++)
		temp[indexCol] = array[UP][indexCol];

	// blue to yellow
	for(let indexCol = 0; indexCol < COLUMN; indexCol++)
		array[UP][indexCol] = array[FRONT][indexCol];	

	// white to blue
	for(let indexCol = 0; indexCol < COLUMN; indexCol++)
		array[FRONT][indexCol] = array[DOWN][indexCol];

	// green to white
	for(let indexCol = 4; indexCol < COLUMN; indexCol++)
		array[DOWN][indexCol - 4] = array[BEHIND][indexCol];

	for(let indexCol = 0; indexCol < COLUMN/2; indexCol++)
		array[DOWN][indexCol + 4] = array[BEHIND][indexCol];

	// copy to green		
	for(let indexCol = 4; indexCol < COLUMN; indexCol++)
		array[BEHIND][indexCol - 4] = temp[indexCol];
		
	for(let indexCol = 0; indexCol < COLUMN/2; indexCol++)
		array[BEHIND][indexCol + 4] = temp[indexCol];
	
	let tempCenter = "";
	tempCenter = arrayCenter[0];
	
	arrayCenter[0] = arrayCenter[1];
	
	for(let index = 0; index < 2; index++)
		arrayCenter[index*4 + 1] = arrayCenter[((index+1)*4 + 1)%ROW];
		
	arrayCenter[3] = tempCenter;
	
	
	moveSide(array, moveR);
	moveSide(array, moveL);
	moveSide(array, moveL);
	moveSide(array, moveL);
}

export const moveEntireCubeXNormal = function (array, arrayCenter, print, solutionObject)
{
    moveEntireCubeX(array, arrayCenter);
    if(print)
    {
        let move = "X";
        solutionObject.update(array, arrayCenter, move);
    }
}

export const moveEntireCubeXReverse = function (array, arrayCenter, print, solutionObject)
{
    moveEntireCubeX(array, arrayCenter);
    moveEntireCubeX(array, arrayCenter);
    moveEntireCubeX(array, arrayCenter);
    if(print)
    {
        let move = "X'";
        solutionObject.update(array, arrayCenter, move);
    }
}

// ---------------------------------------------------------------

export const moveMiddleNormal = function (array, arrayCenter, print, solutionObject)
{
    moveEntireCubeXReverse(array, arrayCenter, false, solutionObject);
    moveCube(array, arrayCenter, moveR, false, solutionObject);
    moveCubeReverse(array, arrayCenter, moveL, false, solutionObject);

    if(print)
    {
        let move = "M";
        solutionObject.update(array, arrayCenter, move);
    }
    
}

export const moveMiddleReverse = function (array, arrayCenter, print, solutionObject)
{
    moveEntireCubeXNormal(array, arrayCenter, false, solutionObject);
    moveCube(array, arrayCenter, moveL, false, solutionObject);
    moveCubeReverse(array, arrayCenter, moveR, false, solutionObject);

    if(print)
    {
        let move = "M'";
        solutionObject.update(array, arrayCenter, move);
    }
}

// -------------------------------------------------------------------------------------------------------------------------------

export const scramble = function(array, arrayCenter, arrayScramble, arrayCopy, arrayCenterCopy)
{

    for(let index = 0; index < arrayScramble.length; index++)
    {
        let move = arrayScramble[index];

        if(move === "R")
            moveCube(array, arrayCenter, moveR, true, scrambleStep);
        else if(move === "L")
            moveCube(array, arrayCenter, moveL, true, scrambleStep);
        else if(move === "U")
            moveCube(array, arrayCenter, moveU, true, scrambleStep);
        else if(move === "D")
            moveCube(array, arrayCenter, moveD, true, scrambleStep);
        else if(move === "F")
            moveCube(array, arrayCenter, moveF, true, scrambleStep);
        else if(move === "B")
            moveCube(array, arrayCenter, moveB, true, scrambleStep); // ------------------
        else if(move === "R'")
            moveCubeReverse(array, arrayCenter, moveR, true, scrambleStep);
        else if(move === "L'")
            moveCubeReverse(array, arrayCenter, moveL, true, scrambleStep);
        else if(move === "U'")
            moveCubeReverse(array, arrayCenter, moveU, true, scrambleStep);
        else if(move === "D'")
            moveCubeReverse(array, arrayCenter, moveD, true, scrambleStep);
        else if(move === "F'")
            moveCubeReverse(array, arrayCenter, moveF, true, scrambleStep);
        else if(move === "B'")
            moveCubeReverse(array, arrayCenter, moveB, true, scrambleStep); // ------------------------
        else if(move === "R2")
            moveCubeTwice(array, arrayCenter, moveR, true, scrambleStep);
        else if(move === "L2")
            moveCubeTwice(array, arrayCenter, moveL, true, scrambleStep);
        else if(move === "U2")
            moveCubeTwice(array, arrayCenter, moveU, true, scrambleStep);
        else if(move === "D2")
            moveCubeTwice(array, arrayCenter, moveD, true, scrambleStep);
        else if(move === "F2")
            moveCubeTwice(array, arrayCenter, moveF, true, scrambleStep);
        else if(move === "B2")
            moveCubeTwice(array, arrayCenter, moveB, true, scrambleStep);
        else 
        {
            index = arrayScramble.length;   // this will exit the for loop, but cube will still move until it reaches the error

            // this is the check for the wrong content
            document.querySelector(".wrongInput").innerHTML = `Wrong Input! Please Try Again!`;
            
            // these two for lops are to reset the cube
            for(let indexRow = 0; indexRow < ROW; indexRow++)          
            {
                for(let indexCol = 0; indexCol < COLUMN; indexCol++)
                {
                    array[indexRow][indexCol] = arrayCopy[indexRow][indexCol];
                }
            }

            for(let index = 0; index < ROW; index++)
            {
                arrayCenter[index] = arrayCenterCopy[index];
            }

            scrambleStep.reset();

            return false;   // to exit the function
        }


    }

    if(arrayScramble.length !== 0)
        return true;

}

