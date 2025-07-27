/**
 * Cell Logic Module
 * Handles cell interactions, number entry, and hint management
 */

import {
	board,
	getSelectedCell,
	setSelectedCell,
	getTreeMode,
	getCurrentNode,
	setCurrentNode,
	getCurrentBoardState,
	getGameTree,
	applyGameState,
} from './gameState.js';

import { createNewBranch, isReplacementMove, updateTreeDisplay } from './treeNavigation.js';

/**
 * Add a cell to the board and set up click event listener
 * @param {HTMLElement} cell - The cell DOM element
 * @param {number} boxId - Box identifier (0-8)
 * @param {number} cellId - Cell identifier within box (0-8)
 */
export function addCell(cell, boxId, cellId) {
	if (!board[boxId]) board[boxId] = [];
	board[boxId][cellId] = cell;

	cell.addEventListener('click', () => {
		// Clear previous selection
		document.querySelectorAll('.cell').forEach(c => c.classList.remove('selected'));

		// Select current cell
		cell.classList.add('selected');
		setSelectedCell([boxId, cellId]);
	});
}

/**
 * Set number or toggle hints in a cell based on modifiers
 * @param {Object} options - Configuration object
 * @param {string|number} options.number - Number to set or key pressed
 * @param {HTMLElement} options.cell - Target cell element
 * @param {number} options.boxId - Box identifier
 * @param {number} options.cellId - Cell identifier
 * @param {boolean} options.isAlt - Whether Alt key is pressed (border hints)
 * @param {boolean} options.isCtrl - Whether Ctrl key is pressed (center hints)
 */
export function setNumber({ number, cell, boxId, cellId, isAlt = false, isCtrl = false }) {
	// Get target cell
	if (!cell) {
		const selectedCell = getSelectedCell();
		if (selectedCell.length < 2) {
			console.warn('No cell selected');
			return;
		}
		[boxId, cellId] = selectedCell;
		cell = board[boxId][cellId];
	}

	// Clear cell
	if (number === 'Delete' || number === 'Backspace') {
		clearCell(cell, boxId, cellId);
		return;
	}

	// Handle number input
	const num = parseInt(number);
	if (!isNaN(num) && num >= 1 && num <= 9) {
		console.log(`Processing number ${num}, isAlt: ${isAlt}, isCtrl: ${isCtrl}`);
		if (isAlt) {
			// Alt + number = border hint
			console.log('Calling toggleBorderHint');
			toggleBorderHint(cell, boxId, cellId, num);
		} else if (isCtrl) {
			// Ctrl + number = center hint
			console.log('Calling toggleCenterHint');
			toggleCenterHint(cell, boxId, cellId, num);
		} else {
			// Just number = main number
			console.log('Calling setMainNumber');
			setMainNumber(cell, boxId, cellId, num);
		}
	}
}

/**
 * Set the main number in a cell with smart tree behavior
 * @param {HTMLElement} cell - The cell element
 * @param {number} boxId - Box identifier
 * @param {number} cellId - Cell identifier
 * @param {number} number - Number to set (1-9)
 */
function setMainNumber(cell, boxId, cellId, number) {
	const mainNumberDiv = cell.querySelector('.main-number');
	const oldNumber = mainNumberDiv.textContent.trim();
	mainNumberDiv.textContent = number;

	// Hide hints when main number is set
	hideHints(cell);

	// Smart tree behavior for digit replacement
	if (getTreeMode()) {
		const action = `Set ${number} at [${boxId},${cellId}]`;
		const currentNode = getCurrentNode();

		// Check if we're replacing a digit in the same cell where current node placed a digit
		if (
			oldNumber &&
			currentNode.action &&
			isReplacementMove(currentNode.action, boxId, cellId)
		) {
			// Replace current node instead of creating child
			console.log(`Smart replacement: updating current node from ${oldNumber} to ${number}`);
			currentNode.action = action;
			currentNode.gameState = getCurrentBoardState();
			currentNode.timestamp = new Date();
			updateTreeDisplay();
		} else {
			// Normal case: create new branch
			createNewBranch(action);
		}
	}
}

/**
 * Toggle border hint for a specific number in a cell
 * @param {HTMLElement} cell - The cell element
 * @param {number} boxId - Box identifier
 * @param {number} cellId - Cell identifier
 * @param {number} number - Number to toggle (1-9)
 */
