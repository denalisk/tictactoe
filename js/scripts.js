var playerArray = []

function Game(playerArray) {
  this.valueVector = [0,0,0,0,0,0,0,0,0];
  this.gameState = true;
  this.playerState = 0;
  this.playerArray = playerArray;
  this.currentPlayer = playerArray[this.playerState]
}

function Player(playerName, game, symbol) {
  this.playerName = playerName;
  this.symbol = symbol;
  playerArray.push(this);
}

Game.prototype.assignSymbol = function(symbols) {
  for (var index = 0; index < 2; index++) {
    this.playerArray[index].symbol = symbols[index]
  }
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

Game.prototype.checkWin = function() {
  var firstElement = this.valueVector[0];
  var winner = false;
  var completeGame = true;
  for (var index = 0; index < 7; index += 3) {
    if (this.valueVector[index] === this.valueVector[index + 1] && this.valueVector[index] === this.valueVector[index + 2] && this.valueVector[index] != 0) {
      winner = true;
    }
  }
  for (var index = 0; index < 3; index += 1) {
    if (this.valueVector[index] === this.valueVector[index + 3] && this.valueVector[index] === this.valueVector[index + 6] && this.valueVector[index] != 0) {
      winner = true;
    }
  }
  for (var index = 2; index < 5; index += 2) {
    if (this.valueVector[4] === this.valueVector[4 + index] && this.valueVector[4] === this.valueVector[4 - index] && this.valueVector[4] != 0) {
      winner = true;
    }
  }
  return winner;
}

Game.prototype.checkComplete = function () {
  var completeGame = true;

  for (var index = 0; index < 9; index++) {
    if (this.valueVector[index] === 0) {
      completeGame = false;
      break;
    }
  }
  return completeGame
};

Game.prototype.checkOver = function () {
  if (this.checkWin() === true) {
    return true;
  } else {
    return this.checkComplete();
  }
};


$(document).ready(function() {
  var player1 = new Player("Sam", "X");
  var player2 = new Player("Nicole", "O");
  var game1 = new Game(playerArray);
  $("#board").append(game1.playerArray[0].symbol);


  game1.printBoard("#board");

  $(".position").click(function() {
    var vectorIndex = parseInt($(this).attr('id'));
    console.log(vectorIndex);
    if (game1.valueVector[vectorIndex] === 0) {
      game1.valueVector[vectorIndex] = game1.playerState+1;
      $("#board").empty();
      game1.printBoard("#board");
      if (game1.checkOver() === true){
        $("#game-over").show();
      }
      game1.stateSwitch();
    }
  })

})
