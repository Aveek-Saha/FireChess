<script>
    import Profile from './Profile.svelte';
    import Room from './Room.svelte';

    import { auth, googleProvider, facebookProvider, twitterProvider, githubProvider } from './firebase';
    import { authState } from 'rxfire/auth';

    let user;

    const unsubscribe = authState(auth).subscribe(u => user = u);

    function login(provider) {
        if (provider == "google")
            auth.signInWithPopup(googleProvider);
        else if (provider == "facebook")
            auth.signInWithPopup(facebookProvider);
        else if (provider == "twitter")
            auth.signInWithPopup(twitterProvider);
        else if (provider == "github")
            auth.signInWithPopup(githubProvider);
    }
</script>

<style>

.signin {
  display: flex;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
}

.form-signin {
  width: 100%;
  padding: 15px;
  margin: auto;
}

</style>

<header class="py-3 mb-3 border-bottom bg-dark text-white">
    <div class="container">
      <div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
        <span class="d-flex align-items-center mb-2 me-2 mb-lg-0 text-white text-decoration-none fs-3">
            <i class="fas fa-fire-alt"></i>
        </span>
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
        <Room uid={user.uid} username={user.displayName} />
    </div>

    {:else}
    <div class="container-fluid signin">
        <div class="text-center form-signin">
            <h1 class="h3 mb-3 fw-normal">Sign in/ Sign up</h1>
            <!-- Google -->
            <button class="btn btn-lg btn-primary" style="background-color: #dd4b39; border:none" 
            on:click={() => login("google")}>
                <i class="fab fa-google me-2"></i>Google
            </button>

            <!-- Twitter -->
            <button class="btn btn-lg btn-primary" style="background-color: #55acee; border:none"
            on:click={() => login("twitter")}>
                <i class="fab fa-twitter me-2"></i>Twitter
            </button>
    
            <!-- Github -->
            <button class="btn btn-lg btn-primary" style="background-color: #333333; border:none"
            on:click={() => login("github")}>
                <i class="fab fa-github me-2"></i>GitHub
            </button>

            <!-- Facebook -->
            <button class="btn btn-lg btn-primary" style="background-color: #3b5998; border:none"
            on:click={() => login("facebook")}>
                <i class="fab fa-facebook-f me-2"></i>Facebook
            </button>
        </div>
    </div>
    {/if}