function toggleBorderHint(cell, boxId, cellId, number) {
	console.log(`toggleBorderHint called with number ${number} at [${boxId},${cellId}]`);
	// Don't add hints if cell has main number
	const mainNumber = parseInt(cell.querySelector('.main-number').textContent) || 0;
	if (mainNumber !== 0) {
		console.log('Cell has main number, skipping hint');
		return;
	}

	// Hints don't create tree branches - they update current state only
	const hintSpot = cell.querySelector(`[data-number="${number}"]`);
	if (!hintSpot) {
		console.log(`Hint spot not found for number ${number}`);
		return;
	}
	const isActive = hintSpot.classList.contains('active');
	console.log(`Hint spot for ${number} is ${isActive ? 'active' : 'inactive'}`);

	if (isActive) {
		hintSpot.textContent = '';
		hintSpot.classList.remove('active');
		console.log(`Removed hint ${number}`);
	} else {
		hintSpot.textContent = number;
		hintSpot.classList.add('active');
		console.log(`Added hint ${number}`);
	}

	// Show/hide hints container based on active hints
	const hasActiveHints = cell.querySelectorAll('.hint-spot.active').length > 0;
	const centerHints = cell.querySelector('.center-hints').textContent.trim();

	if (hasActiveHints || centerHints) {
		showHints(cell);
	} else {
		hideHints(cell);
	}
}

/**
 * Toggle center hint for a specific number in a cell
 * @param {HTMLElement} cell - The cell element
 * @param {number} boxId - Box identifier
 * @param {number} cellId - Cell identifier
 * @param {number} number - Number to toggle (1-9)
 */
function toggleCenterHint(cell, boxId, cellId, number) {
	// Don't add hints if cell has main number
	const mainNumber = parseInt(cell.querySelector('.main-number').textContent) || 0;
	if (mainNumber !== 0) {
		return;
	}

	// Hints don't create tree branches - they update current state only
	const centerHintsDiv = cell.querySelector('.center-hints');
	const currentHints = centerHintsDiv.textContent.trim();
	const hintsArray = currentHints ? currentHints.split(' ').map(n => parseInt(n)) : [];

	const index = hintsArray.indexOf(number);
	if (index > -1) {
		hintsArray.splice(index, 1);
	} else {
		hintsArray.push(number);
		hintsArray.sort((a, b) => a - b);
	}

	centerHintsDiv.textContent = hintsArray.join(' ');

	// Show/hide hints container based on active hints
	const hasActiveHints = cell.querySelectorAll('.hint-spot.active').length > 0;

	if (hintsArray.length > 0 || hasActiveHints) {
		showHints(cell);
	} else {
		hideHints(cell);
	}
}

/**
 * Clear a cell's content with smart tree navigation
 * @param {HTMLElement} cell - The cell element
 * @param {number} boxId - Box identifier
 * @param {number} cellId - Cell identifier
 */
function clearCell(cell, boxId, cellId) {
	const mainNumberDiv = cell.querySelector('.main-number');
	const mainNumber = mainNumberDiv.textContent.trim();

	if (mainNumber) {
		const currentNode = getCurrentNode();
		const gameTree = getGameTree();

		// Smart deletion: check if we're deleting the digit that current node placed
		if (
			getTreeMode() &&
			currentNode.action &&
			isReplacementMove(currentNode.action, boxId, cellId) &&
			currentNode.parent
		) {
			console.log('Smart deletion: removing current node and going back to parent');

			// Remove current node from parent's children
			const parent = currentNode.parent;
			const index = parent.children.indexOf(currentNode);
			if (index > -1) {
				parent.children.splice(index, 1);
			}

			// Go back to parent
			setCurrentNode(parent);
			applyGameState(parent.gameState);
			updateTreeDisplay();
			return;
		}

		// Don't allow regular clearing in tree view mode (prevents cycles)
		if (getTreeMode() && currentNode !== gameTree) {
			console.log('Cannot clear cells in tree view. Use Backspace to navigate back.');
			return;
		}

		// Regular clearing behavior
		mainNumberDiv.textContent = '';
		showHints(cell); // Show hints after clearing main number

		// Create tree branch AFTER clearing (only if not in tree view)
		if (getTreeMode() && currentNode === gameTree) {
			const action = `Clear number at [${boxId},${cellId}]`;
			createNewBranch(action);
		}
	} else {
		// No main number, clear all hints
		cell.querySelectorAll('.hint-spot').forEach(spot => {
			spot.textContent = '';
			spot.classList.remove('active');
		});
		cell.querySelector('.center-hints').textContent = '';
		hideHints(cell);
	}
}

/**
 * Hide hints in a cell
 * @param {HTMLElement} cell - The cell element
 */
function hideHints(cell) {
	cell.querySelector('.center-hints').style.display = 'none';
	cell.querySelector('.border-hints').style.display = 'none';
}

/**
 * Show hints in a cell if it doesn't have a main number
 * @param {HTMLElement} cell - The cell element
 */
function showHints(cell) {
	// Only show hints if cell doesn't have main number
	const mainNumber = cell.querySelector('.main-number').textContent;
	if (!mainNumber) {
		cell.querySelector('.center-hints').style.display = 'block';
		cell.querySelector('.border-hints').style.display = 'grid';
	}
}
