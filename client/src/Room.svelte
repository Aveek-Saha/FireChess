<script>
    import { db, arrayUnion } from './firebase';
    import { collectionData } from 'rxfire/firestore';
    import { startWith } from 'rxjs/operators';
    import Game from './Game.svelte';

    // User ID passed from parent
    export let uid;

    const query = db.collection('rooms').where('players', 'array-contains', uid)
	let rooms = collectionData(query, 'id').pipe(startWith([]));;

    let roomID = "";
	let text;


    function selectRoom(id) {
        roomID = id
        console.log(id);
    }
    function roomList() {
        roomID = "";
    }
    
	function createRoom() {
        db.collection('rooms').add({
            players: [uid], 
            white: uid, 
            gameBoard: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 
            gameStatus: "progress" 
        });
    }

	function joinRoom() {
        var docRef = db.collection("rooms").doc(text);
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                if(uid !== doc.data().white)
                    docRef.update({ 
                        black: uid,
                        players: arrayUnion(uid)
                    });
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

    
</script>

<style>
</style>

{#if roomID==""}
    <button on:click={createRoom}>
        Create Room
    </button>
    <input bind:value={text}>
    <button on:click={joinRoom}>Join Room</button>
{/if}

{#each $rooms as room}
    <br>
    {#if roomID==""}
        <button on:click={selectRoom(room.id)}>
            {room.id}
        </button>
    {/if}
    {#if roomID==room.id}
        <br>
        <button on:click={roomList}>
            Back
        </button>
    {/if}
    {#if roomID==room.id}
        <Game id={room.id} uid={uid}/>
    {/if}
{/each}
