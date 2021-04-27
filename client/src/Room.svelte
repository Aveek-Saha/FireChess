<script>
    import { db } from './firebase';
    import { collectionData } from 'rxfire/firestore';
    import { startWith } from 'rxjs/operators';
    import Game from './Game.svelte';

    // User ID passed from parent
    export let uid;

    const query = db.collection('rooms').where('players', 'array-contains', uid)
	let rooms = collectionData(query, 'id').pipe(startWith([]));;

    
</script>

<style>
</style>


{#each $rooms as room}
<h3> {room.id} </h3>
<Game id={room.id} />

{/each}
