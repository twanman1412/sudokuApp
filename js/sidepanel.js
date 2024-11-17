import { setNumber } from "./cellLogic.js";

function enableNumpad() {

	for (const numbutton of document.querySelectorAll('.numbutton')) {
		numbutton.addEventListener('click', _ => {
			setNumber({ number: numbutton.id });
		});
	}
}

function loadFromFile(evt) {

	const reader = new FileReader();
	reader.onload = _ => {
		const text = reader.result;
		loadBoard(text);
	};

	reader.readAsText(evt.target.files[0]);
}

function loadFromString() {

	const string = document.querySelector('#textfield').value;
	console.log(document.querySelector('#textfield'));
	loadBoard(string);
}

function loadBoard(boardstr) {

	console.log(`We do be loading the board: ${boardstr}`);
}

document.addEventListener('DOMContentLoaded', _ => {
	enableNumpad();

	document.querySelector('#loadfile').addEventListener("change", loadFromFile);
	document.querySelector('#loadstring').addEventListener("click", loadFromString);
});
