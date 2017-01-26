players=[]
numberOfPlayers = 0
numberOfRounds = 0

function go() {
    $('#input-container').slideToggle("slow", setup());
}

function setup() {

    tournamentName = $('[name="tournamentname"]').val();
    numberOfPlayers = $('[name="players"]').val();
    numberOfRounds = $('[name="rounds"]').val();

    $('#tournament-name').html(tournamentName);

    // build number of fields for player names
    for(var i=1; i <= numberOfPlayers; i++) {
      players.push(buildPlayer(i));
    }

    $('#names').append("<h3>Enter Player Names</h3>");

    players.forEach(function(player) {
        $('#names').append(buildPlayerBox(player.displayName));
    });

    // add button to finalise
    $('#names').append('<div><button type="button" class="btn btn-default" onclick="finalise()">Start</button></div>');

}

function buildPlayerBox(name) {
    return '<div class="playername"><input type="text" class="form-control" value="' + name + '"></div>';
}

function buildPlayer(i){
     return {displayName:"Player " + i, win:0, lose:0, draw:0, alreadyPlayed: []};
}

function finalise() {

    $('.playername').each(function(i, obj) {
        displayName = $(this).find("input").val();
        players[i].displayName = displayName;
        name = displayName.replace(/\s+/g, '');
        players[i].name = name;
    });

    $('#names-container').animate({width:'toggle'},700, getPlayersForRound(1));

}

function getPlayersForRound(roundNumber) {

    var html = '<div class="round"><h3>Round ' + roundNumber + '</h3>';

    //sort so people play with players with a similar score
    sortPlayersByScore();

    //update table while players are in score order, before shuffling
    updateTable(roundNumber - 1);

    //shuffle to make sure people don't play same opposition twice
    shufflePlayers();

    games = numberOfPlayers / 2;

    html += "<div class='panel-group'>";

    for(var i=1; i <= games; i++) {
        html += "<div class='panel panel-default matchup'>";
        html += "<div class='panel-heading'>Game " + i + "</div>";
        html += "<ul class='list-group'>";

        playerA = players[(i*2) - 2];
        playerB = players[(i*2) - 1];

        html += playerRow('a', playerA, roundNumber, i);
        html += playerRow('b', playerB, roundNumber, i);
        html += "</div>";

    }

    html += "</div><div id='confirm-round" + roundNumber + "'>";
    html += "<button class='btn btn-default' onclick='confirmRound(" + roundNumber + ")'>Confirm Results</button></div>";
    html += "<span id='confirm-round-message-" + roundNumber + "'></span></div>";
    $('#bracket').append(html);


    for(var i=1; i <= games; i++) {

        addHandlersToCheckBoxes('a', roundNumber, i);
        addHandlersToCheckBoxes('b', roundNumber, i);
    }
}

function sortPlayersByScore() {

    players.sort(function(a, b) {
        return b.win - a.win;
    });
}

function logOutPlayerOrder() {
    players.forEach(function(player) {
        console.log(player.name + " " + player.displayName + " " + player.win + " " + player.lose + " " + player.alreadyPlayed);
    });
}

function shufflePlayers () {
    games = numberOfPlayers / 2;

    for(var i=1; i <= games; i++) {

        playerA = players[(i*2) - 2];
        playerB = players[(i*2) - 1];

        if (hasPlayedYet(playerA, playerB)) {
            // console.log("has already played " + playerA.name + " " + playerB.name);
            //find next unplayed
            nextUnplayed = findNextUnplayed(playerA);
            reverse = false;
            if (nextUnplayed == null) {
                nextUnplayed = findNextUnplayedReverse(playerB);
                reverse = true;
            }

            if (reverse) {
                //swap a with previous unplayed
                playerAIndex = players.indexOf(playerA);
                nextUnplayedIndex = players.indexOf(nextUnplayed);

                // console.log("Swapping " + playerA.name + " with " + nextUnplayed.name);
                players[playerAIndex] = nextUnplayed;
                players[nextUnplayedIndex] = playerA;
            } else {
                //swap b with next unplayed
                playerBIndex = players.indexOf(playerB);
                nextUnplayedIndex = players.indexOf(nextUnplayed);

                // console.log("Swapping " + playerB.name + " with " + nextUnplayed.name);
                players[playerBIndex] = nextUnplayed;
                players[nextUnplayedIndex] = playerB;
            }
        }
    }
}

function hasPlayedYet(player, opponent) {
    return $.inArray(opponent.name, player.alreadyPlayed) > -1;
}

function findNextUnplayed(player) {
    foundPlayer = false;
    for (var i = 0; i < players.length; i++) {
        opponent = players[i];

        if (!foundPlayer) {
            if (opponent.name == player.name) {
                foundPlayer = true;
            }
        } else {
            if (!hasPlayedYet(player, opponent)) {
                return opponent;
            }
        }
    }
}

function findNextUnplayedReverse(player) {
    foundPlayer = false;
    for (var i = players.length - 1; i >= 0 ; i--) {
        opponent = players[i];

        if (!foundPlayer) {
            if (opponent.name == player.name) {
                foundPlayer = true;
            }
        } else {
            if (!hasPlayedYet(player, opponent)) {
                return opponent;
            }
        }
    }
}

