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

        playerA = players[(i*2) - 2];
        playerB = players[(i*2) - 1];
        console.log("game: " + i);
        console.log("a: " + playerA.name);
        console.log("b: " + playerB.name);

        html += playerRow(playerA.name, i);
        html += playerRow(playerB.name, i);
        html += "</div>";

    }

    html += "</div></div>";
    $('#bracket').append(html);

}

function playerRow(playerName, gameNumber) {
    html =  "<div class='player panel-body'><div class='player'>" + playerName + "</div>";
    html += "<div class='player-radio-button'><input type='radio' name='game" + gameNumber + "'></div></div>"
    return html;
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