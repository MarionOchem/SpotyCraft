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
