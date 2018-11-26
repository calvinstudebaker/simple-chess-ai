var game;
var board;

var PIECE_POINTS = {
    'p' : -1,
    'k' : -3,
    'b' : -3,
    'r' : -5,
    'q' : -9,
    'k' : -1000,
    'P' : 1,
    'K' : 3,
    'B' : 3,
    'R' : 5,
    'Q' : 9,
    'K' : 1000
}

function start(){
    setupListeners();
    newGame();
}

var setupListeners = function(){
    $('.reset-game').hide();
    $('#new-game').click(function(){
        $('.reset-game').hide();
        newGame();
    });
}

var newGame = function(){
    game = new Chess();
    board = setupBoard();
}

var gameIsOver = function(){
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

var setupBoard = function(){
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

// Return the material score of the board
// + points for white pieces
// - points for black pieces
var scoreBoard = function(asciiBoard){
    var rows = asciiBoard.split('\n');
    var score = 0;
    for(var i = 1; i < 9; i++) {
        for(var index = 0; index < rows[i].length; index++){
            var char = rows[i][index];
            var value = PIECE_POINTS[char];
            if (value != undefined){
                score += value;
            }
        }
    }
    return score;
}

// Generate all possible moves and pick the move with the optimal score
var makeComputerMove = function(){
    var possibleMoves = game.moves();
    var bestMove = null;
    var bestScore = 99999;
    for(var i = 0; i < possibleMoves.length; i++){
        game.move(possibleMoves[i]);
        var score = scoreBoard(game.ascii());
        game.undo();

        if (score < bestScore) {
            bestScore = score;
            bestMove = possibleMoves[i];
        }
    }

    game.move(bestMove);
    board.position(game.fen());
}

