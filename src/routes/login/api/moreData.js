// API fetch for the chartGenre.svelte component

export const getSavedAlbums = async (token, offset = 0, limit = 50) => {
  const response = await fetch(
    `https://api.spotify.com/v1/me/albums?offset=${offset}&limit=${limit}`,
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
    const nextBatch = await getSavedAlbums(token, offset + limit, limit);
    return [...thisBatch, ...nextBatch];
  }
  return thisBatch;
};

// Wait for the fetch response of getSavedAlbums to clean and formate its data
export const getAllAlbums = async (token) => {
  const result = await getSavedAlbums(token);
    const allAlbumData = result.map((item) => {
      const album = item.album;
      const trackDuration = album.tracks.items.map(
        (track) => track.duration_ms
      );
      const totalDurationInMS = trackDuration.reduce(
        (total, duration) => total + duration,
        0
      );
      const totalMinutes = Math.floor(totalDurationInMS / (60 * 1000));
      const totalSeconds = Math.floor((totalDurationInMS % (60 * 1000)) / 1000);
      const info = {
        name: album.name,
        id: album.id,
        added: item.added_at,
        accessToTheAlbum: album.external_urls.spotify,
        artist: album.artists[0].name,
        cover: album.images[1].url,
        artistId: album.artists[0].id,
        genre: null,
        label: album.label,
        release: album.release_date,
        duration: { minutes: totalMinutes, seconds: totalSeconds },
        popularity: album.popularity,
      };
      return info;
    })
    return allAlbumData;
};

// Top artist overall 
export const longTopArtist = async (token) => {
  try {
    const response = await fetch(
      "https://api.spotify.com/v1/me/top/artists?time_range=long_term&offset=0&limit=10",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const result = await response.json();
    // console.log("result of profile top artist :", result);
  } catch (error) {
    console.error("Error while fetching top artists :", error);
    throw error;
  }
};


// Top artist of 6 past months
export const mediumTopArtist = async (token) => {
  try {
    const response = await fetch(
      "https://api.spotify.com/v1/me/top/artists?time_range=medium_term&offset=0&limit=10",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const result = await response.json();
    const MediumArtist = result.items.map((item) => ({
        name: item.name,
        genre: item.genres,
        popularity: item.popularity,
        id: item.id,
        image: item.images[0].url,
      }))
      return MediumArtist;
  } catch (error) {
    console.error("Error while fetching top artists :", error);
    throw error;
  }
};




// getSavedAlbums fetch with a data.total limit of 200 for debugging purpose :

// const getSavedAlbums = async (
//   token,
//   offset = 0,
//   limit = 50,
//   iterations = 0
// ) => {
//   const response = await fetch(
//     `https://api.spotify.com/v1/me/albums?offset=${offset}&limit=${limit}`,
//     {
//       // for further info : change the request type /me/?...
//       method: "GET",
//       headers: { Authorization: `Bearer ${token}` },
//     }
//   );
//   const data = await response.json();
//   const thisBatch = data.items;
//   // check if there are more albums to fetch and if iterations < 2
//   if (iterations < 2 && data.total > offset + limit) {
//     const nextBatch = await getSavedAlbums(
//       token,
//       offset + limit,
//       limit,
//       iterations + 1
//     );
//     return [...thisBatch, ...nextBatch];
//   }
//   return thisBatch;
// };
