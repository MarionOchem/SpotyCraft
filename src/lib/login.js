/* This gives access to spotify account user related data.
Nb : Relative security flaw : this is an authorization without "Code Challenge", that is, without hash code and without refresh token logic.
Will have to add extra steps for complete security.
*/

import {PUBLIC_CLIENT_ID} from '$env/static/public';

const clientId = PUBLIC_CLIENT_ID;

const authEndpoint = "https://accounts.spotify.com/authorize";
const URI = "http://localhost:5173/login"; // redirect to /login if auth succeed

// Spotify API scope request authorizations 
const scope = [
  "user-top-read",
  "user-library-read",
  "user-read-email",
  "user-read-private",
  "playlist-read-private",
];

export const login = () => {
  window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${URI}&scope=${scope}&response_type=token&show_dialog=true`;
};
