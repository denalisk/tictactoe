var playerArray = [];
var currentGame;
var onePlayer = false;
var gamesArray = [];
var similarArrays = [];

function Game(player1, player2, onePlayer, computerPlayer) {
  this.valueVector = [0,0,0,0,0,0,0,0,0];
  this.gameState = true;
  this.playerState = 0;
  this.playerArray = [];
  this.playerArray.push(player1, player2, computerPlayer);
  this.currentPlayer = playerArray[this.playerState]
  this.winner = "It's a tie";
  this.winnerId;
  this.computerPerfomance;
  this.onePlayer = onePlayer;
}

function Player(playerName, identifier) {
  this.playerName = playerName;
  this.identifier = identifier;
  playerArray.push(this);
  this.winsTotal = 0;
  this.humanPlayer = true;
}

Game.prototype.randomNumber = function() {
  var computerMove = Math.floor(Math.random()*9);
  while (this.valueVector[computerMove] != 0) {
    computerMove = Math.floor(Math.random()*9);
  }
  return computerMove;
};

Game.prototype.onePlayerSetup = function() {
  if (this.onePlayer === true) {
    this.playerArray.splice(1,1);
  } else {
    this.playerArray.pop();
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
  var winIndex;
  var winner = false;
  var completeGame = true;
  for (var index = 0; index < 7; index += 3) {
    if (this.valueVector[index] === this.valueVector[index + 1] && this.valueVector[index] === this.valueVector[index + 2] && this.valueVector[index] != 0) {
      winner = true;
      winIndex = this.valueVector[index];
    }
  }
  for (var index = 0; index < 3; index += 1) {
    if (this.valueVector[index] === this.valueVector[index + 3] && this.valueVector[index] === this.valueVector[index + 6] && this.valueVector[index] != 0) {
      winner = true;
      winIndex = this.valueVector[index];
    }
  }
  for (var index = 2; index < 5; index += 2) {
    if (this.valueVector[4] === this.valueVector[4 + index] && this.valueVector[4] === this.valueVector[4 - index] && this.valueVector[4] != 0) {
      winner = true;
      winIndex = this.valueVector[index];
    }
  }
  if (winner === true) {
    this.winner = this.playerArray[winIndex-1].playerName + " " + "is the winner!";
    this.winnerId = this.playerArray[winIndex-1].identifier;
    if (this.onePlayer === true && this.winnerId === 2) {
      this.computerPerfomance = 2;
    } else {
      this.computerPerfomance = 0;
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
  } else if (this.checkComplete() === true) {
      this.computerPerfomance = 1;
      return true;
  } else {
    return this.checkComplete();
  }
};

Game.prototype.cleanUp = function() {
  for (var index = 0; index < this.playerArray.length; index++) {
    if (this.winnerId === this.playerArray[index].identifier) {
      this.playerArray[index].winsTotal += 1;
    }
  }
  gamesArray.push([this.valueVector, this.computerPerfomance])
  similarArrays = [];
}

Game.prototype.imageInsert = function(imageId, targetId) {
  $(targetId).append($(imageId).clone())
}

Game.prototype.findSimilar = function(arrayOfArrays) {
  for (var arraysIterator = 0; arraysIterator < arrayOfArrays.length; arraysIterator++) {
    var same = true;
    for (var currentIndex = 0; currentIndex < this.valueVector.length; currentIndex++) {
      if (this.valueVector[currentIndex] != 0 && arrayOfArrays[arraysIterator][0][currentIndex] != this.valueVector[currentIndex]) {
        same = false;
      }
    }
    if (same === true) {
      similarArrays.push(arrayOfArrays[arraysIterator])
    }
  }
}


$(document).ready(function() {
  var player1Image = $("#x");
  var player2Image = $("#robot");

  $(".player-1-image").click(function() {
    $(this).siblings().removeClass("highlight");
    $(this).addClass("highlight");
    player1Image = $(this);
  })
  $(".player-2-image").click(function() {
    $(this).siblings().removeClass("highlight");
    $(this).addClass("highlight");
    player2Image = $(this);
  })

  $(".player-numbers").click(function() {
    var playerChoice = $(this).attr('id');
    $(".players-landing-page").hide();
    $("#name-players").show();
    if (playerChoice === "one-player") {
      $(".player2-hidden").hide();
      onePlayer = true;
    }
  })

  $("#get-names").submit(function(event) {
    event.preventDefault();

    $("#x").empty();
    player1Image = player1Image.clone()
    player1Image.removeClass("symbol-pic highlight");
    player1Image.addClass("symbol");
    $("#x").append(player1Image);

    $("#o").empty();
    player2Image = player2Image.clone()
    player2Image.removeClass("symbol-pic highlight");
    player2Image.addClass("symbol");
    $("#o").append(player2Image);

    $(".entire-game").show();
    $(".landing-page").hide();
    var player1 = new Player($("#player-1").val(), 1);
    var player2 = new Player($("#player-2").val(), 2);
    var computerPlayer = new Player("Computer", 2);
    computerPlayer.humanPlayer = false;
    var game1 = new Game(player1, player2, onePlayer, computerPlayer);
    game1.onePlayerSetup();
    currentGame = game1;

    $(".position").click(function() {
      similarArrays = [];

      var currentDiv = $(this);
      var vectorIndex = parseInt(currentDiv.attr('id'));
      if (currentGame.valueVector[vectorIndex] === 0 && currentGame.gameState === true) {
        if (currentGame.playerState === 0 && currentGame.onePlayer === true) {
          currentGame.imageInsert("#x", $(this));
          currentGame.valueVector[vectorIndex] = currentGame.playerState+1;
          if (currentGame.checkOver() === false) {
            var computerMove = currentGame.randomNumber();
            currentGame.imageInsert("#o", "#" + computerMove);
            currentGame.valueVector[computerMove] = 2;
          }
        } else if (currentGame.playerState === 0) {
          currentGame.imageInsert("#x", $(this));
          currentGame.valueVector[vectorIndex] = currentGame.playerState+1;
          currentGame.stateSwitch();
        } else {
          currentGame.imageInsert("#o", $(this));
          currentGame.valueVector[vectorIndex] = currentGame.playerState+1;
          currentGame.stateSwitch();
        }
        if (currentGame.checkOver() === true){
          currentGame.cleanUp();
          $("#game-over-text").text(currentGame.winner);
          currentGame.gameState = false;
          $("#game-over").show();
          $("#player-1-name").text(currentGame.playerArray[0].playerName);
          $("#player-1-wins").text(currentGame.playerArray[0].winsTotal);
          $("#player-2-name").text(currentGame.playerArray[1].playerName);
          $("#player-2-wins").text(currentGame.playerArray[1].winsTotal);
        }
      }
      currentGame.findSimilar(gamesArray);
      console.log("Found " + similarArrays.length + " similar games");
    })

    $(".replay").click(function(){
      var newGame = new Game(player1, player2, onePlayer, computerPlayer);
      newGame.onePlayerSetup();
      currentGame = newGame;
      $("#game-over").hide();
      $(".entire-game").find(".position").empty();
    })
  })

})
