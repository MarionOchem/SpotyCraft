<script>
    import { onMount } from "svelte";
    // import { allAlbums } from "../../../login/components/charts";
    import { writable } from "svelte/store";
    import html2canvas from "html2canvas";
    export const searchAlbumResult = writable([]);
    
    // Handle the changement of display of the search/option div
    import { createEventDispatcher } from 'svelte';
    const dispatchTabSelection = createEventDispatcher();

    // Global variable for the display to update automatically
    let xAxis = 5;
    let yAxis = 5;
    let gap = 10;
    let color = 'black';
    let title = '';
    let offsetX;
    let offsetY;
    let droppedItem = [];
    let noAlbumFounds = false;
    let savedAlbumData;
    let activeTab = "search";

    let storedAlbumData = sessionStorage.getItem("albumData");

    // This component is waiting for the session storage of all albums saved loaded in the charts.svelte component
    if (storedAlbumData) {
        const data = sessionStorage.getItem('albumData')
        savedAlbumData = JSON.parse(data);
        console.log(savedAlbumData);
    }

        // Draw a blank canvas at page load 
        onMount(async () => {
            drawCanvas(5, 5, 5, 'black');
        })

    
    const searchAmongAlbums = (albums, artistName) => {
        return albums.filter(album => album.artist === artistName);
    };

  
    const getInput = (event) => {
        noAlbumFounds = false;
        if (event.key === 'Enter') {
            const input = event.target.value.trim()
            searchAlbumResult.set(searchAmongAlbums(savedAlbumData, input));
            console.log("search albums result :", $searchAlbumResult)
            if ($searchAlbumResult.length === 0) {
                noAlbumFounds = true;
            }
        }
    };

    const downloadCanvas = () => {
        console.log("downloadCanvas() has been clicked")
        const screenshotTarget = document.getElementById('chart-builder');
        html2canvas(screenshotTarget).then((canvas) => {
            let base64image = canvas.toDataURL('image/png');
            console.log(base64image);
            let link = document.createElement('a');
            link.setAttribute('href', base64image);
            link.setAttribute('download', 'myTop.png');
            link.style.display = 'none';
            link.click();
        });
    };

    const refreshCanvas = () => {
        drawCanvas(5, 5, 5, 'black');
        droppedItem = [];
    }

    const drawCanvas = (xAxis, yAxis, gap, color, title) => {
        const canvas = document.getElementById("chart-canvas");
        const ctx = canvas.getContext('2d');
        let cellSize = 100 - gap / 9000; // Adjust cell size based on the gap value
        console.log("gap velue :", gap)
        console.log("cell size : ", cellSize)

        canvas.width = xAxis * cellSize;
        canvas.height = yAxis * cellSize;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let x = 0; x < xAxis; x++) {
            for (let y = 0; y < yAxis; y++) {
                ctx.fillStyle = 'white';
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize); // Draw a filled rectangle
                ctx.strokeStyle = color;
                ctx.lineWidth = gap;
                ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize); // Draw a border rectangle
            }
        }
    }


    const handleTabSelection = (tab) => {
        activeTab = tab;
        dispatchTabSelection('tabSelection', { tab });
    };

    // For search tab inputs
    const getData = () => {
        title = document.getElementById('title').value;
        let xAxis = document.getElementById('x-axis').value;
        let yAxis = document.getElementById('y-axis').value;
        let color = document.getElementById('background-color').value;
        let gap = parseInt(document.getElementById("gap").value);
        let chartCanvas = document.getElementById('chart-canvas');
        let checkBox = document.getElementById("display-infos");
        chartCanvas.style.borderColor = color;
        

        if (checkBox.checked) {
            chartCanvas.style.borderRightWidth = "300px";
        } else {
            chartCanvas.style.borderRightWidth = "10px";
        }

      

        drawCanvas(xAxis, yAxis, gap, color, title)
    };

    // Drag and Drop :
    const allowDrop = (event) => {
        event.preventDefault();
    }

    const drop = (event, artist, name) => {
        event.preventDefault();
        console.log("event from drop :", event)
        // retrieve image url, artist and name from the event drop
        event.dataTransfer.setData("text/plain", event.target.src);
        event.dataTransfer.setData("albumName", artist);
        event.dataTransfer.setData("artistName", name);
        
        droppedItem = [...droppedItem, {artist, name}];
        console.log(droppedItem)

        //get the location of the drop and translate it to the canvas coordinates 
        const canvas = document.getElementById("chart-canvas");
        const ctx = canvas.getContext('2d');
        const cellSize = 100;
        const rect = canvas.getBoundingClientRect();
        console.log("rect :", rect)
        offsetX = rect.left;
        offsetY = rect.top;
        const canvasX = event.clientX - offsetX;
        const canvasY = event.clientY - offsetY;
        const roundedCanvasX = Math.floor(canvasX / cellSize) * cellSize;
        const roundedCanvasY = Math.floor(canvasY / cellSize) * cellSize;

        // create a new image to display inside the canvas based on the retrieve url image from the drag and drop :
        const img = new Image();
        img.src = event.target.src;

        // display image :
        img.onload = function() {
        ctx.drawImage(img, roundedCanvasX, roundedCanvasY, cellSize, cellSize)
        };
    }

