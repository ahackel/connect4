"use strict";

export class Board {
	constructor(width, height, blockSize) {
		this.blockSize = blockSize;
		this.blocks = []; //new Set();
		this.element = $('#board');
		this.selectedBlock_ = null;
		this.setSize(width, height);
	}

	setSize(width, height) {
		this.width = width;
		this.height = height;
		this.element.width(width + "em");
		this.element.height(height + "em");
	}

	get bounds() {
		return new Rect(0, 0, this.width, this.height);
	}

	get selectedBlock(){ return this.selectedBlock_; }
	set selectedBlock(v) {
		if (this.selectedBlock_ != null)
			this.selectedBlock_.selected = false;
		this.selectedBlock_ = v;
		if (v != null)
			v.selected = true;
	}

	clear(){
		this.blocks = []; //.clear();
		this.element.empty();
	}

	addBlock(block){
		this.blocks.push(block); //add(block);
		this.element.append(block.element);
	}

	getBlockAt(x, y){
		//for (let block of this.blocks) {
		for (var i=0; i<this.blocks.length; i++){
			var block = this.blocks[i];
			if (block.x == x && block.y == y)
				return block;
		}
		return null;
	}

}