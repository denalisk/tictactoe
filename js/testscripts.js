var similarArrays = [];
var arrayOfArrays = [[[1,2,3,4,5],"first"],[[5,4,3,2,1],"second"],[[1,1,1,1,1],"third"],[[3,0,0,3,0],"fourth"]];
var currentMoves = [0,0,0,1,1];

var findSimilar = function(arrayOfArrays, currentMoves) {
  for (var arraysIterator = 0; arraysIterator < arrayOfArrays.length; arraysIterator++) {
    var same = true;
    for (var currentIndex = 0; currentIndex < currentMoves.length; currentIndex++) {
      if (currentMoves[currentIndex] != 0 && arrayOfArrays[arraysIterator][0][currentIndex] != currentMoves[currentIndex]) {
        same = false;
      }
    }
    if (same === true) {
      similarArrays.push(arrayOfArrays[arraysIterator][1])
    }
  }
}

findSimilar(arrayOfArrays, currentMoves);
console.log(similarArrays);
