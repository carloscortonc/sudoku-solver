/** Determine the next position */
function getNextPosition([row, col], size) {
  if (row === size - 1 && col === size - 1) {
    return undefined;
  } else if (col === size - 1) {
    return [row + 1, 0]
  }
  return [row, col + 1];
}

module.exports = {
  getNextPosition
}