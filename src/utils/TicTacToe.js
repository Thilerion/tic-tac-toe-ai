const COMPUTER = "ai";
const PLAYER = "player"

const PLAYERS = {
	O: {
		type: COMPUTER,
		mark: "O",
		color: -1
	},
	X: {
		type: PLAYER,
		mark: "X",
		color: 1
	}
}

const TIE = "tie";

const WINNERS = [
	[0, 1, 2], [3, 4, 5], [6, 7, 8],
	[0, 3, 6], [1, 4, 7], [2, 5, 8],
	[0, 4, 8], [2, 4, 6]
];

function getBestMove(game, maxDepth = 9) {

	console.log(game.getCurrentPlayer().currentPlayer.color);
	const { score, move } = negamax(game, 0, maxDepth, game.getCurrentPlayer().currentPlayer.color);
	console.log("Total best score and move found: ", { score, move });

	return move;
}

function negamax(game, depth, maxDepth, color) {

	if (game.evaluateWin().end === true || depth > maxDepth) {
		// 
		if (game.isTie() || !game.end) return { score: 0 };

		// Return score from POV player with color of 1 ("X") * color of recursive step
		let score = game.winner === "X" ? (20 - depth) : (depth - 20);
		return { score: color * score };
		// return { score: color * (20 - depth) };
	}

	let moves = [];

	let possibleMoves = game.grid.reduce((acc, val, index) => {
		if (val !== "X" && val !== "O") acc.push(index);
		return acc;
	}, []);

	let mark = game.getCurrentPlayer().currentPlayer.mark;

	for (let i = 0; i < possibleMoves.length; i++) {

		game.doMove(possibleMoves[i], mark);
		
		let move = possibleMoves[i];

		let score = -1 * (negamax(game, depth + 1, maxDepth, -color).score);
		moves.push({ move, score });

		game.undoMove();
	}

	if (depth === 0) console.log(moves);
	
	return moves.reduce((bestScore, currentScore) => {
		if (currentScore.score > bestScore.score) return currentScore;
		return bestScore;
	}, { score: -10000 });
}

class Game {
	constructor(grid) {
		this.grid = grid;
		this.currentPlayer = PLAYERS.X;
		this.history = [];

		this.end = false;
		this.winner = null;
	}

	static empty() {
		let grid = Array(9).fill(" ");
		return new Game(grid);
	}

	static import(arr) {
		return new Game(arr).getCurrentPlayer().evaluateWin();
	}

	getCurrentPlayer() {
		let moves = this.grid.reduce((acc, val) => {
			if (val === "O" || val === "X") {
				if (!acc[val]) acc[val] = 1;
				else acc[val]++;
			} 
			return acc;
		}, { O: 0, X: 0 });

		if (moves.O >= moves.X) this.currentPlayer = PLAYERS.X;
		else this.currentPlayer = PLAYERS.O;
		return this;
	}

	toggleCurrentPlayer() {
		this.currentPlayer = this.currentPlayer === PLAYERS.X ? PLAYERS.O : PLAYERS.X;
		return this;
	}

	getGridString() {
		let str = `+---+---+---+\n`;

		for (let i = 0; i < this.grid.length; i += 3) {
			str += `| ${this.grid[i]} | ${this.grid[i + 1]} | ${this.grid[i + 2]} |\n+---+---+---+\n`;
		}

		if (this.end && this.winner !== TIE) {
			str = `Game won by ${this.winner}!\n${str}`;
		} else if (this.end && this.winner === TIE) {
			str = `Game was tied!\n${str}`;
		} else {
			str = `Current player: ${this.currentPlayer.mark}\n${str}`;
		}
		return str;
	}

	printGrid() {
		console.log(this.getGridString());
	}

	doMove(index, mark) {
		this.grid[index] = mark;
		this.history.push({ mark, index });
		return this.toggleCurrentPlayer().evaluateWin();
	}

	undoMove() {
		if (this.history.length <= 0) return this;
		let {index} = this.history.pop();
		this.grid[index] = " ";
		return this.toggleCurrentPlayer().evaluateWin();
	}

	evaluateWin() {
		let winner = null;
		let foundEmpty = this.grid.some(el => el === " ");

		for (let i = 0; i < WINNERS.length; i++) {
			let seq = WINNERS[i];
			if ((this.grid[seq[0]] === this.grid[seq[1]] && this.grid[seq[0]] === this.grid[seq[2]]) && this.grid[seq[0]] !== " ") {
				winner = this.grid[seq[0]];
				break;
			}
		}

		if (winner != null) {
			this.winner = winner;
			this.end = true;
		} else {
			if (foundEmpty) {
				this.winner = null;
				this.end = false;
			} else if (!foundEmpty) {
				this.winner = TIE;
				this.end = true;
			}
		}
		return this;
	}

	isTie() {
		return this.winner === TIE;
	}
}

let g = Game.empty().doMove(1, "X").doMove(7, "O").doMove(3, "X").doMove(6, "O").doMove(8, "X").getCurrentPlayer();
g.printGrid();
let bestMove = getBestMove(g, 9);

export { PLAYERS, TIE, WINNERS, Game };