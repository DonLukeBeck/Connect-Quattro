var socket = new WebSocket("ws://localhost:3000");

socket.onmessage = function(event){

    var obj = JSON.parse(event.data);
    
    document.getElementById("currentGames").innerHTML = obj.gamesInitialized;
    document.getElementById("gamesPlayed").innerHTML = obj.gamesCompleted;
    document.getElementById("playersOnline").innerHTML = obj.playerOnline;
   
};

socket.onopen = function(){
    socket.send("splash");
};