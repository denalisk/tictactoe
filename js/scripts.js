function Game(playerArray) {
  this.valueVector = [0,0,0,0,0,0,0,0,0];
  this.gameState = true;
  this.playerState = 0;
  this.playerArray = playerArray;
  this.currentPlayer = playerArray[playerState]
}

function Player(playerName, symbol) {
  this.playerName = playerName;
  this.symbol = symbol;
  playerArray.push(this)
}

Game.prototype.stateSwitch = function() {
  if (playerState === 0) {
    playerState = 1;
  } else {
    playerState = 0;
  }
}

Game.prototype.printBoard = function(outputId) {
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
  $(outputId).append(topRow);
  $(outputId).append(midRow);
  $(outputId).append(bottomRow);
}


$(document).ready(function() {
  var gameboard
})
