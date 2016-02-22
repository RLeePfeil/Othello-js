// For the UI, menu, etc. Anything not directly related to the game.
// Assume we have jquery.
$.ready(function(){
  // Set up the switch click handlers
  $(".switch").on("click", OthelloUI.switchHandler)

  // Set up menu TODO
});

var OthelloUI = OthelloUI ||
{
  switchHandler: function(e) {
    var off = false;

    switch $(e.target).attr("id") {
      case "control-p1":
        if (GAME.players.player1.ai) {
          GAME.players.player1.ai = false;
          off = true;
        } else {
          GAME.players.player1.ai = true;
        }
        break;
      case "control-p2":
        if (GAME.players.player2.ai) {
          GAME.players.player2.ai = false;
          off = true;
        } else {
          GAME.players.player2.ai = true;
        }
        break;
      default:
        break;
    }

    // Show the switch turning on / off
  	if (off) {
  		// Toggle off
  		$(e.target).addClass('off');
  	} else {
  		// Toggle on
  		$(e.target).removeClass('off');
  	}
  },


}
