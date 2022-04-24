
/** Calculate the block index, counting from left to right and top to bottom */
function calculateBlockIndex(size, row, column) {
  const blockLength = Math.sqrt(size);
  return Math.floor(row / blockLength) * blockLength + Math.floor(column / blockLength);
}

/** Method to generate all possible rows for a specific row index.
 * Wrapper for the recursive implementation.
 */
function generatePossibleRows(size, data) {
  const rows = [];
  const availableNumbers = Array.from(Array(size).keys()).map(n => n + 1);
  _generatePossibleRows(size, {
    ...data,
    availableNumbers,
    currentRow: [],
    currentColumnIndex: 0,
  }, rows);
  return rows;
}

/** Recursive method to generate all possible rows for a specific row index from a set of restrictions.
 * All generated rows are stored inside "accumulator" variable
 * The restrictions are:
 *  - column-restrictions: numbers already used for each column
 *  - block-restrictions: numbers already used for each block
 *  - initial-values: initial state of the sudoku, counting as row-restrictions and fixed values
 */
function _generatePossibleRows(size, data, accumulator) {
  const {
    columnRestrictions,
    blockRestrictions,
    availableNumbers,
    currentRow,
    currentColumnIndex,
    initialValues,
    rowIndex
  } = data;
  if (availableNumbers.length === 0) {
    accumulator.push(currentRow);
    return;
  }
  const currentBlockIndex = calculateBlockIndex(size, rowIndex, currentColumnIndex);
  availableNumbers.forEach((number, index) => {
    const matchesColumnRestriction = !columnRestrictions[currentColumnIndex].includes(number);
    const matchesRowRestriction = !initialValues || !initialValues[rowIndex].includes(number)
    const matchesBlockRestriction = !blockRestrictions[currentBlockIndex].includes(number);
    const matchesInitialValue = number === initialValues[rowIndex][currentColumnIndex];
    if ((matchesColumnRestriction && matchesRowRestriction && matchesBlockRestriction) || matchesInitialValue) {
      const cr = [...currentRow, number];
      const an = [...availableNumbers];
      an.splice(index, 1);
      _generatePossibleRows(size, {
        ...data,
        availableNumbers: an,
        currentRow: cr,
        currentColumnIndex: currentColumnIndex + 1
      }, accumulator);
    }
  })
}

/** Returns a new matrix after applying the given number of rotations */
function rotateMatrix(matrix, times) {
  const n_rotations = times % 4;
  const size = matrix.length;
  const newMatrix = Array.from(Array(size).keys()).map(() => []);
  const next = (row, col) => [col, size - 1 - row];
  matrix.forEach((row, rowIndex) => {
    row.forEach((number, columnIndex) => {
      let newRowIndex = rowIndex, newColumnIndex = columnIndex;
      for (let i = 0; i < n_rotations; i++) {
        [newRowIndex, newColumnIndex] = next(newRowIndex, newColumnIndex);
      }
      newMatrix[newRowIndex][newColumnIndex] = number;
    })
  })
  return newMatrix;
}

/** Generate a formatted string version of a given matrix */
function formatMatrix(matrix, spacing = 1) {
  let formattedMatrix = "\n";
  matrix.forEach(row => {
    row.forEach(number => {
      const space = ' '.repeat(spacing);
      formattedMatrix += `${space}${number}`;
    })
    formattedMatrix += '\n';
  })
  return formattedMatrix;
}

/** Utility class to measure elapsed time */
class Timer {
  constructor() {
    this.time = undefined;
  }
  start() {
    this.time = new Date().getTime();
    return this;
  }
  stop() {
    const current = new Date().getTime();
    const diff = current - this.time;
    return diff / 1000;
  }
}

module.exports = {
  calculateBlockIndex,
  generatePossibleRows,
  formatMatrix,
  rotateMatrix,
  Timer
}
