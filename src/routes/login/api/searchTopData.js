// API fetch for the searchTop.svelte component

import { writable } from "svelte/store";
export let overallTopTracks = writable([]);

// This fetch includes logic enabling the future implementation of optimizing the number of fetched sounds based on the user's choice. 
const longTopTrack = async (token, iterations = 2, offset = 0, limit = 50) => {
  let allTracks = [];
  // Loop for the specified number of iterations
  for (let i = 0; i < iterations; i++) {
    const response = await fetch(
      `https://api.spotify.com/v1/me/top/tracks?time_range=long_term&offset=${offset}&limit=${limit}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    const thisBatch = data.items;

    // Add the fetched tracks to the result array
    allTracks.push(...thisBatch);

    // Update the offset for the next batch
    offset += limit;
  }
  return allTracks;
};

// Wait for the fetch response of longTopTrack to clean and formate its data
export const allTopTracks = async (token, iterations) => {
  try {
    const result = await longTopTrack(token, iterations);
    overallTopTracks.set(
      result.map((item) => ({
        name: item.name,
        artist: item.artists[0].name,
        cover: item.album.images[0].url,
        release_date: item.album.release_date,
      }))
    );
  } catch (error) {
    console.error("Error while fetching allTopTracks :", error);
  }
};

// fetch all playlists
const getUserPlaylists = async (token, offset = 0, limit = 50) => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/playlists?offset=${offset}&limit=${limit}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  const data = await response.json();
  const thisBatch = data.items;
  // check if there are more albums to fetch
  if (data.total > offset + limit) {
    // fetch the next batch of albums recursively
    const nextBatch = await getUserPlaylists(token, offset + limit, limit);
    return [...thisBatch, ...nextBatch];
  }
  return thisBatch;
};

export const playlistList = async (token) => {
  const result = await getUserPlaylists(token);
  const allPlaylist = result.map((item) => ({
    name: item.name,
    id: item.id,
  }));
  return allPlaylist;
};

// this is an exemple of Get Playlist items endpoint with non dynamic id.
export const getThisPlaylistTrack = async (token, playlistId) => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const result = await response.json();
    //
    const playlistItems = result.items;
    const playlistTracks = playlistItems.map((item) => ({
      track: item.track.name,
    }));
    return playlistTracks;
  } catch (error) {
    console.error("Error while fetching top artists :", error);
    throw error;
  }
};
