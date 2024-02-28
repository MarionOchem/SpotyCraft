// API fetch for the generalInfo component 

import { writable } from "svelte/store";
export const topArtists = writable([]);
export const topTracks = writable([]);

export const currentTopTrack = async (token) => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?time_range=short_term&offset=0&limit=10`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const result = await response.json();
    topTracks.set(
      result.items.map((item) => ({
        name: item.name,
        artist: item.artists[0].name,
        popularity: item.popularity,
        id: item.id,
        image: item.album.images[0].url,
        analyse: null,
        feature: null,
      }))
    );
  } catch (error) {
    console.error("Error while fetching top artists :", error);
    throw error;
  }
};

export const currentTopArtist = async (token) => {
  try {
    const response = await fetch(
      "https://api.spotify.com/v1/me/top/artists?time_range=short_term&offset=0&limit=10",
      {
        // for further info : change the request type /me/?...
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const result = await response.json();
    topArtists.set(
      result.items.map((item) => ({
        name: item.name,
        genre: item.genres,
        popularity: item.popularity,
        id: item.id,
        image: item.images[0].url,
      }))
    );
  } catch (error) {
    console.error("Error while fetching top artists :", error);
    throw error;
  }
};

export const tracksFeature = async (token, id) => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/audio-features/${id}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error while fetching top artists :", error);
    throw error;
  }
};

export const tracksAnalyse = async (token, id) => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/audio-analysis/${id}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error while fetching top artists :", error);
    throw error;
  }
};
