'use strict';

export class Block {
	constructor (x, y, className){
		this.x = x;
		this.y = y;
		this.element = document.createElement('div');
		this.element.classList.add('block', className);
		this.element.style.left = this.x + "em";
		this.element.style.top = this.y + "em";
	}
}
