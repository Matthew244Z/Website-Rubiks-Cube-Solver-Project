const ROW = 6, COLUMN = 8, PIECE_NUM = 4;
const UP = 0, FRONT = 1, RIGHT = 2, BEHIND = 3, LEFT = 4, DOWN = 5;
const YELLOW_CHAR = "yellow", WHITE_CHAR = "white";

const POSITION_ZERO = 0, POSITION_ONE = 1, POSITION_TWO = 2, POSITION_THREE = 3;
const POSITION_FOUR = 4, POSITION_FIVE = 5, POSITION_SIX = 6, POSITION_SEVEN = 7;

const MOVE_ONE = 1, MOVE_TWO = 2, MOVE_THREE = 3;
 
import { moveU, moveD, moveR, moveL, moveF, moveB,
        moveCube, moveCubeReverse, moveCubeTwice, 
        moveEntireCubeYNormal, moveEntireCubeYReverse, moveEntireCubeYTwice,
        moveEntireCubeXNormal, moveEntireCubeXReverse,
        moveMiddleNormal, moveMiddleReverse,
        makeWhiteCrossStep, orientWhiteCrossStep, makeWhiteCornersStep, makeSecondLayerStep,
        makeYellowCrossStep, makeYellowCornersStep,orientYellowCornersStep, orientYellowCrossStep
} from "./rubiksCubeMovements.js";

import { piece, findEdge, findCorner, sideIndex, moveSideToFront,
         adjustSide, cornerIndex, edgeIndex, chooseSolution
} from "./rubiksCubeUsefulFunctions.js";


// Make White Cross ------------------------------------------------------------

const countWhiteCross = function(array)
{
    let count = 0;
    let odd = 0;
    
    for(let index = 0; index < PIECE_NUM; index++)
    {
        odd = 2*index + 1;

        if(array[DOWN][odd] == WHITE_CHAR)
        {
            count++;
        }
    }

    return count;
}

const spaceOnWhite = function(array, position)
{
    let moveTurns = 0;

    while(array[DOWN][position] == WHITE_CHAR && countWhiteCross(array) != PIECE_NUM)
    {
        position = (position + 2) % COLUMN;
        moveTurns++;
    }

    if(moveTurns == 0)
    {
        moveTurns = PIECE_NUM;
    }

    return (PIECE_NUM - moveTurns);
}

const whiteEdgeOnYellow = function(array, arrayCenter, nWhite)
{
    let moveTurns = 0;

    if(nWhite == POSITION_ONE || nWhite == POSITION_FIVE)
    {
        moveTurns = spaceOnWhite(array, (nWhite+ PIECE_NUM ) % COLUMN);
    }
    else if (nWhite == POSITION_THREE || nWhite == POSITION_SEVEN)
    {
        moveTurns = spaceOnWhite(array, nWhite);
    }

    adjustSide(array, arrayCenter, moveD, true, moveTurns, makeWhiteCrossStep);
    
    switch(nWhite)
    {
        case POSITION_ONE:
            moveCubeTwice(array, arrayCenter, moveB, true, makeWhiteCrossStep);
            break;
        case POSITION_THREE:
            moveCubeTwice(array, arrayCenter, moveR, true, makeWhiteCrossStep);
            break;
        case POSITION_FIVE:
            moveCubeTwice(array, arrayCenter, moveF, true, makeWhiteCrossStep);
            break;
        default:
            moveCubeTwice(array, arrayCenter, moveL, true, makeWhiteCrossStep);
            break;
    }

}

const whiteEdgeOnSides = function(array, arrayCenter, nSide, nWhite,)
{
    moveSideToFront(array, arrayCenter, nSide, true, makeWhiteCrossStep);
    
    let moveTurns = 0;
    
    if(nWhite == POSITION_FIVE)
    {
        moveCubeReverse(array, arrayCenter, moveF, true, makeWhiteCrossStep);
        nWhite = POSITION_THREE;
    }

    if(nWhite == POSITION_ONE)
    {
        moveTurns = spaceOnWhite(array, nWhite); 
        adjustSide(array, arrayCenter, moveD, true, moveTurns, makeWhiteCrossStep);
        
        moveCube(array, arrayCenter, moveF, true, makeWhiteCrossStep);
        nWhite = POSITION_THREE;
    }

    if(nWhite == POSITION_THREE)
    {
        moveTurns = spaceOnWhite(array, nWhite); 
        adjustSide(array, arrayCenter, moveD, true, moveTurns, makeWhiteCrossStep);
        
        moveCubeReverse(array, arrayCenter, moveR, true, makeWhiteCrossStep);
    }


    if(nWhite == POSITION_SEVEN)
    {
        moveTurns = spaceOnWhite(array, nWhite);
        adjustSide(array, arrayCenter, moveD, true, moveTurns, makeWhiteCrossStep);

        moveCube(array, arrayCenter, moveL, true, makeWhiteCrossStep);
    }


}

