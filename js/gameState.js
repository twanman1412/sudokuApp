/**
 * Game State Management Module
 * Centralized state management for the Sudoku application
 */

// Game state variables
export const board = [];
export let selectedCell = [];

// Tree state variables
export let gameTree = null;
export let currentNode = null;
export let nodeIdCounter = 0;
export let treeMode = false; // Tree tracking is off by default

/**
 * Tree node structure for game state tracking
 * Each node represents a game state with ability to branch and navigate
 */
export class TreeNode {
	constructor(gameState, parentNode = null, action = null) {
		this.id = nodeIdCounter++;
		this.gameState = JSON.parse(JSON.stringify(gameState)); // Deep copy
		this.parent = parentNode;
		this.children = [];
		this.action = action; // What action led to this state
		this.timestamp = new Date();

		if (parentNode) {
			parentNode.children.push(this);
		}
	}
}

/**
 * Initialize the game state with empty cells
 * Each cell contains: [main_number, border_hints_array, center_hints_array]
 */
export function initGameState() {
	const initialState = [];
	for (let boxId = 0; boxId < 9; boxId++) {
		initialState[boxId] = [];
		for (let cellId = 0; cellId < 9; cellId++) {
			// [main_number, border_hints_array, center_hints_array]
			initialState[boxId][cellId] = [0, Array(10).fill(false), []];
		}
	}

	console.log('Game state initialized - tree mode off');
}

/**
 * Set the selected cell
 * @param {Array} cellCoords - [boxId, cellId] coordinates
 */
export function setSelectedCell(cellCoords) {
	selectedCell = cellCoords;
}

/**
 * Get the selected cell coordinates
 * @returns {Array} [boxId, cellId] coordinates
 */
export function getSelectedCell() {
	return selectedCell;
}

/**
 * Set tree mode state
 * @param {boolean} enabled - Whether tree mode is enabled
 */
export function setTreeMode(enabled) {
	treeMode = enabled;
}

/**
 * Get tree mode state
 * @returns {boolean} Whether tree mode is enabled
 */
export function getTreeMode() {
	return treeMode;
}

/**
 * Set the game tree
 * @param {TreeNode} tree - The root tree node
 */
export function setGameTree(tree) {
	gameTree = tree;
}

/**
 * Get the game tree
 * @returns {TreeNode|null} The root tree node
 */
export function getGameTree() {
	return gameTree;
}

/**
 * Set the current tree node
 * @param {TreeNode} node - The current node
 */
export function setCurrentNode(node) {
	currentNode = node;
}

/**
 * Get the current tree node
 * @returns {TreeNode|null} The current node
 */
export function getCurrentNode() {
	return currentNode;
}

/**
 * Increment and return the next node ID
 * @returns {number} The next node ID
 */
export function getNextNodeId() {
	return nodeIdCounter++;
}

/**
 * Extract current board state from DOM elements
 * @returns {Array} 3D array representing the complete board state
 */
export function getCurrentBoardState() {
	const state = [];
	for (let boxId = 0; boxId < 9; boxId++) {
		state[boxId] = [];
		for (let cellId = 0; cellId < 9; cellId++) {
			const cell = board[boxId][cellId];
			const mainNumber = parseInt(cell.querySelector('.main-number').textContent) || 0;

			// Get border hints
			const borderHints = Array(10).fill(false);
			cell.querySelectorAll('.hint-spot').forEach(spot => {
				const num = parseInt(spot.dataset.number);
				if (spot.classList.contains('active')) {
					borderHints[num] = true;
				}
			});

			// Get center hints
			const centerHintsText = cell.querySelector('.center-hints').textContent.trim();
			const centerHints = centerHintsText
				? centerHintsText.split(' ').map(n => parseInt(n))
				: [];

			state[boxId][cellId] = [mainNumber, borderHints, centerHints];
		}
	}
	return state;
}

/**
 * Apply a game state to the board DOM elements
 * @param {Array} gameState - The game state to apply
 */
export function applyGameState(gameState) {
	// Apply the game state to the board
	for (let boxId = 0; boxId < 9; boxId++) {
		for (let cellId = 0; cellId < 9; cellId++) {
			const cell = board[boxId][cellId];
			const [mainNumber, borderHints, centerHints] = gameState[boxId][cellId];

			// Set main number
			const mainNumberDiv = cell.querySelector('.main-number');
			mainNumberDiv.textContent = mainNumber || '';

			// Set border hints
			borderHints.forEach((active, num) => {
				if (num >= 1 && num <= 9) {
					const hintSpot = cell.querySelector(`[data-number="${num}"]`);
					if (active) {
						hintSpot.textContent = num;
						hintSpot.classList.add('active');
					} else {
						hintSpot.textContent = '';
						hintSpot.classList.remove('active');
					}
				}
			});

			// Set center hints
			const centerHintsDiv = cell.querySelector('.center-hints');
			centerHintsDiv.textContent = centerHints.join(' ');

			// Show/hide hints based on main number
			if (mainNumber) {
				hideHints(cell);
			} else {
				const hasAnyHints = borderHints.some(h => h) || centerHints.length > 0;
				if (hasAnyHints) {
					showHints(cell);
				}
			}
		}
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
