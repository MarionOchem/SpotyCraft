<script>
// This This is a 'page.svelte' file ready for use with a future feature enabling users to easily create their own charts by combining various pieces of information
import Dashboard from './components/dynamicDashboards.svelte'
</script>


<main class="main">
<Dashboard />
</main>


<style>
    main {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(1, 1, 1, 0.793); 
      z-index: 0; /* Ensure the main is under other content */
        }
    </style>