export const makeWhiteCross = function(array, arrayCenter)
{
    while(countWhiteCross(array) != PIECE_NUM)
    {
        findEdge(array, WHITE_CHAR, piece)

        if(piece.side == UP)
        {
            whiteEdgeOnYellow(array, arrayCenter, piece.position);
        }
        else
        {
            whiteEdgeOnSides(array, arrayCenter, piece.side, piece.position);
        }

    }

    // makeWhiteCrossStep.print();

}


// Orient White Cross ----------------------------------------------------------

const countRightWhiteEdges = function(array, arrayCenter)
{
    let countEdge = 0;
    let indexRow = 0;

    for(let index = 0; index < PIECE_NUM; index++)
    {  
        indexRow = index + FRONT;
        if(array[indexRow][POSITION_FIVE] == arrayCenter[indexRow])
        {
            countEdge++;
        }
    }

    return countEdge;
}

const whiteEdgeColor = function(array, arrayCenter)     // returns the first wrong white edge
{
    let color = 0; 
    let indexRow = 0;

    for(let index = 0; index < PIECE_NUM; index++)
    {
        indexRow = index + FRONT;

        if(array[indexRow][POSITION_FIVE] != arrayCenter[indexRow])
        {
            color = indexRow;
            index = ROW;     // exit the for loop
        }
    }

    return color;
}

const setTwoWhiteCross = function (array, arrayCenter, centerColor)
{
    let difference = PIECE_NUM - (centerColor - FRONT);

    moveCubeTwice(array, arrayCenter, moveF, true, orientWhiteCrossStep);         

    adjustSide(array, arrayCenter, moveU, true, difference, orientWhiteCrossStep);    

    if(difference == MOVE_ONE)
    {
        moveCubeTwice(array, arrayCenter, moveL, true, orientWhiteCrossStep);     
    }
    else if(difference == MOVE_TWO)
    {
        moveCubeTwice(array, arrayCenter, moveB, true, orientWhiteCrossStep);     
    }
    else if(difference == MOVE_THREE)
    {
        moveCubeTwice(array, arrayCenter, moveR, true, orientWhiteCrossStep);     
    }

    let oppositeDifference = PIECE_NUM - difference;

    adjustSide(array, arrayCenter, moveU, true, oppositeDifference, orientWhiteCrossStep);    

    moveCubeTwice(array, arrayCenter, moveF, true, orientWhiteCrossStep);

}

const setThreeWhiteCross = function(array, arrayCenter, positionToMove)
{
    let difference = PIECE_NUM - (positionToMove - FRONT);

    moveCubeTwice(array, arrayCenter, moveF, true, orientWhiteCrossStep);        

    adjustSide(array, arrayCenter, moveU, true, difference, orientWhiteCrossStep);    

    let positionNow = 0;

    if(difference == MOVE_ONE)
    {
        moveCubeTwice(array, arrayCenter, moveL, true, orientWhiteCrossStep);    
        positionToMove = sideIndex(array, arrayCenter, LEFT, POSITION_ONE);
        positionNow = LEFT;
    }
    else if(difference == MOVE_TWO)
    {
        moveCubeTwice(array, arrayCenter, moveB, true, orientWhiteCrossStep);     
        positionToMove = sideIndex(array, arrayCenter, BEHIND, POSITION_ONE);
        positionNow = BEHIND;
    }
    else if(difference == MOVE_THREE)
    {
        moveCubeTwice(array, arrayCenter, moveR, true, orientWhiteCrossStep);     
        positionToMove = sideIndex(array, arrayCenter, RIGHT, POSITION_ONE);
        positionNow = RIGHT;
    }

    let index = 0;

    while(arrayCenter[(positionNow - 1 + index)% PIECE_NUM + 1] != arrayCenter[positionToMove])
    {
        index++; 
    }

    difference = PIECE_NUM - index;

    adjustSide(array, arrayCenter, moveU, true, difference, orientWhiteCrossStep);
    
    
    if(positionToMove == LEFT)
        moveCubeTwice(array, arrayCenter, moveL, true, orientWhiteCrossStep);   
    else if(positionToMove == BEHIND)
        moveCubeTwice(array, arrayCenter, moveB, true, orientWhiteCrossStep);  
    else if(positionToMove == RIGHT)
        moveCubeTwice(array, arrayCenter, moveR, true, orientWhiteCrossStep);    


    difference = positionToMove - 1;
    adjustSide(array, arrayCenter, moveU, true, difference, orientWhiteCrossStep);   

    moveCubeTwice(array, arrayCenter, moveF, true, orientWhiteCrossStep);  

}

