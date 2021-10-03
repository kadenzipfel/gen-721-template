let CANVAS_SIZE
let SQUARE_SIZE
let GRID_LENGTH

const hashPairs = [];
for (let j = 0; j < 32; j++) {
  hashPairs.push(tokenData.hash.slice(2 + (j * 2), 4 + (j * 2)));
}

const decPairs = hashPairs.map(x => {
  return parseInt(x, 16);
});

let grid

function buildGrid() {
  let grid = new Array(GRID_LENGTH)
  for (let i = 0; i < grid.length; i++) {
    grid[i] = new Array(GRID_LENGTH)
  }
  return grid
}

function countNeighbors(grid, x, y) {
  let sum = 0
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let col = (x + i + GRID_LENGTH) % GRID_LENGTH
      let row = (y + j + GRID_LENGTH) % GRID_LENGTH
      sum += grid[col][row]
    }
  }
  sum -= grid[x][y]
  return sum
}

function setup() {
  CANVAS_SIZE =
    windowWidth < windowHeight ? windowWidth : windowHeight;
  SQUARE_SIZE = CANVAS_SIZE / 100
  GRID_LENGTH = CANVAS_SIZE / SQUARE_SIZE
  createCanvas(CANVAS_SIZE, CANVAS_SIZE)
  frameRate(5)
  grid = buildGrid()
  for (let i = 0; i < GRID_LENGTH; i++) {
    for (let j = 0; j < GRID_LENGTH; j++) {
      grid[i][j] = decPairs[(i * j) % 32] % 2
    }
  }
  stroke(255)
}

function draw() {
  background(0)
  
  // Draw squares
  for (let i = 0; i < GRID_LENGTH; i++) {
    for (let j = 0; j < GRID_LENGTH; j++) {
      if (grid[i][j]) {
        square(i * SQUARE_SIZE, j * SQUARE_SIZE, SQUARE_SIZE)
      }
    }
  }
  
  // Get next generation
  let nextGeneration = buildGrid()
  
  for (let i = 0; i < GRID_LENGTH; i++) {
    for (let j = 0; j < GRID_LENGTH; j++) {
      let alive = grid[i][j]
      let neighbors = countNeighbors(grid, i, j) 

      if (!alive && neighbors == 3) {
        nextGeneration[i][j] = true
      } else if (alive && (neighbors < 2 || neighbors > 3)) {
        nextGeneration[i][j] = false
      } else {
        nextGeneration[i][j] = alive
      }
    }
  }
  
  grid = nextGeneration
}