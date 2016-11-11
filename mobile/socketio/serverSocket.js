var Player = require('../models/player.js');
var Room = require('../models/room.js');

exports.init = function(io) {

	var rooms = [];
	
    // When a new connection is initiated
	io.sockets.on('connection', function (socket) {
		console.log('Connection started');

		socket.on('disconnect', function () {
			io.emit('gameDisconnected');
			var r;
			for(var i=0; i<rooms.length; i++) {
				r = rooms[i];
				if(r.getParent() == socket.id || r.getTeen() == socket.id) {
					rooms.splice(i, 1);
				}
			}
		});

		// created a new room
		socket.on('createRoom', function (data) {
			var r;
			var found = false;
			for(var i=0; i<rooms.length; i++) {
				r = rooms[i];
				if(r.getID() == data.room) {
					found = true;
					break;
				}
			}

			if(found) {
				io.sockets.connected[socket.id].emit('roomExists');
			} else {
				var p = new Player(socket.id, data.username, data.playerType, data.room);
				socket.join(data.room);
				var r = new Room(data.room);
				if(data.playerType == "parent") {
					r.parentID = socket.id;
				} else {
					r.teenID = socket.id;
				}

				rooms.push(r);

				if(data.playerType == "parent"){
					// Wait for teen to enter and choose a game
					io.sockets.connected[r.parentID].emit('waitForTeen');
					//io.sockets.connected[r.parentID].emit('choseCategory');
				} else {
					io.sockets.connected[r.teenID].emit('choseGame', {room: r});
				}
			}

		});


		// When a new user joins the game
		socket.on('joinRoom', function (data) {
			var r; // room
			var found = false;
			for(var i=0; i<rooms.length; i++) {
				r = rooms[i];
				if(r.getID() == data.room) {
					found = true;
					break;
				}
			}

			if(found == false) {
				io.sockets.connected[socket.id].emit('wrongRoom');
			} else {
				var p = new Player(socket.id, data.username, data.playerType, data.room);
				socket.join(data.room);

				if(data.playerType == "parent") {
					r.parentID = socket.id;
				} else {
					r.teenID = socket.id;
				}

				if(data.player == "parent"){
					io.sockets.connected[r.parentID].emit('choseCategory', {room: r});
				} else {
					io.sockets.connected[r.teenID].emit('choseGame', {room: r});
				}
			}
		}); 


		// Teen selected game
		socket.on('gameSelected', function (data) {
			var r;
			var teenID = socket.id;
			var parentID = 0;
			for(var i=0; i<rooms.length; i++) {
				if(rooms[i].getTeen() == teenID) {
					rooms[i].game = data.game;
					parentID = rooms[i].getParent();
					r = rooms[i];
					// console.log("room teenscore: "+rooms[i].teenScore);
					// console.log("parent: "+parentID);
					break;
				}
			}
			// Now have the parent choose a cateogry
			io.sockets.connected[parentID].emit('choseCategory', {room: r});
		});

		// parent selected category
		socket.on('categorySelected', function (data) {
			var parentID = socket.id;
			for(var i=0; i<rooms.length; i++) {
				if(rooms[i].getParent() == parentID) {
					rooms[i].category = data.category;
					break;
				}
			}
		});


		// Save the cost amount and category the parent inputs
		socket.on('saveCost', function (data) { 
			var parentID = socket.id;
			var r;

			for(var i=0; i<rooms.length; i++) {
				if(rooms[i].getParent() == parentID) {
					r = rooms[i];
					clearGameData(r);
					console.log(1);
					console.log(r);
					rooms[i].item = data.item;
					rooms[i].cost = data.cost;
					rooms[i].per = data.per;
					
					// missing digit
					rooms[i].digitArray = data.cost.toString(10).split("").map(function(t){return parseInt(t)});
					rooms[i].missingId = Math.floor((Math.random() * (rooms[i].digitArray.length-1)) + 1);
					
					// bonkers
					rooms[i].guess = Math.floor((Math.random() * (data.cost*1.5)) + data.cost*0.5);
					console.log("bonkers");
					console.log("bonkers number guess: "+rooms[i].guess);

					// balance
					var tempCost = data.cost;
					console.log("tempCost: "+tempCost);
					rooms[i].displayVal = tempCost % 10;
					console.log("balance displayVal: "+rooms[i].displayVal);
					tempCost = tempCost - rooms[i].displayVal;

					rooms[i].val1 = Math.floor((Math.random() * (data.cost-1) + 1));
					rooms[i].val2 = tempCost - rooms[i].val1;
					rooms[i].val3 = Math.floor((Math.random() * (data.cost-1) + 1));
					while(rooms[i].val3 == rooms[i].val1) {
						rooms[i].val3 = Math.floor((Math.random() * (data.cost-1) + 1));	
					}

					break;
				}
			}

			console.log("game " + r.getGame());
			console.log(r);
			io.sockets.connected[r.parentID].emit('waitForTeen');
			if(r.getGame() == "digit") {
				io.sockets.connected[r.teenID].emit('startDigit', {digits: r.digitArray, missing: r.missingId, per: r.per, category: r.category, item: r.item});
			} else if(r.getGame() == "bonkers") {
				io.sockets.connected[r.teenID].emit('startBonkers', {guess: r.guess, per: r.per, category: r.category, item: r.item});
			} else if(r.getGame() == "balance") {
				io.sockets.connected[r.teenID].emit('startBalance', {per: r.per, category: r.category, item: r.item, displayVal: r.displayVal, val1: r.val1, val2: r.val2, val3: r.val3});
			}
		});


		// MissingDigits 
		socket.on('checkGuess', function (data) {
			var teenID = socket.id;
			var r;
			for(var i=0; i<rooms.length; i++) {
				if(rooms[i].getTeen() == teenID) {
					r = rooms[i];
					break;
				}
			}

			if(data.guess == r.digitArray[r.missingId]) {
				io.sockets.connected[r.teenID].emit('teenWin', {id: r.teenID, playerType: 'teen', room: r});
				io.sockets.connected[r.parentID].emit('teenWin', {id: r.parentID, playerType: 'parent', room: r});
				// Call score counter
				scoreCounter(r.teenID, "teen", r);
			} else {
				io.sockets.connected[r.teenID].emit('parentWin', {id: r.teenID, playerType: 'teen', room: r});
				io.sockets.connected[r.parentID].emit('parentWin', {id: r.parentID, playerType: 'parent', room: r});
				scoreCounter(r.parentID, "parent", r);
			}
		});


		// Bonkers
		socket.on('bonkersResult', function (data) {
			var teenID = socket.id;
			var r;
			for(var i=0; i<rooms.length; i++) {
				if(rooms[i].getTeen() == teenID) {
					r = rooms[i];
					break;
				}
			}
			var level = data.guess;
			console.log(level);
			if(((level == "up") && (r.guess < r.cost)) || ((level == "down") && (r.guess > r.cost))) {
				io.sockets.connected[r.teenID].emit('teenWin', {id: r.teenID, playerType: 'teen', room: r});
				io.sockets.connected[r.parentID].emit('teenWin', {id: r.parentID, playerType: 'parent', room: r});
				scoreCounter(r.teenID, "teen", r);
			} else {
				io.sockets.connected[r.teenID].emit('parentWin', {id: r.teenID, playerType: 'teen', room: r});
				io.sockets.connected[r.parentID].emit('parentWin', {id: r.parentID, playerType: 'parent', room: r});
				scoreCounter(r.parentID, "parent", r);
			}
		});


		// Balance
		socket.on('balanceResult', function (data) {
			var teenID = socket.id;
			var r;
			for(var i=0; i<rooms.length; i++) {
				if(rooms[i].getTeen() == teenID) {
					r = rooms[i];
					break;
				}
			}

			var sum = 0;
			if(data.one) {
				sum += r.val1;
			}
			if(data.two) {
				sum += r.val2;
			}
			if(data.three) {
				sum += r.val3;
			}
			if((sum+r.displayVal) == r.cost) {
				io.sockets.connected[r.teenID].emit('teenWin', {id: r.teenID, playerType: 'teen', room: r});
				io.sockets.connected[r.parentID].emit('teenWin', {id: r.parentID, playerType: 'parent', room: r});
				scoreCounter(r.teenID, "teen", r);
			} else {
				io.sockets.connected[r.teenID].emit('parentWin', {id: r.teenID, playerType: 'teen', room: r});
				io.sockets.connected[r.parentID].emit('parentWin', {id: r.parentID, playerType: 'parent', room: r});
				scoreCounter(r.parentID, "parent", r);
			}
		});


		// Start a new round
		socket.on('startNewRound', function (data) {
			var r;
			var found = false;
			for(var i=0; i<rooms.length; i++) {
				r = rooms[i];
				if(r.getID() == data.room) {
					found = true;
					break;
				}
			}
			if(data.playerType == "parent"){
				// Wait for teen to enter and choose a game
				io.sockets.connected[r.parentID].emit('waitForTeen');
				//io.sockets.connected[r.parentID].emit('choseCategory');
			} else {
				io.sockets.connected[r.teenID].emit('choseGame', {room: r});
			}
		});

	});


	// Count the score
	function scoreCounter(id, playerType, r) {
		console.log("Counting now");
		console.log("initial score: teen "+r.teenScore+", parent "+r.parentScore);
		if (playerType == "teen") {
			r.teenScore += 1;
			console.log("after score: teen "+r.teenScore+", parent "+r.parentScore);
		}
		else if (playerType == "parent") {
			r.parentScore += 1;
			console.log(r.teenScore);
			console.log("after score: teen "+r.teenScore+", parent "+r.parentScore);
		}
	}


	// Clear game data for starting a new round
	function clearGameData(room) {
		// variables for Missing Digit
		this.digitArray = '';
		this.missingId = [];

		// variables for bonkers
		this.guess = '';

		// variables for balance
		this.displayVal = '';
		this.val1 = '';
		this.val2 = '';
		this.val3 = '';
	}
}
