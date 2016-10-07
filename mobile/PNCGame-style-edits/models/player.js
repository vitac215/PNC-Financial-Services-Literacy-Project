/*
 * This is the Player class which stores information about the player
 */

// Define a constructor function to initialize a new Player object
function Player(player_id, username, is_child) { 	
	this.playerId = player_id; // the socket ID of the player
	this.username = username;  // the player's username
	this.isChild = is_child;  // whether the player is drawing or not
}						

Player.prototype.isChild = function() { // checks if the player is an artist
	return this.isChild;
};

Player.prototype.getUsername = function() { // gets the username of the player
	return this.username;
}

Player.prototype.getID = function() { // gets the ID of the player
	return this.playerId;
}

/*
 * Export the Class
 */
 
module.exports = Player;