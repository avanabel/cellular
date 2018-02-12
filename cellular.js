//VARIABLE DECLARATIONS
//Adjustable parameters
var cellSize = 5; //pixel size of the cells
var cellCountX = 100; //cells per row
var cellCountY = 60; //cells per column
var cellSideWidth = 2; //size of the lines dividing the board

var colorDeadOne = "#000000";
var colorLiveOne = "#FFFFFF";
var colorDeadTwo = "#000000";
var colorLiveTwo = "#CCFFFF";

var ruleDeadOne = {born: [3], surv: [2,3]};
var ruleLiveOne = {born: [3], surv: [1,2,3,4,5,6,7,8]};
var ruleLiveTwo = {born: [3], surv: [2,3]};
var ruleDeadTwo = {born: [3], surv: [2,3]};


//Constructed objects
var intervalID = 0; //used to toggle the SetInterval

var board_one = [];

var board_two = [];


//FUNCTION DECLARATIONS




//Function which takes inputs numRow, numCol and a switch statement and returns a double array (numRow by numCol) populated with all zeroes or random inputs
function newBoard(numRow, numCol, mode) {
	var cells = [];
	if (mode == 0) {
		for (i = 0; i < numRow; i++) {
			cells[i] = [];
			for(j = 0; j < numCol; j++) {
				cells[i][j] = 0;
			}
		}
	}
	else if (mode !== 0) {
		for(i = 0; i < numRow; i++) {
			cells[i] = [];
			for(j = 0; j < numCol; j++) {
				cells[i][j] = Math.floor(Math.random()*2);
			}
		}
	}
	return cells;
}

//Function which makes 

//Function which draws the grid of the board
function drawGrid(canvas) {
	var context = canvas.getContext("2d");

	//fill edges
	context.fillStyle = colorDeadOne;
	context.strokeStyle = "#000000";
	context.lineWidth   = cellSideWidth;
    for (i = 0; i < cellCountX; i++) {
		for (j = 0; j < cellCountY; j++) {
            context.strokeRect(i*cellSize,j*cellSize,cellSize,cellSize);
		}
	}
}

//Function which takes input board and draws the board on the canvas
function drawBoard(canvas1, canvas2, board1, board2) {
	var context1 =  canvas1.getContext('2d');
	var context2 = canvas2.getContext('2d');
	
	context1.fillStyle = colorDeadOne;
	context2.fillStyle = colorDeadOne;
	for (j = 0; j < cellCountY; j++) {
		for (i = 0; i < cellCountX; i++) {
			if (!board1[j][i] && !board2[j][i]) {
        context1.fillRect(i*cellSize,j*cellSize,cellSize-cellSideWidth/2,cellSize-cellSideWidth/2);
     		context2.fillRect(i*cellSize,j*cellSize,cellSize-cellSideWidth/2,cellSize-cellSideWidth/2);
      }
		}
	}

	context1.fillStyle = colorDeadTwo;
	context2.fillStyle = colorDeadTwo;
	for (j = 0; j < cellCountY; j++) {
		for (i = 0; i < cellCountX; i++) {
      if (!board1[j][i] && board2[j][i]) {
        context1.fillRect(i*cellSize,j*cellSize,cellSize-cellSideWidth/2,cellSize-cellSideWidth/2);
      }
      if (!board2[j][i] && board1[j][i]) {
      	context2.fillRect(i*cellSize,j*cellSize,cellSize-cellSideWidth/2,cellSize-cellSideWidth/2);
      }
		}
	}

	context1.fillStyle = colorLiveOne;
	context2.fillStyle = colorLiveOne;
	for (j = 0; j < cellCountY; j++) {
		for (i = 0; i < cellCountX; i++) {
      if (board1[j][i] && !board2[j][i]) {
        context1.fillRect(i*cellSize,j*cellSize,cellSize-cellSideWidth/2,cellSize-cellSideWidth/2);
      }
      if (board2[j][i] && !board1[j][i]) {
      	context2.fillRect(i*cellSize,j*cellSize,cellSize-cellSideWidth/2,cellSize-cellSideWidth/2);
      }
		}
	}

	context1.fillStyle = colorLiveTwo;
	context2.fillStyle = colorLiveTwo;
	for (j = 0; j < cellCountY; j++) {
		for (i = 0; i < cellCountX; i++) {
      if (board1[j][i] && board2[j][i]) {
        context1.fillRect(i*cellSize,j*cellSize,cellSize-cellSideWidth/2,cellSize-cellSideWidth/2);
        context2.fillRect(i*cellSize,j*cellSize,cellSize-cellSideWidth/2,cellSize-cellSideWidth/2);
      }
    }
	}
}

//Function which takes a pair (i,j) and checks that they are within range, then returns the WRAPPED numbers (i-1,i+1,j-1,j+1)
function nbdWrap(i, j) {
	if (i == 0) {
		if (j == 0) {
			return [cellCountX-1,1,cellCountY-1,1];
		} else if (j == cellCountY-1) {
			return [cellCountX-1,1,cellCountY-2,0];
		} else {
			return [cellCountX-1,1,j-1,j+1];
		}
	} else if (i == cellCountX-1) {
		if (j == 0) {
			return [cellCountX-2,0,cellCountY-1,1];
		} else if (j == cellCountY-1) {
			return [cellCountX-2,0,cellCountY-2,0];
		} else {
			return [cellCountX-2,0,j-1,j+1];
		}
	} else {
		if (j == 0) {
			return [i-1,i+1,cellCountY-1,1];
		} else if (j == cellCountY-1) {
			return [i-1,i+1,cellCountY-2,0];
		} else {
			return [i-1,i+1,j-1,j+1];
		}
	}
}

