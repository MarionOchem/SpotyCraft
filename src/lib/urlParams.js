// Get the user authentification token from the http post response in the URL

import { writable } from "svelte/store";
export const authStore = writable({});

export const getParamsFromAuth = () => {
  const urlParams = new URLSearchParams(window.location.hash.substring(1)); 
  const thisToken = urlParams.get("access_token"); // retrieve those 3 keys
  const thisExpiresTime = urlParams.get("expires_in");
  return {
    access_token: thisToken,
    expires_in: thisExpiresTime,
  };
};

export const setAuthParams = async () => {
  const authParams = getParamsFromAuth();
  authStore.set(authParams);
  return authParams;
};
