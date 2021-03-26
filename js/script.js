import { cube, cubeCenter, cubeCopy, cubeCenterCopy, scramble} from "./rubiksCubeMovements.js";
import { resetSolution } from "./rubiksCubeUsefulFunctions.js";
import { makeWhiteCross, orientWhiteCross, makeWhiteCorners, makeSecondLayer, makeYellowCross,
    makeYellowCorners, orientYellowCorners, orientYellowCross, printFormulaSteps} from "./rubiksCubeSolver.js";

document.querySelector("#scrambleButton").addEventListener("click", getValue);

function getValue (){
     
    let variable = document.querySelector("#scrambleInput").value;
    let variableCopy = variable;
    let arrayStorage = [];
    let index = 0;
    let stringCopy = "";
    resetSolution();        // reset storage if it has been used before


    // this will store the data in an array 
    while(variable.length > 0)
    {
        stringCopy = variable[0];
        
        if(variable.length === 1)       // the last one character 
        {
            variable = variable.substr(1);  // you can only subtract one character
        }
        else if(variable[1] === " ")     // it is only one character
        {
            variable = variable.substr(2);  // remove character and space
        }
        else                      // there are two characters to read
        {
            stringCopy = stringCopy + variable[1];  // add the second character
            variable = variable.substr(3);          // remove two characters and space
        }

        arrayStorage[index] = stringCopy;
        index++;
    }

    // this check the size and format of the input
    // it doesn't check the content
    if(variableCopy !== arrayStorage.join(" "))     // if the input is wrong
    {
        document.querySelector(".wrongInput").innerHTML = `Wrong Input! Please Try Again!`;
        return 0;
    }
    else
    {   // delete wrong input message 
        document.querySelector(".wrongInput").innerHTML = ``;
    }


    let solveCube = false;

    solveCube = scramble(cube, cubeCenter, arrayStorage, cubeCopy, cubeCenterCopy);

    if(solveCube)
    {
        makeWhiteCross(cube, cubeCenter);
        orientWhiteCross(cube, cubeCenter);
        makeWhiteCorners(cube, cubeCenter);
        makeSecondLayer(cube, cubeCenter);
        makeYellowCross(cube, cubeCenter);
        makeYellowCorners(cube, cubeCenter);
        orientYellowCorners(cube, cubeCenter);
        orientYellowCross(cube, cubeCenter);
        printFormulaSteps();

        // document.querySelector(".secretCube").innerHTML = `${cube.join(" ")}`;
        // document.querySelector(".secretCenter").innerHTML = `${cubeCenter.join(" ")}`;

    }
}