</script>


<main>
<div class="container">
    <ul class="nav-list">
        <li class="nav-item">
            <button class="tab-item"  on:click={() => handleTabSelection('search')} class:selected={activeTab === 'search'}>Search</button>
        </li>
        <li class="nav-item">
            <button class="tab-item" on:click={() => handleTabSelection('options')} class:selected={activeTab === 'options'}>Options</button>
        </li>
    </ul>
    {#if savedAlbumData.length > 0}
    <div class="content">
        {#if activeTab === 'search'}
            <input id="search-album" placeholder="Search album in your library" type="text" on:keyup={getInput}/>
            {#if noAlbumFounds === true}
            <p> No albums found in your library </p>
            {/if}
            <div class="scroll-bar">
                <div class="artist-grid">
                    {#each $searchAlbumResult as { cover, artist, name }}
                        <li class="artist-cover">
                            <img id="cover" src={cover} width="100px" height="100px" data-album-name={name} data-artist-name={artist} draggable="true" on:dragend={(event) => drop(event, artist, name)}>
                        </li>
                    {/each}
                </div>
            </div>
        {:else if activeTab === 'options'}
        <table class="options-table" on:input={getData}>
            <tr>
                <td>
                    <label for="title"> Title </label>
                </td>
                <td>
                    <input class="options-input" id="title" type="text" name="title">
                </td>
            </tr>
            <tr>
                <td>
                    <label for="display-infos">Display Infos</label>
                </td>
                <td>
                    <input class="options-input" id="display-infos" type="checkbox" name="display-infos">
                </td>
            </tr>
            <tr>
                <td>
                    <label for="axis-columns"> Width </label>
                </td>
                <td>
                    <span>{xAxis}</span>
                    <input class="options-input" id="x-axis" type="range" name="x-axis" min="1" max="12" bind:value={xAxis}>
                </td>
            </tr>
            <tr>
                <td>
                    <label for="axis-row"> Height </label>
                </td>
                <td>
                    <span>{yAxis}</span>
                    <input class="options-input" id="y-axis" type="range" name="y-axis" min="1" max="12" bind:value={yAxis}>
                </td>
            </tr>
            <tr>
                <td>
                    <label for="background-color"> Background Color </label>
                </td>
                <td>
                    <input class="options-input" id="background-color" type="color" name="background-color" bind:value={color}>
                </td>
            </tr>
            <tr>
                <td>
                    <label for="gap"> Gap </label>
                </td>
                <td>
                    <span>{gap}</span>
                    <input class="options-input" id="gap" type="range" min="0" max="50" name="gap" bind:value={gap}>
                </td>
            </tr>
        </table>
        {/if}
    </div>
    {/if}
</div>

<div id="chart-builder" class="chart-builder">
    <h3 id="titleDisplay">{title}</h3>
    <div class="chart-content">
        <canvas id="chart-canvas" width="1420" height="1480" on:dragover={allowDrop}/>
        <div class="panelInfo">
            {#each droppedItem as {artist, name}}
            <div>{artist} - {name}</div>
            {/each}
        </div>
    </div>
</div> 

<button id="refresh" on:click={refreshCanvas}>Refresh Top Chart</button>
<button id="download" on:click={downloadCanvas}>Download</button>

</main>


<style>

@font-face {
    font-family: "GothamCircularThin";
    src: url('static/Gotham-Light.otf') format("otf");
}

main {
 display: flex;
 justify-content: center;
 align-items: flex-end;
 height : 100vh;
 margin: 0;
}
.container {
  margin: 10px;
  width: 400px;
  text-align: center;
  position: fixed;
  top: 10vw;
  left: 5vw;
  width: 20vw;
  height: 30vw;
  border-radius: 20px;
  background-color: rgb(59, 59, 59); 
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column; /* Arrange items vertically */
  align-items: stretch; /* Center items horizontally */
  justify-content: flex-start; /* Align items to the top */
  font-family: "GothamCircularThin", sans-serif;
  color: #fff;
}

#search-album {
    width: 250px;
    height: 25px;
    margin-top: 30px;
    margin-bottom: 100px;
    resize: none;
}

ul {
    padding: 0;
    font-size: .9rem;
    margin-block-start: 1rem;
    margin-block-end: 1rem;
    padding-inline-start: 40px;
    margin-right: -1;
}

li {
    list-style-type: none;
    margin-bottom: 10px;
}

.nav-list {
    display: flex;
    margin: 0;
    padding: 0;
    width: 100%;
    gap: 4px;
}

.nav-item {
    background-color: rgb(59, 59, 59);
    list-style: none;
    border-radius: 6px 6px 0 0;
}

.tab-item {
    background-color: #b5b5b5;
    font-size: 30px;
    border: none;
    padding: 4px;
    border-radius: 6px 6px 0 0;
}

.tab-item.selected {
    background-color: rgb(59, 59, 59);
}

button {
    appearance: auto;
    text-rendering: auto;
    letter-spacing: normal;
    text-indent: 0px;
    display: inline-block;
    text-align: center;
    cursor: default;
    padding-block: 1px;
}


.content {
    text-align: left;
    max-height: 480px;
    overflow-y: auto;
    border-radius: 0 6px 6px;
    padding: 16px;
    font-size: 20px;
    display: flex;
    flex-direction: column;
    align-items: center; 
    justify-content: center; 
}

#search-album {
    position: relative;
    border-radius: 20px;
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

.artist-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1px; 
  grid-row-gap: 10px;
  list-style: none;
}

.artist-cover {
  text-align: center;
}

table {
    width: 100%;
}

tr {
    display: grid;
    grid-template-columns: 120px 1fr;
    margin: 30px 0;
    width: 100%
}

td {
    display: flex;
    align-items: center;
    margin-right: 10px
}

.options-input {
    margin-top: 20px;
    margin-left: 20px;
    padding: 2%;
}

span {
    margin-left: 50px;
}

#title {
  border-radius: 20px;
  border-style: solid;
}

input[type="color"] {
    border-width: 1px;
    width: 40px;
    height: 40px;
}

label {
    margin-left: 30px;
    display: block
}

.chart-builder {
    position: fixed;
    top: 50%;
    left: 60%;
    transform: translate(-50%, -50%);
    align-items: center;
    font-family: "GothamCircularThin", sans-serif;
    background-color: rgb(0, 0, 0);
    padding: 10px;
    border-radius: 20px;
}



#chart-canvas {
  display: grid;
  grid-template-columns: repeat(5, 100px); 
  grid-template-rows: repeat(5, 100px); 
  grid-gap: 100px;
  border-radius: 20px;
  padding-right: 10px;
}

#titleDisplay {
    font-size: 20px;
    color: white;
    margin-left: 40%;
    font-family: "GothamCircularThin", sans-serif;
}

.panelInfo {
    /* display: none; */
    width: 300px;
    min-height: 100%;
    background-color: rgb(0, 0, 0);
    font-family: "GothamCircularThin", sans-serif;
    color: white;
}

.chart-content {
    display: flex;
}

#download {
  bottom: 50px;
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
  margin-bottom: 70px;
  margin-left: 50px;  

}

#download:hover {
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.5);
}

#refresh {
  bottom: 50px;
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
  left: 50%;
  border-top: 20px;
  margin-bottom: 70px;
}

#refresh:hover {
    box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.5);
}

</style>