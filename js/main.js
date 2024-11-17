import { createBoard } from "./createBoard.js";

document.addEventListener('DOMContentLoaded', _ => {

	createBoard(document.querySelector('div#main'));
});
