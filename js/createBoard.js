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

			// Main number display (center)
			const mainNumber = document.createElement('div');
			mainNumber.classList.add('main-number');
			newCell.appendChild(mainNumber);

			// Center hints (small numbers in center)
			const centerHints = document.createElement('div');
			centerHints.classList.add('center-hints');
			newCell.appendChild(centerHints);

			// Border hints (small numbers around edges)
			const borderHints = document.createElement('div');
			borderHints.classList.add('border-hints');
			
			// Create 9 positions for border hints (top-left, top-center, top-right, etc.)
			for (let i = 1; i <= 9; i++) {
				const hintSpot = document.createElement('div');
				hintSpot.classList.add('hint-spot');
				hintSpot.dataset.number = i;
				borderHints.appendChild(hintSpot);
			}
			
			newCell.appendChild(borderHints);

			newBox.appendChild(newCell);
			addCell(newCell, boxId, cellId);
		}

		parentDiv.appendChild(newBox);
	}

	initGameState();
}
