import {Connect4Game} from './Connect4Game';

var blockSize;
var game;

function adjustSize(){
	let portrait = window.innerWidth < window.innerHeight;
	let nx = window.innerWidth / ((portrait) ? 7 : 9);
	let ny = window.innerHeight / 7;
	let n = (portrait) ? nx : ny;
	blockSize = Math.min(128, Math.floor(n));
	$('html').css('font-size', blockSize);
	if (game != null)
		game.board.blockSize = blockSize;
	window.scrollTo(0, 0);
}

$(document).ready(function() {
	adjustSize();
	game = new Connect4Game(blockSize);

	$(window).on('resize', adjustSize);

	document.ontouchmove = function(e){ e.preventDefault(); }
});
