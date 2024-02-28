export const artistGenre = async (token, id) => {
  try {
    const response = await fetch(
      `
      https://api.spotify.com/v1/artists/${id}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const result = await response.json();
    const genre = result.genres;
    return genre;
  } catch (error) {
    console.error("Error while fetching genre of the artist :", error);
    throw error;
  }
};