export const orientWhiteCross = function(array, arrayCenter)
{
    let numEdges = countRightWhiteEdges(array, arrayCenter);

    let nothing_right = 0;

    if(numEdges == nothing_right)
    {
        let indexMove = 0;

        while(numEdges == nothing_right)
        {
            moveCube(array, arrayCenter, moveD, false, orientWhiteCrossStep);
            indexMove++;
            numEdges = countRightWhiteEdges(array, arrayCenter);
        }

        let move = "";

        if(indexMove == MOVE_ONE)
            move = "D";
        else if(indexMove == MOVE_TWO)
            move = "D2";
        else
            move = "D'"

        orientWhiteCrossStep.update(array, arrayCenter, move);

    }

    if(numEdges != PIECE_NUM)
    {        
        let initialColor = whiteEdgeColor(array, arrayCenter);

        moveSideToFront(array, arrayCenter, initialColor, true, orientWhiteCrossStep);
        
        let positionToMove = sideIndex(array, arrayCenter, FRONT, POSITION_FIVE);

        if(numEdges == 2)   // there are two right edges
        {
            setTwoWhiteCross(array, arrayCenter, positionToMove);
        }
        else if (numEdges == 1) // there are one right edge
        {
            setThreeWhiteCross(array, arrayCenter, positionToMove);
        }

    }

    // orientWhiteCrossStep.print();

}

// Make White Corners alredy oriented -------------------------------------------

const countRightWhiteCorners = function(array, arrayCenter)
{
    let countCorners = 0;
    let even = 0;

    for(let index = 0; index < PIECE_NUM; index++)
    {
        even = index*2;

        if(array[DOWN][even] == WHITE_CHAR)
        {
            if(array[index + FRONT][POSITION_FIVE] == arrayCenter[index + FRONT])
            {
                countCorners++;
            }
        }
    }

    return countCorners;
}

const moveWhiteCornerTopLeft = function(array, arrayCenter, solutionObject)
{
    moveCubeReverse(array, arrayCenter, moveU, true, solutionObject);
    moveCubeReverse(array, arrayCenter, moveL, true, solutionObject);
    moveCube(array, arrayCenter, moveU, true, solutionObject);
    moveCube(array, arrayCenter, moveL, true, solutionObject);
}

const moveWhiteCornerTopRight = function(array, arrayCenter, solutionObject)
{
    moveCube(array, arrayCenter, moveU, true, solutionObject);   
    moveCube(array, arrayCenter, moveR, true, solutionObject);    
    moveCubeReverse(array, arrayCenter, moveU, true, solutionObject);    
    moveCubeReverse(array, arrayCenter, moveR, true, solutionObject);  
}

const moveWhiteCornerTopSide = function(array, arrayCenter, centerIndex, whiteIndex)
{
    if(centerIndex != FRONT)
    {
        moveSideToFront(array, arrayCenter, centerIndex, true, makeWhiteCornersStep);
        centerIndex = FRONT;
    }

    cornerIndex(array, arrayCenter, centerIndex, whiteIndex, piece);    // get cornerTop and cornerLeft

    let moveTimes = 0;
    let sideColor = 0;

    if(whiteIndex == POSITION_ZERO)
    {
        moveTimes = piece.cornerLeft;
        sideColor = piece.cornerTop;
    }
    else if(whiteIndex == POSITION_TWO)
    {
        moveTimes = piece.cornerLeft - MOVE_ONE;
        sideColor = piece.cornerLeft;
    }

    moveTimes = PIECE_NUM - moveTimes;

    adjustSide(array, arrayCenter, moveU, true, moveTimes, makeWhiteCornersStep);

    moveSideToFront(array, arrayCenter, sideColor, true, makeWhiteCornersStep);

    if(whiteIndex == POSITION_ZERO)
    {
        moveWhiteCornerTopLeft(array, arrayCenter, makeWhiteCornersStep);
    }
    else if(whiteIndex == POSITION_TWO)
    {
        moveWhiteCornerTopRight(array, arrayCenter, makeWhiteCornersStep);
    }

}

