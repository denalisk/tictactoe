function GlobalMemory() {
  // This holds the memory of all the games
  this.gamesArray = [];
}

function Game(globalMemory) {
  // This holds the individual game
  this.gamesMemory = globalMemory;
  this.valueVector = [0,0,0,0,0,0,0,0,0];
  this.openPositions = [0,1,2,3,4,5,6,7,8];
  this.similarArrays = this.gamesMemory.gamesArray.slice();
  this.gameState = true;
  this.playerArray = [];
  this.currentPlayer;
  this.winner;
  this.winnerId;
  this.computerPerfomance;
}

function Player() {
  this.playerName = "";
  this.winsTotal = 0;
  this.humanPlayer = true;
  this.playerId = 0;
  this.game = null;
  this.image = null;
}

Player.prototype.giveName = function(name) {
  // Sets the name of a player
  this.playerName = name;
}

Game.prototype.setup = function(playerArray) {
  // Add players to the game
  for (let index = 0; index < playerArray.length; index++) {
    playerArray[index].game = this;
    this.playerArray.push(playerArray[index]);
    playerArray[index].playerId = this.playerArray.length;
  }
  this.currentPlayer = this.playerArray[0];
}

Game.prototype.nextPlayer = function() {
  this.currentPlayer = (this.currentPlayer.playerId === 1) ? this.playerArray[1] : this.playerArray[0];
}

Game.prototype.stateSwitch = function() {
  // changes the player who's turn it is
  this.currentPlayer = this.playerArray[(0 + !(this.currentPlayer.playerId))];
}

var printBoard = function(arrayToPrint) {
  // This is a testing function to print out the board console log style
  var topRow = [];
  var midRow = [];
  var bottomRow = [];
  for (var i = 0; i < arrayToPrint.length; i++) {
    if (i < 3) {
      topRow.push(arrayToPrint[i]);
    } else if (i < 6) {
      midRow.push(arrayToPrint[i]);
    } else {
      bottomRow.push(arrayToPrint[i]);
    }
  }
  console.log(topRow + "\n" + midRow + "\n" + bottomRow);
  // $(outputLocation).append(topRow);
  // $(outputLocation).append("<br>");
  // $(outputLocation).append(midRow);
  // $(outputLocation).append("<br>");
  // $(outputLocation).append(bottomRow);
}

Game.prototype.checkWin = function() {
  // Checks to see if someone has won the game, returns a simple boolean yes or no
  var gameWon = false;
  for (var index = 0; index < 7; index += 3) {
    if (this.valueVector[index] === this.valueVector[index + 1] && this.valueVector[index] === this.valueVector[index + 2] && this.valueVector[index] != 0) {
      gameWon = true;
    }
  }
  for (var index = 0; index < 3; index += 1) {
    if (this.valueVector[index] === this.valueVector[index + 3] && this.valueVector[index] === this.valueVector[index + 6] && this.valueVector[index] != 0) {
      gameWon = true;
    }
  }
  for (var index = 2; index < 5; index += 2) {
    if (this.valueVector[4] === this.valueVector[4 + index] && this.valueVector[4] === this.valueVector[4 - index] && this.valueVector[4] != 0) {
      gameWon = true;
    }
  }
  return gameWon;
}

Game.prototype.checkComplete = function () {
  // checks to see if the game is over due to a tie, returns a simple boolean yes or no
  var completeGame = true;
  for (var index = 0; index < 9; index++) {
    if (this.valueVector[index] === 0) {
      completeGame = false;
      break;
    }
  }
  return completeGame;
};

Game.prototype.checkOver = function () {
  // Checks if the game is over with checkWin and checkComplete
  // If the game is won, sets the winner to the current player
  // If the game is tied, sets the winner to false (to use in ternary)
  if (this.checkWin() === true) {
    this.winner = this.currentPlayer;
    return true;
  } else if (this.checkComplete() === true) {
    this.winner = false;
    return true;
  }
};

Game.prototype.cleanUp = function() {
  // Called when the game is over. Saves the
  // current game as a gameMemory object in the global gamesMemory array
  if (this.winner) {
    this.winner.winsTotal += 1;
  }
  var currentMoves = 0;
  // console.log(this.valueVector);
  for (let i = 0; i < this.valueVector.length; i++) {
    if (this.valueVector[i] !== 0) {
      currentMoves += 1;
    }
  }
  var newGameMemory = {
    "valueVector": this.valueVector,
    "moves": currentMoves,
    "winnerId": this.winner ? this.winner.playerId : false,
    "gameCode": parseInt(this.valueVector.join(""))
  };
  var found = false;
  for (let index = 0; index < this.gamesMemory.gamesArray.length; index++) {
    if (this.gamesMemory.gamesArray[index].gameCode === newGameMemory.gameCode) {
      found = true;
      break;
    }
  }
  if (!found) {
    this.gamesMemory.gamesArray.push(newGameMemory);
  }
}

// AI FUNCTIONALITY /////////////////////////////////////////////////////////

