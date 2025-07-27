/**
 * Keyboard Controls and Application Initialization Module
 * Handles all keyboard events and application startup
 */

import { setNumber } from './cellLogic.js';
import { goBack, goForward, startTree, stopTree, updateTreeDisplay } from './treeNavigation.js';
import { getTreeMode } from './gameState.js';

/**
 * Handle keyboard input for number entry and navigation
 */
function setupKeyboardControls() {
	document.addEventListener('keydown', evt => {
		if (evt.key >= '1' && evt.key <= '9') {
			console.log(`Key pressed: ${evt.key}, Alt: ${evt.altKey}, Ctrl: ${evt.ctrlKey}`);
			setNumber({
				number: evt.key,
				isAlt: evt.altKey,
				isCtrl: evt.ctrlKey,
			});
		} else if (evt.key === 'Delete') {
			setNumber({ number: evt.key });
		} else if (evt.key === 'Backspace') {
			// Backspace for tree navigation
			evt.preventDefault();
			goBack();
		} else if (evt.key === 'ArrowLeft') {
			// Go back in tree
			goBack();
		} else if (evt.key === 'ArrowRight') {
			// Go forward in tree (first child)
			goForward(0);
		} else if (evt.key === 't' || evt.key === 'T') {
			// Toggle tree mode
			if (getTreeMode()) {
				stopTree();
			} else {
				startTree();
			}
		}
	});
}

/**
 * Setup info panel toggle functionality
 */
function setupInfoPanel() {
	const infoButton = document.querySelector('#info-button');
	const controlsPanel = document.querySelector('#controls-panel');

	if (!infoButton || !controlsPanel) {
		console.warn('Info panel elements not found');
		return;
	}

	infoButton.addEventListener('click', () => {
		controlsPanel.classList.toggle('controls-hidden');
		controlsPanel.classList.toggle('controls-visible');
	});

	// Click outside to close controls
	document.addEventListener('click', evt => {
		if (!infoButton.contains(evt.target) && !controlsPanel.contains(evt.target)) {
			controlsPanel.classList.add('controls-hidden');
			controlsPanel.classList.remove('controls-visible');
		}
	});
}

/**
 * Initialize the application when DOM is loaded
 */
export function initializeApp() {
	// Setup keyboard controls
	setupKeyboardControls();

	// Setup info panel
	setupInfoPanel();

	// Initialize tree display
	updateTreeDisplay();

	// Log startup information
	console.log('Sudoku app loaded with power-user keyboard controls');
	console.log('Controls: Numbers (1-9), Ctrl+Number (center hints), Alt+Number (border hints)');
	console.log('Navigation: T (toggle tree), Backspace (go back), Left/Right arrows');
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