const moveWhiteCornerTopTop = function(array, arrayCenter, whiteIndex)
{
    cornerIndex(array, arrayCenter, UP, whiteIndex, piece);

    let colorTopStr = arrayCenter[piece.cornerTop];
    let colorLeftStr = arrayCenter[piece.cornerLeft];

    let moveBack = 0; 

    while(whiteIndex != POSITION_FOUR)
    {
        moveCube(array, arrayCenter, moveU, false, makeWhiteCornersStep);  
        whiteIndex = (whiteIndex + 2)%COLUMN;
        moveBack++;
    }

    let moveCubeTimes = moveBack;

    while(moveBack > 0)
    {
        moveCubeReverse(array, arrayCenter, moveU, false, makeWhiteCornersStep);
        moveBack--;
    }

    moveBack = moveCubeTimes;

    while(moveBack > 0) // have the corner on FAKE FRONT TOP RIGHT 
    {
        moveEntireCubeYNormal(array, arrayCenter, false, makeWhiteCornersStep);
        moveBack--;
    }

    let difference = 0;

    for(let index = 0; index < ROW; index++)
    {
        if(arrayCenter[index] == colorLeftStr)
        {
            difference = index - FRONT;     // gets how many moves I need to make
        }
    }

    moveBack = moveCubeTimes;

    while(moveBack > 0)     // gets cube on its original position
    {
        moveEntireCubeYReverse(array, arrayCenter, false, makeWhiteCornersStep);  
        moveBack--;
    }

    difference = PIECE_NUM - difference;
    // move corner to its position

    adjustSide(array, arrayCenter, moveU, true, difference, makeWhiteCornersStep);  


    let entireCube = 0;

    while(array[FRONT][POSITION_TWO] != colorTopStr || array[RIGHT][POSITION_ZERO] != colorLeftStr)
    {
        moveEntireCubeYNormal(array, arrayCenter, false, makeWhiteCornersStep);
        entireCube++; 
    }

    moveBack = entireCube;

    if(moveBack != 0)   // if I need to move cube
    {
        while(moveBack > 0)
        {
            moveEntireCubeYReverse(array, arrayCenter, false, makeWhiteCornersStep);
            moveBack--;
        }

        // move Cube
        if(entireCube == MOVE_ONE)
            moveEntireCubeYNormal(array, arrayCenter, true, makeWhiteCornersStep);   
        else if(entireCube == MOVE_TWO)
            moveEntireCubeYTwice(array, arrayCenter, true, makeWhiteCornersStep);  
        else if(entireCube == MOVE_THREE)
            moveEntireCubeYReverse(array, arrayCenter, true, makeWhiteCornersStep);

    }

    // corner is the right position: FRONT TOP RIGHT


    moveCube(array, arrayCenter, moveR, true, makeWhiteCornersStep);
    moveCubeTwice(array, arrayCenter, moveU, true, makeWhiteCornersStep);
    moveCubeReverse(array, arrayCenter, moveR, true, makeWhiteCornersStep);
    moveCubeReverse(array, arrayCenter, moveU, true, makeWhiteCornersStep);
    moveCube(array, arrayCenter, moveR, true, makeWhiteCornersStep);
    moveCube(array, arrayCenter, moveU, true, makeWhiteCornersStep);
    moveCubeReverse(array, arrayCenter, moveR, true, makeWhiteCornersStep);
}

const moveWhiteCornerBotSide = function(array, arrayCenter, centerIndex, whiteIndex)
{
    moveSideToFront(array, arrayCenter, centerIndex, true, makeWhiteCornersStep);

    if(whiteIndex == POSITION_FOUR)
    {
        moveCube(array, arrayCenter, moveR, true, makeWhiteCornersStep);
        moveCubeReverse(array, arrayCenter, moveU, true, makeWhiteCornersStep);
        moveCubeReverse(array, arrayCenter, moveR, true, makeWhiteCornersStep);
    }
    else if(whiteIndex == POSITION_SIX)
    {
        moveCubeReverse(array, arrayCenter, moveL, true, makeWhiteCornersStep);
        moveCube(array, arrayCenter, moveU, true, makeWhiteCornersStep);   
        moveCube(array, arrayCenter, moveL, true, makeWhiteCornersStep);  
    }
}

const findWrongWhiteCornerBot = function(array, arrayCenter)
{
    let whiteIndex = 0;
    let turnCube = 0;
    let found = false;

    do
    {
        cornerIndex(array, arrayCenter, DOWN, whiteIndex, piece, makeWhiteCornersStep);

        if( (whiteIndex/2)+1 != piece.cornerTop)
        {
            found = true;
        }
        else
        {
            turnCube++;
            whiteIndex = whiteIndex + 2;
        }

    }while(!found);

    return turnCube + FRONT;
}

const moveWhiteCornerBotBot = function(array, arrayCenter)
{
    let wrongFace = 0;

    wrongFace = findWrongWhiteCornerBot(array, arrayCenter);

    moveSideToFront(array, arrayCenter, wrongFace, true, makeWhiteCornersStep);

    moveCubeReverse(array, arrayCenter, moveL, true, makeWhiteCornersStep);
    moveCubeReverse(array, arrayCenter, moveU, true, makeWhiteCornersStep);
    moveCube(array, arrayCenter, moveL, true, makeWhiteCornersStep);

}

