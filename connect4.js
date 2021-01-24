/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure: */

let gameIsRunning = true;

const makeBoard = () => {
// TODO: set "board" to empty HEIGHT x WIDTH matrix array
for(let i = 0; i < HEIGHT; i++) { //creates empty nested arrays
  board.push([]);
  for (let j = 0; j < WIDTH; j++) { //fills each empty nested array with null and continually adds null into each nested array per for-loop
    board[i].push(null);
  }
}
}

/** makeHtmlBoard: make HTML table and row of column tops. */

const makeHtmlBoard = () => {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.querySelector('#board');
  // TODO: add comment for this code
  const top = document.createElement("tr"); //creates new table row
  top.setAttribute("id", "column-top"); //set id of tr to "column-top"
  top.addEventListener("click", handleClick); //everytime top is clicked, the function handleClick is run

  for (let x = 0; x < WIDTH; x++) { //loops WIDTH times
    const headCell = document.createElement("td"); //creates table data
    headCell.setAttribute("id", x); //set id to whatever x is at the time of the for-loop
    top.append(headCell); //top appends the headcell as child
  }
  htmlBoard.append(top); //htmlBoard appends top as child

  // TODO: add comment for this code
  for (let y = 0; y < HEIGHT; y++) { //loops HEIGHT times
    const row = document.createElement("tr"); //creates table row
    for (let x = 0; x < WIDTH; x++) { //loops WIDTH times
      const cell = document.createElement("td"); //creates table data
      cell.setAttribute("id", `${y}-${x}`); //set id to 'y-x' (coordinates for each cell)
      row.append(cell); //row appends cell as child
    }
    htmlBoard.append(row); //htmlBoard appends top as child
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */

const findSpotForCol = x => {
  // TODO: write the real version of this, rather than always returning 0
  for(let y = HEIGHT - 1; y>=0; y--){ //for loop backwards
    if(board[y][x] === null){ //finds the last occurance of null
      return y; //returns "index"
    }
  }
  return null; //returns null if nothing relevant is found
}

/** placeInTable: update DOM to place piece into HTML table of board */

const placeInTable = (y, x) => {
  // TODO: make a div and insert into correct table cell
  const circle = document.createElement("div"); //creates new divs for circles

  circle.setAttribute("class",`piece player${currPlayer}`);
 
  let cell = document.getElementById(`${y}-${x}`); //string literals used to get correct div where circle is "dropped"
  cell.append(circle); //puts the circle into the correct div
  
}

/** endGame: announce game end */

//game state control
const endGame = msg => {
  gameIsRunning = false;

  //settimeout
  // TODO: pop up alert message
  setTimeout(() => {
    alert(msg);

  }, 500);
}

/** handleClick: handle click of column top to play piece */

const handleClick = evt => {
  if(gameIsRunning === false)
    return;
    
  // get x from ID of clicked cell
  const x = +evt.target.id; //gets x value of "top" click

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x); //gets y value of next available "null"
  if (y === null) {
    return; //returns nothing because nothing relevant was selected for y
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x] = currPlayer; //updates board to either 1 or 2
  placeInTable(y, x); //creates a circle and appends to div based on y and x

  // check for win
  if (checkForWin()) {
    endGame(`Player ${currPlayer} won!`); //alerts player once 4 in a row is found
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame

  if (checkForTie()){ //checks if every value in the nested arrays is not null. If not null, then everything has been filled with a 1 or 2 and is considered a tie
    return endGame(`It's a tie!`);
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  switchCurrentPlayers();
}

function switchCurrentPlayers(){
  if (currPlayer === 1) currPlayer++; //if currPlayer is 1, then add one to switch players
  else if (currPlayer === 2) currPlayer--; //if currPlayer is 2, then subtract one to switch players
  
  
}
function checkForTie(){
  return board.every(val => (val.every(block => block !== null)));
}
/** checkForWin: check board cell-by-cell for "does a win start here?" */

const checkForWin = () => {
  const _win = cells => {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]]; //win horizontally (from start point, check 3 points right of start point)
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]]; //win vertically (from start point, check 3 points above start point)
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]]; //win diagonally (positive slope)
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]]; //with diagnoally (negative slope)

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) { //if any of these conditions are met, return true
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();

