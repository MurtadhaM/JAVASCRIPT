
let rows = 7;
let cols = 8;
let grid = new Array(rows); 
// Making a 2D array
for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(cols);

    for (let j = 0; j < grid[i].length; j++) {
    grid[i][j] = 'S';
    }

}   
console.log(grid);

/*
[ [ 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S' ],
  [ 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S' ],
  [ 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S' ],
  [ 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S' ],
  [ 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S' ],
  [ 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S' ],
  [ 'S', 'S', 'S', 'S', 'S', 'S', 'S', 'S' ] ]
*/

// ========================================================

console.log(rows);
console.log(cols);


// ========================================================

let selectedRow = 2;
let selectedCol = 2;


let FINALGRID = '   ';

for (let i = 0; i <= grid.length; i++) {
    FINALGRID += i+1 + ' ';
}
// Normal For Loop
for (let i = 0; i < rows; i++) {
    // add an id to the row
    FINALGRID += ` \n${i+1 } `;
  for (let j = 0; j < cols; j++) {
    
    // If the current row is the selected row
    if (i == selectedRow && j == selectedCol) {
        // Replace the value with an B
        FINALGRID += ` B`;
    } else {
        // Otherwise, print the value
        FINALGRID +=  ' S'
        }

} 

}

console.log(FINALGRID);

 



rows = FINALGRID.split('\n').length;
cols = FINALGRID.split('S');



// For Each Loop
rows.split(' ').forEach((row) => {
    cols.split(' ').forEach((col) => {
        console.log(row, col);
    });
    }
);




// Map function
rows.map((row) => {
    cols.map((col) => {
        console.log(row, col);
    });
    }
);

// Lambda function
rows.map((row) => cols.map((col) => console.log(row, col)));