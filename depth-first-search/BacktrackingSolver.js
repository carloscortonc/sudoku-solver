const { calculateBlockIndex } = require("../utils");
const { getNextPosition } = require("./utils");

class BacktrackingSolver {
  constructor(size = 9, initialState) {
    this.size = size;
    this.matrix = Array.from(Array(size).keys()).map(() => []);
    this.data = {
      options: Array.from(Array(size).keys()).map(() => []),
      columnRestrictions: Array.from(Array(size).keys()).map(() => []),
      blockRestrictions: Array.from(Array(size).keys()).map(() => []),
      position: [0, 0],
      history: []
    }
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
          this.addElement(element, [rowIndex, columnIndex]);
        }
      })
    })
  }
  /** Find all possible values for the current cell */
  findCurrentCellOptions() {
    const [row, col] = this.data.position;
    const currentBlockIndex = calculateBlockIndex(this.size, row, col);
    return Array.from(Array(this.size).keys()).map(n => n + 1).reduce((acc, number) => {
      const matchesColumnRestriction = !this.data.columnRestrictions[col].includes(number);
      const matchesRowRestriction = !this.matrix[row].includes(number)
      const matchesBlockRestriction = !this.data.blockRestrictions[currentBlockIndex].includes(number);
      const matchesInitialValue = number === this.data.initialValues[row][col];
      if ((matchesColumnRestriction && matchesRowRestriction && matchesBlockRestriction) || matchesInitialValue) {
        acc.push(number)
      }
      return acc;
    }, []);
  }
  /** Add a new element, updating related restrictions */
  addElement(element, position) {
    let [row, col] = position ? position : this.data.position;
    const blockIndex = calculateBlockIndex(this.size, row, col);
    this.data.blockRestrictions[blockIndex].push(element);
    this.data.columnRestrictions[col].push(element);
    this.matrix[row][col] = element;
    if (!position) {
      this.data.history.push(this.data.position);
    }
  }
  /** Remove an existing element, updating related restrictions */
  removeElement(position) {
    const [row, col] = position;
    const value = this.matrix[row][col];
    const blockIndex = calculateBlockIndex(this.size, row, col);
    const remove = (array, element) => array.splice(array.indexOf(element), 1);
    remove(this.data.blockRestrictions[blockIndex], value);
    remove(this.data.columnRestrictions[col], value);
    this.matrix[row][col] = 0;
  }
  /** Execute backtracking. Return false if operation is not possible */
  back() {
    if (this.data.history.length === 0) {
      return false;
    }
    const [previousRow, previousCol] = this.data.history.pop();
    this.removeElement([previousRow, previousCol]);
    const [currentRow, currentCol] = this.data.position;
    this.data.options[currentRow][currentCol] = undefined;
    this.data.position = [previousRow, previousCol];
    this.data.options[previousRow][previousCol].splice(0, 1);
    return true;
  }
  getCurrentPosition() {
    return this.data.position;
  }
  next() {
    const nextPosition = getNextPosition(this.data.position, this.size);
    this.data.position = nextPosition;
    return nextPosition;
  }
}

module.exports = BacktrackingSolver;