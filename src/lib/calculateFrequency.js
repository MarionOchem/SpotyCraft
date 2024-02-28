// Feature to format an array into a flat array of strings and calculate a top 5 frequency of those words

export const createTop = (array, n) => {
  // [1] Flatten the array :
  const flatArray = array.flat();

  // [2] Calculate frequency :
  const calculateFrequency = (array) => {
    const wordFrequency = {};

    array.forEach((word) => {
      if (wordFrequency.hasOwnProperty(word)) {
        wordFrequency[word]++;
      } else {
        wordFrequency[word] = 1;
      }
    });
    return wordFrequency;
  };

  // select the (n) highest frequency
  const makeTop = (wordFrequency, n) => {
    const wordArray = Object.entries(wordFrequency);
    const sortedWordArray = wordArray.sort((a, b) => b[1] - a[1]);
    const topNWords = sortedWordArray.slice(0, n);
    const topNWordObject = Object.fromEntries(topNWords);
    return topNWordObject;
  };

  // convert the top 5 frequencies values into % :
  const convertToPourcentage = (values) => {
    // Calculate the total sum of all values
    const total = values.reduce((acc, values) => acc + values, 0);
    // Convert each value to percentage relative to the total sum
    const percentages = values.map((value) =>
      Math.round((value / total) * 100)
    );
    return percentages;
  };
  const replaceValuesWithPercentages = (object, percentages) => {
    const keys = Object.keys(object);
    
    // Iterate over the keys and update the values with the corresponding percentages
    keys.forEach((key, index) => {
      object[key] = percentages[index];
    });
    return object;
  };

  const frequency = calculateFrequency(flatArray);
  const Top = makeTop(frequency, n);
  const values = Object.values(Top);
  const percentage = convertToPourcentage(values);
  const finalTop = replaceValuesWithPercentages(Top, percentage);

  return finalTop;
};
