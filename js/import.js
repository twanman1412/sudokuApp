let button;
let textfield;

document.addEventListener("DOMContentLoaded", _ => {
	button = document.querySelector("button#submit-text");
	textfield = document.querySelector("input#textfield");

	button.addEventListener("click", _ => {
		console.log("click");
		console.log(textfield.value);
		importBoard(textfield.value);
	});
});


function importBoard(board) {

	const fields = board.split("");

	console.dir(fields);


	console.log(fields.lenght);
	if (fields.length !== 81) {
		console.log(fields.length);
		console.warn("wrong board size");
	}
}
