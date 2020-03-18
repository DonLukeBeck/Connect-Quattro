let seconds = 0;

//board creation
for (var i=0; i<=5; i++) {
    for (var j=0; j<=6; j++)  {
        var coin = document.createElement("div");
        coin.setAttribute('class', 'coin');
        coin.innerHTML = "<img src=\"images/np.png\" width=60px height=60px />";
        coin.setAttribute('id', i + "" + j);
        document.getElementById("board").appendChild(coin);
    }
    var br = document.createElement("br");
    document.getElementById("board").appendChild(br);
}

function pad (val) {
    if (val > 9) return val;
    else return "0" + val;
}

function start_timer() {
    setInterval(myTimer, 1000);
}

function myTimer() {
  document.getElementById("counterSeconds").innerHTML = pad(++seconds%60);
  document.getElementById("counterMinutes").innerHTML = pad(parseInt(seconds/60, 10));
}

function clicked(c) {
    socket.send(c.id);
    //position id to be sent to the server
}

//game aborted by pressing exit game
function exitGame(){
    socket.send("exit");
}

var socket = new WebSocket("ws://localhost:3000");

socket.onmessage = function(event){
    //messages sent by the server to the client
    var obj = JSON.parse(event.data);

    if(obj.type == "PLAYER-TYPE") {
        if(obj.data=="A"){
            document.getElementById("statusMessage").innerHTML = obj.mess;
        }else if(obj.data=="B"){
            //Game started
            document.getElementById("statusMessage").innerHTML = "Elapsed Time: <span id=\"counterMinutes\">00</span>:<span id=\"counterSeconds\">00</span>";
            for (var i=0; i<=5; i++) {
                for (var j=0; j<=6; j++)  {
                    document.getElementById(i + "" + j).setAttribute('onclick', 'clicked(this)');
                }
            }
            start_timer();
        }
    }else if(obj.type == "PLAYER-MOVE") {
        //placing pizza at index depending on player
        if(obj.data == "A") {
            document.getElementById(obj.mess).innerHTML = "<img src=\"images/yellowp1.png\" width=60px height=60px />";
        }else if(obj.data == "B") {
            document.getElementById(obj.mess).innerHTML = "<img src=\"images/yellowp2.png\" width=60px height=60px />";
        }
    }else if(obj.type == "GAME-WON-BY") {
        document.getElementById("statusMessage").innerHTML = obj.type + "-" + obj.data;
    }else if(obj.type == "GAME-ABORTED"){
        document.getElementById("statusMessage").innerHTML = obj.type;
    }
};

//on first connection we send the message to the server
socket.onopen = function(){
    socket.send("game");
};

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}