export const makeWhiteCorners = function(array, arrayCenter)
{
    let sideIndex = 0;
    let positionIndex = 0;

    while(countRightWhiteCorners(array, arrayCenter) != PIECE_NUM)
    {
        // makeWhiteCornersStep.formula.push("<br>");

        findCorner(array, WHITE_CHAR, piece);

        sideIndex = piece.side;
        positionIndex = piece.position;

        if(sideIndex == UP)
        {
            moveWhiteCornerTopTop(array, arrayCenter, positionIndex);
        }
        else if(sideIndex != DOWN && (positionIndex == POSITION_ZERO || positionIndex == POSITION_TWO))
        {
            moveWhiteCornerTopSide(array, arrayCenter, sideIndex, positionIndex);
        }
        else if(sideIndex != DOWN && (positionIndex == POSITION_FOUR || positionIndex == POSITION_SIX))
        {
            moveWhiteCornerBotSide(array, arrayCenter, sideIndex, positionIndex);
        }
        else
        {
            moveWhiteCornerBotBot(array, arrayCenter);
        }
    }

    // makeWhiteCornersStep.print();

}

// Make Second Layer --------------------------------------------------------------------

const countRightEdgeSL = function(array, arrayCenter)
{
    let countEdge = 0;

    for(let index = 0; index < PIECE_NUM; index++)
    {
        if(array[FRONT][POSITION_THREE] == arrayCenter[FRONT] && array[RIGHT][POSITION_SEVEN] == arrayCenter[RIGHT])
        {
            countEdge++;
        }

        moveEntireCubeYNormal(array, arrayCenter, false, makeSecondLayerStep);
    }

    return countEdge;
}

const findSLEdgeTop = function(array, arrayCenter, color)
{
    let nPosition = -1;
    let tempPosition = 0;

    for(let indexCol = 0; indexCol < PIECE_NUM; indexCol++)
    {
        tempPosition = (2*indexCol) + 1;

        if(array[UP][tempPosition] != color)
        {
            let iEdge = edgeIndex(array, arrayCenter, UP, tempPosition, makeSecondLayerStep);

            if(iEdge != UP)
            {
                nPosition = tempPosition;
                indexCol = PIECE_NUM;       // exit loop
            }
        }
    }

    return nPosition;
}

const moveSLTopLeft = function(array, arrayCenter, solutionObject)
{
    moveWhiteCornerTopLeft(array, arrayCenter, solutionObject);
    moveEntireCubeYReverse(array, arrayCenter, true, solutionObject);
    moveWhiteCornerTopRight(array, arrayCenter, solutionObject);
}

const moveSLTopRight = function(array, arrayCenter, solutionObject)
{
    moveWhiteCornerTopRight(array, arrayCenter, solutionObject);
    moveEntireCubeYNormal(array, arrayCenter, true, solutionObject);
    moveWhiteCornerTopLeft(array, arrayCenter, solutionObject);
}

const moveSLTop = function(array, arrayCenter, positionEdgeTop, nEdgeSide)
{
    makeSecondLayerStep.formula.push("<br>");


    let edgeTopColor = array[UP][positionEdgeTop];  // the position of the top edge on the yellow side
    let edgeSideColor = arrayCenter[nEdgeSide];     // index of the color of that face that needs to go

    moveSideToFront(array, arrayCenter, nEdgeSide, true, makeSecondLayerStep);


    let moveUInt = 0;
    let repeat = true;

    for(let index = 0; index < PIECE_NUM; index++)
    {
        if(arrayCenter[index + FRONT] == edgeTopColor)      // get new index of positionEdgeTop
            positionEdgeTop = index + FRONT;

        if( (array[FRONT][POSITION_ONE] != edgeSideColor || array[UP][POSITION_FIVE] != edgeTopColor) && repeat)
        {
            moveUInt++;     // get how many moveU is needed to position edge on front
        }
        else
        {
            repeat = false;
        }

        moveCube(array, arrayCenter, moveU, false, makeSecondLayerStep);
    }

    adjustSide(array, arrayCenter, moveU, true, moveUInt, makeSecondLayerStep); // put edge on front

    if(positionEdgeTop == RIGHT)
    {
        moveSLTopRight(array, arrayCenter, makeSecondLayerStep);
    }   
    else if(positionEdgeTop == LEFT)
    {
        moveSLTopLeft(array, arrayCenter, makeSecondLayerStep);
    }

}

const wrongSLEdgeMiddle = function(array, arrayCenter)
{
    let wrongEdge = 0;
    let indexOne = 0;
    let indexTwo = 0;

    for(let index = 0; index < PIECE_NUM; index++)
    {
        indexOne = index + 1;
        indexTwo = (index + 3)%4 + 1;
        if(arrayCenter[indexOne] != array[indexOne][POSITION_SEVEN] && arrayCenter[indexTwo] != array[indexTwo][POSITION_THREE])
        {
            wrongEdge = indexOne;
        }
    }

    moveSideToFront(array, arrayCenter, wrongEdge, true, makeSecondLayerStep);

    moveCubeReverse(array, arrayCenter, moveL, true, makeSecondLayerStep);
    moveCube(array, arrayCenter, moveU, true, makeSecondLayerStep);
    moveCube(array, arrayCenter, moveL, true, makeSecondLayerStep);
    moveEntireCubeYReverse(array, arrayCenter, true, makeSecondLayerStep);
    moveWhiteCornerTopRight(array, arrayCenter, makeSecondLayerStep);
}

