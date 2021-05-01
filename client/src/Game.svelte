<script>
    import { docData } from "rxfire/firestore";
    import { db } from './firebase';

    import { onMount, createEventDispatcher } from 'svelte';

    import { Chess } from 'chess.js'

    export let id;
    export let uid;

    const dispatch = createEventDispatcher();

    let gameref = db.doc('rooms/'+id);
    let gameBoard, black = false, white = false, blackName, whiteName;
    let matchStart=false, turn;

    new ClipboardJS('.copy');

    docData(gameref).subscribe(match => {
        gameBoard = match.gameBoard
        board.position(gameBoard)
        game.load(gameBoard)
        if(match.black){
            blackName = match.black.name
            black = match.black.uid == uid
            matchStart = true
        }
        turn = game.turn()
        whiteName = match.white.name
        white = match.white.uid == uid
        if (black)
            board.orientation('black')
        else
            board.orientation('white')
    })

    var board = null
    var game = new Chess()
    var whiteSquareGrey = '#a9a9a9'
    var blackSquareGrey = '#696969'

    function removeGreySquares () {
    window.$('#myBoard'+id+ ' .square-55d63').css('background', '')
    }

    function greySquare (square) {
    var square = window.$('#myBoard'+id+ ' .square-' + square)

    var background = whiteSquareGrey
    if (square.hasClass('black-3c85d')) {
        background = blackSquareGrey
    }

    square.css('background', background)
    }

    function onDragStart (source, piece) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false

    // or if it's not that side's turn
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1) ||
        (game.turn() === 'w' && black) ||
        (game.turn() === 'b' && white)||
        !matchStart) {
        return false
    }
    }

    function onDrop (source, target) {
    removeGreySquares()

    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    })

    // illegal move
    if (move === null) return 'snapback'
    else{
            db.doc('rooms/'+id).update({ gameBoard: game.fen() });
        }
    }

    function onMouseoverSquare (square, piece) {
    // get list of possible moves for this square
    var moves = game.moves({
        square: square,
        verbose: true
    })

    // exit if there are no moves available for this square
    if (moves.length === 0) return

    // highlight the square they moused over
    greySquare(square)

    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to)
    }
    }

    function onMouseoutSquare (square, piece) {
    removeGreySquares()
    }

    function onSnapEnd () {
    board.position(game.fen())
    }

    var config = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
    }
    onMount(() => {
        board = Chessboard('myBoard'+id, config)
	});

    function goBack() {
		dispatch('goBack', { id });
	}
</script>

<style>
</style>

<div class="row">
    <div class="col-md-6 offset-md-2">
        <div id={"myBoard" + id} style="width: 80%"></div>
    </div>
    <div class="col-md-3">
        <div class="card mb-3">
            <div class="card-header">Game Status</div>
            <div class="card-body">
                {#if !matchStart}
                    <p class="card-text">Waiting for Second player to join.</p>
                    <button type="button" class="btn btn-outline-dark copy" data-clipboard-text={id}>
                        <i class="fas fa-clipboard me-2"></i>Copy Room ID
                    </button>
                {:else}
                    {#if turn === 'w'}
                        <p class="card-text">{whiteName}'s turn (White)</p>
                    {:else if turn === 'b'}
                        <p class="card-text">{blackName}'s turn (Black)</p>
                    {/if}
                {/if}
            </div>
        </div>
    </div>
</div>