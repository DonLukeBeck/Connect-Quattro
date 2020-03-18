var game = function(gameID) {
    
    this.playerA = null;
    this.playerB = null;
    this.id = gameID;
    this.gameState = "0 JOINT"; //"A" means A won, "B" means B won, "ABORTED" means the game was aborted
    this.playerTurn = "A";
    
    this.O_GAME_WON_BY = {
      type: "GAME-WON-BY",
      data: null
    };
    this.O_PLAYER_A = {
      type: "PLAYER-TYPE",
      data: "A",
      mess: "Waiting for second player"
    };
    this.O_PLAYER_B = {
      type: "PLAYER-TYPE",
      data: "B",
      mess: ""
    };
    this.O_PLAYER_MOVE = {
      type: "PLAYER-MOVE",
      data: null,
      mess: null
    };

    this.O_GAME_ABORTED = {
      type: "GAME-ABORTED"
    };

    this.gameMatrix = [
      [0, 0, 0, 0, 0, 0, 0], 
      [0, 0, 0, 0, 0, 0, 0], 
      [0, 0, 0, 0, 0, 0, 0], 
      [0, 0, 0, 0, 0, 0, 0], 
      [0, 0, 0, 0, 0, 0, 0], 
      [0, 0, 0, 0, 0, 0, 0]
    ]

    this.checkRow = function(i, j, val) {
      var pizzas = 0;
      var col = j;
      while(col<=6 && this.gameMatrix[i][col] == val) {
        pizzas++;
        col++;
      }
      col = j-1;
      while(col>=0 && this.gameMatrix[i][col] == val) {
        pizzas++;
        col--; 
      }
      return pizzas;
    };
  
    this.checkCol = function(i, j, val) {
      var pizzas = 0;
      var row = i;
      while(row<=5 && this.gameMatrix[row][j] == val) {
        pizzas++;
        row++;
      }
      row = i-1;
      while(row>=0 && this.gameMatrix[row][j] == val) {
        pizzas++;
        row--;
      }
      return pizzas;
    }
  
    this.checkLeftD = function(i, j, val) {
      var pizzas = 0;
      var row = i;
      var col = j;
      while(row>=0 && col>=0 && this.gameMatrix[row][col] == val) {
        pizzas++;
        row--;
        col--;
      }
      row = i+1;
      col = j+1;
      while(row<=5 && col<=6 && this.gameMatrix[row][col] == val) {
        pizzas++;
        row++;
        col++;
      }
      return pizzas;
    }
    
    this.checkRightD = function(i, j, val) {
      var pizzas = 0;
      var row = i;
      var col = j;
      while(row>=0 && col<=6 && this.gameMatrix[row][col] == val) {
        pizzas++;
        row--;
        col++;
      }
      row=i+1;
      col=j-1;
      while(row<=5 && col>=0 && this.gameMatrix[row][col] == val) {
        pizzas++;
        row++;
        col--;
      }
      return pizzas;
    }
  };
  

  game.prototype.transitionStates = {};
  game.prototype.transitionStates["0 JOINT"] = 0;
  game.prototype.transitionStates["1 JOINT"] = 1;
  game.prototype.transitionStates["2 JOINT"] = 2;
  game.prototype.transitionStates["4 PIZZA"] = 3;//player connected 4 pizzas
  game.prototype.transitionStates["A"] = 4; //A won
  game.prototype.transitionStates["B"] = 5; //B won
  game.prototype.transitionStates["ABORTED"] = 6;

  game.prototype.transitionMatrix = [
    [0, 1, 0, 0, 0, 0, 0], //0 JOINT
    [1, 0, 1, 0, 0, 0, 0], //1 JOINT
    [0, 0, 0, 1, 0, 0, 1], //2 JOINT (note: once we have two players, there is no way back!)
    [0, 0, 0, 1, 1, 1, 1], //4 PIZZA
    [0, 0, 0, 0, 0, 0, 0], //A WON
    [0, 0, 0, 0, 0, 0, 0], //B WON
    [0, 0, 0, 0, 0, 0, 0]  //ABORTED
  ];

  game.prototype.isValidTransition = function(from, to) {
    console.assert(
      typeof from == "string",
      "%s: Expecting a string, got a %s",
      arguments.callee.name,
      typeof from
    );
    console.assert(
      typeof to == "string",
      "%s: Expecting a string, got a %s",
      arguments.callee.name,
      typeof to
    );
    console.assert(
      from in game.prototype.transitionStates == true,
      "%s: Expecting %s to be a valid transition state",
      arguments.callee.name,
      from
    );
    console.assert(
      to in game.prototype.transitionStates == true,
      "%s: Expecting %s to be a valid transition state",
      arguments.callee.name,
      to
    );
  
    let i, j;
    if (!(from in game.prototype.transitionStates)) {
      return false;
    } else {
      i = game.prototype.transitionStates[from];
    }
  
    if (!(to in game.prototype.transitionStates)) {
      return false;
    } else {
      j = game.prototype.transitionStates[to];
    }
  
    return game.prototype.transitionMatrix[i][j] > 0;
  };

  game.prototype.isValidState = function(s) {
    return s in game.prototype.transitionStates;
  };

  game.prototype.setStatus = function(w) {
    console.assert(
      typeof w == "string",
      "%s: Expecting a string, got a %s",
      arguments.callee.name,
      typeof w
    );
  
    if (
      game.prototype.isValidState(w) &&
      game.prototype.isValidTransition(this.gameState, w)
    ) {
      this.gameState = w;
      console.log("[STATUS] %s", this.gameState);
    } else {
      return new Error(
        "Impossible status change from %s to %s",
        this.gameState,
        w
      );
    }
  };

  game.prototype.hasTwoConnectedPlayers = function() {
    return this.gameState == "2 JOINT";
  };

  game.prototype.addPlayer = function(p) {
    console.assert(
      p instanceof Object,
      "%s: Expecting an object (WebSocket), got a %s",
      arguments.callee.name,
      typeof p
    );
  
    if (this.gameState != "0 JOINT" && this.gameState != "1 JOINT") {
      return new Error(
        "Invalid call to addPlayer, current state is %s",
        this.gameState
      );
    }
  
    /*
     * revise the game state
     */
  
    var error = this.setStatus("1 JOINT");
    if (error instanceof Error) {
      this.setStatus("2 JOINT");
    }
  
    if (this.playerA == null) {
      this.playerA = p;
      return "A";
    } else {
      this.playerB = p;
      return "B";
    }
  };

  game.prototype.Moved = function(ws, message) {

    var val = 0; //value inserted in gameMatrix

    if(ws == this.playerA && this.playerTurn == "A") {
      //a moves
      val = 1;
    }else if (ws == this.playerB && this.playerTurn == "B") {
      //b moves
      val = 2;
    }else {
      return false;
    }
    
    var j = message%10;
    var row = 5;
    var col = j;
    var found = false;

    //search in gameMatrix column the first empty position
    while(!found && row >= 0) {
      if(this.gameMatrix[row][col] == 0) {
        this.gameMatrix[row][col] = val;
        found = true;
        var i = row;
      }
      row--;
    }

    if(!found) return false; //column is full - can't put another pizza

    //check for four pizzas
    if(
      this.checkRow(i, j, val) == 4 ||
      this.checkCol(i, j, val) == 4 ||
      this.checkLeftD(i, j, val) == 4 ||
      this.checkRightD(i, j, val) == 4 
    ) {
        this.O_PLAYER_MOVE.data = this.playerTurn;
        this.O_PLAYER_MOVE.mess = i + "" + j;
        this.O_GAME_WON_BY.data = this.playerTurn;
        return true;
    }

    this.O_PLAYER_MOVE.data = this.playerTurn;
    this.O_PLAYER_MOVE.mess = i + "" + j;

    //next turn
    if (this.playerTurn == "A") {
      this.playerTurn = "B";
    }else {
      this.playerTurn = "A";
    }

    return true;
  };

  module.exports = game;