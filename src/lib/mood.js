import { createTop } from "$lib/calculateFrequency.js";


export const renderMood = (array, n) => {
  // emotionTracker key correspond to integers map to pitches using standard Pitch Class notation from spotify API
  // emotionTracker value correspond to simple yet standard psychoacoustics emotional evaluation of pitch class 
  const emotionTracker = {
    0: ["Innocence", "Happiness", "Spiritual", "Purity"],
    1: ["Sadness", "Grief", "Moody"],
    2: ["Wiliness", "Triumphant", "Excitement"],
    3: ["Devotion", "Intimacy", "Openness", "Love"],
    4: ["Frustration", "Anger", "Energetic", "Joyful"],
    5: ["Optimism", "Excitement", "Triumph"],
    6: ["Clarity", "Satisfaction", "Delight"],
    7: ["Dreamy", "Calm", "Tenderness", "Peaceful"],
    8: ["Doom", "Reflecting", "Dark"],
    9: ["Joy", "Contentment", "Love", "Optimism"],
    10: ["Joy", "Uplifting", "Clarity", "Hope"],
    11: ["Wildness", "Passion", "Anger", "Bold"],
  };

  // Compare the array values with the object key and each time their is a match,
  // replace array value by object value.
  for (let i = 0; i < array.length; i++) {
    let value = array[i];
    if (emotionTracker.hasOwnProperty(value)) {
      array[i] = emotionTracker[value];
    }
  }
  const topEmotions = createTop(array, n);
  return topEmotions;
};
