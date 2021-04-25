<script>
    import { db } from './firebase';
    import { collectionData } from 'rxfire/firestore';
    import { startWith } from 'rxjs/operators';

    // User ID passed from parent
    export let uid;

    const query = db.collection('rooms').where('white', '==', uid)
	let roomID = collectionData(query, 'id').pipe(startWith([]));;
</script>

<style>
</style>


<h3>Hi 
    {#each $roomID as todo}

    {todo.id}<br>
    
    {/each}
</h3>
<h3>Hi { uid }</h3>
