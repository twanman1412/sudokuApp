# Sudoku App

A modern Electron-based Sudoku application with advanced tree-based move tracking and power-user keyboard controls.

## Features

### Core Gameplay
- **9x9 Sudoku Grid**: Traditional Sudoku board with 3x3 box layout
- **Number Entry**: Enter numbers 1-9 using keyboard
- **Cell Selection**: Click on any cell to select it (highlighted with blue border)
- **Clear Cells**: Use Delete key to clear cell contents

### Advanced Hint System
The app supports two types of hints to help solve puzzles:

1. **Border Hints**: Small numbers displayed around the edges of cells in a 3x3 grid pattern
   - Use `Shift + Number` to toggle border hints
2. **Center Hints**: Small numbers displayed in the center of cells as a sorted list
   - Use `Ctrl + Number` to toggle center hints

### Tree Navigation System
Unique tree-based move tracking allows you to explore different solution paths:

- **Tree Mode**: Track your moves as a branching tree structure
- **Smart Navigation**: Navigate back and forward through your move history
- **Branch Exploration**: Try different approaches without losing previous work
- **Visual Tree Display**: File-explorer style tree view in the sidebar

## Controls

### Keyboard Shortcuts (Primary Interface)
- **1-9**: Enter numbers in selected cell
- **Shift + 1-9**: Toggle border hints for selected cell
- **Ctrl + 1-9**: Toggle center hints for selected cell
- **Delete**: Clear selected cell contents
- **Backspace**: Navigate back in move tree
- **←/→ Arrow Keys**: Navigate tree (back/forward)
- **T**: Toggle tree tracking mode

### Mouse Controls
- **Click Cell**: Select a cell for input
- **Click Tree Nodes**: Navigate directly to any position in the tree
- **Info Button (ℹ️)**: Show/hide keyboard controls reference

## Tree Navigation Features

### Starting Tree Mode
1. Press `T` or click "Start Tree Tracking" to begin tracking moves
2. All subsequent number placements create new tree nodes
3. Tree view appears in the right sidebar

### Navigation
- **Backspace/Left Arrow**: Go back to parent move
- **Right Arrow**: Go forward to first child move
- **Click Tree Nodes**: Jump directly to any previous position
- **Smart Replacement**: Changing a number in the same cell updates the current node instead of creating a new branch

### Visual Tree Display
- 📂 Folders represent moves with multiple possible next moves
- 📄 Files represent end positions
- Current position is highlighted
- Expandable/collapsible tree structure

## Installation & Running

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Setup
1. Clone or download this repository
2. Install dependencies: `npm install`
3. Start the application: `npm start`

### Development
- **Linting**: `npm run lint` (check for code issues)
- **Format**: `npm run format` (auto-format code)
- **Format Check**: `npm run format:check` (check formatting)

## Technical Details

### Project Structure
```
sudokuApp/
├── index.html              # Main HTML file
├── package.json            # Dependencies and scripts
├── js/
│   ├── main.js            # Application entry point
│   ├── gameState.js       # Centralized state management
│   ├── createBoard.js     # Sudoku grid creation
│   ├── cellLogic.js       # Cell interactions and number/hint logic
│   ├── treeNavigation.js  # Tree structure and navigation
│   ├── keyboardControls.js # Event handlers and initialization
│   └── electron.js        # Electron main process
└── style/
    ├── index.css          # Main layout and body styles
    ├── board.css          # Sudoku grid and cell styles
    └── sidepanel.css      # Sidebar and tree display styles
```

### Architecture
- **Modular Design**: Clean separation of concerns across focused modules
- **Centralized State Management**: All game state managed through dedicated module
- **Tree-based Move Tracking**: Advanced branching navigation system
- **Event-driven Architecture**: Keyboard and UI events handled separately
- **Responsive UI**: Modern CSS with gradients and smooth transitions
- **Keyboard-first Interface**: Optimized for power users

## About

Created as a personal project to solve the frustration of reading small handwritten numbers in difficult Sudoku puzzles. Features a clean, modern interface with advanced navigation capabilities that go beyond traditional Sudoku apps.

The tree navigation system is particularly useful for:
- Exploring multiple solution strategies
- Backtracking without losing work
- Learning from mistakes by comparing different approaches
- Advanced Sudoku solving techniques that require trying multiple paths
