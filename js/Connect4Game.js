import {Block} from './Block.js';
import {Game} from './Game.js';
import {GameState, MCTS} from './MCTS.js';

"use strict";

const EMPTY = -1;
const RED = 0;
const YELLOW = 1;
const NUM_PLAYERS = 2;
const DRAW = -1;
const CONNECT_LENGTH = 4;
const WIDTH = 7;
const HEIGHT = 6;
const MAXITER = 300;
const COLOR_NAMES = ['red', 'yellow', 'blue', 'green'];
const HUMAN_PLAYERS = [true, false, false, false];

class Connect4GameState extends GameState{

	constructor(player){
		super();
		this.player = player;
		this.winner = null;
		this.lastPosition = null;
		for (let i=0; i<WIDTH * HEIGHT; i++)
			this.values.push(EMPTY);
	}

	get(x, y) {
		if (x < 0 || y < 0 || x > WIDTH - 1 || y > HEIGHT - 1)
			return null;
		return this.values[x + y * WIDTH];
	}

	getColumnCount(x){
		let count = 0;
		for (let y = HEIGHT - 1; y >= -1; y--){
			if (this.values[x + y * WIDTH] != EMPTY)
				count++;
			else
				return count;
		}
	}

	isColumnFree(x){
		return this.getColumnCount(x) < HEIGHT;
	}


	getMoves(){
		let moves = [];
		if (this.winner == null) {
			// Game is not over, so there are moves:
			for (let x = 0; x < WIDTH; x++) {
				if (this.isColumnFree(x)) {
					moves.push(x);
				}
			}
		}
		return moves;
	}

	doMove(move){
		this.player = ((this.player + 1) % NUM_PLAYERS);

		let y = HEIGHT - this.getColumnCount(move) - 1;
		this.lastPosition = move + y * WIDTH;
		this.values[this.lastPosition] = this.player;
		this.winner = this.getWinner();
		return y;
	}

	copy(){
		let s = new Connect4GameState();
		s.values = this.values.slice(0);
		s.player = this.player;
		s.winner = this.winner;
		s.lastPosition = this.lastPosition;
		return s;
	}

	checkLine(dx, dy){
		let count = 0;

		let x = this.lastPosition % WIDTH;
		let y = Math.floor(this.lastPosition / WIDTH);
		x -= dx * (CONNECT_LENGTH-1);
		y -= dy * (CONNECT_LENGTH-1);

		for (let i = 0; i < CONNECT_LENGTH * 2 - 1; i++) {
			if (this.get(x + dx * i, y + dy * i) == this.player)
				count++;
			else
				count = 0;
			if (count == CONNECT_LENGTH) {
				this.wonPosition = [];
				for (let p = 0; p<CONNECT_LENGTH; p++){
					this.wonPosition.push({
						x: x + dx * (i - p),
						y: y + dy * (i - p)
					})
				}
				return true;
			}
		}
		return false;
	}


	getWinner(){
		if (this.checkLine(1, 0)) return this.player;
		if (this.checkLine(0, 1)) return this.player;
		if (this.checkLine(1, 1)) return this.player;
		if (this.checkLine(1, -1)) return this.player;

		if (this.isFull())
			return DRAW;
		else
			return null;
	}

	getResult(player){
		if (this.winner == player)
			return 1;
		if (this.winner == DRAW || this.winner == null)
			return 0.5;
		// other player wins:
		return 0;
	}

	isFull(){
		for (let v of this.values) {
			if (v == EMPTY)
				return false;
		}
		return true;
	}
}

class Connect4Block extends Block {
	constructor (game, x, y, color) {
		let colorClass = COLOR_NAMES[color];
		super(game, x, y, 1, 1, colorClass);
		this.element.classList.add('start');
		setTimeout(() => { this.element.classList.remove('start'); }, 0);
	}
}

export class Connect4Game extends Game {
	constructor(blockSize) {
		super(WIDTH, HEIGHT, blockSize);
		this.gameOver = document.getElementById('gameover');
		this.gameOver.style.display = 'none';
		this.gameOver.addEventListener('pointerdown', e => {
			this.reset();
		});
		this.gameOverText = document.getElementById('gameover-text');
		this.wins = [0, 0, 0, 0];
		this.reset();
	}

	startTimer(){
		if (!this.timer) {
			this.timer = setInterval(() => this.tick(), 1000);
		}
	}

	stopTimer(){
		clearInterval(this.timer);
		this.timer = null;
	}

	click(e){
		// the player can only move if the last player has been the computer:
		if (e.originalEvent.which != 1 || e.originalEvent.ctrlKey)
			return;

		if (this.over || this.gameState.player == RED)
		    return;

		if (this.placeBlock(e.x)) {
			// reset timer:
			this.stopTimer();
			this.startTimer();
		}
	}

	tick(){
		let nextPlayer = (this.gameState.player + 1) % NUM_PLAYERS;
		if (this.over || HUMAN_PLAYERS[nextPlayer]) {
			this.stopTimer();
			return;
		}

		let move = MCTS.search(this.gameState, MAXITER); //, Math.random() * 100);
		this.placeBlock(move);
	}

	placeBlock(x){
		if (this.gameState.isColumnFree(x)) {
			let y = this.gameState.doMove(x);
			this.board.addBlock(new Connect4Block(this, x, y, this.gameState.player));
			this.checkGameOver();
			return true;
		}
		return false;
	}

	doMove(state, move, player, real){
		let count = this.getColumnCount(state, move);
		let y = null;
		if (count < this.board.height) {
			y = this.board.height - count - 1;
			state.set(move, y, player);
			this.lastMove.x = move;
			this.lastMove.y = y;
			this.lastMove.color = player;
			if (real)
				this.board.addBlock(new Connect4Block(this, move, y, player));
		}
		return y;
	}

	checkGameOver(){
		if (this.gameState.winner != null) {

			if (this.gameState.wonPosition) {
				for (let p of this.gameState.wonPosition) {
					this.board.getBlockAt(p.x, p.y).element.classList.add('won');
				}
			}

			let s = 'DRAW';
			if (this.gameState.winner != DRAW){
				let winningColor = COLOR_NAMES[this.gameState.winner];
				s = winningColor + " wins.";
				this.wins[this.gameState.winner]++;

				document.getElementsByClassName('wins.' + winningColor)
					.innerText = this.wins[this.gameState.winner];
			}
			this.gameOverText.innerText = s.toUpperCase();
			this.gameOver.style.display = 'block';
			this.over = true;
			return true;
		}
		return false;
	}

	reset(){
		super.reset();
		this.gameOver.style.display = 'none';
		this.gameState = new Connect4GameState(Math.floor(Math.random() * NUM_PLAYERS));
		this.startTimer();
	}


}
