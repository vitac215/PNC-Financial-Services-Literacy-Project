var Player = require('../models/player.js');

exports.init = function(io) {

	var parentID;
	var teenID;
	var game = "";
	var category = "";
	var item;
	var cost;
	var per;

	// variables for missing digit
	var digitArray;
	var missingId;
	
    // When a new connection is initiated
	io.sockets.on('connection', function (socket) {
		console.log('Connection started');

		// When a new user joins the game
		socket.on('chooseGameAndCategory', function (data) {
			if(data.player == "parent"){
				parentID = socket.id;
				io.sockets.connected[parentID].emit('choseCategory');
			} else {
				teenID = socket.id;
				io.sockets.connected[teenID].emit('choseGame');
			}
		}); 


		socket.on('gameSelected', function (data) {
			game = data.game;
		});

		socket.on('categorySelected', function (data) {
			category = data.category;
		});

		socket.on('saveCost', function (data) { 
			item = data.item;
			cost = data.cost;
			per = data.per;

			digitArray = cost.toString(10).split("").map(function(t){return parseInt(t)});
			missingId = Math.floor((Math.random() * (digitArray.length-1)) + 1);

			io.sockets.connected[teenID].emit('startGame', {digits: digitArray, missing: missingId, per: per, category: category});
			io.sockets.connected[parentID].emit('waitForTeen');
		});

		socket.on('checkGuess', function (data) {
			if(data.guess == digitArray[missingId]) {
				io.sockets.connected[teenID].emit('teenWin');
			} else {
				io.sockets.connected[teenID].emit('parentWin');
			}
		});

	});
}
