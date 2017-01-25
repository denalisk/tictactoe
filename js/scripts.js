var playerArray = [];
var currentGame;

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
  this.winsTotal = 0;
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
    this.playerArray[this.playerState].winsTotal += 1;
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
    currentGame = game1;

    $(".position").click(function() {
      var currentDiv = $(this);
      var vectorIndex = parseInt(currentDiv.attr('id'));
      if (currentGame.valueVector[vectorIndex] === 0 && currentGame.gameState === true) {
        if (currentGame.playerState === 0) {
          var imageId = "#x";
        } else {
          var imageId = "#o";
        }
        currentGame.imageInsert(imageId, currentDiv);
        currentGame.valueVector[vectorIndex] = currentGame.playerState+1;
        if (currentGame.checkOver() === true){
          $("#game-over-text").text(currentGame.winner);
          currentGame.gameState = false;
          $("#game-over").show();
          $("#player-1-name").text(currentGame.playerArray[0].playerName);
          $("#player-1-wins").text(currentGame.playerArray[0].winsTotal);
          $("#player-2-name").text(currentGame.playerArray[1].playerName);
          $("#player-2-wins").text(currentGame.playerArray[1].winsTotal);
        }
        currentGame.stateSwitch();
      }
    })

    $(".replay").click(function(){
      var newGame = new Game(playerArray);
      currentGame = newGame;
      $("#game-over").hide();
      $(".entire-game").find(".position").empty();
    })
  })

})
