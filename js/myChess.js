var game;
var board;

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
    board = setupBoard();
}

function gameIsOver(){
    return game.game_over() || game.in_draw() || game.moves().length == 0
}

var onDrop = function(source, target, piece, newPos, oldPos, orientation){
    // See if the move is legal
    // Based on http://chessboardjs.com/examples#5005
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // Always promote pawn to queen for simplicity
    });

    // Illegal move
    if (move == null) {
        return 'snapback';
    }

    else if (gameIsOver()) {
        $('.reset-game').show();
    }

    else{
        // Make computer move
        window.setTimeout(makeComputerMove, 250);
    }
};

var onDragStart = function(source, piece, position, orientation) {
    if(gameIsOver()){
        return false;
    }
};

// Update the board position after the piece snap
// to correctly show castling, en passant, pawn promotion
// http://chessboardjs.com/examples#5005
var onSnapEnd = function() {
    board.position(game.fen());
};

function setupBoard(){
    var boardConfig = {
        draggable: true,
        dropOffBoard: 'snapback',
        position: 'start',
        onDrop: onDrop,
        onDragStart: onDragStart,
        onSnapEnd: onSnapEnd,
    };
    return ChessBoard('board', boardConfig);
}

// Based on example in http://chessboardjs.com/examples#5001
var makeRandomMove = function() {
    var possibleMoves = game.moves();

    if (possibleMoves.length === 0) return;

    var randomIndex = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIndex]);
    board.position(game.fen());
};

var makeComputerMove = function(){
    makeRandomMove();
}

