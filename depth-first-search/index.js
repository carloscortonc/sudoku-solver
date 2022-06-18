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
    const cellOptions = btkSolver.getCellOptions(currentPosition);
    if (cellOptions.length === 0) {
      if (btkSolver.back() === false) {
        return undefined;
      }
      continue;
    }
    btkSolver.useCellOptions(cellOptions);
    btkSolver.next();
  }
  //Reverse heuristic rotation, if applied
  const finalMatrix = reverse(btkSolver.matrix);
  return finalMatrix;
};

module.exports = solve;