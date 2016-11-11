$(document).ready(function(){

	// connects the socket
	var socket = io.connect();

    // Monitor the change of the playerType selection
    //   make sure the parent get to create the game first
    $("input[name=player]").change(function() {
        var playerType = $("input[name=player]:checked").val();
        console.log(playerType);
        if (playerType == "parent") {
            $('#create').show();
            $('#join').hide();
        } 
        if (playerType == "teen") {
            $('#join').show();
            $('#create').hide();
        }     
    })


    // When someone creates a room
    $('#create').click(function () {
        var username = $('#username').val(); // username of the player
        var playerType = $("input[name=player]:checked").val();
        var room = $("#room").val();
        socket.emit('createRoom', {username: username, playerType: playerType, room: room});
    });

    // After the user enters an username and hits join
	$('#join').click(function () {
		var username = $('#username').val(); // username of the player
		var playerType = $("input[name=player]:checked").val();
        var room = $("#room").val();
		socket.emit('joinRoom', {username: username, playerType: playerType, room: room});
	});

    socket.on('wrongRoom', function(data) {
        $('.wrongCode').modal()
    });

    socket.on('roomExists', function(data) {
        $('.roomExists').modal()
    });


    // Choose game (teen)
	socket.on('choseGame', function(data){
		$('.initialPage').fadeOut();
		$('.spinGame').fadeIn();
        updateScore(data.room);
    });

    // Choose category (parent)
	socket.on('choseCategory', function(data){
		$('.initialPage').fadeOut();
        $('.waitingForTeen').fadeOut();
		$('.spinCategory').fadeIn();
        updateScore(data.room);
    });


    // When a game is selected
    $('#digit').click(function () {
    	$('.spinGame').fadeOut();
		$('.waitingForParent').fadeIn();
		socket.emit('gameSelected', {game: "digit"});    	
    });

    $('#bonkers').click(function () {
        $('.spinGame').fadeOut();
        $('.waitingForParent').fadeIn();
        socket.emit('gameSelected', {game: "bonkers"});    
    });

    $('#balance').click(function () {
        $('.spinGame').fadeOut();
        $('.waitingForParent').fadeIn();
        socket.emit('gameSelected', {game: "balance"});
    });


    // When a category is selected
    $('#home').click(function () {
        // Clear the category
        $('#category').empty();
    	$('.spinCategory').fadeOut();
    	$('#category').append("Home");
		$('.inputInformation').fadeIn();
        // Clear the item
        $("#item").empty();
        appendItem("home");
		socket.emit('categorySelected', {category: "home"});  
    });

    $('#travel').click(function () {
        // Clear the category
        $('#category').empty();
        $('.spinCategory').fadeOut();
        $('#category').append("Travel");
        $('.inputInformation').fadeIn();
        // Clear the item
        $("#item").empty();
        appendItem("travel");
        socket.emit('categorySelected', {category: "travel"});  
    });

    $('#fun').click(function () {
        // Clear the category
        $('#category').empty();
        $('.spinCategory').fadeOut();
        $('#category').append("Fun");
        $('.inputInformation').fadeIn();
        // Clear the item
        $("#item").empty();
        appendItem("fun");
        socket.emit('categorySelected', {category: "fun"});  
    });

    $('#finance').click(function () {
        // Clear the category
        $('#category').empty();
        $('.spinCategory').fadeOut();
        $('#category').append("Finance");
        $('.inputInformation').fadeIn();
        // Clear the item
        $("#item").empty();
        appendItem("finance");
        socket.emit('categorySelected', {category: "finance"});  
    });

    $('#living_expenses').click(function () {
        // Clear the category
        $('#category').empty();
        $('.spinCategory').fadeOut();
        $('#category').append("Purchases");
        $('.inputInformation').fadeIn();
        // Clear the item
        $("#item").empty();
        appendItem("purchases");
        socket.emit('categorySelected', {category: "purchases"});  
    });


    $('#costSubmit').click(function () {
        var cost = parseInt($('#cost').val());
        console.log("cost submit: "+cost);
        // Validate the format of the cost input
        if ( (isNaN(cost)) || (cost < 10) ) {
            alert("Please enter the cost in correct format. It should be a number larger than 10");
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



    // MISSINGDIGITS GAME
    socket.on('startDigit', function(data) {
        clearGameData('digit');
    	$('#categoryName').append(data.category);
    	$('#perValue').append(data.per+"ly ");
        $('#subCategory').append(data.item);
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

    	//var missingDigitPlace = Math.floor((Math.random() * 2) + 1);
        var missingDigitPlace = Math.floor(Math.random() * 3);
        console.log(missingDigitPlace);
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
		$('.parentWin').modal('show');
        initialize();
        socket.emit('startNewRound', {id: data.id, playerType: data.playerType, room: data.room});
	});

	socket.on('teenWin', function (data) {
		$('.teenWin').modal('show');
        initialize();
        socket.emit('startNewRound', {id: data.id, playerType: data.playerType, room: data.room});
	});

    $('.close').click(function () {
        $('.modal-backdrop').fadeOut();
    });



    // BONKERS GAME
    socket.on('startBonkers', function (data) {
        clearGameData('bonkers');
        $('#categoryNameBonkers').append(data.category);
        $('#perValueBonkers').append(data.per);
        $('#bonkersNumber').append(data.guess);
        $('.waitingForParent').fadeOut();
        $('.bonkersScreen').fadeIn();
    });

    // // Toogle on and off the arrows
    // $('.up-arrow-bonkers').click(function (){
    //     $('.down-arrow-bonkers').toggle();
    // });

    // $('.down-arrow-bonkers').click(function (){
    //     $('.up-arrow-bonkers').toggle();
    // });

    // Submit bonkers choice
    $('.up-arrow-bonkers').click(function (){
        var guess;
        guess = "up";
        console.log("bonkers-guess: "+guess);
        socket.emit('bonkersResult', {guess: guess});
    });
    $('.down-arrow-bonkers').click(function (){
        var guess;
        guess = "down";
        console.log("bonkers-guess: "+guess);
        socket.emit('bonkersResult', {guess: guess});
    });

    // $('#guessBonkers').click(function () {
    //     var guess;
    //     // if ($('.down-arrow-bonkers').css('display') == 'none') {
    //     //     guess = "up";
    //     // }
    //     // else if ($('.up-arrow-bonkers').css('display') == 'none') {
    //     //     guess = "down";
    //     // }
    //     // else {
    //     //     // Make sure the teen selects higher or lower before pressing the guess button
    //     //     alert("Click the arrow to indicate whether you think the price is HIGHER or LOWER");
    //     //     return false;
    //     // }
        
    //     socket.emit('bonkersResult', {guess: guess});
    // });



    // BALANCE GAME
    socket.on('startBalance', function (data) {
        clearGameData('balance');
        $('.categoryNameBalance').append(data.category);
        $('.perValueBalance').append(data.per);
        $('.waitingForParent').fadeOut();
        $('.balanceScreen').fadeIn();

        // Append the initial number on the static ball on scale
        console.log("initialval for balance: "+data.displayVal)
        $('#ball-scale-text-0').html(data.displayVal);
        $('#nest-total-text').html(data.displayVal);

        // Append the guesses
        balanceAppend('ball-option-text-1', data.val1);
        balanceAppend('ball-option-text-2', data.val2);
        balanceAppend('ball-option-text-3', data.val3);

        // Map the relationship between the option balls and scale balls
        $('#ball-option-1').click(function() {
            // If option ball 1 has value, move it onto scale ball 1
            if ($(this).html() != "") {
                $('#ball-option-1').hide();
                $('#ball-scale-1').show();
                $('#ball-option-text-1').html("");
                balanceAppend('ball-scale-text-1', data.val1);
                updateScale();
            }
        });
        $('#ball-option-2').click(function() {
            // If option ball 2 has value, move it onto scale ball 2
            if ($(this).html() != "") {
                $('#ball-option-2').hide();
                $('#ball-scale-2').show();
                $('#ball-option-text-2').html("");
                balanceAppend('ball-scale-text-2', data.val2);
                updateScale();
            }
        });
        $('#ball-option-3').click(function() {
            // If option ball 2 has value, move it onto scale ball 2
            if ($(this).html() != "") {
                $('#ball-option-3').hide();
                $('#ball-scale-3').show();
                $('#ball-option-text-3').html("");
                balanceAppend('ball-scale-text-3', data.val2);
                updateScale();
            }
        });

        $('#ball-scale-1').click(function() {
            // If scale ball 1 has value, move it onto option ball 1
            if ($(this).html() != "") {
                $('#ball-scale-1').hide();
                $('#ball-option-1').show();
                $('#ball-scale-text-1').html("");
                balanceAppend('ball-option-text-1', data.val1);
                updateScale();
            }
        });
        $('#ball-scale-2').click(function() {
            // If scale ball 2 has value, move it onto option ball 2
            if ($(this).html() != "") {
                $('#ball-scale-2').hide();
                $('#ball-option-2').show();
                $('#ball-scale-text-2').html("");
                balanceAppend('ball-option-text-2', data.val2);
                updateScale();
            }
        });
        $('#ball-scale-3').click(function() {
            // If scale ball 3 has value, move it onto option ball 3
            if ($(this).html() != "") {
                $('#ball-scale-3').hide();
                $('#ball-option-3').show();
                $('#ball-scale-text-3').html("");
                balanceAppend('ball-option-text-3', data.val2);
                updateScale();
            }
        });
    });


    $('#guessBalance').click(function () {       
        var one = false;
        var two = false;
        var three = false;
        if($('#ball-scale-text-1').html() != ""){
            one = true;
        }
        if($('#ball-scale-text-2').html() != ""){
            two = true;
        }
        if($('#ball-scale-text-3').html() != ""){
            three = true;
        }
        socket.emit('balanceResult', {one: one, two: two, three: three});

    });


    // Functions

    // Function to hide all screens 
    function initialize() {
        $('.initialPage ').fadeOut();
        $('.spinGame').fadeOut();
        $('.spinCategory').fadeOut();
        $('.waitingForParent').fadeOut();
        $('.waitingForTeen').fadeOut();
        $('.inputInformation').fadeOut();
        $('.missingDigitScreen').fadeOut();
        $('.balanceScreen').fadeOut();
        $('.bonkersScreen').fadeOut();
        $('.spinGame').fadeOut();
        $('#newRound').fadeOut();

        $('#cost').val("");
    };


    // Function to update the score
    function updateScore(room) {
        console.log("updating score");  
        console.log("room: "+room);
        console.log("teenscore: "+room.teenScore+", parentscore: "+room.parentScore);
        $('#parentScoreCategory').html(room.parentScore);
        $('#teenScoreCategory').html(room.teenScore);
        $('#parentScoreGame').html(room.parentScore);
        $('#teenScoreGame').html(room.teenScore);
    };

    // Clear all game data for a new round
    function clearGameData(game) {
        $('.parentWin').modal('hide');
        $('.teenWin').modal('hide');

        if (game == 'digit') {
            $('#categoryName').empty();
            $('#perValue').empty();
            $('.digitList ul').empty();
            $('.digitList ul').append('<li>$</li>');
            $('.choices').empty();
        };

        if (game == 'bonkers') {
            $('#categoryNameBonkers').empty();
            $('#perValueBonkers').empty();
            $('#bonkersNumber').empty();
            $('.up-arrow-bonkers').css('display', 'inline');
            $('.down-arrow-bonkers').css('display', 'inline');
        }
        if (game == 'balance') {
            $('.categoryNameBalance').empty();
            $('.perValueBalance').empty();
            $('#bonkersNumber').empty();
            //$('##startVal').empty();
           //$('#balanceChoices').empty();
            $('.ball-text').html("");
            $('#ball-solution-text').html("?");
            $('.ball-interactive').show();
            $('.ball-hidden').hide();
        }
    };

    // Append sub-categories to the category for parent to input cost
    function appendItem(category) {
        if (category == "home"){
            $("#item").append('<option value="rent">rent</option>');
            $("#item").append('<option value="electricity">electricity</option>');
            $("#item").append('<option value="water">water</option>');
            $("#item").append('<option value="gas">gas</option>');
        }
        if (category == "travel"){

        }
        if (category == "fun"){

        }
        if (category == "finance"){

        }
        if (category == "living_expenses"){

        }
    }

    // Function for the balance game.
    //  Change value attribute and actual valee of the option ball 
    function balanceAppend(dest_id, value) {
        // Change the value attribute
        $('#'+dest_id).attr("value", value);
        // Change the actual value
        $('#'+dest_id).html(value);
    } 

    // Function for the balance game.
    //  Update the left scale value
    function updateScale() {
        var sum = parseInt($('#ball-scale-text-0').html());
        if ($('#ball-scale-text-1').html() != "") {
            sum += parseInt($('#ball-scale-text-1').html());
        }
        if ($('#ball-scale-text-2').html() != "") {
            sum += parseInt($('#ball-scale-text-2').html());
        }
        if ($('#ball-scale-text-3').html() != "") {
            sum += parseInt($('#ball-scale-text-3').html());
        }
        console.log("sum: "+sum);
        $('#nest-total-text').html(sum);
    }


});