const board = [];
const gameState = [];

let selected = [];
let borderHintMode = false; // Border hint mode
let centerHintMode = false; // Center hint mode

export function initGameState() {
	for (let boxId = 0; boxId < 9; boxId++) {
		gameState[boxId] = [];
		for (let cellId = 0; cellId < 9; cellId++) {
			// [main_number, border_hints_array, center_hints_array]
			gameState[boxId][cellId] = [0, Array(10).fill(false), []];
		}
	}
	console.log("Game state initialized");
}

export function addCell(cell, boxId, cellId) {
	if (!board[boxId]) board[boxId] = [];
	board[boxId][cellId] = cell;

	cell.addEventListener("click", () => {
		// Clear previous selection
		document.querySelectorAll('.cell').forEach(c => c.classList.remove('selected'));
		
		// Select current cell
		cell.classList.add('selected');
		selected = [boxId, cellId];
	});
}

export function setNumber({ number, cell, boxId, cellId }) {
	// Get target cell
	if (!cell) {
		if (selected.length < 2) {
			console.warn("No cell selected");
			return;
		}
		[boxId, cellId] = selected;
		cell = board[boxId][cellId];
	}

	// Clear cell
	if (number === "Delete" || number === "Backspace") {
		clearCell(cell, boxId, cellId);
		return;
	}

	// Handle number input
	const num = parseInt(number);
	if (!isNaN(num) && num >= 1 && num <= 9) {
		if (borderHintMode) {
			toggleBorderHint(cell, boxId, cellId, num);
		} else if (centerHintMode) {
			toggleCenterHint(cell, boxId, cellId, num);
		} else {
			setMainNumber(cell, boxId, cellId, num);
		}
	}
}

function setMainNumber(cell, boxId, cellId, number) {
	gameState[boxId][cellId][0] = number;
	
	const mainNumberDiv = cell.querySelector('.main-number');
	mainNumberDiv.textContent = number;
	
	// Hide hints when main number is set
	hideHints(cell);
}

function hideHints(cell) {
	cell.querySelector('.center-hints').style.display = 'none';
	cell.querySelector('.border-hints').style.display = 'none';
}

function showHints(cell) {
	// Only show hints if cell doesn't have main number
	const mainNumber = cell.querySelector('.main-number').textContent;
	if (!mainNumber) {
		cell.querySelector('.center-hints').style.display = 'block';
		cell.querySelector('.border-hints').style.display = 'grid';
	}
}

function toggleBorderHint(cell, boxId, cellId, number) {
	// Don't add hints if cell has main number
	if (gameState[boxId][cellId][0] !== 0) {
		return;
	}
	
	const borderHints = gameState[boxId][cellId][1];
	borderHints[number] = !borderHints[number];
	
	const hintSpot = cell.querySelector(`[data-number="${number}"]`);
	if (borderHints[number]) {
		hintSpot.textContent = number;
		hintSpot.classList.add('active');
	} else {
		hintSpot.textContent = '';
		hintSpot.classList.remove('active');
	}
	
	// Show border hints container if any hints are active
	const borderHintsDiv = cell.querySelector('.border-hints');
	const hasActiveHints = borderHints.some(hint => hint);
	if (hasActiveHints) {
		showHints(cell);
	} else if (!gameState[boxId][cellId][2].length) {
		hideHints(cell);
	}
}

function toggleCenterHint(cell, boxId, cellId, number) {
	// Don't add hints if cell has main number
	if (gameState[boxId][cellId][0] !== 0) {
		return;
	}
	
	const centerHints = gameState[boxId][cellId][2];
	const index = centerHints.indexOf(number);
	
	if (index > -1) {
		centerHints.splice(index, 1);
	} else {
		centerHints.push(number);
		centerHints.sort((a, b) => a - b);
	}
	
	updateCenterHintsDisplay(cell, centerHints);
	
	// Show hints if there are any
	if (centerHints.length > 0) {
		showHints(cell);
	} else if (!gameState[boxId][cellId][1].some(hint => hint)) {
		hideHints(cell);
	}
}

function updateCenterHintsDisplay(cell, centerHints) {
	const centerHintsDiv = cell.querySelector('.center-hints');
	centerHintsDiv.textContent = centerHints.join(' ');
}

function clearCell(cell, boxId, cellId) {
	// Clear main number
	gameState[boxId][cellId][0] = 0;
	cell.querySelector('.main-number').textContent = '';
	
	// Clear border hints
	gameState[boxId][cellId][1].fill(false);
	cell.querySelectorAll('.hint-spot').forEach(spot => {
		spot.textContent = '';
		spot.classList.remove('active');
	});
	
	// Clear center hints
	gameState[boxId][cellId][2] = [];
	cell.querySelector('.center-hints').textContent = '';
	
	// Show hint containers after clearing
	showHints(cell);
}

// Toggle border hint mode
function toggleBorderHintMode() {
	borderHintMode = !borderHintMode;
	if (borderHintMode && centerHintMode) {
		centerHintMode = false;
		updateCenterHintModeDisplay();
	}
	updateBorderHintModeDisplay();
}

// Toggle center hint mode
function toggleCenterHintMode() {
	centerHintMode = !centerHintMode;
	if (centerHintMode && borderHintMode) {
		borderHintMode = false;
		updateBorderHintModeDisplay();
	}
	updateCenterHintModeDisplay();
}

// Update border hint mode display
function updateBorderHintModeDisplay() {
	const button = document.querySelector('#border-hints');
	button.textContent = `Border Hints: ${borderHintMode ? 'ON' : 'OFF'}`;
	if (borderHintMode) {
		button.classList.add('selected');
	} else {
		button.classList.remove('selected');
	}
}

// Update center hint mode display
function updateCenterHintModeDisplay() {
	const button = document.querySelector('#center-hints');
	button.textContent = `Center Hints: ${centerHintMode ? 'ON' : 'OFF'}`;
	if (centerHintMode) {
		button.classList.add('selected');
	} else {
		button.classList.remove('selected');
	}
}

// Keyboard controls
document.addEventListener('keydown', (evt) => {
	if (evt.key >= '1' && evt.key <= '9') {
		setNumber({ number: evt.key });
	} else if (evt.key === 'Delete' || evt.key === 'Backspace') {
		setNumber({ number: evt.key });
	} else if (evt.key === 'b' || evt.key === 'B') {
		// Toggle border hint mode with 'b' key
		toggleBorderHintMode();
	} else if (evt.key === 'c' || evt.key === 'C') {
		// Toggle center hint mode with 'c' key
		toggleCenterHintMode();
	}
});

// Setup number buttons and controls
document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.numbutton').forEach(button => {
		button.addEventListener('click', () => {
			setNumber({ number: button.id });
		});
	});
	
	// Setup control buttons
	document.querySelector('#border-hints').addEventListener('click', () => {
		toggleBorderHintMode();
	});
	
	document.querySelector('#center-hints').addEventListener('click', () => {
		toggleCenterHintMode();
	});
	
	// Initialize displays
	updateBorderHintModeDisplay();
	updateCenterHintModeDisplay();
});
