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
					io.sockets.connected[r.parentID].emit('choseCategory');
				} else {
					io.sockets.connected[r.teenID].emit('choseGame');
				}
			}

		});

		// When a new user joins the game
		socket.on('joinRoom', function (data) {
			var r;
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
					io.sockets.connected[r.parentID].emit('choseCategory');
				} else {
					io.sockets.connected[r.teenID].emit('choseGame');
				}
			}
		}); 


		// teen selected game
		socket.on('gameSelected', function (data) {
			var teenID = socket.id;
			for(var i=0; i<rooms.length; i++) {
				if(rooms[i].getTeen() == teenID) {
					rooms[i].game = data.game;
					console.log(rooms[i]);
					break;
				}
			}
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

		socket.on('saveCost', function (data) { 
			var parentID = socket.id;
			var r;
			for(var i=0; i<rooms.length; i++) {
				if(rooms[i].getParent() == parentID) {
					r = rooms[i];
					console.log(1);
					console.log(r);
					rooms[i].item = data.item;
					rooms[i].cost = data.cost;
					rooms[i].per = data.per;
					
					// missing digit
					rooms[i].digitArray = data.cost.toString(10).split("").map(function(t){return parseInt(t)});
					rooms[i].missingId = Math.floor((Math.random() * (rooms[i].digitArray.length-1)) + 1);
					
					// bonkers
					rooms[i].guess = Math.floor((Math.random() * ((data.cost-1)*2)) + 1);

					// balance
					var tempCost = data.cost;
					rooms[i].displayVal = tempCost % 10;
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

			console.log("game" + r.getGame());
			console.log(2);
			console.log(r);
			io.sockets.connected[r.parentID].emit('waitForTeen');
			if(r.getGame() == "digit") {
				io.sockets.connected[r.teenID].emit('startDigit', {digits: r.digitArray, missing: r.missingId, per: r.per, category: r.category});
			} else if(r.getGame() == "bonkers") {
				io.sockets.connected[r.teenID].emit('startBonkers', {guess: r.guess, per: r.per, category: r.category});
			} else if(r.getGame() == "balance") {
				io.sockets.connected[r.teenID].emit('startBalance', {per: r.per, category: r.category, displayVal: r.displayVal, val1: r.val1, val2: r.val2, val3: r.val3});
			}
		});

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
				io.sockets.connected[r.teenID].emit('teenWin');
			} else {
				io.sockets.connected[r.teenID].emit('parentWin');
			}
		});

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
				io.sockets.connected[r.teenID].emit('teenWin');
			} else {
				io.sockets.connected[r.teenID].emit('parentWin');
			}
		});

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
				io.sockets.connected[r.teenID].emit('teenWin');
			} else {
				io.sockets.connected[r.teenID].emit('parentWin');
			}
		});

	});
}
