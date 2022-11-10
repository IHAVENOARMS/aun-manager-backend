const splitArray = (array, length) => {
  const splitArrays = [];
  const copy = [...array];
  while (copy.length) {
    splitArrays.push(copy.splice(0, length));
  }
  return splitArrays;
};

module.exports = splitArray;
