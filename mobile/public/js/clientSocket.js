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
        $('.wrongCode').modal();
    });

    socket.on('roomExists', function(data) {
        $('.roomExists').modal();
    });

    // socket.on('costWrongFormat'), function(data) {
    //     $('.costWrongFormat').modal();
    // }

    // Choose game (teen)
	socket.on('choseGame', function(data){
		$('.initialPage').fadeOut();
		$('.spinGame').fadeIn();
        var parentName = data.room['parentName'];
        var teenName = data.room['teenName'];
        appendName(parentName, teenName);
        updateScore(data.room);
    });

    // Choose category (parent)
	socket.on('choseCategory', function(data){
        console.log("here");
		$('.initialPage').fadeOut();
        $('.waitingForTeen').fadeOut();
        $('.waitingForTeenToJoin').fadeOut();
        $('.waitingForTeenToChooseGame').fadeOut();
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
        $('.chooseCategoryNote').hide();
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
        $('.chooseCategoryNote').show();
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
        $('.chooseCategoryNote').show();
        $('.spinCategory').fadeOut();
        $('#category').append("Fun");
        $('.inputInformation').fadeIn();
        // Clear the item
        $("#item").empty();
        appendItem("fun");
        socket.emit('categorySelected', {category: "fun"});  
    });

    $('#shopping').click(function () {
        // Clear the category
        $('#category').empty();
        $('.chooseCategoryNote').show();
        $('.spinCategory').fadeOut();
        $('#category').append("shopping");
        $('.inputInformation').fadeIn();
        // Clear the item
        $("#item").empty();
        appendItem("shopping");
        socket.emit('categorySelected', {category: "shopping"});  
    });

    $('#living_expenses').click(function () {
        // Clear the category
        $('#category').empty();
        $('.chooseCategoryNote').show();
        $('.spinCategory').fadeOut();
        $('#category').append("living expenses");
        $('.inputInformation').fadeIn();
        // Clear the item
        $("#item").empty();
        appendItem("living_expenses");
        socket.emit('categorySelected', {category: "living_expenses"});  
    });


    $('#costSubmit').click(function () {
        var cost = parseInt($('#cost').val());
        console.log("cost submit: "+cost);
        // Validate the format of the cost input
        if ( (isNaN(cost)) || (cost < 10) ) {
           $('.costWrongFormat').modal();
        }
        else {
            var item =  $('#item :selected').text();
            var per = $("input[name=per]:checked").val();
            socket.emit('saveCost', {item: item, cost: cost, per: per});
        }
    });

    socket.on('waitForTeenToJoin', function(data) {
        $('.initialPage').fadeOut();
        $('.inputInformation').fadeOut();
        $('.waitingForTeenToJoin').fadeIn();
    });

    socket.on('waitingForTeenToChooseGame', function(data) {
        $('.initialPage').fadeOut();
        $('.inputInformation').fadeOut();
        $('.waitingForTeen').fadeOut();
        $('.waitingForTeenToJoin').fadeOut();
        $('.waitingForTeenToChooseGame').fadeIn();
        var parentName = data.room['parentName'];
        var teenName = data.room['teenName'];
        appendName(parentName, teenName);
    });

    socket.on('waitForTeen', function(data) {
        console.log(data);
        $('.initialPage').fadeOut();
    	$('.inputInformation').fadeOut();
        $('.waitingForTeenToJoin').fadeOut();
        $('.waitingForTeenToChooseGame').fadeOut();
    	$('.waitingForTeen').fadeIn();
        var parentName = data.room['parentName'];
        var teenName = data.room['teenName'];
        appendName(parentName, teenName);
    });



    // MISSINGDIGITS GAME
    socket.on('startDigit', function(data) {
        clearGameData('digit');
        $('.digit-option').empty();
    	$('#categoryName').append(data.category);
    	$('#perValue').append(data.per+"ly ");
        $('.subCategory').append(data.item);
    	var missingID = data.missing;
    	var digitArray = data.digits;
  		var element;

        // Determine the missing digit choices
        var missingDigitPlace = Math.floor(Math.random() * 3);
        console.log(missingDigitPlace);
        var seenDigit = [];
        seenDigit.push(digitArray[missingID]);

        console.log("missingdigit value: "+digitArray[missingID]);

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
            // $('.choices').append('<input type="radio" name="choice" value=' + element + '> ' + element);
        }

        // Shuffle the array
        //   http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
        seenDigit = shuffle(seenDigit);

        console.log("seenDigit");
        console.log(seenDigit);

        // Append the three numbers
        for(var k=0; k<3; k++) {
            // Append digits for each number
            for(var i=0; i<digitArray.length; i++) {
                if(i != missingID) {
                    element = digitArray[i];
                } else {
                    element = '<span class="digit-option-missing">'+seenDigit[k]+'</span>';
                }
                // $('.digitList ul').append('<li>' + element + '</li>');
                $('#digit-option'+k).append(element);
            }
        }
    	$('.waitingForParent').fadeOut();
    	$('.missingDigitScreen').fadeIn();
    });


    $('.digit-option').click(function() {
        // http://stackoverflow.com/questions/10780087/getting-integer-value-from-a-string-using-javascript-jquery
        var guess = parseInt($(this).html().replace ( /[^\d.]/g, '' ));
        console.log("missing digit guess: " + guess);
        socket.emit('checkGuess', {guess: guess})
    });
	
	// $('#guess').click(function () {
	// 	var guess = $("input[name=choice]:checked").val();
	// 	socket.emit('checkGuess', {guess: guess})
	// });

	socket.on('parentWin', function (data) {
        $('.guessAns').empty();
        $('.correctAns').empty();
        $('.gameover_msg').empty();
        $('.guessAns').html(data.room['teenGuess']);
        $('.correctAns').html(data.room['cost']);
		$('.parentWin').modal('show');
        var msg = createMsg(data.playerType, "parentWin");
        $('.gameover_msg').append(msg);
        initialize();
        socket.emit('startNewRound', {id: data.id, playerType: data.playerType, room: data.room});
	});

	socket.on('teenWin', function (data) {
        $('.guessAns').empty();
        $('.correctAns').empty();
        $('.gameover_msg').empty();
        $('.guessAns').html(data.room['teenGuess']);
        $('.correctAns').html(data.room['cost']);
		$('.teenWin').modal('show');
        var msg = createMsg(data.playerType, "teenWin");
        $('.gameover_msg').append(msg);
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
        $('#perValueBonkers').append(data.per+"ly ");
        $('.subCategory').append(data.item);
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
        $('#categoryNameBalance').append(data.category);
        $('.perValueBalance').append(data.per);
        $('#perValueBalance').append(data.per+"ly ");
        $('.subCategory').append(data.item);
        $('.waitingForParent').fadeOut();
        $('.balanceScreen').fadeIn();

        // Append the initial number on the static ball on scale
        console.log("initialval for balance: "+data.displayVal)
        $('#ball-scale-text-0').html(data.displayVal);
        $('#nest-total-text').html(data.displayVal);

        // Append the guesses randomly
        console.log(data);
        balanceAppend('ball-option-text-1', data.room.val[0]);
        balanceAppend('ball-option-text-2', data.room.val[1]);
        balanceAppend('ball-option-text-3', data.room.val[2]);

        // Map the relationship between the option balls and scale balls
        $('#ball-option-1').click(function() {
            // If option ball 1 has value, move it onto scale ball 1
            if ($(this).html() != "") {
                $('#ball-option-1').hide();
                $('#ball-scale-1').show();
                $('#ball-option-text-1').html("");
                balanceAppend('ball-scale-text-1', data.room.val[0]);
                updateScale();
            }
        });
        $('#ball-option-2').click(function() {
            // If option ball 2 has value, move it onto scale ball 2
            if ($(this).html() != "") {
                $('#ball-option-2').hide();
                $('#ball-scale-2').show();
                $('#ball-option-text-2').html("");
                balanceAppend('ball-scale-text-2', data.room.val[1]);
                updateScale();
            }
        });
        $('#ball-option-3').click(function() {
            // If option ball 3 has value, move it onto scale ball 3
            if ($(this).html() != "") {
                $('#ball-option-3').hide();
                $('#ball-scale-3').show();
                $('#ball-option-text-3').html("");
                balanceAppend('ball-scale-text-3', data.room.val[2]);
                updateScale();
            }
        });

        $('#ball-scale-1').click(function() {
            // If scale ball 1 has value, move it onto option ball 1
            if ($(this).html() != "") {
                $('#ball-scale-1').hide();
                $('#ball-option-1').show();
                $('#ball-scale-text-1').html("");
                balanceAppend('ball-option-text-1', data.room.val[0]);
                updateScale();
            }
        });
        $('#ball-scale-2').click(function() {
            // If scale ball 2 has value, move it onto option ball 2
            if ($(this).html() != "") {
                $('#ball-scale-2').hide();
                $('#ball-option-2').show();
                $('#ball-scale-text-2').html("");
                balanceAppend('ball-option-text-2', data.room.val[1]);
                updateScale();
            }
        });
        $('#ball-scale-3').click(function() {
            // If scale ball 3 has value, move it onto option ball 3
            if ($(this).html() != "") {
                $('#ball-scale-3').hide();
                $('#ball-option-3').show();
                $('#ball-scale-text-3').html("");
                balanceAppend('ball-option-text-3', data.room.val[2]);
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
        $('.waitingForTeenToJoin').fadeOut();
        $('.waitingForTeenToChooseGame').fadeOut();
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

        $('.subCategory').empty();

        if (game == 'digit') {
            $('#categoryName').empty();
            $('#perValue').empty();
            // $('.digitList ul').empty();
            // $('.digitList ul').append('<li>$</li>');
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
            $('#perValueBalance').empty();
            $('#bonkersNumber').empty();
            //$('##startVal').empty();
           //$('#balanceChoices').empty();
            $('.ball-text').html("");
            $('.ball-text-lg').html("?");
            $('.ball-interactive').show();
            $('.ball-hidden').hide();
        }
    };

    // Append name to waiting messages
    function appendName(parentName, teenName) {
        // Empty the name field and append name
        $('.teenName').empty();
        $('.teenName').html(teenName);
        $('.parentName').empty();
        $('.parentName').html(parentName);
    }

    // Append sub-categories to the category for parent to input cost
    function appendItem(category) {
        if (category == "home"){
            $("#item").append('<option value="rent">rent</option>');
            $("#item").append('<option value="mortgage">mortgage</option>');
            $("#item").append('<option value="electricity">electricity</option>');
            $("#item").append('<option value="internet">internet</option>');
            $("#item").append('<option value="gas">gas</option>');
        }
        if (category == "travel"){
            $("#item").append('<option value="hotels">hotels</option>');
            $("#item").append('<option value="flights">flights</option>');
            $("#item").append('<option value="rental car">rental car</option>');
        }
        if (category == "fun"){
            $("#item").append('<option value="dining out">dining out</option>');
            $("#item").append('<option value="movies">movies</option>');
            $("#item").append('<option value="sports">sports</option>');           
        }
        if (category == "shopping"){
            $("#item").append('<option value="clothes">clothes</option>'); 
            $("#item").append('<option value="electronics">electronics</option>'); 
            $("#item").append('<option value="games">games</option>'); 
        }
        if (category == "living_expenses"){
            $("#item").append('<option value="automobiles">automobiles</option>'); 
            $("#item").append('<option value="groceries">groceries</option>'); 
            $("#item").append('<option value="medical expenses">medical expenses</option>');
            $("#item").append('<option value="braces">braces</option>');  
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
        // console.log("sum: "+sum);
        $('#nest-total-text').html(sum);
    }

    // Function to shuffle an array
    function shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;
      // While there remain elements to shuffle...
      while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    }

    // Function to create gameover messages
    function createMsg(playerType, whoWins) {
        var msg;
        var random = -1;
        if (whoWins == "parentWin") {
            if (playerType == "parent") {
                // Situation: parent wins
                // Choose 1 comment from 5 for each situation
                switch (random = Math.floor(Math.random() * 5)) {
                    case 0:
                        msg = "Nice job! You’re beating your kid at a video game!";
                        break;
                    case 1:
                        msg = "Way to go!  Show ‘em who's boss!";
                        break;
                    case 2:
                        msg = "Takin’ them to school!";
                        break;
                    case 3:
                        msg = "Hey, you’re pretty good at this!";
                        break;
                    case 4:
                        msg = "Maybe you should bet some free chores on this?";
                        break;
                }
            }
            else {
                // Situation: teen loses
                // Choose 1 comment from 5 for each situation
                switch (random = Math.floor(Math.random() * 5)) {
                    case 0:
                        msg = "I hope you didn’t bet your allowance on this.";
                        break;
                    case 1:
                        msg = "Aren’t you supposed to be better at video games than your parents?";
                        break;
                    case 2:
                        msg = "Much loss. Very sad.";
                        break;
                    case 3:
                        msg = "I remember my first video game.";
                        break;
                    case 4:
                        msg = "Do it the same way, but this time better.";
                        break;
                }
            }
        }
        // Teen wins
        else {
            if (playerType == "parent") {
                // Situation: parent loses
                // Choose 1 comment from 6 for each situation
                switch (random = Math.floor(Math.random() * 6)) {
                    case 0:
                        msg = "Points are like money, they don’t grow on trees.";
                        break;
                    case 1:
                        msg = "You know what they say: kids always end up smarter than their parents.";
                        break;
                    case 2:
                        msg = "They are probably tweeting about this right now.";
                        break;
                    case 3:
                        msg = "Do it the same way, but this time better.";
                        break;
                    case 4:
                        msg = "What, did you forget your coffee this morning?";
                        break;
                    case 5:
                        msg = "I mean, I’m not surprised your kid is beating you at a video game.";
                        break;
                }
            }
            else {
                // Situation: teen wins
                // Choose 1 comment from 5 for each situation
                switch (random = Math.floor(Math.random() * 6)) {
                    case 0:
                        msg = "If this score were a report card, we’d put it up on the fridge.";
                        break;
                    case 1:
                        msg = "Clearly, parents don’t know everything.";
                        break;
                    case 2:
                        msg = "Nice job! Beating your parents at their own game.";
                        break;
                    case 3:
                        msg = "It’s like they say: kids always end up smarter than their parents.";
                        break;
                    case 4:
                        msg = "Keep it up!  Maybe they’ll buy you DQ after this...";
                        break;
                    case 5:
                        msg = "You’ve clearly been doing your homework!";
                        break;
                }
            }
        }
        // console.log("gameover msg: "+msg);
        return msg;
    }

});