<script>
    import { onMount } from "svelte"
    import { authStore } from '$lib/urlParams'
    import { playlistList, getThisPlaylistTrack } from "../api/searchTopData"
    import { allTopTracks, overallTopTracks } from '../api/searchTopData'
    import { writable } from "svelte/store";
    let playlistStore = writable([]);
    let top_tracks = writable([]);

    export let showSidePanel;

    let access_token;
    let formSubmit = false; 

    $: {
        access_token = $authStore.access_token;
        // console.log("access token in searchTop :", access_token)
       }
    
    // Global variable for the display to update automatically 
    let selectedArtist = [];
    let selectedPlaylist = [];
    let allPlaylistTracks = [];
    let artistInput = false;
    let playlistInput = false;
    let filteredTopTracks = [];


       // Prevent the submit form to trigger when pressing enter in the artist and playlist selection input
       const stopPropagation = (event) => {
        if (event.key === "Enter") {
        event.preventDefault();
      }
      }

    const getInput = (event) => {
      if (event.key === 'Enter') {
        const inputId = event.target.id;
        const inputValue = event.target.value.trim();
        // Handle artist input
        if (inputId === 'artist-name' && inputValue !== '') {
          selectedArtist = [...selectedArtist, inputValue];
          console.log("selectedArtist :", selectedArtist)
          artistInput = true;
          // Handle playlist input
        } else if (inputId === 'playlist-name' && inputValue !== '') {
          selectedPlaylist = [...selectedPlaylist, inputValue];
          console.log("selectedPlaylist :", selectedPlaylist)
          playlistInput = true;
        }
        event.target.value = "";        
      }
    }

    const submitForm = async (event) => {

        let numOfIterations = event.target.elements["iterations"].value;

        // at submitForm,  create a new store to modify the data of full playlist array while keeping the latter intact 
        $top_tracks = $overallTopTracks;

        // [1] modify top_tracks store based selectedArtist | nb : better optimisation if performing the filtering outside of the store and then update it
        $top_tracks = $top_tracks.filter(item => !selectedArtist.includes(item.artist));
        console.log("top_tracks after filtering input artist : ", $top_tracks)

        // [2] modify top_tracks store based on selectedPlaylist
        // [2.1] Get the data of all the tracks contained in the selected playlist of the user input
        console.log("$playlistStore at the moment of iterating :", $playlistStore)
          for (let playlist of $playlistStore) {
            for (let playlistName of selectedPlaylist) {
              if (playlist.name === playlistName) {
                let thisPlaylistTracks = await getThisPlaylistTrack(access_token, playlist.id);
                console.log("thisPlaylistTracks :", thisPlaylistTracks);
                // Concatenate the matche result inside an array : all tracks of all selected playlist. 
                allPlaylistTracks = [...allPlaylistTracks, thisPlaylistTracks];
              };
            };
          };
          // This variable is an array containing tracks content of all the playlist that have matched with user input
          console.log("allPlaylistTracks :", allPlaylistTracks)
          
          // [2.2] Compare data obtained with 2.1 with the top_tracks store and suppress the matches
          filteredTopTracks = $top_tracks.filter(track => {
            // Check if any track in flatAllPlaylistTracks matches the name of the current track
            const hasMatch = allPlaylistTracks.some(trackItem => {
              return trackItem.some(item => item.track === track.name);
            });
          // Return true to keep the track if there's no match, false otherwise
          return !hasMatch;
          });
          console.log("filteredTopTracks after filtering playlists : ", filteredTopTracks)

        // cut the result top from the end to match the top length of the input :
        if (filteredTopTracks.length > numOfIterations) {
          const numToRemove = filteredTopTracks.length - numOfIterations;
          filteredTopTracks.splice(- numToRemove);
        }
        console.log("new top after filtering artist name and playlist name: ", filteredTopTracks);
        formSubmit = true;
    };

      // Clear all computed data for the next custom top
      const refreshCustomTop = () => {
        top_tracks.set([]);
        selectedArtist = [];
        selectedPlaylist = [];
        allPlaylistTracks = [];
        filteredTopTracks = [];
        // console.log("result of refresh button/function :", $top_tracks, selectedArtist, selectedPlaylist, allPlaylistTracks)
      }
       

    onMount(async () => {
            try {
            
            const playlistsInfo = await playlistList(access_token);
            playlistStore.set(playlistsInfo);
            console.log("$playlistStore inside onMount :", $playlistStore)
            
            // fetch allTopTracks and store it inside a store onMount to limit loading time
            await allTopTracks(access_token);
            top_tracks.set($overallTopTracks)
            console.log("Initial store $top_tracks :", $top_tracks);
            

            } catch (error) {
                console.error("Error while mounting search top component :", error)
            }

    });
</script>


