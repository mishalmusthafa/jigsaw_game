// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('game-status');
const welcomeText = document.getElementById('welcome');

// Game states
const GAME_STATES = {
    MAIN: 'main',
    PUZZLE: 'puzzle',
    PUZZLE2: 'puzzle2',
    PUZZLE3: 'puzzle3',
};
let currentGameState = GAME_STATES.MAIN;

// Store original canvas dimensions
const ORIGINAL_WIDTH = canvas.width;
const ORIGINAL_HEIGHT = canvas.height;

// Initialize puzzle game resources
let image = new Image();
image.crossOrigin = 'anonymous';
image.src = 'img_2.jpg';

// Base Puzzle Game Class
class PuzzleGame {
    constructor(canvas, ctx, image, rows = 3, cols = 3) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.image = image;
        this.ROWS = rows;
        this.COLS = cols;
        this.TILE_SIZE = 300;
        this.BORDER_WIDTH = 8;
        this.tiles = [];
        this.tilePositions = [];
        this.selectedTile = null;
        this.isSwapping = false;
    }

    createTiles() {
        this.tiles = [];
        this.tilePositions = [];
        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                let tile = {
                    x: col * this.TILE_SIZE,
                    y: row * this.TILE_SIZE,
                    originalX: col * this.TILE_SIZE,
                    originalY: row * this.TILE_SIZE,
                };
                this.tiles.push(tile);
                this.tilePositions.push({ row, col });
            }
        }
    }

    shuffleTiles() {
        this.tilePositions.sort(() => Math.random() - 0.5);
    }

    drawSingleTile(index) {
        let tile = this.tiles[index];
        let pos = this.tilePositions[index];

        this.ctx.drawImage(
            this.image,
            tile.originalX,
            tile.originalY,
            this.TILE_SIZE,
            this.TILE_SIZE,
            pos.col * this.TILE_SIZE,
            pos.row * this.TILE_SIZE,
            this.TILE_SIZE,
            this.TILE_SIZE
        );

        this.ctx.strokeStyle = '#FF69B4';
        this.ctx.lineWidth = this.BORDER_WIDTH;
        this.ctx.strokeRect(
            pos.col * this.TILE_SIZE,
            pos.row * this.TILE_SIZE,
            this.TILE_SIZE,
            this.TILE_SIZE
        );
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.tiles.length; i++) {
            this.drawSingleTile(i);
        }
    }

    isPuzzleSolved() {
        return this.tilePositions.every(
            (pos, i) => pos.row * this.COLS + pos.col === i
        );
    }

    handleClick(e) {
        if (this.isSwapping) return false;

        let col = Math.floor(e.offsetX / this.TILE_SIZE);
        let row = Math.floor(e.offsetY / this.TILE_SIZE);
        let clickedTile = { row, col };

        if (!this.selectedTile) {
            this.selectedTile = clickedTile;
            return false;
        } else {
            this.isSwapping = true;
            const solved = this.swapTiles(this.selectedTile, clickedTile);
            this.selectedTile = null;

            setTimeout(() => {
                this.isSwapping = false;
            }, 150);

            return solved;
        }
    }

    swapTiles(tile1, tile2) {
        let index1 = this.tilePositions.findIndex(
            (t) => t.row === tile1.row && t.col === tile1.col
        );
        let index2 = this.tilePositions.findIndex(
            (t) => t.row === tile2.row && t.col === tile2.col
        );

        [this.tilePositions[index1], this.tilePositions[index2]] = [
            this.tilePositions[index2],
            this.tilePositions[index1],
        ];

        this.drawSingleTile(index1);
        this.drawSingleTile(index2);

        return this.isPuzzleSolved();
    }

    drawPreview(x, y, width, height) {
        const scaleX = width / (this.TILE_SIZE * this.COLS);
        const scaleY = height / (this.TILE_SIZE * this.ROWS);
        const scale = Math.min(scaleX, scaleY);

        const scaledWidth = this.TILE_SIZE * this.COLS * scale;
        const scaledHeight = this.TILE_SIZE * this.ROWS * scale;
        const offsetX = x + (width - scaledWidth) / 2;
        const offsetY = y + (height - scaledHeight) / 2;

        for (let i = 0; i < this.tiles.length; i++) {
            const tile = this.tiles[i];
            const pos = this.tilePositions[i];
            this.ctx.drawImage(
                this.image,
                tile.originalX,
                tile.originalY,
                this.TILE_SIZE,
                this.TILE_SIZE,
                offsetX + pos.col * this.TILE_SIZE * scale,
                offsetY + pos.row * this.TILE_SIZE * scale,
                this.TILE_SIZE * scale,
                this.TILE_SIZE * scale
            );

            this.ctx.lineWidth = this.BORDER_WIDTH * scale;
            this.ctx.strokeRect(
                offsetX + pos.col * this.TILE_SIZE * scale,
                offsetY + pos.row * this.TILE_SIZE * scale,
                this.TILE_SIZE * scale,
                this.TILE_SIZE * scale
            );
        }
    }
}

