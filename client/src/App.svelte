<script>
    import Profile from './Profile.svelte';
    import Room from './Room.svelte';

    import { auth, googleProvider, db, arrayUnion } from './firebase';
	import { collectionData } from 'rxfire/firestore';
    import { authState } from 'rxfire/auth';

    let user;
	let roomID;

    const unsubscribe = authState(auth).subscribe(u => user = u);

    function login() {
        auth.signInWithPopup(googleProvider);
    }

	function createRoom() {
        db.collection('rooms').add({
            players: [user.uid], 
            white: user.uid, 
            gameBoard: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", 
            gameStatus: "progress" 
        });
    }

	function joinRoom() {
        var docRef = db.collection("rooms").doc(roomID);
        docRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                if(user.uid !== doc.data().white)
                    docRef.update({ 
                        black: user.uid,
                        players: arrayUnion(user.uid)
                    });
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
        // db.collection('rooms').doc(roomID).update({ black: user.uid });
        // roomID = ""
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
    <input bind:value={roomID}>
    <button on:click={joinRoom}>Add Task</button>
	<Room uid={user.uid} />
{:else}
	<button on:click={login}>
		Sign in with Google
	</button>
{/if}
</section>