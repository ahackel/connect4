import {Rect} from './Rect';
import {Block} from './Block';
import {Board} from './Board';

"use strict";

function clamp(v, min, max){
	return Math.min(Math.max(v, min), max);
}

export class Game {
	constructor(width, height, blockSize) {
		this.board = new Board(width, height, blockSize);

		this.board.element.on('touchstart mousedown', this, function (e) {
			let that = e.data;

			let pos = $(this).offset();
			let x = (e.pageX - pos.left) / that.board.blockSize;
			let y = (e.pageY - pos.top) / that.board.blockSize;
			let clampedX = clamp(Math.floor(x), 0, that.board.width - 1);
			let clampedY = clamp(Math.floor(y), 0, that.board.height - 1);

			let newEvent = {
				originalEvent: e,
				x: clampedX,
				y: clampedY,
				originalX: x,
				originalY: y,
				block: that.board.getBlockAt(clampedX, clampedY)
			};
			that.click(newEvent);
		});

		this.numMoves = 0;
		this.editMode_ = false;
		this.over = false;
	}

	get editMode() { return this.editMode_; }
	set editMode(v) {
		this.editMode_ = v;
		this.board.setSize(v ? 8 : 4, 5);
		this.board.element.toggleClass('editmode', v);
	}

	reset(){
		this.board.clear();
		this.over = false;
	}

	click(e){}

	won() {
		console.log('Game won!');
	}
}