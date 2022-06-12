const { calculateBlockIndex } = require("../utils");

/** Method to generate all possible rows for a specific row index.
 * Wrapper for the recursive implementation. */
function generatePossibleRows(matrix, rowIndex) {
  const rows = [];
  const availableNumbers = Array.from(Array(matrix.length).keys()).map(n => n + 1);
  generatePossibleRowsRecursively({ matrix, rowIndex, availableNumbers, currentRow: [], columnIndex: 0, }, rows);
  return rows;
}

/** Recursive method to generate all possible rows for a specific row index from a set of restrictions.
 * All generated rows are stored inside "accumulator" variable
 * The restrictions are:
 *  - column-restriction: numbers already used a column
 *  - row-restriction: numbers already used for a row
 *  - block-restriction: numbers already used for a block
 */
function generatePossibleRowsRecursively(data, accumulator) {
  if (data.availableNumbers.length === 0) {
    accumulator.push(data.currentRow);
    return;
  }
  const { rowIndex, columnIndex } = data;
  data.availableNumbers.forEach((value, index) => {
    const matchesRestrictions = [columnRestriction, rowRestriction, blockRestriction]
      .every(restriction => restriction(value, data))
    if (matchesRestrictions || data.matrix[rowIndex][columnIndex] === value) {
      const currentRow = [...data.currentRow, value];
      const availableNumbers = [...data.availableNumbers];
      availableNumbers.splice(index, 1);
      const nextColumnIndex = columnIndex + 1;
      generatePossibleRowsRecursively({ ...data, currentRow, availableNumbers, columnIndex: nextColumnIndex }, accumulator);
    }
  });
}

/** Column restriction logic */
const columnRestriction = (value, data) => {
  const indexes = Array.from(Array(data.matrix.length).keys()).map(i => parseInt(i));
  return indexes.every(rowIndex => data.matrix[rowIndex][data.columnIndex] !== value);
}

/** Row restriction logic */
const rowRestriction = (value, data) => {
  const indexes = Array.from(Array(data.matrix.length).keys()).map(i => parseInt(i));
  return indexes.every(columnIndex => data.matrix[data.rowIndex][columnIndex] !== value);
}

/** Block restriction logic */
const blockRestriction = (value, data) => {
  const valueBlockIndex = calculateBlockIndex(data.matrix.length, data.rowIndex, data.columnIndex);
  return data.matrix.every((row, rowIndex) => row.every((cellValue, columnIndex) => {
    const cellBlockIndex = calculateBlockIndex(data.matrix.length, rowIndex, columnIndex);
    return cellBlockIndex !== valueBlockIndex || value !== cellValue;
  }))
}

module.exports = {
  generatePossibleRows,
}