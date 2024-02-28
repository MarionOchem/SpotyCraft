<script>
    import { createEventDispatcher } from 'svelte';
    const dispatchSidePanel = createEventDispatcher();

    const openSidePanel = () => {
        console.log("sidePanel button has been clicked")
      dispatchSidePanel('showSidePanel');
    }
</script>


<div class="container">

    <button on:click={openSidePanel} id="side-panel">☰ Custom Top</button>
    <a href='../../dashboard'>
        <button>☰  Dashboard</button>
    </a>
    <a href='../../topster' data-sveltekit:prefetch="none">
        <button>☰  TopCraft</button>
    </a>
</div>


<style>
 @font-face {
    font-family: "GothamCircularThin";
    src: url('static/Gotham-Light.otf') format("otf");
}

.container {
  margin-right: 20px;;
  position: fixed;
  top: 30%;
  bottom: 30%;
  left: 0;
  width: 5vw;
  height: 20vw;
  border-radius: 10px;
  background-color: transparent;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.384);
  display: flex;
  flex-direction: column; /* Arrange items vertically */
  align-items: center; /* Center items horizontally */
  justify-content: center; /* Align items to the top */
  font-family: "GothamCircularThin", sans-serif;
}

button {
    background-color: transparent;
    border: none;
    padding: 30%;
    padding-left: 20px;
    font-size: 20px;
    color: #fff;
    cursor: pointer;
 }

 button.hover {
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.384);
 }
</style>