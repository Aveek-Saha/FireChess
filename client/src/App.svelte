<script>
    import Profile from './Profile.svelte';
    import Room from './Room.svelte';

    import { auth, googleProvider } from './firebase';
    import { authState } from 'rxfire/auth';

    let user;

    const unsubscribe = authState(auth).subscribe(u => user = u);

    function login() {
        auth.signInWithPopup(googleProvider);
    }
</script>


<section>
{#if user}
    <Profile {...user} />
    <button on:click={ () => auth.signOut() }>Logout</button>
    <hr>
	<Room uid={user.uid} />
{:else}
	<button on:click={login}>
		Sign in with Google
	</button>
{/if}
</section>