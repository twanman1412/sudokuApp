# Sudoku App

A simplified Electron-based Sudoku application focused on the core gameplay experience.

## Features

### Core Functionality
- **Number Entry**: Click on cells and enter numbers 1-9 using keyboard or number buttons
- **Cell Selection**: Click on any cell to select it (highlighted with blue border)
- **Clear Cells**: Use the "Clear" button or Delete/Backspace keys to clear cell contents

### Hint System
The app supports two types of hints to help solve puzzles:

1. **Border Hints**: Small numbers displayed around the edges of cells in a 3x3 grid pattern
2. **Center Hints**: Small numbers displayed in the center of cells as a simple list

### Controls

#### Keyboard Shortcuts
- **1-9**: Enter numbers or toggle hints (depending on mode)
- **Delete/Backspace**: Clear cell contents
- **H**: Toggle hint mode on/off
- **T**: Switch between border and center hint types

#### Interface Buttons
- **Number Buttons (1-9)**: Enter numbers or toggle hints
- **Clear**: Clear the selected cell
- **Toggle Hints**: Switch between number entry and hint mode
- **Hint Type**: Switch between border and center hint display

### How to Use Hints

1. **Enable Hint Mode**: Click "Toggle Hints" or press 'H' to enter hint mode
2. **Choose Hint Type**: Click "Hint Type" or press 'T' to switch between border and center hints
3. **Add/Remove Hints**: In hint mode, clicking numbers or using number keys will toggle hints for the selected cell
4. **Return to Number Entry**: Click "Toggle Hints" again or press 'H' to return to normal number entry

## Installation & Running

1. Make sure you have Node.js installed
2. Install dependencies: `npm install`
3. Start the app: `npm start`

## Project Structure

```
sudokuApp/
├── index.html          # Main HTML file
├── package.json        # Node.js dependencies and scripts
├── js/
│   ├── main.js         # Application entry point
│   ├── createBoard.js  # Sudoku grid creation
│   ├── cellLogic.js    # Game logic and interactions
│   └── electron.js     # Electron configuration
└── style/
    ├── index.css       # Main layout styles
    ├── board.css       # Sudoku grid styles
    └── sidepanel.css   # Control panel styles
```

This is a stripped-down version focused on core sudoku gameplay without file loading or other complex features.

Sudoku app I made cause I was bored and could not read all the small numbers I wrote in my harder sudokus