//Function which takes a board and coordinates i and j, and returns the number of cells in Von Neumann nbd with value 1
function countNbd(board, i, j, debug) {
	var n = nbdWrap(i, j);
	if(debug == 'debug') {
		console.log('i: ' + i + ', j: ' + j);
		console.log(board[j][n[1]]);
		console.log(board[n[3]][n[1]]); 
		console.log(board[n[3]][i]); 
		console.log(board[n[3]][n[0]]);
    console.log(board[j][n[0]]); 
    console.log(board[n[2]][n[0]]); 
    console.log(board[n[2]][i]); 
    console.log(board[n[2]][n[1]]);
	}
	return board[j][n[1]] + board[n[3]][n[1]] + board[n[3]][i] + board[n[3]][n[0]]
           + board[j][n[0]] + board[n[2]][n[0]] + board[n[2]][i] + board[n[2]][n[1]];

}



//Function which takes input board and outputs the board after one Life generation
//Wrap around
function oneStep(board) {
	var nextBoard = [];
	for(j = 0; j < cellCountY; j++) {
		nextBoard[j] = [];
		for(i = 0; i < cellCountX - bordRight; i++) {
			nextBoard[j][i] = lTest(board, i, j, ruleLiveOne['born'], ruleLiveOne['surv']);
		}
		for(i = cellCountX - bordRight; i < cellCountX; i++) {
			nextBoard[j][i] = lTest(board, i, j, ruleDeadOne['born'], ruleDeadOne['surv']);
		}
	}
	return nextBoard;
}

//Duelling Boards

function duelBoardStep(board1, board2) {
	var newBoard1 = [];
	var newBoard2 = [];

	for(j = 0; j < cellCountY; j++) {
		newBoard1.push([]);
		for(i = 0; i < cellCountX; i++) {
			if(board2[j][i]) {
				newBoard1[j].push(lTest(board1, i, j, ruleLiveOne['born'], ruleLiveOne['surv']));
			} else {
				newBoard1[j].push(lTest(board1, i, j, ruleDeadOne['born'], ruleDeadOne['surv']));
			}
			
		}
	}

	for(j = 0; j < cellCountY; j++) {
		newBoard2.push([]);
		for(i = 0; i < cellCountX; i++) {
			if(board1[j][i]) {
				newBoard2[j].push(lTest(board2, i, j, ruleLiveTwo['born'], ruleLiveTwo['surv']));
			} else {
				newBoard2[j].push(lTest(board2, i, j, ruleDeadTwo['born'], ruleDeadTwo['surv']));
			}
			
		}
	}

	return [newBoard1, newBoard2];


}

//Tests whether the cell with coordinates (i,j) survives to the next round, provided rules born and surv
function lTest(board, i, j, born, surv) {
	var count = countNbd(board,i,j);
	var sBorn = new Set(born);
	var sSurv = new Set(surv);
		if(board[j][i] == 0) { //if cell is dead
			if(sBorn.has(count)) {
				return 1;
			} else {
				return 0;
			}
		} else {
			if(sSurv.has(count)) {
				return 1;
			} else {
				return 0;
			}
		}
}


// This is called when "One Step" is clicked.
function drawCells() {
	var canvas1 = document.getElementById('board1');
	var canvas2 = document.getElementById('board2');
	board_one = oneStep(board_one);
	board_two = oneStep(board_two);
	drawBoard(canvas1, board_one);
	drawBoard(canvas2, board_two);
}

function drawCells2() {
	var canvas1 = document.getElementById('board1');
	var canvas2 = document.getElementById('board2');
	[board_one, board_two] = duelBoardStep(board_one, board_two);
	drawBoard(canvas1, canvas2, board_one, board_two);
}



function boardRun() {
    if(!intervalID) {
        intervalID = window.setInterval(function() {
    		drawCells2();
    	}, 40);
    }
}

function boardPause() {
    window.clearInterval(intervalID);
    intervalID = 0;
}


function toggleCtrl() {
    document.getElementById('control-div').classList.toggle('ctrl-hid');
}

function updateSettings(form) {
    cellCountX = form.cellcountx.value;
    cellCountY = form.cellcounty.value;
    cellSize = form.cellsize.value;
    
    colorLiveOne = form.liveone.value;
    colorDeadOne = form.deadone.value;
    colorLiveTwo = form.livetwo.value;
    colorDeadTwo = form.deadtwo.value;
    
    initBoard();
    
}

function initBoard() {
    var canvas1 = document.getElementById('board1');
    var canvas2 = document.getElementById('board2');
    
    canvas1.setAttribute('width', cellCountX*cellSize);
	canvas1.setAttribute('height', cellCountY*cellSize);

    canvas2.setAttribute('width', cellCountX*cellSize);
	canvas2.setAttribute('height', cellCountY*cellSize);

    board_one = newBoard(cellCountY, cellCountX, 1);
    board_two = newBoard(cellCountY, cellCountX, 1);

    drawGrid(canvas1);
    drawGrid(canvas2);

		drawBoard(canvas1, canvas2, board_one, board_two);
}



//ACTION

window.onload = function() {
    initBoard();
}
