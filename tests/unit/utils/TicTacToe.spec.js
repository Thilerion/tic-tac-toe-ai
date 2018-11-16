import { PLAYERS, TIE, WINNERS, Game } from '../../../src/utils/TicTacToe.js';

describe('Game class', () => {

	describe('instantiation', () => {
		it('has a static empty method that returns an empty board', () => {
			let g = Game.empty();
			expect(g).toBeInstanceOf(Game);
			expect(g.grid.every(val => val === " ")).toBe(true);
		})

		it('has a static import method that takes an array', () => {
			let arr1 = ["X", "O", "X", "O", " ", " ", " ", " ", " "];
			let g1 = Game.import(arr1);
			expect(g1).toBeInstanceOf(Game);
			expect(g1.grid).toEqual(arr1);
		})

		it('assigns the correct player when creating a game', () => {
			let arr = ["X", "O", "X", "O", "X", " ", " ", " ", " "];
			let g = Game.import(arr);
			expect(g.currentPlayer).toBe(PLAYERS.O);

			arr = ["X", "O", "X", "O", " ", " ", " ", " ", " "];
			g = Game.import(arr);
			expect(g.currentPlayer).toBe(PLAYERS.X);

			g = Game.empty();
			expect(g.currentPlayer).toBe(PLAYERS.X);
		})
	})

	describe('toggle player method', () => {
		it('toggles the current player', () => {
			let game = Game.empty();
			expect(game.currentPlayer).toBe(PLAYERS.X);
			game.toggleCurrentPlayer();
			expect(game.currentPlayer).toBe(PLAYERS.O);
			game.toggleCurrentPlayer();
			expect(game.currentPlayer).toBe(PLAYERS.X);
		})
	})

	describe('move method and history', () => {
		let game;
		beforeEach(() => {
			game = Game.empty();
		})

		it('takes an index and mark and adds it to the grid', () => {
			expect(game.grid[0]).toBe(" ");
			game.doMove(0, "X");
			expect(game.grid[0]).toBe("X");
		})

		it('adds the move to the history', () => {
			expect(game.history).toHaveLength(0);
			game.doMove(0, "X").doMove(1, "O");
			expect(game.history).toHaveLength(2);
		})

		it('has a history array with each item having a mark and index', () => {
			let move = { mark: "X", index: 0 };
			game.doMove(move.index, move.mark);
			expect(game.history[0]).toEqual(move);
		})

		it('toggles the current player after making a move', () => {
			expect(game.currentPlayer).not.toBe(game.doMove(0, "X").currentPlayer);
			expect(game.currentPlayer).toBe(game.currentPlayer);
		})
	})

	describe('undo move method', () => {
		let game;
		beforeEach(() => {
			game = Game.empty();
		})

		it('only returns itself when there is no history', () => {
			let grid = [...game.grid];
			game.undoMove();
			let newGrid = [...game.grid];
			expect(grid).toEqual(newGrid);
			expect(game.undoMove()).toBe(game);
		})

		it('reduces history by one', () => {
			expect(game.doMove(0, 'X').history).toHaveLength(1);
			expect(game.undoMove().history).toHaveLength(0);
		})

		it('removes the last move from the grid', () => {
			let move = { index: 7, mark: "X" };
			expect(game.doMove(move.index, move.mark).undoMove().grid[7]).toBe(" ");
		})

		it('toggles the current player', () => {
			let p1 = game.currentPlayer;
			let p2 = game.doMove(0, "X").currentPlayer;
			let p3 = game.undoMove().currentPlayer;

			expect(p1).toBe(p3);
			expect(p1).not.toBe(p2);
		})
	})

	describe('evaluate win', () => {
		let game;
		beforeEach(() => {
			game = Game.empty();
		})

		it('has no winner, and no end in an empty new board', () => {
			expect(game.end).toBe(false);
			expect(game.winner).toBeFalsy();
		})

		it('correctly finds wins', () => {
			let arrX1 = ["X", "X", "X", "O", "O", " ", " ", " ", " "];
			let arrX2 = ["X", "O", "O", "X", "X", "O", "X", " ", " "];
			let arrO1 = ["O", "X", "X", "X", "O", "X", "O", " ", "O"];
			let arrO2 = ["X", " ", "O", " ", "O", "X", "O", "X", " "];

			game.grid = arrX1;
			game.evaluateWin();
			expect(game.winner).toBe("X");
			expect(game.end).toBe(true);

			game.grid = arrX2;
			game.evaluateWin();
			expect(game.winner).toBe("X");
			expect(game.end).toBe(true);

			game.grid = arrO1;
			game.evaluateWin();
			expect(game.winner).toBe("O");
			expect(game.end).toBe(true);

			game.grid = arrO2;
			game.evaluateWin();
			expect(game.winner).toBe("O");
			expect(game.end).toBe(true);
		})

		it('correctly find ties', () => {
			let arr1 = [
				"X", "X", "O",
				"O", "X", "X",
				"X", "O", "O"
			];
			let arr2 = [
				"X", "O", "X",
				"X", "O", "X",
				"O", "X", "O"
			];
			let arr3 = [
				" ", " ", " ",
				" ", " ", " ",
				" ", " ", " "
			];

			game.grid = arr1;
			game.evaluateWin();
			expect(game.winner).toBe(TIE);
			expect(game.end).toBe(true);

			game.grid = arr2;
			game.evaluateWin();
			expect(game.winner).toBe(TIE);
			expect(game.end).toBe(true);

			game.grid = arr3;
			game.evaluateWin();
			expect(game.winner).not.toBe(TIE);
			expect(game.end).toBe(false);
		})
	})
})