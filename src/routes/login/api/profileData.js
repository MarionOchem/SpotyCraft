// API fetch for the profileInfo.svelte component

import { writable } from "svelte/store";
export const profileStore = writable({});

export const fetchProfile = async (token) => {
  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await response.json();
    profileStore.set({
      profilePicture: result.images[1].url,
      profileName: result.display_name,
      profileURL: result.external_urls.spotify,
      profileId: result.id,
    });
  } catch (error) {
    console.error("Error while fetching user profile ", error);
    throw error;
  }
};