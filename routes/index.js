var express = require('express');
var router = express.Router();
var gameStatus = require('../public/javascripts/statTracker.js');

router.get('/', function(req, res) {
  res.render("splash.ejs", {gamesInitialized: gameStatus.gamesInitialized, gamesPlayed: gameStatus.gamesCompleted, playersOnline: gameStatus.playerOnline});
});

router.post('/', function(req, res) {
  res.render("splash.ejs", {gamesInitialized: gameStatus.gamesInitialized, gamesPlayed: gameStatus.gamesCompleted, playersOnline: gameStatus.playerOnline});
});

router.post('/game', function(req, res) {
  res.sendFile("game.html", {root: "./public/"});
});

module.exports = router;