Generate a blank vector
* input:
* output: 000
          000
          000

Make a grid of buttons that are connected to each vector position and display an "1" when the button is clicked.
* input: click
* output: 100
          000
          000

If the position has already been clicked it will not be clickable again.
* input: click
* output: 100
          000
          000

Make a global state variable that toggles between 1's and 2's.
* input: click
* output: 100
          020
          000

If the top row contains the same variable the game is over and a user has won.
* input: click
* output: 111
          022
          000

If the left column contains the same variable the game is over and a user has won.
* input: click
* output: 100
          122
          100

If a diagonal contains the same variable the game is over and a user has won.
* input: click
* output: 100
          012
          001

Make for loops to check the remaining columns, rows, and diagonals.
* input: click
* output: 010
          012
          012

If there are no remaining zeros and the above conditions are not met then call a draw.
* input: click
* output: 121
          212
          212

Link button click functionality to the separate divs and clone the Xs and Os.
* input: click
* output: XOX
          OXO
          OXO

Ice box ideas:
* highlight winning row
* have the players select which images they want to use instead of X and O
* Add a replay button
* Make the computer play against one person
* Improve the look of the game board
* Add a sound effect or celebration effect when someone wins
