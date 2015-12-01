module.exports = function shuffle(array) {
  var newArray = array.slice();
  var copy = [], n = newArray.length, i;
  while (n) {
    i = Math.floor(Math.random() * newArray.length);
    if (i in newArray) {
      copy.push(newArray[i]);
      delete newArray[i];
      n--;
    }
  }
  return copy;
}