$(document).ready(function(){

	// connects the socket
	var socket = io.connect();

    // After the user enters an username and hits join
	$('#join').click(function () {
		var username = $('#username').val(); // username of the player
		var playerType = $("input[name=player]:checked").val();
		socket.emit('chooseGameAndCategory', {player: playerType});
	});

	socket.on('choseGame', function(data){
		$('.initialPage').fadeOut();
		$('.spinGame').fadeIn();
    });

	socket.on('choseCategory', function(data){
		$('.initialPage').fadeOut();
		$('.spinCategory').fadeIn();
    });

    $('#digit').click(function () {
    	$('.spinGame').fadeOut();
		$('.waitingForParent').fadeIn();
		socket.emit('gameSelected', {game: "digit"});    	
    });

    $('#home').click(function () {
    	$('.spinCategory').fadeOut();
    	$('#category').append("Home");
		$('.inputInformation').fadeIn();
		socket.emit('categorySelected', {category: "home"});  
    });


    $('#costSubmit').click(function () {
        var cost = parseInt($('#cost').val());
        // Validate the format of the cost input
        if (isNaN(cost)) {
            alert("Please enter the cost in correct format");
        }
        else {
            var item =  $('#item :selected').text();
            var per = $("input[name=per]:checked").val();
            socket.emit('saveCost', {item: item, cost: cost, per: per});
        }
    });

    socket.on('waitForTeen', function(data) {
        $('.initialPage').fadeOut();
    	$('.inputInformation').fadeOut();
    	$('.waitingForTeen').fadeIn();
    });

    socket.on('startMDGame', function(data) {
    	$('#categoryName').append(data.category);
        $('#itemName').append(data.item);
    	$('#perValue').append(data.per);
    	var missingID = data.missing;
    	var digitArray = data.digits;
  		var element;
    	for(var i=0; i<digitArray.length; i++) {
    		if(i != missingID) {
    			element = digitArray[i];
    		} else {
    			element = "_"
    		}

    		$('.digitList ul').append('<li>' + element + '</li>');
    	}

    	var missingDigitPlace = Math.floor((Math.random() * 2) + 1);
    	var seenDigit = [];
    	seenDigit.push(digitArray[missingID]);
    	for(var i=0; i<3; i++) {
    		if(i == missingDigitPlace){
    			element = digitArray[missingID];
    		} else {
    			element = Math.floor((Math.random() * 9) + 1);
    			while(seenDigit.indexOf(element) != -1){
    				element = Math.floor((Math.random() * 9) + 1);
    			}
    			seenDigit.push(element);
    		}

    		$('.choices').append('<input type="radio" name="choice" value=' + element + '> ' + element);
    	}

    	$('.waitingForParent').fadeOut();
    	$('.missingDigitScreen').fadeIn();
    });

	
	$('#guess').click(function () {
		var guess = $("input[name=choice]:checked").val();
		socket.emit('checkGuess', {guess: guess})
	});

	socket.on('parentWin', function (data) {
		$('.parentWin').modal()
	});

	socket.on('teenWin', function (data) {
		$('.teenWin').modal()
	});






});