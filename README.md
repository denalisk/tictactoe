# "Tic Tac Toe" Making a functional tictactoe AI

#### _Tic Tac Toe_, 04.07.2017

### By _Sam Kirsch_, rebuilt from a initial collaboration with Nicole Sanders

## Description

#### A basic website built so that users can play Tic Tac Toe against each other or against the computer. The AI learns as you play against it, avoiding moves that have had negative outcomes before and favoring moves that have proven to be beneficial. The gameMemory is not persistent by design, and the AI will become "fresh" again on a page reload. Users can "train" the AI by allowing it to play against a slightly randomized version of itself, increasing the breadth of the gameMemory. This is still a work in progress.

## Specifications

* Users can choose a player name and a symbol
* Users can take turns with each other or a computer to place markers on the board
* The game ends when one player has 3 in a row or the board is filled
* Users can choose to play again

#### Known Issues

* AI learning currently has minimal returns after ~1000 unique games, greatly slowing the learning process
* Currently undetermined whether "dumb" AI moves are a result of this or issues relating to move choice valuation
* Players can click while the training screen is active

#### Next Steps

* Refactor the AI learning process to weight moves that win/lose fast vs. slow
* Identify method to speed up learning process
* Generic "make the AI smarter"

## Setup

* Clone this repository
* Open index.html using a web browser

### Technologies Used

* HTML and CSS
* JavaScript

[github link for this project](https://github.com/denalisk/tictactoe)
//
[view this project on gh-pages](https://denalisk.github.io/tictactoe/)

##### Copyright (c) 2017 Sam Kirsch.

##### Licensed under the MIT license.
