// Define a constructor function to initialize a new Player object
function Room(id) { 	
	this.roomID = id;
	this.parentID;
	this.teenID;
	this.game = "";
	this.category = "";
	this.item;
	this.cost;
	this.per;

	// variables for Missing Digit
	this.digitArray;
	this.missingId;

	// variables for bonkers
	this.guess;

	// variables for balance
	this.displayVal;
	this.val1;
	this.val2;
	this.val3;
}						

Room.prototype.getID = function() { // checks if the player is an artist
	return this.roomID;
}

Room.prototype.getParent = function() { // checks if the player is an artist
	return this.parentID;
}

Room.prototype.getTeen = function() { // checks if the player is an artist
	return this.teenID;
}

Room.prototype.getGame = function() { // checks if the player is an artist
	return this.game;
}

Room.prototype.getCost = function() { // checks if the player is an artist
	return this.cost;
}

Room.prototype.getItem = function() { // checks if the player is an artist
	return this.item;
}

Room.prototype.getPer = function() { // checks if the player is an artist
	return this.per;
}

/*
 * Export the Class
 */
 
module.exports = Room;