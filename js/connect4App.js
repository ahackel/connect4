'use strict';

import {Connect4Game} from './Connect4Game.js';

let blockSize;
let game;

function adjustSize(){
	const portrait = window.innerWidth < window.innerHeight;
	const nx = window.innerWidth / ((portrait) ? 7 : 9);
	const ny = window.innerHeight / 7;
	const n = (portrait) ? nx : ny;
	blockSize = Math.min(128, Math.floor(n));
	document.documentElement.style.fontSize = blockSize + "px";
	if (game) {
		game.board.blockSize = blockSize;
	}
	window.scrollTo(0, 0);
}

const ready = (callback) => {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", callback);
	} else {
		callback();
	}
};

ready(() => {
	adjustSize();
	game = new Connect4Game(blockSize);
	window.addEventListener("resize", adjustSize);
	document.ontouchmove = function(e){ e.preventDefault(); };
});