function addHandlersToCheckBoxes(aOrB, roundNumber, gameNumber) {
        
    $('#winner-checkbox-' + roundNumber + "-" + gameNumber + "-" + aOrB).change(function() {
        winnerA = $('#winner-' + roundNumber + "-" + gameNumber + "-a");
        winnerB = $('#winner-' + roundNumber + "-" + gameNumber + "-b");

        winnerAVisible = winnerA.is(':visible')
        winnerBVisible = winnerB.is(':visible')

        if (!winnerAVisible && !winnerBVisible) {
            $('#winner-' + roundNumber + "-" + gameNumber + "-" + aOrB).show();
        } else {
            $('#winner-' + roundNumber + "-" + gameNumber + "-a").toggle();
            $('#winner-' + roundNumber + "-" + gameNumber + "-b").toggle();
        }
    });
}

function playerRow(aOrB, player, roundNumber, gameNumber) {
    var html =  "<li class='list-group-item'><div class='player round" + roundNumber + "'>" + player.displayName + "</div>";
    html += "<div class='player-radio-button'><input type='radio' id='winner-checkbox-" + roundNumber + "-" + gameNumber + "-" + aOrB + "' name='round" + roundNumber + "game" + gameNumber + "' value='" + player.name + "'></div>";
    html += "<div class='winner' id='winner-" + roundNumber + "-" + gameNumber + "-" + aOrB + "'>WINNER</div><div class='padding'></div></li>"

    return html;
}

function confirmRound(roundNumber) {

    allGood = verifyResultsAreAllSet(roundNumber)
    $('#confirm-round-message-' + roundNumber).html("");
    //show warning if not all set, and return
    if (!allGood) {
        $('#confirm-round-message-' + roundNumber).append("<div class='alert alert-danger'>Need to select all winners</div>");
        return;
    };

    //save results to players
    $('[id^=winner-checkbox-' + roundNumber + ']').each(function(i, obj) {
        playerName = $(this).val();
        player = players.filter(function(object) {
            return object.name == playerName;
        })[0];

        isWinner = $(this).is(':checked');

        if(isWinner){
            player.win += 1;
        } else {
            player.lose += 1;
        }

        //save the matchups so they don't occur again
        game = $(this).attr('name');
        $('input[name=' + game + ']').each(function (i, object) {
           possibleOpponent = $(this).val();
           if (possibleOpponent != playerName) {
                player.alreadyPlayed.push(possibleOpponent);
           }
        });
    });

    $('#confirm-round' + roundNumber).hide();

    if (roundNumber < numberOfRounds) {
        getPlayersForRound(roundNumber + 1);
    }
}

function updateTable(roundNumber) {

    var html = "<div class='standings'><h3>Standings After Round " + roundNumber + "</h3>";
    html += "<table><tr><th>Position</th><th>Player</th><th>Won</th><th>Lost</th></tr>";
    for (var i = 0; i < players.length; i++) {
        html += tableRow(i + 1, players[i]);
    }

    html += "</table></div>"

    console.log(html);

    $('#table').html(html);
}

function tableRow(position, player) {
    return "<tr><td>" + position + "</td><td>" + player.displayName + "</td><td>" + player.win + "</td><td>" + player.lose + "</td></tr>";
}

function verifyResultsAreAllSet (roundNumber) {

    allSet = true;
    $('[id^=winner-checkbox-' + roundNumber + ']').each(function(i, obj) {
        game = $(this).attr('name');
        allSetForThisGroup = $('input[name=' + game + ']:checked').length == 1;
        if (!allSetForThisGroup) {
            allSet = false;
        }
    });

    return allSet;
}

function addHandlers() {


//For input buttons
//plugin bootstrap minus and plus
//http://jsfiddle.net/laelitenetwork/puJ6G/
$('.btn-number').click(function(e){
    e.preventDefault();
    
    fieldName = $(this).attr('data-field');
    type      = $(this).attr('data-type');
    var input = $("input[name='"+fieldName+"']");
    var currentVal = parseInt(input.val());
    if (!isNaN(currentVal)) {
        if(type == 'minus') {
            
            if(currentVal > input.attr('min')) {
                input.val(currentVal - 1).change();
            } 
            if(parseInt(input.val()) == input.attr('min')) {
                $(this).attr('disabled', true);
            }

        } else if(type == 'plus') {

            if(currentVal < input.attr('max')) {
                input.val(currentVal + 1).change();
            }
            if(parseInt(input.val()) == input.attr('max')) {
                $(this).attr('disabled', true);
            }

        }
    } else {
        input.val(0);
    }
});

$('.input-number').focusin(function(){
   $(this).data('oldValue', $(this).val());
});

$('.input-number').change(function() {
    minValue =  parseInt($(this).attr('min'));
    maxValue =  parseInt($(this).attr('max'));
    valueCurrent = parseInt($(this).val());
    
    name = $(this).attr('name');
    if(valueCurrent >= minValue) {
        $(".btn-number[data-type='minus'][data-field='"+name+"']").removeAttr('disabled')
    } else {
        alert('Sorry, the minimum value was reached');
        $(this).val($(this).data('oldValue'));
    }
    if(valueCurrent <= maxValue) {
        $(".btn-number[data-type='plus'][data-field='"+name+"']").removeAttr('disabled')
    } else {
        alert('Sorry, the maximum value was reached');
        $(this).val($(this).data('oldValue'));
    }
    
    
});

$(".input-number").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 190]) !== -1 ||
             // Allow: Ctrl+A
            (e.keyCode == 65 && e.ctrlKey === true) || 
             // Allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
}