export const makeSecondLayer = function(array, arrayCenter)
{
    while(countRightEdgeSL(array, arrayCenter) != PIECE_NUM)
    {
        let edgeTopPosition = findSLEdgeTop(array, arrayCenter, YELLOW_CHAR);

        if(edgeTopPosition != -1)
        {
            let edgeSideIndex = edgeIndex(array, arrayCenter, UP, edgeTopPosition, makeSecondLayerStep);
            moveSLTop(array, arrayCenter, edgeTopPosition, edgeSideIndex);
        }
        else
        {
            wrongSLEdgeMiddle(array, arrayCenter);
        }
    }

    // makeSecondLayerStep.print();
}

// Make Yellow Cross -------------------------------------------------------------------

const countYellowEdges = function(array)
{
    let countEdges = 0;
    let odd = 0;

    for(let index = 0; index < PIECE_NUM; index++)
    {
        odd = (index*2) + 1;

        if(array[UP][odd] == YELLOW_CHAR)
        {
            countEdges++;
        }
    }
    return countEdges;
}

const moveYellowCross = function(array, arrayCenter)
{
    moveCube(array, arrayCenter, moveF, true, makeYellowCrossStep);
    moveCube(array, arrayCenter, moveR, true, makeYellowCrossStep);
    moveCube(array, arrayCenter, moveU, true, makeYellowCrossStep);
    moveCubeReverse(array, arrayCenter, moveR, true, makeYellowCrossStep);
    moveCubeReverse(array, arrayCenter, moveU, true, makeYellowCrossStep);
    moveCubeReverse(array, arrayCenter, moveF, true, makeYellowCrossStep);
}

const moveYellowCrossTwoEdges = function(array, arrayCenter)
{
    findEdge(array, YELLOW_CHAR, piece);

    let difference = (7 - piece.position) / 2;

    if(array[UP][7] == YELLOW_CHAR && (piece.position == POSITION_ONE || piece.position == POSITION_THREE))
        difference = 0;     // dont need to move

    adjustSide(array, arrayCenter, moveU, true, difference, makeYellowCrossStep); 

    moveYellowCross(array, arrayCenter);
}

export const makeYellowCross = function(array, arrayCenter)
{
    while(countYellowEdges(array) != PIECE_NUM)
    {
        let countEdges = countYellowEdges(array);

        if(countEdges == 0)
        {
            moveYellowCross(array, arrayCenter);
        }
        else if(countEdges == 2)
        {
            moveYellowCrossTwoEdges(array, arrayCenter);
        }
    }

    // makeYellowCrossStep.print();
}

// Make Yellow Corners --------------------------------------------------------------------

const countYellowCorners = function(array)
{
    let countCorners = 0;
    let even = 0;

    for(let index = 0; index < PIECE_NUM; index++)
    {
        even = index*2;

        if(array[UP][even] == YELLOW_CHAR)
        {
            countCorners++;
        }
    }
    return countCorners;
}

const moveYellowCorners = function(array, arrayCenter)
{
    moveCube(array, arrayCenter, moveR, true, makeYellowCornersStep);
    moveCube(array, arrayCenter, moveU, true, makeYellowCornersStep);
    moveCubeReverse(array, arrayCenter, moveR, true, makeYellowCornersStep);
    moveCube(array, arrayCenter, moveU, true, makeYellowCornersStep);
    moveCube(array, arrayCenter, moveR, true, makeYellowCornersStep);
    moveCubeTwice(array, arrayCenter, moveU, true, makeYellowCornersStep);
    moveCubeReverse(array, arrayCenter, moveR, true, makeYellowCornersStep);
}

const moveYellowCornersReverse = function(array, arrayCenter)
{
    moveCubeReverse(array, arrayCenter, moveR, true, makeYellowCornersStep);
    moveCubeReverse(array, arrayCenter, moveU, true, makeYellowCornersStep);
    moveCube(array, arrayCenter, moveR, true, makeYellowCornersStep);
    moveCubeReverse(array, arrayCenter, moveU, true, makeYellowCornersStep);
    moveCubeReverse(array, arrayCenter, moveR, true, makeYellowCornersStep);
    moveCubeTwice(array, arrayCenter, moveU, true, makeYellowCornersStep);
    moveCube(array, arrayCenter, moveR, true, makeYellowCornersStep);
}

