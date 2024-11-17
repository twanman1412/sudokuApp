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

document.addEventListener('keydown', evt => {

	if (evt.key === "Shift" || evt.key === "Control") {

		console.log(`hints mode ${hints ? "disabled" : "enabled"}`);
		hints = !hints;
	}

	if (evt.key === "Delete" || evt.key === "Backspace") {
		selected.querySelector('p').innerText = "";
	}

	const num = parseInt(evt.key);
	if (!isNaN(num)) {
		selected.querySelector('p').innerText = num;
	}
});
