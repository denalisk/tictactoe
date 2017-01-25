var playerArray = []

function Game(playerArray) {
  this.valueVector = [0,0,0,0,0,0,0,0,0];
  this.gameState = true;
  this.playerState = 0;
  this.playerArray = playerArray;
  this.currentPlayer = playerArray[this.playerState]
  this.winner = "It's a tie";
}

function Player(playerName) {
  this.playerName = playerName;
  this.symbol = "X";
  playerArray.push(this);
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
  if (winner === true) {
    this.winner = this.playerArray[this.playerState].playerName + " " + "is the winner!";
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

Game.prototype.imageInsert = function(imageId, targetId) {
  $(targetId).append($(imageId).clone())
}


$(document).ready(function() {
  $("#get-names").submit(function(event) {
    event.preventDefault();
    $(".entire-game").show();
    $(".landing-page").hide();
    var player1 = new Player($("#player-1").val());
    var player2 = new Player($("#player-2").val());
    var game1 = new Game(playerArray);

    $(".position").click(function() {
      var currentDiv = $(this);
      var vectorIndex = parseInt(currentDiv.attr('id'));
      if (game1.valueVector[vectorIndex] === 0 && game1.gameState === true) {
        if (game1.playerState === 0) {
          var imageId = "#x";
        } else {
          var imageId = "#o";
        }
        game1.imageInsert(imageId, currentDiv);
        game1.valueVector[vectorIndex] = game1.playerState+1;
        if (game1.checkOver() === true){
          $("#game-over").append(game1.winner);
          game1.gameState = false;
          $("#game-over").show();
        }
        game1.stateSwitch();
      }
    })
  })

})