const oneYellowCorner = function(array, arrayCenter)
{
    let moveUInt = 0;
    let repeat = true;

    for(let indexRow = 0; indexRow < PIECE_NUM; indexRow++)
    {
        if(array[UP][POSITION_SIX] != YELLOW_CHAR && repeat)
        {
            moveUInt++;
        }
        else
        {
            repeat = false;
            if(array[UP][POSITION_SIX] == YELLOW_CHAR && array[FRONT][POSITION_TWO] != YELLOW_CHAR)
                moveUInt++;
        }

        moveCube(array, arrayCenter, moveU, false, makeYellowCornersStep);
    }

    adjustSide(array, arrayCenter, moveU, true, moveUInt, makeYellowCornersStep); 

    if(array[FRONT][POSITION_TWO] == YELLOW_CHAR)
    {
        moveYellowCorners(array, arrayCenter);
    }
    else
    {
        moveYellowCornersReverse(array, arrayCenter);
    }

}

const noYellowCorners = function(array, arrayCenter)
{
    let moveUInt = 0;

    if(array[LEFT][POSITION_ZERO] != YELLOW_CHAR || array[LEFT][POSITION_TWO] != YELLOW_CHAR) // not the right position
    {
        for(let indexSide = FRONT; indexSide < PIECE_NUM; indexSide++)
        {
            if(array[indexSide][POSITION_ZERO] == YELLOW_CHAR && array[indexSide][POSITION_TWO] == YELLOW_CHAR)
            {
                moveUInt = indexSide;
                indexSide = PIECE_NUM;
            }
        }
    }

    adjustSide(array, arrayCenter, moveU, true, makeYellowCornersStep);

    moveYellowCorners(array, arrayCenter);
}

const twoYellowCorners = function(array, arrayCenter)
{
    let repeat = true;
    let conditionOne = false;
    let conditionTwo = false;
    let moveUInt = 0;

    for(let index = 0; index < PIECE_NUM; index++)
    {
        conditionOne = (array[UP][POSITION_ZERO] == YELLOW_CHAR);
        conditionTwo = (array[UP][POSITION_TWO] == YELLOW_CHAR || array[UP][POSITION_FOUR] == YELLOW_CHAR);

        if(array[UP][POSITION_FOUR] == YELLOW_CHAR)
            conditionTwo = (array[FRONT][POSITION_ZERO] == YELLOW_CHAR);

        if((!conditionOne || !conditionTwo) && repeat)
            moveUInt++;
        else
            repeat = false;

        moveCube(array, arrayCenter, moveU, false, makeYellowCornersStep);
    }

    adjustSide(array, arrayCenter, moveU, true, moveUInt, makeYellowCornersStep);

    moveYellowCorners(array, arrayCenter);
}

export const makeYellowCorners = function(array, arrayCenter)
{
    while(countYellowCorners(array) != PIECE_NUM)
    {
        let countCorners = countYellowCorners(array);

        makeYellowCornersStep.formula.push("<br>");

        if(countCorners == 0)
        {
            noYellowCorners(array, arrayCenter);
        }
        else if(countCorners == 1)
        {
            oneYellowCorner(array, arrayCenter);
        }
        else if(countCorners == 2)
        {
            twoYellowCorners(array, arrayCenter);
        }
    }

    // makeYellowCornersStep.print();
}

// Orient Yellow Corners -------------------------------------------------------------------------------------------

const findTwoRightYellowCorners = function(array, arrayCenter)
{
    let position = -1;
    let repeat = true;

    for(let index = 0; index < PIECE_NUM; index++)
    {
        if(array[BEHIND][POSITION_ZERO] == array[BEHIND][POSITION_TWO] && repeat)
        {
            position = index;
            repeat = false;
        }

        moveCube(array, arrayCenter, moveU, false, orientYellowCornersStep);
    }

    return position;
}

const moveYellowCornersOrientation = function(array, arrayCenter)
{
    moveEntireCubeXReverse(array, arrayCenter, true, orientYellowCornersStep);
    moveCubeReverse(array, arrayCenter, moveR, true, orientYellowCornersStep);
    moveCube(array, arrayCenter, moveD, true, orientYellowCornersStep);
    moveCubeReverse(array, arrayCenter, moveR, true, orientYellowCornersStep);
    moveCubeTwice(array, arrayCenter, moveU, true, orientYellowCornersStep);
    moveCube(array, arrayCenter, moveR, true, orientYellowCornersStep);
    moveCubeReverse(array, arrayCenter, moveD, true, orientYellowCornersStep);
    moveCubeReverse(array, arrayCenter, moveR, true, orientYellowCornersStep);
    moveCubeTwice(array, arrayCenter, moveU, true, orientYellowCornersStep);
    moveCubeTwice(array, arrayCenter, moveR, true, orientYellowCornersStep);
    moveEntireCubeXNormal(array, arrayCenter, true, orientYellowCornersStep);
}

