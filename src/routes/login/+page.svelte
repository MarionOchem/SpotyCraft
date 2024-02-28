<script>
    // Import components 
    import ProfileInfo from './components/profileInfo.svelte'
    import Sidebar from './components/sidebar.svelte'
    import Chart from './components/charts.svelte'
    import GeneralInfo from './components/generalInfo.svelte'
    import Overlay from './components/moreInfo.svelte'
    import SearchTop from './components/searchTop.svelte'

    import { onMount } from "svelte";
    import  { setAuthParams } from '$lib/urlParams'
    
    let isReady = false;

    // Handle the state of the large popup 
    let showOverlay = false;
    const handleShowOverlay = () => {
        showOverlay = true;
    }
    
    // Handle the state of the side popup
    let showSidePanel = false;
    const handleShowSidePanel = () => {
        showSidePanel = !showSidePanel;
    }

    onMount( async () => {
        // Fetch the user authentification token for all the app fetches
        const keys = await setAuthParams()
        console.log("this is authentification token :", keys)

        isReady = true;
    });
   

</script>


<main class="main">
    {#if isReady === true}
        <ProfileInfo />
        <Sidebar on:showSidePanel={handleShowSidePanel}/>
        <Chart />
        <GeneralInfo on:showOverlay={handleShowOverlay}/>
        <Overlay bind:showOverlay={showOverlay}/>  
        <SearchTop bind:showSidePanel={showSidePanel}/>  
    {/if}
</main>

<style>
main {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(1, 1, 1, 0.793); 
  z-index: 0;
    }
</style>