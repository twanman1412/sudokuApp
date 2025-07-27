/**
 * Tree Navigation Module
 * Handles tree structure, navigation, and display functionality
 */

import {
	TreeNode,
	getGameTree,
	setGameTree,
	getCurrentNode,
	setCurrentNode,
	getTreeMode,
	setTreeMode,
	getCurrentBoardState,
	applyGameState,
} from './gameState.js';

/**
 * Start tree tracking from current board state
 * Creates root node and enables tree navigation features
 */
export function startTree() {
	const currentState = getCurrentBoardState();
	const rootNode = new TreeNode(currentState, null, null); // Root has no parent or action
	setGameTree(rootNode);
	setCurrentNode(rootNode);
	setTreeMode(true);
	updateTreeDisplay();
	console.log('Tree tracking started from current position');
	console.log('Root node created with current board state');
}

/**
 * Stop tree tracking and disable tree navigation features
 */
export function stopTree() {
	setGameTree(null);
	setCurrentNode(null);
	setTreeMode(false);
	updateTreeDisplay();
	console.log('Tree tracking stopped');
}

/**
 * Create a new tree branch when in tree mode
 * @param {string} action - Description of the action that led to this state
 * @returns {TreeNode|null} The new node created or null if not in tree mode
 */
export function createNewBranch(action) {
	// Only create tree nodes if tree mode is active
	if (!getTreeMode()) return null;

	// Create new node with current board state (after the move was made)
	const newNode = new TreeNode(getCurrentBoardState(), getCurrentNode(), action);
	setCurrentNode(newNode);
	updateTreeDisplay();
	return newNode;
}

/**
 * Navigate back to the parent node in the tree
 */
export function goBack() {
	const currentNode = getCurrentNode();
	if (!getTreeMode() || !currentNode.parent) {
		console.log('Cannot go back - not in tree mode or at root');
		return;
	}

	setCurrentNode(currentNode.parent);
	applyGameState(currentNode.parent.gameState);
	updateTreeDisplay();
	console.log('Moved back to:', currentNode.parent.action || 'Root');
}

/**
 * Navigate forward to a child node in the tree
 * @param {number} childIndex - Index of child to navigate to (default: 0)
 */
export function goForward(childIndex = 0) {
	const currentNode = getCurrentNode();
	if (!getTreeMode() || currentNode.children.length <= childIndex) {
		console.log('Cannot go forward - not in tree mode or no children');
		return;
	}

	const targetChild = currentNode.children[childIndex];
	setCurrentNode(targetChild);
	applyGameState(targetChild.gameState);
	updateTreeDisplay();
	console.log('Moved forward to:', targetChild.action);
}

/**
 * Navigate directly to a specific node by ID
 * @param {number} nodeId - ID of the node to navigate to
 */
export function goToNode(nodeId) {
	if (!getTreeMode()) return;

	const node = findNodeById(nodeId);
	if (node) {
		setCurrentNode(node);
		applyGameState(node.gameState);
		updateTreeDisplay();
		console.log('Jumped to node:', node.action || 'Root');
	}
}

/**
 * Find a node in the tree by its ID
 * @param {number} nodeId - ID to search for
 * @returns {TreeNode|null} Found node or null
 */
function findNodeById(nodeId) {
	const gameTree = getGameTree();
	if (!gameTree) return null;

	function searchTree(node) {
		if (node.id === nodeId) return node;
		for (const child of node.children) {
			const found = searchTree(child);
			if (found) return found;
		}
		return null;
	}
	return searchTree(gameTree);
}

/**
 * Check if an action affects the same cell as a given position
 * @param {string} action - Action string to parse
 * @param {number} boxId - Box identifier to compare
 * @param {number} cellId - Cell identifier to compare
 * @returns {boolean} Whether the action affects the same cell
 */
export function isReplacementMove(action, boxId, cellId) {
	// Parse action string like "Set 5 at [2,3]" or "Clear number at [2,3]"
	const match = action.match(/at \[(\d+),(\d+)\]/);
	if (match) {
		const actionBoxId = parseInt(match[1]);
		const actionCellId = parseInt(match[2]);
		return actionBoxId === boxId && actionCellId === cellId;
	}
	return false;
}

