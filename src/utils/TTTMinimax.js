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

	const { score, move } = minimax(game, true, 0, maxDepth);
	console.log("Total best score and move found: ", { score, move });

	return move;
}

function minimax(game, maximizing = true, currentDepth = 0, maxDepth) {

	if (game.evaluateWin().end === true || currentDepth > maxDepth) {
		if (game.isTie() || !game.end) return { score: 0 };
		// if maximizing, return negative score because the last move was made by minimizing player
		else if (maximizing) return { score: -20 + currentDepth };
		else return {score: 20 - currentDepth};
	}

	let moves = [];

	let possibleMoves = game.grid.reduce((acc, val, index) => {
		if (val === " ") {
			return [...acc, index];
		} else return acc;
	}, []);

	for (let i = 0; i < possibleMoves.length; i++) {
		game.doMove(possibleMoves[i], game.currentPlayer.mark);
		
		let move = possibleMoves[i];

		let score = minimax(game, !maximizing, currentDepth + 1, maxDepth).score;
		moves.push({ move, score });

		game.undoMove();
	}
	
	let bestMoves = [];
	let bestScore = maximizing ? -Infinity : Infinity;

	for (let i = 0; i < moves.length; i++) {
		let evalMove = moves[i];
		if (!maximizing) {
			if (evalMove.score < bestScore) {
				bestScore = evalMove.score;
				bestMoves = [evalMove.move];
			} else if (evalMove.score === bestScore) {
				bestMoves.push(evalMove.move);
			}
		} else if (maximizing) {
			if (evalMove.score > bestScore) {
				bestScore = evalMove.score;
				bestMoves = [evalMove.move];
			} else if (evalMove.score === bestScore) {
				bestMoves.push(evalMove.move);
			}
		}
	}

	let rndBestMove = bestMoves[Math.floor(Math.random() * bestMoves.length)];

	return { move: rndBestMove, score: bestScore };
}