<div class="sidePanel" class:visible={showSidePanel}>

    <h3>Custom Top</h3>
    <div class="selectedInputWrapper">
      <div class="selectedArtist">
        {#if artistInput === true}
          <h4>Selected Artists</h4>
            {#each selectedArtist as artist}
            <li>{artist}</li>
            {/each}
        {/if}
      </div>

      <div class="selectedPlaylist">
        {#if playlistInput === true}
          <h4>Selected Playlist</h4>
          {#each selectedPlaylist as playlist}
          <li>{playlist}</li>
          {/each}
        {/if}
      </div>
    </div>
   
    <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
    <form class="form" on:keydown={stopPropagation} on:submit|preventDefault={submitForm}>

        <label for="iterations"> Top Length </label>
        <select id="iterations" name="iterations">
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="80">80</option>
        </select>

      <div class="input">
        <div class="input-box">
            <label for="artist-name">Artist</label>
            <input id="artist-name" name="artist-name" type="text" on:keyup={getInput} />
        </div> 
        <div class="input-box">   
            <label for="playlist-name">Playlist</label>
            <input id="playlist-name" name="playlist-name" type="text" on:keyup={getInput}  />
        </div>
      </div>

        <button id="submitButton" type="submit"> Load </button>
    </form>


    <div class="scroll-bar">
        {#if formSubmit && filteredTopTracks.length > 0}
        <div class="artist-grid">
          {#each filteredTopTracks as { cover, name, artist }}
            <li class="artist-item">
              <img src={cover} width="100px" height="100px">
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

    <button id="refreshButton" on:click={refreshCustomTop}>Refresh</button>

</div>





<style>
@font-face {
    font-family: "GothamCircularThin";
    src: url('static/Gotham-Light.otf') format("otf");
}

@keyframes slideRightToLeft {
    from { right: -40vw; } /* Start from the right */
    to { right: 0; } /* Move towards the left */
}

.sidePanel {
    position: fixed; 
    top: 10vw;
    bottom: 0;
    left: 20vw;
    width: 0;
    height: 30vw;
    background-color: rgb(59, 59, 59); 
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.555);
    display: flex;
    font-family: "GothamCircularThin", sans-serif;
    text-align: center;
    flex-direction: column;
    align-items: center; 
    color: #fff;
    z-index: 100;
    border-radius: 20px;
    visibility: visible;
    overflow-x: hidden;
    transition: width 0.5s ease, right 0.5s ease;
}

.sidePanel.visible {
    display: flex;
    right: 0;
    width: 40vw;
    visibility: visible;
    animation: slideRightToLeft 0.5s ease;
}


label {
  font-size: 15px;
}

.sidePanel h3 {
    margin-top: 20px;
    margin-bottom: 30px;
    text-align: center;
}

.sidePanel label {
    display: inline-block;
    margin-bottom: 10px;
}

#iterations {
  margin-bottom: 30px;
}

.sidePanel form {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.sidePanel input {
    display: inline-block;
    padding: 10px; 
    border: 1px solid #ccc; 
    border-radius: 20px; 
    outline: none;
    margin: 10px; 
}

.form {
  width: 60%;
  margin-bottom: 100px;
}

h3 {
  font-size: 25px;
}

.selectedInputWrapper {
  width: 95%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.selectedArtist {
  margin-left: 40px;
  list-style: none;
}

.selectedPlaylist {
  margin-right: 40px;
  list-style: none;
}


.sidePanel button:hover {
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.5);
}

.scroll-bar {
    overflow-y: auto; /* or overflow-y: scroll; */
    max-height: 400px; /* or adjust height as needed */
}

/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1; 
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #1DB954;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #1DB954; 
}

#iterations {
  width: 55px;
  height: 55px;
  border-radius: 100px;
}

#submitButton {
  padding: 10px 50px;
    border-radius: 20px;
    background-color: #1DB954;
    color: #fff;
    font-weight: bold;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    border: none;
    outline: none;
    cursor: pointer;
    transition: box-shadow 0.3s;
    margin-top: 10px; 
}

#refreshButton {
  position: relative;
  padding: 10px 50px;
    border-radius: 20px;
    background-color: #1DB954;
    color: #fff;
    font-weight: bold;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
    border: none;
    outline: none;
    cursor: pointer;
    transition: box-shadow 0.3s;
    margin-top: 10px; 
    bottom: 0;
  margin-bottom: 10px;
}

select {
  font-family: "GothamCircularThin", sans-serif;
  font-size: 20px;
}

.input {
  display: flex;
  justify-content: space-between;
}

.input-box {
  display: flex; 
  flex-direction: column;
  flex: 1;
  margin: 0 30px;
}


.input-box label {
  margin-bottom: 5px;
}

.artist-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* Five columns */
  grid-gap: 5px; /* Adjust gap between items */
  grid-row-gap: 50px;
  list-style: none;
}

.artist-item {
  text-align: center;
}
</style>
