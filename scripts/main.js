players=[]
numberOfPlayers = 0
numberOfRounds = 0

function go() {
    $('#input-container').slideToggle("slow", setup());
}

function setup() {
    // $('#restartBox').toggle();

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
        $('#names').append(buildPlayerBox(player.name));
    });

    // add button to finalise
    $('#names').append('<div><button type="button" class="btn btn-default" onclick="finalise()">Start</button></div>');

}

function buildPlayerBox(name) {
    return '<div class="playername"><input type="text" class="form-control" value="' + name + '"></div>';
}

function buildPlayer(i){
     return {name:"Player " + i, win:0, lose:0, draw:0};
}

function finalise() {

    $('.playername').each(function(i, obj) {
        players[i].name = $(this).find("input").val();
    });

    $('#names-container').animate({width:'toggle'},700, getPlayersForRound(1));

}

function getPlayersForRound(roundNumber) {

    html ='<div class="round"><h3>Round ' + roundNumber + '</h3>';

    // todo - shuffle to make sure people don't play same opposition twice
        b = players[5];
        players[5] = players[0];
        players[0] = b;
    //

    players.forEach(function(player) {
        console.log(player.name);
    });

    games = numberOfPlayers / 2;

    html += "<div class='panel-group'>";

    for(var i=1; i <= games; i++) {
        html += "<div class='panel panel-default matchup'>";
        html += "<div class='panel-heading'>Game " + i + "</div>";
        html += "<ul class='list-group'>";

        playerA = players[(i*2) - 2];
        playerB = players[(i*2) - 1];

        html += playerRow('a', playerA.name, roundNumber, i);
        html += playerRow('b', playerB.name, roundNumber, i);
        html += "</div>";

    }

    html += "</div><div id='confirm-round" + roundNumber + "''><button class='btn btn-default' onclick='confirmRound(" + roundNumber + ")'>Confirm Results</button></div></div>";
    $('#bracket').append(html);


    for(var i=1; i <= games; i++) {

        addHandlersToCheckBoxes('a', roundNumber, i);
        addHandlersToCheckBoxes('b', roundNumber, i);
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

function playerRow(aOrB, playerName, roundNumber, gameNumber) {
    html =  "<li class='list-group-item'><div class='player'>" + playerName + "</div>";
    html += "<div class='player-radio-button'><input type='radio' id='winner-checkbox-" + roundNumber + "-" + gameNumber + "-" + aOrB + "' name='game" + gameNumber + "' value='" + playerName + "'></div>";
    html += "<div class='winner' id='winner-" + roundNumber + "-" + gameNumber + "-" + aOrB + "'>WINNER</div><div class='padding'></div></li>"

    return html;
}

function confirmRound(roundNumber) {

    //todo - verify all results have been set

    // save results to players
    $('.player').each(function(i, obj) {
        playerName = $(this).html();
        // playerIndex = getPlayerIndex(playerName);
        // players[playerIndex].win += 1;

    });

    //todo - save the matchups so they don't occur again

    $('#confirm-round' + roundNumber).hide();

    getPlayersForRound(roundNumber + 1);
}

function addHandlers() {


    go();

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