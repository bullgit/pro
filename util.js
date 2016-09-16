module.exports = {
  /**
   * get a random value of an array
   * @param  {Array} array the array to randomise
   * @return {Object}      a random objec
   */
  random(array) {
    if (!array instanceof Array) {
      throw new Error('input was no array.', array);
    } else {
      return array[Math.floor(Math.random() * array.length)];
    }
  }
};
