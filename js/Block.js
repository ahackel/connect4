export class Block {
	constructor (game, x, y, width, height, className){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.className = className;
		this.element = document.createElement('div');
		this.element.classList.add('block', className);
		this.element.style.left = this.x + "em";
		this.element.style.top = this.y + "em";
	}
}