// Tree display and UI functions

/**
 * Update the tree display in the sidebar with file-tree style interface
 */
export function updateTreeDisplay() {
	const treeContainer = document.querySelector('#tree-view');
	if (!treeContainer) return;

	treeContainer.innerHTML = '';

	if (!getTreeMode()) {
		// Show option to start tree tracking
		const startButton = document.createElement('button');
		startButton.textContent = 'Start Tree Tracking';
		startButton.className = 'tree-control-button';
		startButton.onclick = startTree;
		treeContainer.appendChild(startButton);
		return;
	}

	// Tree controls
	const controls = document.createElement('div');
	controls.className = 'tree-controls';

	const stopButton = document.createElement('button');
	stopButton.textContent = 'Stop Tree';
	stopButton.className = 'tree-control-button';
	stopButton.onclick = stopTree;
	controls.appendChild(stopButton);

	treeContainer.appendChild(controls);

	// Render tree structure
	const treeStructure = document.createElement('div');
	treeStructure.className = 'tree-structure';

	const gameTree = getGameTree();
	if (gameTree) {
		renderTreeNode(gameTree, treeStructure, 0, []);
	}
	treeContainer.appendChild(treeStructure);
}

/**
 * Render a single tree node and its children
 * @param {TreeNode} node - Node to render
 * @param {HTMLElement} container - Container element
 * @param {number} depth - Indentation depth
 * @param {Array} isLastChild - Array tracking last child status for each level
 */
function renderTreeNode(node, container, depth = 0, isLastChild = []) {
	const nodeDiv = document.createElement('div');
	nodeDiv.className = 'tree-node-item';

	// Node content
	const nodeContent = document.createElement('div');
	nodeContent.className = 'tree-node-content';
	nodeContent.style.paddingLeft = `${depth * 16}px`; // 16px per level for clear indentation

	const currentNode = getCurrentNode();
	if (node === currentNode) {
		nodeContent.classList.add('current');
	}

	const nodeText = node.action || 'Root';

	// Create main content area (for navigation)
	const mainContent = document.createElement('span');
	mainContent.className = 'tree-node-main';

	// Folder indicator
	let folderIcon = '';
	if (node.children.length > 0) {
		folderIcon = node.expanded !== false ? '📂 ' : '📁 ';
	} else {
		folderIcon = '📄 '; // File/leaf node
	}

	mainContent.innerHTML = `${folderIcon}${nodeText}`;

	// Click handler for navigation only
	mainContent.onclick = e => {
		e.stopPropagation();

		// Navigate to node
		if (node !== currentNode) {
			setCurrentNode(node);
			applyGameState(node.gameState);
			updateTreeDisplay();
			console.log('Navigated to:', node.action || 'Root');
		}
	};

	nodeContent.appendChild(mainContent);

	// Add toggle button for nodes with children
	if (node.children.length > 0) {
		const toggleButton = document.createElement('span');
		toggleButton.className = 'tree-toggle-button';
		toggleButton.innerHTML = node.expanded !== false ? '▼' : '▶';

		// Click handler for toggle only
		toggleButton.onclick = e => {
			e.stopPropagation();

			// Toggle expansion
			node.expanded = node.expanded !== false ? false : true;
			updateTreeDisplay();
			console.log('Toggled expansion for:', node.action || 'Root');
		};

		nodeContent.appendChild(toggleButton);
	}

	nodeDiv.appendChild(nodeContent);
	container.appendChild(nodeDiv);

	// Render children if expanded
	if (node.children.length > 0 && node.expanded !== false) {
		node.children.forEach((child, index) => {
			const isLast = index === node.children.length - 1;
			const newIsLastChild = [...isLastChild, isLast];
			renderTreeNode(child, container, depth + 1, newIsLastChild);
		});
	}
}

/**
 * Get the current path from root to current node
 * @returns {string} Path description
 */
export function getCurrentPath() {
	const path = [];
	let node = getCurrentNode();
	while (node && node.parent) {
		path.unshift(node.action);
		node = node.parent;
	}
	return path.length > 0 ? path.join(' → ') : 'Root';
}
