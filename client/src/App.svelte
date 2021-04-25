<script>
    import Profile from './Profile.svelte';
    import Game from './Game.svelte';

    import { auth, googleProvider, db } from './firebase';
	import { collectionData } from 'rxfire/firestore';
    import { authState } from 'rxfire/auth';

    let user;
	let roomID;

    const unsubscribe = authState(auth).subscribe(u => user = u);

    function login() {
        auth.signInWithPopup(googleProvider);
    }

	function createRoom() {
        db.collection('rooms').add({ white: user.uid, gameBoard: "blank", gameStatus: "progress" });
    }

	function joinRoom(event) {
        const { id, newStatus } = event.detail;
        db.collection('todos').doc(id).update({ complete: newStatus });
    }
</script>


<section>
{#if user}
    <Profile {...user} />
    <button on:click={ () => auth.signOut() }>Logout</button>
    <hr>
	<button on:click={createRoom}>
		Create Room
	</button>
	<Game uid={user.uid} />
{:else}
	<button on:click={login}>
		Sign in with Google
	</button>
{/if}
</section>