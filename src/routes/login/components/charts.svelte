<script>
    import  { onMount } from 'svelte'
    import { authStore } from '$lib/urlParams'
    import { orderChronologically } from "$lib/diggingActivity"
    import { renderChart } from '$lib/renderChart'
    import { renderGenre } from '$lib/topGenre'
    import { radarChart } from '$lib/radarChart'
    import { renderMood } from "$lib/mood"
    import { getAllAlbums, mediumTopArtist } from '../api/moreData'
    import { topTracks, topArtists } from '../api/currentData'
    import { writable } from 'svelte/store';

    export const allAlbums = writable([]);
    export const MTopArtists = writable({});

    // Check if their is data in the localStorage "albumData"
    let storedAlbumData = sessionStorage.getItem("albumData");
    let storedMediumTopArtist = sessionStorage.getItem("mediumArtist");

    let access_token;

    $: {
        access_token = $authStore.access_token;
        // console.log("access token inside moreInfo:", access_token)
        }

    // Global variable for the display to update automatically 
    let ctxDate;
    let ctxGenreRadar;
    let ctxGenre;
    let ctxMood;
    let mediumArrayGenre = [];
    let currentArrayGenre= [];
    let arrayKey = [];
    let resultGenre;
    let arrayGenre = [];

onMount (async () => {


    try {
// [1] Chart to represent digging activity from the beginning of the user's spotify account :
        if (!storedAlbumData) {
            const result = await getAllAlbums(access_token)
            console.log("result :", result)
            allAlbums.set(result);
            // store the data that is in $allAlbum into localStorage
            sessionStorage.setItem('albumData', JSON.stringify(result))
        } else {
            storedAlbumData = sessionStorage.getItem('albumData');
            const data = JSON.parse(storedAlbumData)
            allAlbums.set(data);
        }
        

    console.log("albums info in moreInfo :", $allAlbums);
    console.log("$topArtists inside more info from store :", $topArtists)

        
        const addedDate = [];
        $allAlbums.forEach(album => {
            addedDate.push(album.added)
        });
        const sortedDates = orderChronologically(addedDate);
        const labelsDate = Object.keys(sortedDates);
        const dataDate = Object.values(sortedDates);
        renderChart(labelsDate, dataDate, ctxDate, "line", "amount of music digging");


// [2] Chart to represent the difference of top genre between past 6 month and current 4 weeks :

        if (!storedMediumTopArtist) {
            const resultMedium = await mediumTopArtist(access_token);
            MTopArtists.set(resultMedium);
            sessionStorage.setItem("mediumArtist", JSON.stringify(resultMedium))
            console.log($MTopArtists)
        } else {
            storedMediumTopArtist = sessionStorage.getItem("mediumArtist");
            const data2 = JSON.parse(storedMediumTopArtist)
            MTopArtists.set(data2);
        }

    $MTopArtists.forEach(artist => {
        mediumArrayGenre.push(...artist.genre)
    });
    const mediumResultGenre = renderGenre(mediumArrayGenre, 5)
    const mediumLabelsGenre = Object.keys(mediumResultGenre)
    const mediumDataGenre = Object.values(mediumResultGenre);

    $topArtists.forEach(artist => {
        currentArrayGenre.push(...artist.genre)
    })
    const currentResultGenre = renderGenre(currentArrayGenre, 5);
    const currentLabelsGenre = Object.keys(currentResultGenre);
    const currentDataGenre = Object.values(currentResultGenre)

    const allGenre = [...currentLabelsGenre, ...mediumLabelsGenre];
    const labels = [...new Set(allGenre)];
    radarChart(labels, currentDataGenre, mediumDataGenre, ctxGenreRadar)


// [3] Chart to represent a mood tracker based on the data of the current top song :
    $topTracks.forEach(track => {
        arrayKey.push(track.feature.key)
      })
      const topMood = renderMood(arrayKey, 4)
      const labelsMood = Object.keys(topMood);
      const dataMood = Object.values(topMood);
      renderChart(labelsMood, dataMood, ctxMood, 'doughnut', "% of emotion")

// [4] Chart to represent the top 5 genre of the user current listening behavior :
      $topArtists.forEach(artist => {
          arrayGenre.push(...artist.genre)
        })
        resultGenre = renderGenre(arrayGenre, 5)

        const labelsGenre = Object.keys(resultGenre);
        const dataGenre = Object.values(resultGenre);
        renderChart(labelsGenre, dataGenre, ctxGenre, "polarArea", "% of genre");


    } catch (error) {
        console.error("Error in the fetching of all albums :", error)
    }


});

</script>



<div class="chart-container">
    <canvas id="myChartData" width="300" height="300" bind:this={ctxDate}></canvas>
    <canvas id="myChartGenreRadar" width="300" height="300" bind:this={ctxGenreRadar}></canvas>
    <canvas id="myChartGenre" width="300" height="300" bind:this={ctxGenre}></canvas>
    <canvas id="myChartMood" width="300" height="300" bind:this={ctxMood}></canvas>
</div>



<style>
.chart-container {
        position: fixed;
        display: grid;
        grid-template-columns: repeat(2, 1fr); 
        grid-template-rows: repeat(2, 1fr);
        grid-gap: 200px; 
        left: 20%;
        width: 40%; 
        height: 40%; 
}

.chart-container canvas {
        width: 100%;
        height: 100%; 
        max-width: 400px; 
        max-height: 400px;
}
</style>





