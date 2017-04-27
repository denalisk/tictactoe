function GamesMemory() {
  // This holds the memory of all the games
  this.gamesArray = [];
}

function Game(gamesMemory) {
  // This holds the individual game
  this.gamesMemory = gamesMemory;
  this.valueVector = [0,0,0,0,0,0,0,0,0];
  this.openPositions = [0,1,2,3,4,5,6,7,8];
  this.similarArrays = this.gamesMemory.gamesArray.slice();
  this.gameState = false;
  this.playerArray = [];
  this.currentPlayer;
  this.winner;
  this.winnerId;
  this.computerPerfomance;
}

function Player(playerName, identifier, game) {
  this.playerName = playerName;
  this.identifier = identifier;
  this.winsTotal = 0;
  this.humanPlayer = true;
  this.game = game;
  this.playerId = this.game.playerArray.length;
  this.game.playerArray.push(this);
}

Game.prototype.randomNumber = function() {
  // This function chooses a random legal move
  var choice = Math.floor(Math.random()*this.openPositions.length);
  return this.openPositions[choice];
};

Game.prototype.stateSwitch = function() {
  // changes the player who's turn it is
  this.currentPlayer = this.playerArray[(0 + !(this.currentPlayer.playerId))];
}

Game.prototype.printBoard = function(outputLocation) {
  // This is a testing function to print out the board console log style
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
    this.gameState = false;
  } else if (this.checkComplete() === true) {
    this.winner = false;
    this.gameState = false;
  }
};

Game.prototype.cleanUp = function () {
  var newGameMemory = {
    "valueVector": this.valueVector,
    "moves": this.moves,
    "winnerId": this.winner ? this.winner.playerId : false,
    "gameCode": parseInt(this.valueVector.join(""))
  };
  var found = false;
  for (let index = 0; index < this.gamesMemory.length; index++) {
    if (this.gamesMemory[index].gameCode === newGameMemory.gameCode) {
      found = true;
      break;
    }
  }
  if (!found) {
    this.gamesMemory.push(newGameMemory);
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
      if (this.valueVector[currentIndex] != 0 && gamesArray[arraysIterator].valueVector[currentIndex] != this.valueVector[currentIndex]) {
        same = false;
      }
    }
    if (same === false) {
      this.similarArrays.splice(arraysIterator, 1);
    }
  }
}

Game.prototype.evaluateMoves = function() {
  // This function iterates through the similarArrays property of the Game and
  // ranks each legal move based off the outcome of each move in each game
  // Moves in winning games are highly positive, moves in losing games are worth
  // negative, and tie games are slightly positive
  // Outputs an array of values associated with each move, i.e. [3, -12, 13,...]
  var evaluator = [0,0,0,0,0,0,0,0,0];
  for (var jdex = 0; jdex < this.valueVector.length; jdex++) {
    if (this.valueVector[jdex] != 0) {
      evaluator[jdex] = ('ILLEGAL');
    }
  }
  for (var index = 0; index < this.similarArrays.length; index++) {
    for (movesIndex = 0; movesIndex < this.valueVector.length; movesIndex++) {
      if (this.valueVector[movesIndex] === 0 && this.similarArrays[index].valueVector[movesIndex] === this.currentPlayer.playerId) {
        var gameRecord = this.similarArrays[index];
        var modifier = (gameRecord.winnerId === this.currentPlayer.playerId || (gameRecord.winnerId === false)) ? 1 : -1;
        evaluator[movesIndex] += modifier*(2**(9-gameRecord.moves));
        }
      }
    }
  }
  return evaluator;
}

// Notes on the new gamesArray:
`gameObject = {
  "valueVector": [9,9,9,9,9,9,9,9,9],
  "moves": total_number_of_moves,
  "winnerId": player1 = 1//player2 = 2,
  "pointValue": f(performance = 1 if this player won // -1 if they lost, total_number_of_moves = m)
  // pointValue = c*(2**(9-m))
}
`

Game.prototype.bestMove = function(evaluator) {
  var bestPositionValue = "none";
  var moveChoices = []
  for (var index = 0; index < evaluator.length; index++) {
    if (evaluator[index] !== "ILLEGAL") {
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
  return moveChoices[bestMove];
}


////////////////////////FRONT END///////////////////////////////////

var

$(document).ready(function() {




// Icon selector click functions
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


})






























// GO TO FRONT END //////////////////////////////////////////////////////////////////
