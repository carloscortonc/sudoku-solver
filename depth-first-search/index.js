const BacktrackingSolver = require("./BacktrackingSolver");
const applyHeuristics = require("../heuristics");

/** Main function */
function solve(fileContent, options) {
  const { matrix: initialState, reverse } = applyHeuristics(fileContent, options);

  const size = initialState.length;
  const btkSolver = new BacktrackingSolver(size, initialState);

  while (true) {
    const currentPosition = btkSolver.getCurrentPosition();
    if (!currentPosition) {
      break;
    }
    const [row, col] = currentPosition;
    if (btkSolver.matrix[row][col] > 0) {
      btkSolver.next();
      continue;
    }
    let cellOptions = btkSolver.data.options[row][col];
    if (cellOptions === undefined) {
      cellOptions = btkSolver.findCurrentCellOptions();
    }
    if (cellOptions.length === 0) {
      if (!btkSolver.back()) {
        return undefined;
      }
      continue;
    }
    btkSolver.data.options[row][col] = cellOptions;
    btkSolver.addElement(cellOptions[0]);
    btkSolver.next();
  }
  //Reverse heuristic rotation, if applied
  const finalMatrix = reverse(btkSolver.matrix);
  return finalMatrix;
};

module.exports = solve;