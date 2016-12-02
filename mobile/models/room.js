// Define a constructor function to initialize a new Player object
function Room(id) { 	
	this.roomID = id;
	this.parentID;
	this.teenID;
	this.parentName;
	this.teenName;
	this.game = "";
	this.category = "";
	this.item;
	this.cost;
	this.per;
	this.teenGuess;

	// variables for Missing Digit
	this.digitArray;
	this.missingId;

	// variables for bonkers
	this.guess;

	// variables for balance
	this.displayVal;
	// this.val1;
	// this.val2;
	// this.val3;
	this.val = [];

	// variables for score counter
	this.teenScore = 0;
	this.parentScore = 0;
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

Room.prototype.getParentName = function() { // checks if the player is an artist
	return this.parentName;
}

Room.prototype.getTeenName = function() { // checks if the player is an artist
	return this.teenName;
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

Room.prototype.getTeenScore = function() {
	return this.teenScore;
}

Room.prototype.getParentScore = function() {
	return this.parentScore;
}

/*
 * Export the Class
 */
 
module.exports = Room;