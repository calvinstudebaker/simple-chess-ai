var chess;

function start(){
    chess = new Chess();
    setupBoard();
}

function isValidMove(target, validMoves){
    console.log(validMoves);
    for(var i = 0; i < validMoves.length; i++) {
        if(validMoves[i].indexOf(target) != -1){
            return true;
        }
    }
    return false;
}

function setupBoard(){
    var onDrop = function(source, target, piece, newPos, oldPos, orientation){
        var validMoves = chess.moves({square: source})
        if (!isValidMove(target, validMoves)) {
            return 'snapback'
        }
        else {
            chess.move({from: source, to: target});
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

