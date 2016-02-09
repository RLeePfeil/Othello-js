/*
 * TODO Enancements
 *
 * - Improve AI -
 * Computer should...
 *   take corners whenever possible, disallow user from taking corners
 *   make moves with the highest (pieces flipped : pieces opponent can flip next turn) ratio
 *   not make plays that allow the user to put a piece on an edge (maybe?)
 *
 * - 2 player mode (instead of only vs AI) -
 * Add a menu to select 1player vs com and 2 player
 * Also include "game restart" button (and possibly "undo")
 *
 * - Graph of gameplay -
 * At the end, show a screen containing a graph of the amount of board captured over time
 *
 */


var GAME = GAME ||
{
	across: 8, // Number of squares across the board
	down: 8, // Number of squares down the board
	container: null, // Stage object
	passBtn: null, // Pass button
	messages: null, // Message holding div
	errors: null, // Error holding div
	player: 'player1', // Holds the current player as a string

	tweens: {}, // Holds animations

	board: [], // All the pieces in the board as an array

	/* Constructor */
	Othello: function()
	{
		// Get elements
		GAME.container = document.getElementById("game-board");
		GAME.passBtn = document.getElementById("pass-button");
		GAME.messages = document.getElementById("messages");
		GAME.errors = document.getElementById("errors");

		// Set up the board
		GAME.setUp(GAME.across, GAME.down);

		// Set up the starting piece positions
		var l = Math.floor((GAME.across-1)/2);
		var r = Math.ceil((GAME.across-1)/2);
		var t = Math.floor((GAME.down-1)/2);
		var b = Math.ceil((GAME.down-1)/2);

		GAME.board[l][t].obj.placePiece(null, false);
		GAME.board[r][b].obj.placePiece(null, false);
		GAME.player = 'player2';
		GAME.board[l][b].obj.placePiece(null, false);
		GAME.board[r][t].obj.placePiece(null, false);
		GAME.player = 'player1';

		// Set up button events
		GAME.passBtn.onclick = GAME.passTurn;

		// Highlight valid moves at the start
		GAME.validMoves();

		console.log("Black's Move");
		GAME.showMessage("Black's Move");
		// TODO show whose turn it is
		//whoseTurn_mc.gotoAndStop('player1');
		//whoseTurn_txt.mouseEnabled = false;
		//whoseTurn_txt.text = "Black's Move"
	},

	/*
	 * Create the board
	 * Takes # of pieces across and down as acs, dwn
	 */
	setUp: function(acs, dwn)
	{
		for (var a=0; a<acs; a++)
		{
			var colArray = [];
			for (var d=0; d<dwn; d++)
			{
				colArray.push({'obj':new Square(GAME, a, d), 'pieces':null});
			}
			GAME.board.push(colArray);
		}
	},

	passTurn: function() {
		alert("Passing turn...");
		GAME.switchPlayer();
	},

	/*
	 * Changes the current players
	 * Happens at the end of the flipping process
	 */
	switchPlayer: function ()
	{
		if (GAME.player == 'player1') {
			GAME.player = 'player2';
			// update to say "player 2" or "White's Move"
			GAME.showMessage("White's Move");

			// Every time we switch players, show valid moves!
			GAME.validMoves();

			// Take a bit to make it seem like the computer is thinking
			setTimeout(GAME.computerMove, Math.round(800+Math.random()*1200));
		} else if (GAME.player == 'player2') {
			GAME.player = 'player1';
			// update to say "player 1" or "Black's Move"
			GAME.showMessage("Black's Move");

			// Every time we switch players, show valid moves!
			GAME.validMoves();
		}
	},

	/*
	 * Go through entire array of squares and check to see if moves would be valid,
	 * based on the current player's turn
	 */
	validMoves: function()
	{
	 for (var a=0; a<GAME.board.length; a++) {
		 for (var d=0; d<GAME.board[a].length; d++){
			 if (!GAME.board[a][d].obj.myPiece && !!GAME.board[a][d].obj.checkPiece()){
				 GAME.board[a][d].obj.mySquare.classList.add("highlight");
			 }
		 }
	 }
	},

	/*
	 * Clears the highlighted moves
	 */
	removeValidMoves: function()
	{
	 for (var a=0; a<GAME.board.length; a++) {
		 for (var d=0; d<GAME.board[a].length; d++){
			 GAME.board[a][d].obj.mySquare.classList.remove("highlight");
		 }
	 }
	},

	/*
	 * Return the number of pieces in an array by their owners
	 */
	tallyPieces: function() {
		//GAME.board TODO
		var playerTally = {};
		GAME.forEachPiece(function(piece){
			if (playerTally[piece.myPlayer]) {
				playerTally[piece.myPlayer] ++;
			} else {
				playerTally[piece.myPlayer] = 1;
			}
		});

		for (player in playerTally) {
			GAME.showScore(player, playerTally[player]);
		}
	},

	/*
	 * Takes id of player ("player1", "player2") and score, displays it
	 */
	showScore: function(player, score) {
		document.getElementById("tally-"+player).innerHTML = score;
	},

	/*
	 * Helper function, runs a function on each square
	 */
	forEachSquare: function(doThing) {
		for (var a=0; a<GAME.board.length; a++) {
 			for (var d=0; d<GAME.board[a].length; d++){
				doThing(GAME.board[a][d].obj.mySquare);
			}
	 	}
 	},

	/*
	 * Helper function, runs a function on each piece
	 */
	forEachPiece: function(doThing) {
		for (var a=0; a<GAME.board.length; a++) {
 			for (var d=0; d<GAME.board[a].length; d++){
				if (!!GAME.board[a][d].obj.myPiece) {
					doThing(GAME.board[a][d].obj);
				}
			}
	 	}
 	},

	/*
	 * Takes a message (msg) and display it, replacing the old message
	 */
	showMessage: function(msg)
	{
		// Fade out old message, then remove
		if (GAME.messages.children.length > 0) {
			var curMessage = GAME.messages.children[0];
			curMessage.classList.remove("fadein");
			setTimeout(function(){curMessage.parentElement.removeChild(curMessage);}, 350);
		}

		// Add new message
		var newMessage = document.createElement("span");
		newMessage.appendChild(document.createTextNode(msg));
		GAME.messages.appendChild(newMessage);
		setTimeout(function(){newMessage.classList.add("fadein");}, 350);
	},

	/*
	 * Hides the current message temporarily, then shows it again afterwards
	 */
	showError: function(msg)
	{
		// Change error text, fade out after 3 sec
		var curMessage = GAME.errors.children[0];
		curMessage.innerHTML = msg;
		curMessage.classList.add("fadein");

		if (GAME.errorTimeout) {
			clearTimeout(GAME.errorTimeout);
		}

		GAME.errorTimeout = setTimeout(function(){curMessage.classList.remove("fadein");}, 3000);
	},

	/*
	 * Check the win conditions
	 */
	checkWin: function()
	{
		var winObj = {'player1':0, 'player2':0};

		for(var c=0; c<GAME.board.length; c++) {
			for(var r=0; r<GAME.board[c].length; r++) {
				var mp = GAME.board[c][r].obj.myPlayer;
				if (mp == null) {
					return false;
				} else if (mp == 'player1') {
					winObj.player1++;
				} else if (mp == 'player2') {
					winObj.player2++;
				}
			}
		}
		if (winObj.player1 > winObj.player2) {
			return 'player 1 wins!'
		} else if (winObj.player1 < winObj.player2) {
			return 'player 2 wins!';
		} else {
			return 'draw!'
		}
	},

	/*
	 * AI for computer move
	 */
	computerMove: function()
	{
		var possibleMoves = []; // Holds the number of possible moves

		for (var c=0; c<GAME.board.length; c++) {
			for (var r=0; r<GAME.board[c].length; r++) {
				if(GAME.board[c][r].obj.myPlayer == null) {
					var checkPieceResult = GAME.board[c][r].obj.checkPiece();
					if (checkPieceResult != false) {
						possibleMoves.push({'obj':GAME.board[c][r].obj, 'pieces':checkPieceResult});
					}
				}
			}
		}

		var indexToPlace = null;

		// See if any of the moves are corner pieces - if so, go for it!

		/* Moves with the highest favor will be chosen.
		 * +1 favor for each piece that can be flipped
		 * +10 favor for a corner piece
		 * +5 favor for a side piece
		 * -X for favor of best move that could be made by opponent using same credentials TODO
		 */

		var favor = 0; // Holds the highest favor value using credentials above
		var chosenMove = 0; // The index of the possibleMoves array with the highest favor

		for (var i=0; i< possibleMoves.length; i++) {
			// Add up the number of pieces that would be flipped
			var tempFavor = 0;
			for (var m=0; m<possibleMoves[i].pieces.length; m++) {
				for (var n=0; n<possibleMoves[i].pieces[m].length; n++) {
					tempFavor++;
				}
			}

			// Is the square on the left/right edge of the board?
			if (possibleMoves[i].obj.myX == 0 || possibleMoves[i].obj.myX == GAME.across-1) {
				tempFavor += 5;
			}

			// Is the square on the top/bottom edge of the board?
			if (possibleMoves[i].obj.myY == 0 || possibleMoves[i].obj.myY == GAME.down-1) {
				tempFavor += 5;
			}

			// If this move has the highest favor, choose it
			if (tempFavor > favor) {
				favor = tempFavor;
				chosenMove = i;
			}
		}

		if (favor == 0 && chosenMove == 0) {
			GAME.showError("Computer can't move!");
			GAME.switchPlayer();
		} else {
			possibleMoves[chosenMove].obj.placePiece(null, false);
			setTimeout(possibleMoves[chosenMove].obj.flipPieces, 400, possibleMoves[chosenMove].pieces);
		}
	}
}







