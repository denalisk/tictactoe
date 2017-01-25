function Game(valueVector, gameState, playerArray) {
  this.valueVector = valueVector;
  this.gameState = gameState;
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


$(document).ready(function() {
  var gameboard
})
