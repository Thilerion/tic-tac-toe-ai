/*
	1.	check if game is over
		1a.	if yes, return {score}
		1b.	if no, continue
	2.	create array to hold all scores in
	3.	get all moves
	4.	for each move:
		4a.	make move
		4b.	assign {move,score} with recurse, toggling !maximizing
		4c.	push {move, score} to moves array
		4d. undo move
	5.	find the move with the best score
		5a. initial bestScore = maximizing ? -Infinity : Infinity
	6.	return {move, score}, with the score being the best found score

	Possible additions:
	-	Reduce/increase (towards 0) the score with the depth
	-	Directly change bestScore & bestMove after the recursion
		-	This may be necessary for the alpha-beta pruning
	-	Randomize choice if multiple moves have the best score
*/

function getBestMove(game, maxDepth = 9) {

	const { score, move } = minimax(game, game.getCurrentPlayer().currentPlayer, 0, maxDepth);
	console.log("Total best score and move found: ", { score, move });

	return move;
}

function minimax(game, maxPlayer, depth, maxDepth) {

	if (game.evaluateWin().end === true || depth > maxDepth) {
		if (game.isTie() || !game.end) return { score: 0 };
		
		// Return score from maximizer's perspective
		if (game.winner === maxPlayer.mark) {
			return { score: 20 - depth };
		} else return { score: depth - 20 };
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

		let score = minimax(game, maxPlayer, depth + 1, maxDepth).score;
		moves.push({ move, score });

		game.undoMove();
	}

	if (depth < 2) console.log(moves);

	let getMaximumScore = game.getCurrentPlayer().currentPlayer === maxPlayer;
	
	return moves.reduce((bestScore, currentScore) => {
		if (getMaximumScore) {
			if (currentScore.score > bestScore.score) return currentScore;
		} else {
			if (currentScore.score < bestScore.score) return currentScore;
		}
		return bestScore;
	}, { score: getMaximumScore ? -10000 : 10000 });
}