// Puzzle Status Variable
const puzzleStatus = {
    puzzleOneSolved: false,
    puzzleTwoSolved: false,
    puzzleThreeSolved: false,
};

// Main game variables
const player = {
    x: 50,
    y: 300,
    width: 50,
    height: 50,
    speed: 5,
    velocityY: 0,
    gravity: 0.5,
    jumpStrength: -10,
    grounded: true,
};

const groundY = player.y;
const key = {
    a: false,
    d: false,
    space: false,
    enter: false,
};

// Create puzzle instances
let currentPuzzle = null;
const puzzleOne = new PuzzleGame(canvas, ctx, image);
const puzzleTwo = new PuzzleGame(canvas, ctx, image);
const puzzleThree = new PuzzleGame(canvas, ctx, image);

// Main game functions with character
function drawMainGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, groundY + player.height, canvas.width, 10);

    // Draw windows
    let windowWidth = canvas.width / 3 - 20;
    let windowHeight = canvas.height / 1.5;
    let padding = 10;

    // Draw windows with puzzle previews
    for (let i = 0; i < 3; i++) {
        const x = (canvas.width / 3) * i + padding;
        ctx.strokeRect(x, padding, windowWidth, windowHeight);

        // Draw appropriate puzzle preview based on status
        const puzzle = i === 0 ? puzzleOne : i === 1 ? puzzleTwo : puzzleThree;
        const solved =
            i === 0
                ? puzzleStatus.puzzleOneSolved
                : i === 1
                ? puzzleStatus.puzzleTwoSolved
                : puzzleStatus.puzzleThreeSolved;

        if (!solved) {
            puzzle.drawPreview(x, padding, windowWidth, windowHeight);
        } else {
            ctx.drawImage(image, x, padding, windowWidth, windowHeight);
        }
    }

    // Draw player
    ctx.fillStyle = '#FF5733';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function updateMainGame() {
    if (key.d) {
        player.x = Math.min(
            player.x + player.speed,
            canvas.width - player.width
        );
    }
    if (key.a) {
        player.x = Math.max(player.x - player.speed, 0);
    }

    if (!player.grounded) {
        player.velocityY += player.gravity;
        player.y += player.velocityY;
    }

    if (player.y >= groundY) {
        player.y = groundY;
        player.velocityY = 0;
        player.grounded = true;
    }

    // Check for window transition
    let sectionWidth = canvas.width / 3;
    if (key.enter) {
        if (player.x <= sectionWidth) {
            switchToPuzzleGameOne();
        } else if (player.x <= sectionWidth * 2) {
            switchToPuzzleGameTwo();
        } else {
            switchToPuzzleGameThree();
        }
    }
}

function switchToPuzzleGameOne() {
    welcomeText.innerText = 'Puzzle One';
    setupPuzzleGame(puzzleOne, 'puzzleOneSolved', GAME_STATES.PUZZLE);
}

