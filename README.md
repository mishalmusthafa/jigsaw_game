# Puzzle Adventure - Game Documentation

## Run Game

Open index.html to run the game

## Overview

Puzzle Adventure is a game that combines platformer mechanics with interactive puzzle-solving elements. Players control a character that can move and jump while interacting with three different puzzles to progress through the game.

## Game Structure

The game consists of two main components:

1. **Main Game**: A platformer-style game where the player can move left, right, and jump.
2. **Puzzle Game**: A tile-based puzzle where the player must rearrange shuffled tiles to solve the puzzle.

The game alternates between these two modes based on player interactions.

## Key Features

### Main Game

-   Player movement (left, right, and jump)
-   Three windows displaying puzzle previews
-   Transition to puzzle games by pressing the Enter key near a window

### Puzzle Game

-   Three unique puzzles (Puzzle One, Puzzle Two, Puzzle Three)
-   Click-based tile swapping
-   Randomized tile shuffling for replayability
-   Completing a puzzle returns the player to the main game

### Game States

The game uses a state management system to switch between the main game and puzzle games.

## Code Components

### 1. Canvas and Context Setup

The game uses an HTML `<canvas>` element to render graphics.

```javascript
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('game-status');
const welcomeText = document.getElementById('welcome');
```

### 2. Game States

State management is used to track whether the player is in the main game or a puzzle game.

```javascript
const GAME_STATES = {
    MAIN: 'main',
    PUZZLE: 'puzzle',
    PUZZLE2: 'puzzle2',
    PUZZLE3: 'puzzle3',
};
let currentGameState = GAME_STATES.MAIN;
```

### 3. Puzzle Game Class

The `PuzzleGame` class manages puzzle logic, including tile creation, shuffling, and interactions.

#### Key Methods:

-   `createTiles()`: Initializes the tiles and positions.
-   `shuffleTiles()`: Randomizes tile positions.
-   `drawSingleTile(index)`: Draws a tile on the canvas.
-   `draw()`: Redraws all tiles.
-   `isPuzzleSolved()`: Checks if the puzzle is solved.
-   `handleClick(e)`: Handles tile swapping.
-   `swapTiles(tile1, tile2)`: Swaps tile positions.
-   `drawPreview(x, y, width, height)`: Draws a scaled-down puzzle preview.

### 4. Player Object

Stores properties for movement and physics.

```javascript
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
```

### 5. Puzzle Instances

Three puzzle instances representing different puzzles.

```javascript
const puzzleOne = new PuzzleGame(canvas, ctx, image);
const puzzleTwo = new PuzzleGame(canvas, ctx, image);
const puzzleThree = new PuzzleGame(canvas, ctx, image);
```

### 6. Main Game Functions

-   `drawMainGame()`: Draws the player, ground, and puzzle previews.
-   `updateMainGame()`: Updates player movement and handles puzzle transitions.
-   `switchToPuzzleGameOne()`, `switchToPuzzleGameTwo()`, `switchToPuzzleGameThree()`: Start respective puzzle games.
-   `setupPuzzleGame(puzzle, statusKey, gameState)`: Initializes a puzzle game.
-   `switchToMainGame()`: Returns to the main game after solving a puzzle.

### 7. Game Loop

Handles game updates and rendering.

```javascript
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
```

### 8. Event Listeners

Handle player input for movement, jumping, and puzzle interactions.

```javascript
document.addEventListener('keydown', function (e) {
    // Handle keydown events
});

document.addEventListener('keyup', function (e) {
    // Handle keyup events
});
```

### 9. Initialization

The game starts when the puzzle image loads.

```javascript
image.onload = initializeGame;
```

## How to Play

### Main Game

-   Use `A` and `D` keys to move left and right.
-   Press `Space` to jump.
-   Approach a window and press `Enter` to start a puzzle.

### Puzzle Game

-   Click on two adjacent tiles to swap them.
-   Solve the puzzle by arranging tiles correctly.
-   Press `Enter` to return to the main game after solving a puzzle.

### Winning the Game

Solve all three puzzles to complete the game.

## Customization

### Puzzle Difficulty

Modify the `ROWS` and `COLS` properties in `PuzzleGame` to change puzzle difficulty.

### Player Physics

Adjust properties in the `player` object (`speed`, `gravity`, `jumpStrength`) for movement behavior.

### Graphics

Replace the puzzle image (`img_2.jpg`) with a custom image.

## Dependencies

The game requires an HTML file with a `<canvas>` element and two `<div>` elements for game status.

Example HTML:

```html
<canvas id="gameCanvas" width="800" height="600"></canvas>
<div id="game-status">Solve the puzzles!</div>
<div id="welcome">Welcome to Puzzle Adventure!</div>
```

## Known Issues

-   Assumes the puzzle image is square.
-   Player can only jump when grounded.

## Future Improvements

-   Add more levels or puzzles.
-   Implement a scoring system or timer.
-   Add animations for smoother transitions.
-   Support touch input for mobile devices.

---

Enjoy playing and customizing **Puzzle Adventure**!
