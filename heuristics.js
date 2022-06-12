const { rotateMatrix, log: logutils } = require("./utils")

const MODULE = "HST";

/** Find the rotation that has the most set values in the upper rows. This translates in less early bifurcations, and thus
 * less time and memory complexity. */
function heuristicRotation(matrix, options) {
  const log = (message) => logutils(message, MODULE, options.log);
  const rotationScores = [0, 1, 2, 3].reduce((acc, rotation) => {
    const rotatedMatrix = rotateMatrix(matrix, rotation);
    acc[rotation] = 0;
    rotatedMatrix.forEach((row, index) => {
      const rowScore = row.filter(e => e > 0).length;
      const rowWeight = (row.length - index) ** 2;
      acc[rotation] += (rowScore * rowWeight);
    });
    return acc;
  }, {});
  const maxValue = Math.max(...Object.values(rotationScores));
  const bestRotation = parseInt(Object.keys(rotationScores).find(rotation => rotationScores[rotation] === maxValue));
  const reverseRotation = 4 - bestRotation;
  log(`Heuristic rotation applied: ${bestRotation}`);
  return {
    matrix: rotateMatrix(matrix, bestRotation),
    reverse: (matrix) => rotateMatrix(matrix, reverseRotation)
  };
}

//List of all heuristics
const heuristics = [heuristicRotation];

//Method for applying all existing heuristics and returning one single reverse method
function applyHeuristics(matrix, options) {
  if (!options.heuristics) {
    return {
      matrix,
      reverse: m => m
    }
  }
  let finalMatrix, reverseList = [];
  heuristics.forEach(heuristic => {
    const heuristicOutput = heuristic(matrix, options);
    finalMatrix = heuristicOutput.matrix;
    reverseList.push(heuristicOutput.reverse);
  })
  const reverse = (matrix) => {
    let m = matrix;
    reverseList.forEach(rev => {
      m = rev(m);
    });
    return m;
  }
  return {
    matrix: finalMatrix,
    reverse
  }
}

module.exports = applyHeuristics;