function switchToPuzzleGameTwo() {
    welcomeText.innerText = 'Puzzle Two';
    setupPuzzleGame(puzzleTwo, 'puzzleTwoSolved', GAME_STATES.PUZZLE2);
}

function switchToPuzzleGameThree() {
    welcomeText.innerText = 'Puzzle Three';
    setupPuzzleGame(puzzleThree, 'puzzleThreeSolved', GAME_STATES.PUZZLE3);
}

function setupPuzzleGame(puzzle, statusKey, gameState) {
    if (!puzzleStatus[statusKey]) {
        statusText.innerText = 'Solve the puzzle for next stage';
    } else {
        statusText.innerText = `${welcomeText.innerText} Solved, Press enter to continue`;
    }

    currentGameState = gameState;
    currentPuzzle = puzzle;

    canvas.width = puzzle.TILE_SIZE * puzzle.COLS;
    canvas.height = puzzle.TILE_SIZE * puzzle.ROWS;

    puzzle.createTiles();
    if (!puzzleStatus[statusKey]) {
        puzzle.shuffleTiles();
    }

    canvas.onclick = (e) => {
        if (!puzzleStatus[statusKey]) {
            const solved = puzzle.handleClick(e);
            if (solved) {
                puzzleStatus[statusKey] = true;
                statusText.innerText = `${welcomeText.innerText} Solved`;
                setTimeout(() => {
                    alert('Puzzle Solved!');
                    switchToMainGame();
                }, 100);
            }
        }
    };
}

function switchToMainGame() {
    let solvedCount = Object.values(puzzleStatus).filter(Boolean).length;
    if (solvedCount === 0) {
        statusText.innerText = 'Solve the puzzles!';
    } else if (solvedCount === 3) {
        statusText.innerText = 'Congratulations! You finished the game!';
    } else {
        statusText.innerText = `${solvedCount} puzzle${
            solvedCount > 1 ? 's' : ''
        } solved!`;
    }

    currentGameState = GAME_STATES.MAIN;
    canvas.width = ORIGINAL_WIDTH;
    canvas.height = ORIGINAL_HEIGHT;
    canvas.onclick = null;
    updateGame();
}

// Game loop
function updateGame() {
    if (currentGameState === GAME_STATES.MAIN) {
        updateMainGame();
        drawMainGame();
    } else if (
        [GAME_STATES.PUZZLE, GAME_STATES.PUZZLE2, GAME_STATES.PUZZLE3].includes(
            currentGameState
        )
    ) {
        currentPuzzle.draw();
    }
    requestAnimationFrame(updateGame);
}

// Event listeners
document.addEventListener('keydown', function (e) {
    if (currentGameState === GAME_STATES.MAIN) {
        if (e.key === ' ' && player.grounded) {
            player.velocityY = player.jumpStrength;
            player.grounded = false;
        }
        if (e.key === 'd') key.d = true;
        if (e.key === 'a') key.a = true;
        if (e.key === 'Enter') key.enter = true;
    } else if (
        e.key === 'Enter' &&
        ((currentGameState === GAME_STATES.PUZZLE &&
            puzzleStatus.puzzleOneSolved) ||
            (currentGameState === GAME_STATES.PUZZLE2 &&
                puzzleStatus.puzzleTwoSolved) ||
            (currentGameState === GAME_STATES.PUZZLE3 &&
                puzzleStatus.puzzleThreeSolved))
    ) {
        switchToMainGame();
    }
});

document.addEventListener('keyup', function (e) {
    if (e.key === 'd') key.d = false;
    if (e.key === 'a') key.a = false;
    if (e.key === 'Enter') key.enter = false;
});

// Initialize game
function initializeGame() {
    puzzleOne.createTiles();
    puzzleTwo.createTiles();
    puzzleThree.createTiles();
    puzzleOne.shuffleTiles();
    puzzleTwo.shuffleTiles();
    puzzleThree.shuffleTiles();
    updateGame();
}

// Start the game when image loads
image.onload = initializeGame;
