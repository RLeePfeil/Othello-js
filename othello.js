var GAME = GAME ||
{
	across: 8, // Number of squares across the board
	down: 8, // Number of squares down the board
	container: null, // Stage object
	passBtn: null, // Pass button
	player: 'player1', // Holds the current player as a string

	tweens: {}, // Holds animations

	board: [], // All the pieces in the board as an array

	/* Constructor */
	Othello: function()
	{
		// Get elements
		GAME.container = document.getElementById("game-board");
		GAME.passBtn = document.getElementById("pass-button");

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

		console.log("Black's Move");
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
			// TODO update to say "player 2" or "White's Move"
			//whoseTurn_obj.gotoAndPlay('player1');
			//whoseTurn_txt.text = "White's Move"

			// Every time we switch players, show valid moves!
			GAME.validMoves();

			// Take a bit to make it seem like the computer is thinking
			setTimeout(GAME.computerMove, 1800);
		} else if (GAME.player == 'player2') {
			GAME.player = 'player1';
			// TODO update to say "player 1" or "Black's Move"
			//whoseTurn_mc.gotoAndPlay('player2');
			//whoseTurn_txt.text = "Black's Move"

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
	 console.log("adding valid move highlighting");
	 for (var a=0; a<GAME.board.length; a++) {
		 for (var d=0; d<GAME.board[a].length; d++){
			 if (!GAME.board[a][d].obj.myPiece && !!GAME.board[a][d].obj.checkPiece()){
				 GAME.board[a][d].obj.mySquare.classList.add("highlight");
				 console.log("highlighting "+a+" "+d);
			 }
		 }
	 }
	},

	/*
	 * Clears the highlighted moves
	 */
	removeValidMoves: function()
	{
	 console.log("removing valid move highlighting");
	 for (var a=0; a<GAME.board.length; a++) {
		 for (var d=0; d<GAME.board[a].length; d++){
			 GAME.board[a][d].obj.mySquare.classList.remove("highlight");
		 }
	 }
	},

	/*
	 * Takes a message (msg) and display it
	 */
	writeError: function(msg)
	{
		// TODO create new error message, show it, fade it out
		//error_mc.error_txt.text+= "\n"+msg+"\n";
		//tweens.errorScroll = new Tween(error_mc, 'verticalScrollPosition', Strong.easeOut, error_mc.verticalScrollPosition, error_mc.textHeight, 30);
		//error_mc.verticalScrollPosition = error_mc.textHeight;
		alert("ERROR: " + msg);
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
		var totals = [];

		for (var c=0; c<GAME.board.length; c++) {
			for (var r=0; r<GAME.board[c].length; r++) {
				if(GAME.board[c][r].obj.myPlayer == null) {
					var checkPieceResult = GAME.board[c][r].obj.checkPiece();
					if (checkPieceResult != false) {
						totals.push({'obj':GAME.board[c][r].obj, 'pieces':checkPieceResult});
					}
				}
			}
		}

		var maxNum = 0;
		var maxIndex = 0;

		for (var i=0; i< totals.length; i++) {
			var tempCount = 0;
			for (var m=0; m<totals[i].pieces.length; m++) {
				for (var n=0; n<totals[i].pieces[m].length; n++) {
					tempCount++;
				}
			}

			if (tempCount > maxNum) {
				maxNum = tempCount;
				maxIndex = i;
			}
		}

		if (maxNum == 0 && maxIndex == 0) {
			GAME.writeError("Computer can't move!");
			GAME.switchPlayer();
		} else {
			totals[maxIndex].obj.placePiece(null, false);
			setTimeout(totals[maxIndex].obj.flipPieces, 400, totals[maxIndex].pieces);
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
				this.game.writeError("Invalid move. ("+this.myX+","+this.myY+")");
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
				//squareObj.game.writeError("flipping "+which[i][j].x+" "+which[i][j].y);
				setTimeout(squareObj.game.board[which[i][j].x][which[i][j].y].obj.flipMe, flipCount*delay);
				flipCount++;
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
			squareObj.game.writeError(isWin);
		}
	}

	return this;
}
