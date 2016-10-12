/*
 * This is the Player class which stores information about the player
 */

// Define a constructor function to initialize a new Player object
function Player(player_id, username, type, roomNum) { 	
	this.playerId = player_id; // the socket ID of the player
	this.username = username;  // the player's username
	this.type = type;  // whether the player is drawing or not
	this.room = roomNum;
}						

Player.prototype.type = function() { // checks if the player is an artist
	return this.type;
}

Player.prototype.getUsername = function() { // gets the username of the player
	return this.username;
}

Player.prototype.getRoom = function () {
	return this.room;
}

Player.prototype.getID = function() { // gets the ID of the player
	return this.playerId;
}

/*
 * Export the Class
 */
 
module.exports = Player;