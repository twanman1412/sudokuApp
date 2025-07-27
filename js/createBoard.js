/**
 * Board Creation Module
 * Handles the creation and setup of the 9x9 Sudoku grid
 */

import { addCell } from './cellLogic.js';
import { initGameState } from './gameState.js';

/**
 * Create the complete Sudoku board with 9 boxes and 9 cells each
 * @param {HTMLElement} parentDiv - The container element for the board
 */
export function createBoard(parentDiv) {
	for (let boxId = 0; boxId < 9; boxId++) {
		const newBox = document.createElement('div');
		newBox.classList.add('box');
		newBox.id = `box${boxId}`;

		for (let cellId = 0; cellId < 9; cellId++) {
			const newCell = document.createElement('div');
			newCell.classList.add('cell');
			newCell.classList.add(`c${(cellId + boxId) % 2}`); // Alternating colors

			// Main number display (center)
			const mainNumber = document.createElement('div');
			mainNumber.classList.add('main-number');
			newCell.appendChild(mainNumber);

			// Center hints (small numbers in center)
			const centerHints = document.createElement('div');
			centerHints.classList.add('center-hints');
			newCell.appendChild(centerHints);

			// Border hints (small numbers around edges)
			const borderHints = document.createElement('div');
			borderHints.classList.add('border-hints');

			// Create 9 positions for border hints (3x3 grid pattern)
			for (let i = 1; i <= 9; i++) {
				const hintSpot = document.createElement('div');
				hintSpot.classList.add('hint-spot');
				hintSpot.dataset.number = i;
				borderHints.appendChild(hintSpot);
			}

			newCell.appendChild(borderHints);
			newBox.appendChild(newCell);

			// Register cell with game logic
			addCell(newCell, boxId, cellId);
		}

		parentDiv.appendChild(newBox);
	}

	// Initialize the game state after board creation
	initGameState();
}
