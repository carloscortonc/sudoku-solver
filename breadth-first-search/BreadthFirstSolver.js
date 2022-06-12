const { deepClone } = require("../utils");
const { generatePossibleRows } = require("./utils");

class BreadthFirstSolver {
  /** Create a new sudoku, initialize values */
  constructor(size = 9, initialState) {
    this.size = size;
    this.data = {
      rowIndex: 0,
    }
    this.matrix = Array.from(Array(size).keys()).map(() => []);;
    if (initialState) {
      this.matrix = initialState;
    }
  }
  /** Add new row to current sudoku. Returns true if the sudoku is completed */
  addRow(row) {
    this.matrix[this.data.rowIndex] = row;
    if (this.data.rowIndex + 1 === this.size) {
      return true;
    }
    this.data.rowIndex++;
    return false;
  }
  /** Create and return a copy of the current sudoku */
  clone() {
    const sudoku = new BreadthFirstSolver();
    sudoku.size = this.size;
    sudoku.matrix = deepClone(this.matrix);
    sudoku.data = deepClone(this.data);
    return sudoku;
  }
  /** Generate all possible rows for next row-index based on current sudoku state */
  generateRows() {
    return generatePossibleRows(this.matrix, this.data.rowIndex);
  }
}

module.exports = BreadthFirstSolver;
