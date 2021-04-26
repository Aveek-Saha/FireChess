<script>
    import { db } from './firebase';
    import { collectionData } from 'rxfire/firestore';
    import { startWith } from 'rxjs/operators';

    import { onMount } from 'svelte';

    import { Chess } from 'chess.js'

    // User ID passed from parent
    export let uid;

    const query = db.collection('rooms').where('white', '==', uid)
	let roomID = collectionData(query, 'id').pipe(startWith([]));;

    var board = null
    var game = new Chess()
    var whiteSquareGrey = '#a9a9a9'
    var blackSquareGrey = '#696969'

    function removeGreySquares () {
    window.$('#myBoard .square-55d63').css('background', '')
    }

    function greySquare (square) {
    var square = window.$('#myBoard .square-' + square)

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
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
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
        board = Chessboard('myBoard', config)
	});
</script>

<style>
</style>


<h3>Hi 
    {#each $roomID as todo}

    {todo.id}<br>
    
    {/each}
</h3>
<h3>Hi { uid }</h3>

<div id="myBoard" style="width: 400px"></div>