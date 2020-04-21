
## Description of project

A board game application designed for the web progamming project of the course Web and Database Technology.

The game is Connect Quattro, a different take of the classic Connect 4, having pizzas as tokens.

Included in the application are the following:

- The game is for 2+ players and in 2D.
- The game works 2+ modern browsers (e.g. Firefox and Chrome).
- It works well on a laptop/desktop device, i.e. we are considering screen resolutions of ~1366x768 or higher.
- Upon entering your web application's URL, a splash screen is shown that allows a user to see some statistics of the game (how many games are currently ongoing, how many users have started a game, etc. - pick three statistics you want to report), a brief description of how-to-play on your platform and a Play button (or something to that effect).
- Upon pressing Play, the user enters the game screen and waits for a sufficient number of other gamers to start playing. It is clear for the player that s/he is waiting for more players to enter the game.
Once there are sufficiently many players, the game automatically starts and the players play against each other. Multiple games can take place at the same time.
- The splash and game screens need to look good (we do realize that this is subjective and we handle this requirement very leniently!); all required game elements need to be visible (e.g. if a game requires a dice, a dice element needs to be visible).
- Once a player makes a move, the validity of the move is checked and invalid moves are rejected. Once a player wins the game, this information is announced to all players participating in the game.
- Players see basic information about the ongoing game, e.g. the time passed since starting the game or number of lost/won pieces.
- Players are able to play the game in fullscreen mode.
- Players play the game with the mouse.
- Once a player drops out of a game, the game is aborted; this is announced to all players currently active in the game.
- The game has at least one sound effect (e.g. a ping every time a move is made).

## How to run it

- Write in terminal npm install

- Write in terminal node app.js 3000

- Open a browser and connect to localhost:3000
