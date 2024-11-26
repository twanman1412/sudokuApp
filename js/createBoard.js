import { addCell, initGameState } from "./cellLogic.js";

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

			const num = document.createElement('p');
			newCell.appendChild(num);

			const hints = document.createElement('div');
			hints.classList.add('hints');
			newCell.appendChild(hints);

			newBox.appendChild(newCell);
			addCell(newCell, boxId, cellId);
		}

		parentDiv.appendChild(newBox);
	}

	initGameState();
}
