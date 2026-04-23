let maze = [];
let rows = 8;
let cols = 8;
let cellSize = 40;
let visitedCells = [];
let solutionPath = [];

const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');

const dx = [1, -1, 0, 0];
const dy = [0, 0, 1, -1];

function createMaze() {
    rows = parseInt(document.getElementById('rows').value);
    cols = parseInt(document.getElementById('cols').value);
    
    // Validate positions
    const startRow = parseInt(document.getElementById('startRow').value);
    const startCol = parseInt(document.getElementById('startCol').value);
    const endRow = parseInt(document.getElementById('endRow').value);
    const endCol = parseInt(document.getElementById('endCol').value);

    if (startRow >= rows || startCol >= cols || endRow >= rows || endCol >= cols) {
        alert('Start and End positions must be within maze dimensions!');
        return;
    }

    // Create empty maze (all paths)
    maze = Array(rows).fill(null).map(() => Array(cols).fill(0));
    
    // Add some random walls for demonstration
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if ((i + j) % 3 === 0 && !(i === startRow && j === startCol) && !(i === endRow && j === endCol)) {
                maze[i][j] = Math.random() > 0.6 ? 1 : 0;
            }
        }
    }

    visitedCells = [];
    solutionPath = [];
    document.getElementById('resultSection').classList.remove('show');
    
    drawMaze();
}

function randomMaze() {
    rows = parseInt(document.getElementById('rows').value);
    cols = parseInt(document.getElementById('cols').value);
    
    maze = Array(rows).fill(null).map(() => Array(cols).fill(0));
    
    // Create random maze with recursive backtracking
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            maze[i][j] = Math.random() > 0.7 ? 1 : 0;
        }
    }
    
    // Ensure start and end are paths
    const startRow = parseInt(document.getElementById('startRow').value);
    const startCol = parseInt(document.getElementById('startCol').value);
    const endRow = parseInt(document.getElementById('endRow').value);
    const endCol = parseInt(document.getElementById('endCol').value);
    
    maze[startRow][startCol] = 0;
    maze[endRow][endCol] = 0;

    visitedCells = [];
    solutionPath = [];
    document.getElementById('resultSection').classList.remove('show');
    
    drawMaze();
}

function loadExample() {
    rows = 8;
    cols = 8;
    
    document.getElementById('rows').value = rows;
    document.getElementById('cols').value = cols;
    document.getElementById('startRow').value = 0;
    document.getElementById('startCol').value = 0;
    document.getElementById('endRow').value = 7;
    document.getElementById('endCol').value = 7;

    // Example maze
    maze = [
        [0, 1, 0, 0, 0, 1, 0, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [0, 0, 0, 1, 0, 0, 0, 0],
        [1, 1, 0, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 0, 0]
    ];

    visitedCells = [];
    solutionPath = [];
    document.getElementById('resultSection').classList.remove('show');
    
    drawMaze();
}

function resizeCanvas() {
    const containerWidth = canvas.parentElement.offsetWidth - 40;
    const maxSize = Math.min(containerWidth, 600);
    
    cellSize = Math.floor(maxSize / Math.max(rows, cols));
    cellSize = Math.max(20, Math.min(50, cellSize));
    
    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;
}

function drawMaze() {
    if (maze.length === 0) return;
    
    resizeCanvas();
    
    const startRow = parseInt(document.getElementById('startRow').value);
    const startCol = parseInt(document.getElementById('startCol').value);
    const endRow = parseInt(document.getElementById('endRow').value);
    const endCol = parseInt(document.getElementById('endCol').value);

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const x = j * cellSize;
            const y = i * cellSize;

            // Determine color
            let color = maze[i][j] === 1 ? '#333' : '#fff';
            
            if (i === startRow && j === startCol) {
                color = '#4CAF50';
            } else if (i === endRow && j === endCol) {
                color = '#FF5252';
            } else if (solutionPath.some(p => p[0] === i && p[1] === j)) {
                color = '#FFD700';
            } else if (visitedCells.some(p => p[0] === i && p[1] === j)) {
                color = '#90CAF9';
            }

            ctx.fillStyle = color;
            ctx.fillRect(x, y, cellSize, cellSize);

            ctx.strokeStyle = '#ddd';
            ctx.lineWidth = 0.5;
            ctx.strokeRect(x, y, cellSize, cellSize);
        }
    }
}

function isValid(x, y) {
    return x >= 0 && y >= 0 && x < rows && y < cols && maze[x][y] === 0;
}

function bfs(start, end) {
    const queue = [start];
    const visited = new Set();
    const parent = new Map();
    
    visited.add(JSON.stringify(start));
    visitedCells = [];

    while (queue.length > 0) {
        const curr = queue.shift();
        visitedCells.push(curr);

        if (curr[0] === end[0] && curr[1] === end[1]) {
            // Path found - reconstruct
            const path = [];
            let current = end;

            while (!(current[0] === start[0] && current[1] === start[1])) {
                path.push(current);
                const key = JSON.stringify(current);
                current = parent.get(key);
            }
            path.push(start);
            path.reverse();
            
            return path;
        }

        for (let i = 0; i < 4; i++) {
            const nx = curr[0] + dx[i];
            const ny = curr[1] + dy[i];

            if (isValid(nx, ny) && !visited.has(JSON.stringify([nx, ny]))) {
                queue.push([nx, ny]);
                visited.add(JSON.stringify([nx, ny]));
                parent.set(JSON.stringify([nx, ny]), curr);
            }
        }

        // Optional: animate the search
        // await sleep(10);
        // drawMaze();
    }

    return null;
}

function solveMaze() {
    if (maze.length === 0) {
        alert('Please create or load a maze first!');
        return;
    }

    const startRow = parseInt(document.getElementById('startRow').value);
    const startCol = parseInt(document.getElementById('startCol').value);
    const endRow = parseInt(document.getElementById('endRow').value);
    const endCol = parseInt(document.getElementById('endCol').value);

    if (!isValid(startRow, startCol)) {
        alert('Invalid start position or start position is on a wall!');
        return;
    }

    if (!isValid(endRow, endCol)) {
        alert('Invalid end position or end position is on a wall!');
        return;
    }

    const start = [startRow, startCol];
    const end = [endRow, endCol];

    solutionPath = bfs(start, end) || [];

    const resultSection = document.getElementById('resultSection');
    const resultText = document.getElementById('resultText');
    const pathDisplay = document.getElementById('pathDisplay');

    if (solutionPath.length > 0) {
        resultSection.classList.add('show', 'success');
        resultSection.classList.remove('error');
        resultText.textContent = `✓ Path Found! (Steps: ${solutionPath.length - 1})`;
        pathDisplay.style.display = 'block';
        pathDisplay.innerHTML = '<strong>Path:</strong> ' + 
            solutionPath.map(p => `(${p[0]},${p[1]})`).join(' → ');
    } else {
        resultSection.classList.add('show', 'error');
        resultSection.classList.remove('success');
        resultText.textContent = '✗ No Path Found!';
        pathDisplay.style.display = 'none';
    }

    drawMaze();
}

// Initialize
window.addEventListener('load', () => {
    loadExample();
});

window.addEventListener('resize', () => {
    drawMaze();
});
