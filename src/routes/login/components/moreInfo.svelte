<script>
// A ready-to-use large popup for further uses 

    import  { onMount } from 'svelte'
    import { authStore } from '$lib/urlParams'

    export let showOverlay = false;
    

    let access_token;
    $: {
        access_token = $authStore.access_token;
        // console.log("access token inside moreInfo:", access_token)
       }

    const closePopup = () => {
        showOverlay = false;
    }


</script>


<div class="overlay" class:visible={showOverlay}>
    <div class="popup">
        <div class="popup-content"> 
            <svg id="closePopup" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="64" height="64" viewBox="0,0,256,256" style="fill:#000000;" on:click={closePopup}>
            <g fill-opacity="0" fill="#20c997" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path d="M128,240.64c-62.20935,0 -112.64,-50.43065 -112.64,-112.64v0c0,-62.20935 50.43065,-112.64 112.64,-112.64v0c62.20935,0 112.64,50.43065 112.64,112.64v0c0,62.20935 -50.43065,112.64 -112.64,112.64z" id="shape"></path></g><g fill="none" fill-rule="nonzero" stroke="none" stroke-width="none" stroke-linecap="butt" stroke-linejoin="none" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" style="mix-blend-mode: normal"><path transform="scale(2,2)" d="M105,23c11,10.9 17,25.5 17,41c0,15.5 -6,30 -17,41c-10.9,11 -25.5,17 -41,17c-15.5,0 -30,-6 -41,-17c-11,-10.9 -17,-25.5 -17,-41c0,-15.5 6,-30.1 17,-41c10.9,-11 25.5,-17 41,-17c15.5,0 30.1,6 41,17z" id="strokeMainSVG" fill="#dddddd" stroke="#dddddd" stroke-width="3" stroke-linejoin="round"></path><g transform="scale(2,2)" fill="#000000" stroke="none" stroke-width="1" stroke-linejoin="miter"><path d="M64,6c-15.5,0 -30.1,6 -41,17c-11,10.9 -17,25.5 -17,41c0,15.5 6,30.1 17,41c11,11 25.5,17 41,17c15.5,0 30.1,-6 41,-17c11,-11 17,-25.5 17,-41c0,-15.5 -6,-30.1 -17,-41c-10.9,-11 -25.5,-17 -41,-17zM64,12c13.9,0 26.90078,5.39922 36.80078,15.19922c9.9,9.8 15.19922,22.90078 15.19922,36.80078c0,13.9 -5.39922,26.90078 -15.19922,36.80078c-9.9,9.8 -22.90078,15.19922 -36.80078,15.19922c-13.9,0 -26.90078,-5.39922 -36.80078,-15.19922c-9.9,-9.8 -15.19922,-22.90078 -15.19922,-36.80078c0,-13.9 5.39922,-26.90078 15.19922,-36.80078c9.8,-9.9 22.90078,-15.19922 36.80078,-15.19922zM50.5625,47.5c-0.7625,0 -1.5125,0.30039 -2.0625,0.90039c-1.2,1.2 -1.2,3.09922 0,4.19922l11.30078,11.40039l-11.40039,11.30078c-1.2,1.2 -1.2,3.09922 0,4.19922c0.6,0.6 1.39961,0.90039 2.09961,0.90039c0.7,0 1.49961,-0.30039 2.09961,-0.90039l11.40039,-11.30078l11.30078,11.30078c0.6,0.6 1.39961,0.90039 2.09961,0.90039c0.7,0 1.49961,-0.30039 2.09961,-0.90039c1.2,-1.2 1.2,-3.09922 0,-4.19922l-11.30078,-11.30078l11.30078,-11.30078c1.2,-1.2 1.19961,-3.09883 0.09961,-4.29883c-1.2,-1.2 -3.09922,-1.2 -4.19922,0l-11.40039,11.40039l-11.30078,-11.40039c-0.6,-0.6 -1.37422,-0.90039 -2.13672,-0.90039z"></path></g></g>
            </svg>
        </div> 
    </div>
</div>




<style>
    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.582); /* Greyish overlay */
        z-index: 999; /* Ensure the overlay is above other content */
        display: none; 
    }

    .popup {
        position: fixed;
        width: 80%;
        height: 80%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #e4ebeee6;
        border-radius: 10px;
        padding: 20px;
        z-index: 1000; /* Ensure the popup is above the overlay */
        /* Relative positioning to accommodate absolute positioning of close button */
        position: relative;
    }

    .popup-content {
        text-align: center;
        padding: 20px;
        width: 100%;
        height: 100%;
    }

    .chart-container {
    width: 40%;
    height: 40%;
    display: flex;
    margin-top: 10%;
    grid-gap: 20%;
    }

    .visible {
        display: block; /* Show the overlay and popup when the visible class is applied */
    }

    #closePopup {
        position: absolute;
        top: 10px; /* Adjust as needed */
        right: 10px; /* Adjust as needed */
        color: black;
        opacity: 0.5;
        /* transition: opacity 0.1s ease; */
    }

    #closePopup:hover {
        opacity: 1;
    }

</style>