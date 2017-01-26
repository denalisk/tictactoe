var similarArrays = [];
var arrayOfArrays = [[[1,2,1],2],[[2,1,1],(-2)],[[1,1,2],(-2)]];
var currentMoves = [1,0,0];

var findSimilar = function(arrayOfArrays, currentMoves) {
  for (var arraysIterator = 0; arraysIterator < arrayOfArrays.length; arraysIterator++) {
    var same = true;
    for (var currentIndex = 0; currentIndex < currentMoves.length; currentIndex++) {
      if (currentMoves[currentIndex] != 0 && arrayOfArrays[arraysIterator][0][currentIndex] != currentMoves[currentIndex]) {
        same = false;
      }
    }
    if (same === true) {
      similarArrays.push(arrayOfArrays[arraysIterator])
    }
  }
}

Math.floor(Math.random() * moveChoices.length)

var evaluateMoves = function(similarArrays, currentMoves) {
  var evaluator = [0,0,0,0,0,0,0,0,0];
  for (var jdex = 0; jdex < currentMoves.length; jdex++) {
    if (currentMoves[jdex] != 0) {
      evaluator[jdex] += -100;
    }
  }
  for (var index = 0; index < similarArrays.length; index++) {
    for (movesIndex = 0; movesIndex < currentMoves.length; movesIndex++) {
      if (similarArrays[index][0][movesIndex] === 2 && currentMoves[movesIndex] === 0) {
        evaluator[movesIndex] += similarArrays[index][1];
      }
    }
  }
  console.log(evaluator);
}

findSimilar(arrayOfArrays, currentMoves);
for (var i = 0; i < similarArrays.length; i++) {
  console.log("Array " + i + " is " + similarArrays[i]);
}
console.log(similarArrays);

evaluateMoves(similarArrays, currentMoves);
