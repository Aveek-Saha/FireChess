<script>
    import { db } from './firebase';
    import { collectionData } from 'rxfire/firestore';
    import { startWith } from 'rxjs/operators';
    import Game from './Game.svelte';

    // User ID passed from parent
    export let uid;

    const query = db.collection('rooms').where('players', 'array-contains', uid)
	let rooms = collectionData(query, 'id').pipe(startWith([]));;

    let roomID = "";

    function selectRoom(id) {
        roomID = id
        console.log(id);
    }
    function roomList() {
        roomID = "";
    }

    
</script>

<style>
</style>


{#each $rooms as room}
    <br>
    {#if roomID==""}
        <button on:click={selectRoom(room.id)}>
            {room.id}
        </button>
    {/if}
    {#if roomID==room.id}
        <button on:click={roomList}>
            Back
        </button>
    {/if}
    {#if roomID==room.id}
        <Game id={room.id} uid={uid}/>
    {/if}
{/each}
