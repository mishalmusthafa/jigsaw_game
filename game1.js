const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const ROWS = 3,
    COLS = 3;
const TILE_SIZE = 300;
canvas.width = TILE_SIZE * COLS;
canvas.height = TILE_SIZE * ROWS;

const BORDER_WIDTH = 8;
const BORDER_COLOR_OUTER = '#FF69B4'; // PRINCESS_RED
const BORDER_COLOR_INNER = '#DDA0DD'; // PRINCESS_PURPLE

let image = new Image();
image.crossOrigin = 'anonymous';
image.src = 'img_2.jpg';

let tiles = [],
    tilePositions = [],
    selectedTile = null;
let isSwapping = false;

image.onload = function () {
    createTiles();
    shuffleTiles();
    drawTiles();
};

function createTiles() {
    tiles = [];
    tilePositions = [];

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            let tile = {
                x: col * TILE_SIZE,
                y: row * TILE_SIZE,
                originalX: col * TILE_SIZE,
                originalY: row * TILE_SIZE,
            };
            tiles.push(tile);
            tilePositions.push({ row, col });
        }
    }
}

function shuffleTiles() {
    tilePositions.sort(() => Math.random() - 0.5);
}

function drawTiles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < tiles.length; i++) {
        drawSingleTile(i);
    }
}

function drawSingleTile(index) {
    let tile = tiles[index];
    let pos = tilePositions[index];

    ctx.clearRect(
        pos.col * TILE_SIZE,
        pos.row * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
    );
    ctx.drawImage(
        image,
        tile.originalX,
        tile.originalY,
        TILE_SIZE,
        TILE_SIZE,
        pos.col * TILE_SIZE,
        pos.row * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
    );

    ctx.strokeStyle = BORDER_COLOR_OUTER;
    ctx.lineWidth = BORDER_WIDTH;
    ctx.strokeRect(
        pos.col * TILE_SIZE,
        pos.row * TILE_SIZE,
        TILE_SIZE,
        TILE_SIZE
    );
}

canvas.addEventListener('click', function (e) {
    if (isSwapping) return;

    let col = Math.floor(e.offsetX / TILE_SIZE);
    let row = Math.floor(e.offsetY / TILE_SIZE);
    let clickedTile = { row, col };

    if (!selectedTile) {
        selectedTile = clickedTile;
    } else {
        isSwapping = true;
        swapTiles(selectedTile, clickedTile);
        selectedTile = null;

        setTimeout(() => {
            isSwapping = false;
        }, 150);
    }
});

function swapTiles(tile1, tile2) {
    let index1 = tilePositions.findIndex(
        (t) => t.row === tile1.row && t.col === tile1.col
    );
    let index2 = tilePositions.findIndex(
        (t) => t.row === tile2.row && t.col === tile2.col
    );

    [tilePositions[index1], tilePositions[index2]] = [
        tilePositions[index2],
        tilePositions[index1],
    ];

    drawSingleTile(index1);
    drawSingleTile(index2);

    if (isPuzzleSolved()) {
        setTimeout(() => {
            alert('Puzzle Solved!');
        }, 100);
    }
}

function isPuzzleSolved() {
    return tilePositions.every((pos, i) => pos.row * COLS + pos.col === i);
}
