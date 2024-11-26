const board = [];
const gameState = [];

let selected = [];

let hints = false;

export function initGameState() {

	for (let boxId = 0; boxId < 9; boxId++) {
		gameState[boxId] = [];
		for (let cellId = 0; cellId < 9; cellId++) {
			// [ number, hints ]
			gameState[boxId][cellId] = [0, []];
		}
	}

	console.log("Game state created");
	console.dir(gameState);
}

export function exportGameState() {
	return gameState.toString();
}

export function importGameState(gameState) {
	gameState = Array.from(gameState);
}

export function addCell(cell, boxId, cellId) {

	if (!board[boxId]) board[boxId] = [];
	board[boxId][cellId] = cell;

	cell.addEventListener("click", _ => {

		for (const box of board) {
			for (const cell_ of box) {
				cell_.classList.remove('selected');
			}
		}

		cell.classList.add('selected');
		selected = [boxId, cellId];
	});
}

export function setNumber({ number, cell, boxId, cellId }) {

	if (number === "Shift" || number === "Control") {
		document.querySelector('div#Control').classList.toggle('selected');
		hints = !hints;

		return;
	}

	if (!cell) {
		if (!boxId || !cellId) {

			if (selected.length < 2) {
				console.warn("No cell selected");
				return;
			}

			[boxId, cellId] = selected;
			cell = board[selected[0]][selected[1]];
		} else if (board[boxId] && board[boxId][cellId]) {
			cell = board[boxId][cellId];
		} else {
			console.warn(`Setting number to undefined box/cell combo ${boxId}/${cellId}`);
		}
	};

	if (number === "Delete" || number === "Backspace") {

		if (cell.querySelector('p').innerText === "") {

			const children = cell.querySelector('div.hints').children;
			for (const child of children) {
				cell.querySelector('div.hints').removeChild(child);
			}

			// Clear hints
			gameState[boxId][cellId][1] = [];

			if (number === "Backspace") {
				return;
			}
		}

		cell.querySelector('p').innerText = "";
		gameState[boxId][cellId][0] = 0;
		cell.querySelector('div.hints').style.display = 'flex';

		return;
	}

	const num = parseInt(number);
	if (!isNaN(num)) {
		if (hints) {

			console.log(num);
			console.dir(gameState[boxId][cellId][1]);
			if (gameState[boxId][cellId][1][num]) {

				gameState[boxId][cellId][1][num] = undefined;
				document.querySelectorAll('div.hints p').forEach(el => {
					if (el.innerText == num) {
						cell.querySelector('div.hints').removeChild(el);
					}
				});

				return;
			}

			// Add number to hints
			gameState[boxId][cellId][1][num] = num;

			const hint = document.createElement('p');
			hint.innerText = num;
			cell.querySelector('div.hints').appendChild(hint);
			return;
		}

		cell.querySelector('p').innerText = num;
		cell.querySelector('div.hints').style.display = 'none';
	}
}

document.addEventListener('keydown', evt => {
	if (evt.key != '0') {
		setNumber({ number: evt.key });
	}
});
