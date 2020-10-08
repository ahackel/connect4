'use strict';

import {Board} from './Board.js';

const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

export class Game {
	constructor(width, height, blockSize) {
		this.board = new Board(width, height, blockSize);

		this.board.element.addEventListener('pointerdown', (e) => {
			let x = e.offsetX / this.board.blockSize;
			let y = e.offsetY / this.board.blockSize;
			let clampedX = clamp(Math.floor(x), 0, this.board.width - 1);
			let clampedY = clamp(Math.floor(y), 0, this.board.height - 1);

			let newEvent = {
				originalEvent: e,
				x: clampedX,
				y: clampedY,
				originalX: x,
				originalY: y,
				block: this.board.getBlockAt(clampedX, clampedY)
			};
			this.click(newEvent);
		});

		this.numMoves = 0;
		this.over = false;
	}

	reset(){
		this.board.clear();
		this.over = false;
	}

	click(e){}

	won() {
	}
}
