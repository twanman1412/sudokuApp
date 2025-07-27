/**
 * Main Application Entry Point
 * Initializes the Sudoku board when the DOM is ready
 */

import { createBoard } from './createBoard.js';
import './keyboardControls.js'; // Import for side effects (event listeners)

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', () => {
	const mainContainer = document.querySelector('div#main');
	if (mainContainer) {
		createBoard(mainContainer);
	} else {
		console.error('Main container not found');
	}
});
