<script>
    import  { onMount } from 'svelte'
    import { authStore } from '$lib/urlParams'
    import { fetchProfile, profileStore } from '../api/profileData'

    let access_token;

    $: {
        access_token = $authStore.access_token;
        // console.log("access token in profile info:", access_token)
       }
    
    onMount(async () => {
        try {
            await fetchProfile(access_token);
            // console.log($profileStore)
           
        } catch (error) {
            console.error("Error while fetching the profile api endpoint :", error)
        }
    });
</script>


<div class="profileInfo">
    {#if $profileStore.profilePicture && $profileStore.profileName && $profileStore.profileURL}
    <!-- svelte-ignore a11y-img-redundant-alt -->
    <img class="profile-picture" src={$profileStore.profilePicture} alt="Profile Picture"/>
    <div class="profile-text">
        <p><strong>{$profileStore.profileName}</strong></p>
        <a href={$profileStore.profileURL} target="_blank">My spotify account</a>
    </div>
    {/if}
</div>


<style>
 .profileInfo {
    display: flex;
    align-items: center;
    margin-left: 3%;
    margin-top: 1%;
  }

  .profile-picture {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    overflow: hidden;
    margin-right: 30px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
  }

  @font-face {
    font-family: "GothamCircularThin";
    src: url('static/Gotham-Light.otf') format("otf");
}

  .profile-text {
    font-family: "GothamCircularThin", sans-serif;
    display: flex;
    flex-direction: column;
    font-size:20px;
    color: white;
  }
  .profile-text a {
    color: white;
}
</style>