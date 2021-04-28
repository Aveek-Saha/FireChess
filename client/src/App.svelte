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
<style>
    
</style>
<header class="py-3 mb-3 border-bottom bg-dark text-white">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
  
        <ul class="nav col-12 col-sm-auto me-sm-auto mb-2 justify-content-center mb-md-0">
            <span class="fs-4">Fire Chess</span>
        </ul>
  
        {#if user}
        <div class="dropdown text-end">
          <a href="#" class="d-block link-secondary text-decoration-none dropdown-toggle" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="true">
            <img src={ user.photoURL } alt="mdo" width="32" height="32" class="rounded-circle">
          </a>
          <ul class="dropdown-menu text-small" aria-labelledby="dropdownUser1" style="position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate(-110px, 34px);" data-popper-placement="bottom-end">
            <li><span class="dropdown-item" >Hi { user.displayName }!</span></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" on:click={ () => auth.signOut() }>Logout</a></li>
          </ul>
        </div>
        {/if}
      </div>
    </div>
  </header>


    {#if user}
    <!-- <Profile {...user} /> -->
    <div class="container-fluid">
        <Room uid={user.uid} />
    </div>

    {:else}
    <div class="container-fluid">
    <button on:click={login}>
            Sign in with Google
        </button>
    </div>
    {/if}
