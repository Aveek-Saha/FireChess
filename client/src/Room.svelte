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
        text=""
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
<div class="row justify-content-around">
    <div class="col-lg-4 col-md-5">
        <div class="card">
            <div class="card-header">
                <h5 class="card-title">Room List</h5>
            </div>
            <div class="list-group list-group-flush">
                {#each $rooms as room}
                            <button type="button" class="list-group-item list-group-item-action" 
                            on:click={selectRoom(room.id)}>
                            {room.id}
                        </button>
                {/each}
            </div>
        </div>
    </div>
    <div class="col-auto">
        <form>
            <div class="row g-3">
                <div class="col-auto">
                    <label for="inputText" class="visually-hidden">Room ID</label>
                    <input type="search" class="form-control" id="inputText" placeholder="Room ID" bind:value={text}>
                </div>
                <div class="col-auto">
                    <button type="button" class="btn btn-outline-info mb-3" on:click={joinRoom}>Join Room</button>
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-auto">
                    <button type="button" class="btn btn-outline-success" on:click={createRoom}>
                        Create Room
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>


{/if}

<div class="row">
    <div class="col-12">
        {#if roomID!=""}
        <form class="row g-3 mb-3">
            <div class="col-12">
                <button type="button" class="btn btn-primary" on:click={roomList}>
                    Back
                </button>
            </div>
        </form>
        {/if}
        <div class="list-group">
            {#each $rooms as room}
                {#if roomID==room.id}
                    <div class="col-md-6 offset-md-3">
                        <Game id={room.id} uid={uid}/>
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</div>

