"use strict";

import {Connect4Game} from './Connect4Game.js';

let blockSize;
let game;

function adjustSize(){
	let portrait = window.innerWidth < window.innerHeight;
	let nx = window.innerWidth / ((portrait) ? 7 : 9);
	let ny = window.innerHeight / 7;
	let n = (portrait) ? nx : ny;
	blockSize = Math.min(128, Math.floor(n));
	document.documentElement.style.fontSize = blockSize + "px";
	if (game != null)
		game.board.blockSize = blockSize;
	window.scrollTo(0, 0);
}

const ready = (callback) => {
	if (document.readyState != "loading")
		callback();
	else
		document.addEventListener("DOMContentLoaded", callback);
};

ready(() => {
	adjustSize();
	game = new Connect4Game(blockSize);
	window.addEventListener("resize", adjustSize);
	document.ontouchmove = function(e){ e.preventDefault(); }
});
