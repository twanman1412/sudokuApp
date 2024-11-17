const board = [];
let selected;

let hints = false;

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
		selected = cell;
	});
}

export function setNumber({ number, cell, boxId, cellId }) {

	if (!cell) {
		if (!boxId || !cellId) {
			cell = selected;
		} else if (board[boxId] && board[boxId][cellId]) {
			cell = board[boxId][cellId];
		} else {
			console.warn(`Setting number to undefined box/cell combo ${boxId}/${cellId}`);
		}
	};

	if (number === "Shift" || number === "Control") {
		hints = !hints;
	}

	if (number === "Delete" || number === "Backspace") {
		cell.querySelector('p').innerText = "";
	}

	const num = parseInt(number);
	if (!isNaN(num)) {
		cell.querySelector('p').innerText = num;
	}
}

document.addEventListener('keydown', evt => {
	setNumber({ number: evt.key });
});