Game.prototype.findSimilar = function() {
  // The similarArrays property starts each game holding all arrays in memory.
  // This function is called each turn by the AI and removes arrays that are not
  // similar to the current gamestate, slowly whittling down the similar states
  for (var arraysIterator = 0; arraysIterator < this.similarArrays.length; arraysIterator++) {
    var same = true;
    for (var currentIndex = 0; currentIndex < this.valueVector.length; currentIndex++) {
      if (this.valueVector[currentIndex] != 0 && this.similarArrays[arraysIterator].valueVector[currentIndex] != this.valueVector[currentIndex]) {
        same = false;
        break;
      }
    }
    if (same === false) {
      this.similarArrays.splice(arraysIterator, 1);
    }
  }
}

Player.prototype.randomEvaluator = function() {
  var evaluator = [0,0,0,0,0,0,0,0,0];
  for (var jdex = 0; jdex < this.game.valueVector.length; jdex++) {
    if (this.game.valueVector[jdex] != 0) {
      evaluator[jdex] = (this.game.valueVector[jdex] === 1) ? "X" : "O";
    }
  }
  return evaluator;
}

Player.prototype.evaluateMoves = function() {
  // This function iterates through the similarArrays property of the players Game
  // and ranks each legal move based off the outcome of each similar game
  // Moves in winning games are highly positive, moves in losing games are worth
  // negative, and tie games are slightly positive
  // Value of moves are weighted based off how long it took to win or lose a game
  // Outputs an array of values associated with each move, i.e. [3, -12, 13,...]
  var evaluator = [0,0,0,0,0,0,0,0,0];
  for (var jdex = 0; jdex < this.game.valueVector.length; jdex++) {
    if (this.game.valueVector[jdex] != 0) {
      evaluator[jdex] = (this.game.valueVector[jdex] === 1) ? "X" : "O";
    }
  }
  for (var index = 0; index < this.game.similarArrays.length; index++) {
    for (movesIndex = 0; movesIndex < this.game.valueVector.length; movesIndex++) {
      if (this.game.valueVector[movesIndex] === 0 && this.game.similarArrays[index].valueVector[movesIndex] === this.game.currentPlayer.playerId) {
        var gameRecord = this.game.similarArrays[index];
        var modifier = (gameRecord.winnerId === this.game.currentPlayer.playerId || (gameRecord.winnerId === false)) ? 1 : -1;
        evaluator[movesIndex] += modifier*(2**(9-gameRecord.moves));
      }
    }
  }
  // console.log("Current player is player " + this.playerId);
  // console.log("This is the returned evaluator: ");
  // console.log(evaluator);
  return evaluator;
}

// // Notes on the new gamesArray:
// gameObject = {
//   "valueVector": [9,9,9,9,9,9,9,9,9],
//   "moves": total_number_of_moves,
//   "winnerId": player1 = 1//player2 = 2,
//   "pointValue": f(performance = 1 if this player won // -1 if they lost, total_number_of_moves = m)
//   // pointValue = c*(2**(9-m))
// }

Player.prototype.bestMove = function(evaluator) {
  var bestPositionValue = "none";
  var moveChoices = []
  for (var index = 0; index < evaluator.length; index++) {
    if (evaluator[index] !== "X" && evaluator[index] !== "O") {
      if (evaluator[index] > bestPositionValue || bestPositionValue === "none") {
        moveChoices = [];
        moveChoices.push(index);
        bestPositionValue = evaluator[index];
      } else if (evaluator[index] === bestPositionValue) {
        moveChoices.push(index);
      }
    }
  }
  var bestMove = Math.floor(Math.random() * moveChoices.length);
  // console.log("The evaluator was :");
  printBoard(evaluator);
  // console.log("Player chose move position: " + moveChoices[bestMove]);
  return moveChoices[bestMove];
}

Player.prototype.computerMove = function() {
  //Return a move for the computer
  // var evaluator = this.randomEvaluator();
  var evaluator = (this.playerId === 2) ? this.evaluateMoves() : this.randomEvaluator();
  var moveChoice = this.bestMove(evaluator);
  return moveChoice;
}

Game.prototype.practiceMove = function() {
  // Makes an automatic move for the computer
  this.valueVector[this.currentPlayer.computerMove()] = this.currentPlayer.playerId;
}

Game.prototype.practiceGame = function() {
  // Plays a game between two computer players, stores the result in the
  // gamesMemory
  while (this.gameState) {
    this.findSimilar();
    this.practiceMove();
    this.checkOver() ? this.gameState = false : this.nextPlayer();
  }
  this.cleanUp();
}

var trainingMontage = function(trainingGames, globalMemory) {
  // Plays practice computer games a set number of times
  var player1 = new Player();
  var player2 = new Player();
  var practicePlayers = [player1, player2];
  console.log("At the start of the montage");
  console.log(globalMemory);
  for(let i = 0; i < trainingGames; i++) {
    var game = new Game(globalMemory);
    game.setup(practicePlayers);
    game.practiceGame();
  }
  console.log("the montage is over");
  console.log(globalMemory);
}