export const orientYellowCorners = function(array, arrayCenter)
{
    let cornerPosition = findTwoRightYellowCorners(array, arrayCenter);

    if(cornerPosition == -1)    // nothing right
    {
        moveYellowCornersOrientation(array, arrayCenter);
        cornerPosition = findTwoRightYellowCorners(array, arrayCenter);     // get new position
    }

    // cornerPosition will be 0 1 2 3 

    adjustSide(array, arrayCenter, moveU, true, cornerPosition, orientYellowCornersStep);

    if(array[FRONT][POSITION_ZERO] != array[FRONT][POSITION_TWO])  // check if the two corners on the front is right
    {
        moveYellowCornersOrientation(array, arrayCenter);
    }

    // orientYellowCornersStep.print();

}

// Orient Yellow Cross ------------------------------------------------------------------------------------------

const findOneRightYellowEdge = function(array, arrayCenter)
{
    let position = -1;
    let repeat = true;

    for(let index = 0; index < PIECE_NUM; index++)
    {
        if(array[FRONT][POSITION_ZERO] == array[FRONT][POSITION_ONE] && repeat)
        {
            position = index;
            repeat = false;
        }

        moveCube(array, arrayCenter, moveU, false, orientYellowCrossStep);
    }

    return position+1;
}

const moveYellowEdgesRight = function(array, arrayCenter)
{
    moveCubeTwice(array, arrayCenter, moveF, true, orientYellowCrossStep);
    moveCubeReverse(array, arrayCenter, moveU, true, orientYellowCrossStep);
    moveMiddleReverse(array, arrayCenter, true, orientYellowCrossStep);
    moveCubeTwice(array, arrayCenter, moveU, true, orientYellowCrossStep);
    moveMiddleNormal(array, arrayCenter, true, orientYellowCrossStep);
    moveCubeReverse(array, arrayCenter, moveU, true, orientYellowCrossStep);
    moveCubeTwice(array, arrayCenter, moveF, true, orientYellowCrossStep);
}

const moveYellowEdgesLeft = function(array, arrayCenter)
{
    moveCubeTwice(array, arrayCenter, moveF, true, orientYellowCrossStep);
    moveCube(array, arrayCenter, moveU, true, orientYellowCrossStep);
    moveMiddleReverse(array, arrayCenter, true, orientYellowCrossStep);
    moveCubeTwice(array, arrayCenter, moveU, true, orientYellowCrossStep);
    moveMiddleNormal(array, arrayCenter, true, orientYellowCrossStep);
    moveCube(array, arrayCenter, moveU, true, orientYellowCrossStep);
    moveCubeTwice(array, arrayCenter, moveF, true, orientYellowCrossStep);
}

export const orientYellowCross = function(array, arrayCenter)
{    
    // position of the right layer 
    let edgeSidePosition = findOneRightYellowEdge(array, arrayCenter); 

    if(edgeSidePosition == 0)  // there is no right yellow edge
    {
        moveYellowEdgesRight(array, arrayCenter);
        edgeSidePosition = findOneRightYellowEdge(array, arrayCenter);  // make sure there is one edge is right
    }

    let rightCenter = sideIndex(array, arrayCenter, edgeSidePosition, POSITION_ONE);

    let moveUInt = 0;
    let repeat = true;

    for(let index = 0; index < PIECE_NUM; index++)
    {
        if( ( (edgeSidePosition + index - 1)%PIECE_NUM + 1 == rightCenter) && repeat)
        {
            moveUInt = index;
            repeat = false;
        }
    }

    if(moveUInt == 0)
        moveUInt = PIECE_NUM;

    moveUInt = PIECE_NUM - moveUInt;

    // ensure the right edge is on its side
    adjustSide(array, arrayCenter, moveU, true, moveUInt, orientYellowCrossStep);

    if(rightCenter != BEHIND)
    {
        rightCenter = ((rightCenter + 1) % 4) + 1;
    }

    if(array[BEHIND][POSITION_ZERO] != array[BEHIND][POSITION_ONE] || array[FRONT][POSITION_ONE] != array[FRONT][POSITION_ZERO]) 
    {                                       // check if the front layer is right
        // move right side to the back
        if(rightCenter != BEHIND)   // check if right side is already in the back or not
        {
            moveSideToFront(array, arrayCenter, rightCenter, true, orientYellowCrossStep);
        }

        if(array[FRONT][POSITION_ONE] == arrayCenter[RIGHT])
        {
            moveYellowEdgesRight(array, arrayCenter);
        }
        else if(array[FRONT][POSITION_ONE] == arrayCenter[LEFT])
        {
            moveYellowEdgesLeft(array, arrayCenter);
        }
    }

}

// Check if one or more steps are not needed -----------------------------------------------------------------------

export const printFormulaSteps = function()
{
    let totalSteps = 9;
    let step;

    for(let index = 0; index < totalSteps; index++)
    {
        step = chooseSolution(index);

        if(step.formula == "")
        {
            step.formula.push("This step is already done!");
        }

        step.print();
    }

}