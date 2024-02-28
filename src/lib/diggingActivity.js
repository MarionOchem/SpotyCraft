// Formatting data of getAllAlbums for the chart of digging activity

export const orderChronologically = (array) => {
  // Ordering the date array in chronologic order :
  const sortDates = (array) => {
    array.sort((a, b) => new Date(a) - new Date(b));
    return array;
  };

  // get each year in this array (only once) === labels
  // get the number of times a year appear in the array === data
  const yearCounts = {};
  const countYears = (dates) => {
    dates.forEach((date) => {
      const year = new Date(date).getFullYear();
      if (yearCounts[year]) {
        yearCounts[year]++;
      } else {
        yearCounts[year] = 1;
      }
    });
    return yearCounts;
  };

  const sortedDates = sortDates(array);
  return countYears(sortedDates);
};
