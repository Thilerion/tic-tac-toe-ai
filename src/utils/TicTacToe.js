const COMPUTER = "ai";
const PLAYER = "player"

const PLAYERS = {
	O: {
		type: COMPUTER,
		mark: "O"
	},
	X: {
		type: PLAYER,
		mark: "X"
	}
}

const TIE = "tie";

const WINNERS = [
	[0, 1, 2], [3, 4, 5], [6, 7, 8],
	[0, 3, 6], [1, 4, 7], [2, 5, 8],
	[0, 4, 8], [2, 4, 6]
];

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

	printGrid() {
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
		console.log(str);
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

export { PLAYERS, TIE, WINNERS, Game };