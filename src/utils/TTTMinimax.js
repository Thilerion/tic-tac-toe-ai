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