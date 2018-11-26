var game;

function start(){
    setupListeners();
    newGame();
}

function setupListeners(){
    $('.reset-game').hide();
    $('#new-game').click(function(){
        $('.reset-game').hide();
        newGame();
    });
}

function newGame(){
    game = new Chess();
    setupBoard();
}

function isValidMove(target, validMoves){
    for(var i = 0; i < validMoves.length; i++) {
        if(validMoves[i].indexOf(target) != -1){
            return true;
        }
    }
    return false;
}

function setupBoard(){
    var onDrop = function(source, target, piece, newPos, oldPos, orientation){
        var validMoves = game.moves({square: source})
        if (!isValidMove(target, validMoves)) {
            return 'snapback'
        }
        else {
            game.move({from: source, to: target});
            if(game.game_over() || game.in_draw() || game.moves().length == 0){
                $('.reset-game').show();
            }
        }
    };

    var boardConfig = {
        draggable: true,
        dropOffBoard: 'snapback',
        position: 'start',
        onDrop: onDrop,
    };
    var board = ChessBoard('board', boardConfig);
}

