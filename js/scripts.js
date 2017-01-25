var playerArray = []

function Game(playerArray) {
  this.valueVector = [0,0,0,0,0,0,0,0,0];
  this.gameState = true;
  this.playerState = 0;
  this.playerArray = playerArray;
  this.currentPlayer = playerArray[this.playerState]
}

function Player(playerName, symbol, game) {
  this.playerName = playerName;
  this.symbol = symbol;
  playerArray.push(this)
}

Game.prototype.stateSwitch = function() {
  if (this.playerState === 0) {
    this.playerState = 1;
  } else {
    this.playerState = 0;
  }
}

Game.prototype.printBoard = function(outputLocation) {
  var topRow = [];
  var midRow = [];
  var bottomRow = [];
  for (var i = 0; i < this.valueVector.length; i++) {
    if (i < 3) {
      topRow.push(this.valueVector[i]);
    } else if (i < 6) {
      midRow.push(this.valueVector[i]);
    } else {
      bottomRow.push(this.valueVector[i]);
    }
  }
  $(outputLocation).append(topRow);
  $(outputLocation).append("<br>");
  $(outputLocation).append(midRow);
  $(outputLocation).append("<br>");
  $(outputLocation).append(bottomRow);
}


$(document).ready(function() {
  var player1 = new Player("Sam", "X");
  var player2 = new Player("Nicole", "O");
  var game1 = new Game(playerArray);

  game1.printBoard("#board");

  $(".move-button").click(function() {
    var vectorIndex = parseInt($(this).val());
    console.log(vectorIndex);
    game1.valueVector[vectorIndex] = game1.playerArray[game1.playerState].symbol;
    $("#board").empty();
    game1.printBoard("#board");
    game1.stateSwitch();
  })

})