var printBoard = function(arrayToPrint) {
  // This is a testing function to print out a 3x3 board console log style
  var topRow = [];
  var midRow = [];
  var bottomRow = [];
  for (var i = 0; i < arrayToPrint.length; i++) {
    if (i < 3) {
      topRow.push(arrayToPrint[i]);
    } else if (i < 6) {
      midRow.push(arrayToPrint[i]);
    } else {
      bottomRow.push(arrayToPrint[i]);
    }
  }
  console.log(topRow + "\n" + midRow + "\n" + bottomRow);
  // $(outputLocation).append(topRow);
  // $(outputLocation).append("<br>");
  // $(outputLocation).append(midRow);
  // $(outputLocation).append("<br>");
  // $(outputLocation).append(bottomRow);
}

////////////////////////FRONT END///////////////////////////////////

$(document).ready(function() {
// Variables for the game
  var globalMemory = new GlobalMemory();
  var currentGame;
  var humanPlayers = 1;
  var player1 = new Player();
  var player2 = new Player();
  player1.image = $("#x");
  player2.image = $("#robot");

// Training montage button
  $("#montage-button").click(function() {
    var montageCount = $("#montage-input").val();
    trainingMontage(montageCount, globalMemory);
  })

// Player selector click functions
  $("#one-player").click(function(){
    humanPlayers = 1;
    player2.image = $("#robot");
    $("#player2-human").hide();
    $("#player2-computer").show();
  })
  $("#two-players").click(function(){
    humanPlayers = 2;
    player2.image = $("#o");
    $("#player2-computer").hide();
    $("#player2-human").show();
  })

// Start game click function
  $("#start-game").click(function() {
    player1.playerName = $("#player-1").val();
    player2.playerName = (humanPlayers === 2) ? $("#player-2").val() : "Computer";
    if (player1.playerName === "" || player2.playerName === "") {
      $("#invalid-player-name").show();
    } else {
      // Assign player images
      player1.image = player1.image.clone()
      player1.image.removeClass("symbol-pic highlight");
      player1.image.addClass("symbol");
      $("#player1-symbol").append(player1.image);
      player2.image = player2.image.clone()
      player2.image.removeClass("symbol-pic highlight");
      player2.image.addClass("symbol");
      $("#player2-symbol").append(player2.image);
      // Start the game
      currentGame = new Game(globalMemory);
      currentGame.setup([player1, player2]);
      $(".players-landing-page").hide();
      $("#gameboard-content").show();
    }
  })

// Icon selector click functions
  $(".player-1-image").click(function() {
    $(this).siblings().removeClass("highlight");
    $(this).addClass("highlight");
    player1.image = $(this);
  })
  $(".player-2-image").click(function() {
    $(this).siblings().removeClass("highlight");
    $(this).addClass("highlight");
    player2.image = $(this);
  })

  // Position click and play function
  $(".position").click(function() {
    var currentDiv = $(this);
    var vectorIndex = parseInt(currentDiv.attr('id'));
    if (currentGame.valueVector[vectorIndex] === 0 && currentGame.gameState === true) {
      // Insert the current player's symbol into the gameboard position
      var playerSymbolString = "#player" + currentGame.currentPlayer.playerId + "-symbol";
      $(currentDiv).append($(playerSymbolString).clone());
      // Mark the vector position as occupied in the valueVector
      currentGame.valueVector[vectorIndex] = currentGame.currentPlayer.playerId;
      // Check to see if the game is over
      console.log("right before checkover");
      currentGame.gameState = !(currentGame.checkOver());
      if (currentGame.gameState && humanPlayers === 1) {
        console.log("at computer turn");
        // Computer move
        currentGame.nextPlayer();
        // Remove bloat from similarArrays
        currentGame.findSimilar();
        // choose a computer move and place it on the board
        var computerChoice = currentGame.currentPlayer.computerMove();
        var computerSymbolString = "#player" + currentGame.currentPlayer.playerId + "-symbol";
        $("#" + computerChoice).append($(computerSymbolString).clone());
        currentGame.valueVector[computerChoice] = currentGame.currentPlayer.playerId;
        // Check again to see if the game is over
        currentGame.gameState = !(currentGame.checkOver());
      }
      if (currentGame.gameState === false) {
        // Clean up, show the game over screen
        currentGame.cleanUp();
        $("#game-over-text").text(currentGame.winner ? (currentGame.winner.playerName + " is the winner!") : "It's a tie!");
        // $("#gameboard-content").hide();
        $("#game-over").show();
        $("#player-1-name").text(player1.playerName);
        $("#player-1-wins").text(player1.winsTotal);
        $("#player-2-name").text(player2.playerName);
        $("#player-2-wins").text(player2.winsTotal);
      } else {
        // next players turn
        currentGame.nextPlayer();
      }
    }
  })
  // Replay button function
  $(".replay").click(function(){
      var newGame = new Game(globalMemory);
      newGame.setup([player1, player2]);
      currentGame = newGame;
      console.log(currentGame.gamesMemory);
      $("#game-over").hide();
      $(".entire-game").find(".position").empty();
      // $("#gameboard-content").show();
    })
})






























// GO TO FRONT END //////////////////////////////////////////////////////////////////
