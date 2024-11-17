import { addCell } from "./cellLogic.js";

export function createBoard(parentDiv) {

	for (let boxId = 0; boxId < 9; boxId++) {

		const newBox = document.createElement('div');
		newBox.classList.add('box');
		newBox.id = `box${boxId}`;

		for (let cellId = 0; cellId < 9; cellId++) {

			const newCell = document.createElement('div');
			newCell.classList.add('cell');
			newCell.classList.add(`c${(cellId + boxId) % 2}`);
			//NOTE : Cell Id system for future usage
			// newCell.id = `cell${boxId}.${cellId}`;
			newBox.appendChild(newCell);

			const num = document.createElement('p');

			const hints = document.createElement('div');
			hints.classList.add('hint');

			newCell.appendChild(num);
			newCell.appendChild(hints);

			addCell(newCell, boxId, cellId);
		}

		parentDiv.appendChild(newBox);
	}
}
