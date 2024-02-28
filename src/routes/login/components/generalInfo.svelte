<script>
import  { onMount } from 'svelte'
import { authStore } from '$lib/urlParams'
import { currentTopTrack, currentTopArtist, tracksFeature, topArtists, topTracks } from '../api/currentData'

 // For futur use : sessionStorage for data topArtist and topTracks initialize in this component
    // let storedTopArtist = sessionStorage.getItem("topArtist");
    // let storedTopTracks = sessionStorage.getItem("topTracks");

// Handle the opening of the Custom Top side popup
import { createEventDispatcher } from 'svelte';
const dispatchPopup = createEventDispatcher();

const openPopup = () => {
      dispatchPopup('showOverlay');
}

let access_token;

$:  {
      access_token = $authStore.access_token;
      // console.log("access token in generalInfo:", access_token)
    }

    onMount(async () => {
        try {
          
          console.log("top track length :", $topTracks.length)
            await currentTopTrack(access_token);
            await currentTopArtist(access_token);
            
            // get the audio features of top 10 tracks for further uses
              for (const item of $topTracks) {
                const result = await tracksFeature(access_token, item.id)
                item.feature = result 
              }

       
      console.log("Final topArtist  inside generalInfo :", $topArtists)
      console.log("Final topTracks inside generalInfo :", $topTracks)
      
        } catch (error) {
            console.error("Error in the fetching of current artist and/or tracks :", error)
        }
    });

</script>

<div class="container">
  <div class="dynamic-content">
    <div>
      {#if $topArtists.length > 0}
        <h3>Your top Artists</h3>
        <div class="artist-grid">
          {#each $topArtists as { image, name }}
            <li class="artist-item">
              <img src={image} width="100px" height="100px">
              <br>
              <br>
              {name}
            </li>
          {/each}
        </div>
      {/if}
    </div>
    <br>
    <br>
    <div>
      {#if $topTracks.length > 0}
        <h3>Your top Tracks</h3>
        <div class="artist-grid">
          {#each $topTracks as { image, name, artist }}
            <li class="artist-item">
              <img src={image} width="100px" height="100px">
              <br>
              <br>
              {name}
              <br>
              {artist}
            </li>
          {/each}
        </div>
      {/if}
    </div>
    <button on:click={openPopup} class="learn_button">Learn More</button>
  </div>
</div>


<style>
   @font-face {
    font-family: "GothamCircularThin";
    src: url('static/Gotham-Light.otf') format("otf");
}

.container {
  margin-right: 20px;;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 30vw;
  height: 80vw;
  background-color: transparent;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column; /* Arrange items vertically */
  align-items: stretch; /* Center items horizontally */
  justify-content: flex-start; /* Align items to the top */
  font-family: "GothamCircularThin", sans-serif;
  color: #fff;
}

.dynamic-content {
  width: 100%; 
  height: 100%;
  padding: 5px; 
}

.chart-container {
  display: flex;
  margin: 30px;
}


ul {
  list-style: none;
  padding: 0; 
}

h3 {
  margin-top: 30px;
  margin-bottom: 30px; 
}

.artist-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); 
  grid-gap: 5px; 
  list-style: none;
}

.artist-item {
  text-align: center;
}

li {
  margin-bottom: 20px; 
  margin-right: 20px;
}

.learn_button{
  position: relative;
  padding: 15px 50px;
  border-radius: 20px;
  background-color: #1DB954;
  color: #fff;
  font-weight: bold;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  border: none;
  outline: none;
  cursor: pointer;
  transition: box-shadow 0.3s;
  left: 40%;
  border-top: 20px;
}

.learn_button:hover {
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.5);
}
</style>