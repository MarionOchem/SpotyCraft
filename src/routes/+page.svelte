<script>
    import { login } from '$lib/login'
 
    const handleClick = () => {
        login()
    } 
</script>


<main class="container">
    <h1>SpotyCraft</h1>
    <div class="logo">
        <img src="/spotify_logo.png" alt="Connect to your personal Spotify dashboard" on:click={handleClick}> 
    </div>
</main>


<style>
.container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0); 
  z-index: 0; 
}

@font-face {
    font-family: "GothamCircularBold";
    src: url('static/Gotham-Bold.otf') format("otf");
}

h1 {
    position: fixed;
    left: 35%;
    font-family: "GothamCircularBold", sans-serif;
    color: white;
    font-size: 50px;
}
.logo {
  display: flex;
  justify-content: center;
  align-items: center; 
  height: 100%;
}

img {
  width: 600px;
  height: auto;
  top: 50%;
}
</style>