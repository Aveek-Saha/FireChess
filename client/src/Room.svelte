<script>
    import { db, arrayUnion, deleteField, arrayRemove } from './firebase';
    import { collectionData } from 'rxfire/firestore';
    import { startWith } from 'rxjs/operators';
    import Game from './Game.svelte';

    // User ID passed from parent
    export let uid;
    export let username;

    const query = db.collection('rooms').where('players', 'array-contains', uid).orderBy("players", "desc");
	let rooms = collectionData(query, 'id').pipe(startWith([]));;

    let roomID = "";
	let text="";


    function selectRoom(id) {
        roomID = id
    }
    function roomList() {
        roomID = "";
    }
    
	function createRoom() {
        if($rooms.length >= 5){
            alert("You've already created 5 rooms. Delete some to make room for more")
            return
        }
        db.collection('rooms').add({
            players: [uid], 
            white: {"uid": uid, "name": username}, 
            gameBoard: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 
            gameStatus: "progress" 
        });
    }

	function joinRoom() {
        if (text == "")
            return
        var docRef = db.collection("rooms").doc(text);
        text=""
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data().players.length);
                if((uid !== doc.data().white.uid) && (doc.data().players.length <= 1))
                    docRef.update({ 
                        black: {"uid": uid, "name": username},
                        players: arrayUnion(uid)
                    });
                else
                    alert("Cannot join this room")
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

    function deleteRoom(id) {
        db.collection("rooms").doc(id).delete()
    }
    
    function leaveRoom(id) {
        var docRef = db.collection("rooms").doc(id);
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                if((uid !== doc.data().white.uid) && (doc.data().players.length == 2))
                    docRef.update({ 
                        black: deleteField(),
                        players: arrayRemove(uid)
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
    <div class="col-lg-4 col-md-5 mb-3">
        <div class="card">
            <div class="card-header">
                <h5 class="card-title">Room List</h5>
            </div>
            <div class="list-group list-group-flush">
                {#each $rooms as room}
                    <button type="button" class="list-group-item list-group-item-action" 
                        on:click={() => selectRoom(room.id)}>
                        {#if room.black && room.black.uid !=uid}
                            Room with {room.black.name}
                        {:else if room.black && room.white.uid !=uid}
                            Room with {room.white.name}
                        {:else if !room.black}
                            Empty room
                        {/if}
                        {#if room.white.uid == uid}
                            <button type="button" class="btn btn-danger btn-sm float-end" 
                            on:click|stopPropagation={() => {deleteRoom(room.id)}}>
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        {:else if room.black && (room.black.uid == uid)}
                            <button type="button" class="btn btn-warning btn-sm float-end" 
                            on:click|stopPropagation={() => {leaveRoom(room.id)}}>
                                <i class="fas fa-sign-out-alt"></i>
                            </button>
                        {/if}
                    </button>
                {/each}
            </div>
        </div>
    </div>
    <div class="col-auto">
        <form>
            <div class="row g-2">
                <div class="col-auto">
                    <label for="inputText" class="visually-hidden">Room ID</label>
                    <input type="search" class="form-control" id="inputText" placeholder="Room ID" bind:value={text}>
                </div>
                <div class="col-auto">
                    <button type="button" class="btn btn-outline-primary mb-3" disabled={text==""}
                    on:click={joinRoom}>Join Room</button>
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
                        <Game id={room.id} uid={uid}/>
                {/if}
            {/each}
        </div>
    </div>
</div>

