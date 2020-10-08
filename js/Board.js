'use strict';

export class Board {
	#blocks = [];
	#element
	width
	height
	blockSize

	constructor(width, height, blockSize) {
		this.blockSize = blockSize;
		this.#element = document.getElementById('board');
		this.setSize(width, height);
	}

	get element() { return this.#element; }

	setSize(width, height) {
		this.width = width;
		this.height = height;
		this.#element.style.width = width + "em";
		this.#element.style.height = height + "em";
	}

	clear(){
		this.#blocks = [];
		this.#element.innerHTML = "";
	}

	addBlock(block) {
		this.#blocks.push(block);
		this.#element.appendChild(block.element);
	}

	getBlockAt(x, y) {
		return this.#blocks.find(block => block.x === x && block.y === y);
	}

}
