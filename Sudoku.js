const {
  calculateBlockIndex,
  generatePossibleRows
} = require('./utils');

class Sudoku {
  /** Create a new sudoku, initialize values */
  constructor(size = 9, initialState) {
    this.size = size;
    this.data = {
      rowIndex: 0,
      columnRestrictions: Array.from(Array(size).keys()).map(() => []),
      blockRestrictions: Array.from(Array(size).keys()).map(() => []),
    }
    this.matrix = [];
    if (initialState) {
      this.processInitialState(initialState);
    }
  }
  /** Process initial values of a sudoku puzzle */
  processInitialState(initialState) {
    this.data.initialValues = initialState;
    initialState.forEach((row, rowIndex) => {
      row.forEach((element, columnIndex) => {
        if (element > 0) {
          const blockIndex = calculateBlockIndex(this.size, rowIndex, columnIndex);
          this.data.blockRestrictions[blockIndex].push(element);
          this.data.columnRestrictions[columnIndex].push(element);
        }
      })
    })
  }
  /** Add new row to current sudoku. Returns true if the sudoku is completed */
  addRow(row) {
    this.matrix.push(row);
    if (this.data.rowIndex + 1 === this.size) {
      return true;
    }
    row.forEach((number, index) => {
      this.data.columnRestrictions[index].push(number);
      const blockIndex = calculateBlockIndex(this.size, this.data.rowIndex, index);
      this.data.blockRestrictions[blockIndex].push(number);
    })
    this.data.rowIndex++;
    return false;
  }
  /** Create and return a copy of the current sudoku */
  clone() {
    const cloneField = field => JSON.parse(JSON.stringify(field));
    const sudoku = new Sudoku();
    sudoku.size = this.size;
    sudoku.matrix = cloneField(this.matrix);
    sudoku.data = cloneField(this.data);
    return sudoku;
  }
  /** Generate all possible rows for next row-index based on current sudoku state */
  generateRows() {
    return generatePossibleRows(this.size, this.data);
  }
}

module.exports = Sudoku;
