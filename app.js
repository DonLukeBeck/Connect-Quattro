var express = require("express");
var http = require("http");
var websocket = require("ws");
var indexRouter = require("./routes/index");
var gameStatus = require("./public/javascripts/statTracker");
var Game = require("./public/javascripts/game");
var ejs = require('ejs');
var cookieParser = require('cookie-parser');

var port = process.argv[2];
var app = express();

var server = http.createServer(app);
server.listen(port);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(cookieParser());

var websockets = {};//property: websocket, value: game

/*
 * regularly clean up the websockets object
 */
setInterval(function() {
  for (let i in websockets) {
    if (Object.prototype.hasOwnProperty.call(websockets,i)) {
      let gameObj = websockets[i];
      //if the gameObj has a final status, the game is complete/aborted
      if (gameObj.finalStatus != null) {
        delete websockets[i];
      }
    }
  }
}, 50000);


app.get("/", indexRouter);
app.post("/game", indexRouter);
app.post("/", indexRouter);

app.use(express.static(__dirname + "/public/"));

const wss = new websocket.Server({server});
var connectionID = 0; //each websocket receives an unique ID
var gameID = 0;
var currentGame = new Game(gameID++);
var str = "";

wss.on("connection", function(ws) {
//server listening to port
  let con = ws; // ws = callback function / connection object returned from wss
  //need an id to identify each connection
  con.id = connectionID++; //increments each time there's a connection
  con.on("message", function incoming(message) {
    //con-> server connection per user
    //message -> received from the client
    if(message == "splash") {
      //connected from splash.html -> message incoming from splash_script
      var gs = JSON.stringify(gameStatus);
      con.send(gs);
      con.close();

    }else if(message == "game"){

      //if 2 connected players are already in a game we create a new game
      if(currentGame.hasTwoConnectedPlayers()){
        currentGame = new Game(gameID++);
      }
    
      //first conection from game.html
      websockets[con.id] = currentGame;
      playerType = currentGame.addPlayer(con);
      gameStatus.playerOnline++;

      if(playerType == "A")
        str = JSON.stringify(currentGame.O_PLAYER_A);
        currentGame.playerA.send(str);
    
      if(playerType == "B"){
        str = JSON.stringify(currentGame.O_PLAYER_B);
        gameStatus.gamesInitialized++;
        currentGame.playerA.send(str);
        currentGame.playerB.send(str);
      }

    }else if(message == "exit") {
      let gameObj = websockets[con.id]; //current game for 2 users
      if(gameObj.playerB == null){
        gameObj.playerA.close();
        gameObj.playerA = null;
        gameStatus.playerOnline--;
      }else{
        str = JSON.stringify(gameObj.O_GAME_ABORTED);
        gameObj.playerA.send(str);
        gameObj.playerB.send(str);
        gameObj.playerA.close();
        gameObj.playerB.close();
        gameStatus.gamesInitialized--;
        gameStatus.playerOnline--;
        gameStatus.playerOnline--;
      }
    }else{

      //game started
      let gameObj = websockets[con.id]; //current game for 2 users
      var goodMove = gameObj.Moved(con, message);
      //message = move id

      if(goodMove) {
        str = JSON.stringify(gameObj.O_PLAYER_MOVE);
        gameObj.playerA.send(str);
        gameObj.playerB.send(str);
        if(gameObj.O_GAME_WON_BY.data != null) {
          str = JSON.stringify(gameObj.O_GAME_WON_BY);
          gameObj.playerA.send(str);
          gameObj.playerB.send(str);
          gameObj.playerA.close();
          gameObj.playerB.close();
          gameStatus.gamesInitialized--;
          gameStatus.gamesCompleted++;
          gameStatus.playerOnline--;
          gameStatus.playerOnline--;
        }
      }
    }
  });
});
