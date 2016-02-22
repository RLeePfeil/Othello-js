// For the UI, menu, etc. Anything not directly related to the game.
// Assume we have jquery.
$(document).ready(function(){
  console.log("initialize UI");

  // See which switches need to be turned off by default
  if (!GAME.players.player1.ai) {
    $("#control-p1").addClass("off");
  }

  if (!GAME.players.player2.ai) {
    $("#control-p2").addClass("off");
  }

  // Set up the switch click handlers
  $(".switch").on("click", OthelloUI.switchHandler)

  // Set up menu TODO
});

var OthelloUI = OthelloUI ||
{
  switchHandler: function(e) {
    var $dt = $(e.delegateTarget);
    var id = $dt.attr("id");
    var off = false;

    switch (id) {
      case "control-p1":
        if (playerCheck("player1")) {
          off = true;
        }
        break;
      case "control-p2":
        if (playerCheck("player2")) {
          off = true;
        }
        break;
      default:
        break;
    }

    // Shorthand func, returns true if AI is being turned off
    function playerCheck(which) {
      if (GAME.players[which].ai) {
        GAME.players[which].ai = false;
        return true;
      } else {
        GAME.players[which].ai = true;
        // If it's the computer player's turn, move!
        if (GAME.player == which) {
          GAME.computerMove();
        }
        return false;
      }
    }

    // Show the switch turning on / off
  	if (off) {
  		// Toggle off
  		$dt.addClass('off');
  	} else {
  		// Toggle on
  		$dt.removeClass('off');
  	}
  },


}
