// Monte Carlo Tree Search

function indentString(indent) {
	let s = "\n";
	for (let i = 0; i < indent; i++)
		s += "| ";
	return s;
}


export class GameState {
	constructor(move){
		this.values = [];
	}

	copy(){
		let s = new GameState();
		s.values = this.values.splice(0);
		return s;
	}

	getMoves(){
		return [];
	}

	getResult(){
		return 0;
	}

	doMove(move){

	}

}

export class MCTreeNode {

//	static nActions = 5;
//	static epsilon = 1e-6;


	constructor(state, parent, move) {
		this.move = move;
		this.parent = parent;
		this.children = [];
		this.visits = 0;
		this.untriedMoves = state.getMoves();
		this.player = state.player;

		this.totValue = 0;
		this.epsilon = 1e-6;
	}

	selectChild() {
		let uct = c => c.totValue / c.visits + Math.sqrt(2 * Math.log(this.visits) / c.visits);

		this.children.sort((a, b) => uct(b) - uct(a));
		return this.children[0];
	}

	addChild(move, state){
		let n = new MCTreeNode(state, this, move);
		this.untriedMoves.splice(this.untriedMoves.indexOf(move), 1);
		this.children.push(n);
		return n;
	}

	update(value) {
		this.visits++;
		this.totValue += value;
	}

	getResult(player) {
		return 0;
	}

	toString(){
		return "[M:" + this.move + " W/V:" + this.totValue + "/" + this.visits + " U:" + this.untriedMoves + " P:" + this.player + "]";
	}

	treeToString(indent) {
		let s = indentString(indent) + this;
		for (let c of this.children)
			s += c.treeToString(indent + 1);
		return s;
	}

	bestTreeToString(indent) {
		let s = indentString(indent) + this;
		if (this.children.length > 0) {
			this.children.sort((a, b) => b.visits - a.visits);
			s += this.children[0].bestTreeToString(indent + 1);
		}
		return s;
	}

}

export class MCTS {

	static search(rootState, iterMax = 1000) {

		// iterate at least one time:
		iterMax = Math.max(1, iterMax);

		let rootNode = new MCTreeNode(rootState);
		for (let i = 0; i < iterMax; i++) {
			let node = rootNode;
			let state = rootState.copy();

			//select:
			while (node.untriedMoves.length == 0 && node.children.length > 0) {
				node = node.selectChild();
				state.doMove(node.move);
			}

			//expand:
			if (node.untriedMoves.length > 0) {
				let m = node.untriedMoves[Math.floor(Math.random() * node.untriedMoves.length)];
				state.doMove(m);
				node = node.addChild(m, state);
			}

			//rollout:
			while (true) {
				let moves = state.getMoves();
				if (moves == 0)
					break;
				state.doMove(moves[Math.floor(Math.random() * moves.length)]);
			}

				// Backpropagate
			while (node != null) {
				let result = state.getResult(node.player);
				node.update(result);
				node = node.parent;
			}
		}
		if (rootNode.children.length == 0)
		    return -1;
		rootNode.children.sort((a, b) => b.visits - a.visits);
		//console.log(rootNode.bestTreeToString(0));
		//console.log(rootNode);
		return rootNode.children[0].move;
	}
}