/*
 * Board square class
 */
var Square = function (g, acs, dwn)
{
	var squareObj = this;
	this.game = g;
	this.myX = acs;
	this.myY = dwn;
	this.myPlayer = null;
	this.myTweens = {};

	// add element to the game container and register it
	this.mySquare = document.createElement("span");
	var classlist = "square";
	if (this.myY == 0) {
		// If it's the first in a row
		classlist = classlist + " first";
	}
	if ((this.myX + this.myY)%2 == 0) {
		// If it's an odd piece, give different background color
		classlist = classlist + " odd";
	}
	this.mySquare.setAttribute("class", classlist);
	this.mySquare.onclick = function(){
		// Only allow clicking if it's the player's turn
		if (squareObj.game.player == "player1") {
			squareObj.placePiece(null, true);
		}
	};
	this.game.container.appendChild(this.mySquare);

	this.myPiece;

	this.placePiece = function(e, playerIsPlacing)
	{
		console.log("place piece");
		if (playerIsPlacing) {
			var piecesToFlip = this.checkPiece();
			if(piecesToFlip == false) {
				this.game.showError("Invalid move. ("+this.myX+","+this.myY+")");
				// TODO show the invalid move X on the square
				//this.invalidMove_mc.gotoAndPlay(2);
				return false;
			} //when tweens are created, else is taken care of
		}

		if (this.game.board[this.myX][this.myY].obj.myPlayer == null) {
			//set the board
			this.game.board[this.myX][this.myY].obj.myPlayer = this.game.player;
			this.myPlayer = this.game.player;

			//place piece here!
			this.myPiece = document.createElement("span");
			this.myPiece.setAttribute("class", "piece " + this.game.player);
			this.mySquare.appendChild(this.myPiece);
			// Remove click event to place piece
			this.mySquare.onclick = null;

			setTimeout(function(){squareObj.myPiece.classList.add("placed")}, 20); // Give the piece the "placed" class so it falls onto the board

			// Clear the valid moves when a new piece is placed
			this.game.removeValidMoves();

			// Check win conditions after piece placement is finished
			setTimeout(function(){squareObj._checkWin()}, 250);

			// Update tally when piece placement is finished
			setTimeout(function(){squareObj.game.tallyPieces()}, 250);

			if (playerIsPlacing) {
				// flip won pieces after the piece is placed
				setTimeout(function(e){squareObj.flipPieces(piecesToFlip)}, 250);
			}
		}
	}

	//returns false if move is invalid (no pieces of opposite color are near it, and no moves can be made
	//returns with the pieces to flip (in order) if the move is valid
	this.checkPiece = function()
	{
		var opposingPlayer = '';
		var thisPlayer = '';
		if (this.game.player == 'player1') { opposingPlayer = 'player2'; thisPlayer = 'player1'; }
		else { opposingPlayer = 'player1'; thisPlayer = 'player2'; }


		var modifiers = [function(spy){spy.y--;return spy;},			//up
								 function(spy){spy.x++; spy.y--;return spy;},	//up right
								 function(spy){spy.x++;return spy;},			//right
								 function(spy){spy.x++; spy.y++;return spy;},	//down right
								 function(spy){spy.y++;return spy;},			//down
								 function(spy){spy.x--; spy.y++;return spy;},	//down left
								 function(spy){spy.x--;return spy;},			//left
								 function(spy){spy.x--; spy.y--;return spy;}];//up left

		var pieceArray = [];

		for(var i=0; i<modifiers.length; i++)
		{
			var spy = {'x':this.myX, 'y':this.myY};
			var tempList = [];
			var isValid = false;
			var nextPiece = true;

			do {
				spy = modifiers[i](spy); //modify the point value we're checking

				if (isWithinBounds()) {

					//Flash to show pieces that are being checked
					//game.board[spy.x][spy.y].obj.beacon_mc.play();

					var isOppositeResult = isOpposite();

					if (isOppositeResult == null) {
						nextPiece = false; //don't check the next piece in this direction
					} else if (isOppositeResult == true) {
						tempList.push({'x':spy.x, 'y':spy.y});
					} else if (isOppositeResult == false) {
						if (tempList.length > 0) {
							isValid = true;
						} else {
							nextPiece = false; //don't check the next piece in this direction
						}
					}
				}
			} while(isWithinBounds() && isValid == false && nextPiece == true);

			if (isValid != false && tempList.length > 0) {
				pieceArray.push(tempList);
			}
			//console.log("reset: "+i);
		}

		//if there are no pieces to flip, return false
		if (pieceArray.length == 0) {
			return false;
		} else { //else, return the collected array of flippable pieces
			return pieceArray;
		}

		//function resetSpy() {spy.x = myX; spy.y = myY;}

		function isWithinBounds() {
			//console.log("within bounds test")
			if(spy.x >= 0 && spy.x <= squareObj.game.across-1 && spy.y >= 0 && spy.y <= squareObj.game.down-1) {
				return true;
			} else {
				return false;
			}
		}

		//Checks to see if the piece chosen is of the opposite color. if there is no piece, null is returned. if
		function isOpposite() {
			if (squareObj.game.board[spy.x][spy.y].obj.myPlayer == opposingPlayer) {
				return true;
			}
			else if (squareObj.game.board[spy.x][spy.y].obj.myPlayer == thisPlayer) {
				return false;
			}
			else {
				return null;
			}
		}
	}

	this.flipPieces = function(which)
	{
		var flipCount = 0;
		var delay = 333;//in ms

		for (var i=0; i<which.length; i++)
		{
			for (var j=0; j<which[i].length; j++)
			{
				//squareObj.game.showError("flipping "+which[i][j].x+" "+which[i][j].y);
				setTimeout(squareObj.game.board[which[i][j].x][which[i][j].y].obj.flipMe, flipCount * delay);
				flipCount++;

				// Update tally when piece flipping starts
				setTimeout(squareObj.game.tallyPieces, flipCount * delay);
			}
		}

		setTimeout(squareObj.game.switchPlayer, flipCount * delay);
	}

	this.flipMe = function()
	{
		if (squareObj.myPlayer == 'player1') {
			squareObj.myPlayer = 'player2';
			// TODO separate instruction from display
			squareObj.myPiece.classList.remove("player1");
			squareObj.myPiece.classList.add("player2");
		} else if (squareObj.myPlayer == 'player2') {
			squareObj.myPlayer = 'player1';
			// TODO separate instruction from display
			squareObj.myPiece.classList.remove("player2");
			squareObj.myPiece.classList.add("player1");
		}
	}

	this._checkWin = function(e)
	{
		var isWin = squareObj.game.checkWin();
		if (isWin != false) {
			console.log(isWin);
			squareObj.game.showMessage(isWin);
		}
	}

	return this;
}
