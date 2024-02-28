/* 
There is an imbalance in the number of genres rendered for each song by the api endpoint
TODO : at the moment we retrieve each artist's genre, limit it to the same number of genres per artist.
*/

import { writable } from "svelte/store";
import { createTop } from "$lib/calculateFrequency.js";
export const topCurrentGenre = writable([]);


export const renderGenre = (array, n) => {
  // Handle "hip hop" subgenre string data. Should make further handling for other problematic string format of genre render by api endpoint.
  const modifyArray = array.map((item) => {
    const modifyItem = item.replace(/\bhip hop\b/g, "hip-hop");
    return modifyItem;
  });
  const beforeArray = [];
  modifyArray.forEach((item) => {
    beforeArray.push(item.split(" "));
  });
  const topGenre = createTop(beforeArray, n);
  topCurrentGenre.set(topGenre);
  console.log("topCurrentGenre outside moreInfo :", topGenre);
  return topGenre;
};
