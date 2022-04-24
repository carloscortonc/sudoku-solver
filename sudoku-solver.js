const Sudoku = require('./Sudoku');
const { Timer, formatMatrix, rotateMatrix } = require('./utils');

const DEFAULT_INPUT_FILE = './input/level-1.json';

/** Find the rotation that has the most set values in the upper rows. This translates in less generated rows, and thus
 * less time and memory complexity.
 */
function heuristicRotation(matrix) {
  const rotationScores = [0, 1, 2, 3].reduce((acc, rotation) => {
    const rotatedMatrix = rotateMatrix(matrix, rotation);
    acc[rotation] = 0;
    rotatedMatrix.forEach((row, index) => {
      const rowScore = row.filter(e => e > 0).length;
      const rowWeight = (row.length - index)**2;
      acc[rotation] += (rowScore * rowWeight);
    });
    return acc;
  }, {});
  const maxValue = Math.max(...Object.values(rotationScores));
  const bestRotation = Object.keys(rotationScores).find(rotation => rotationScores[rotation] === maxValue);
  return {
    matrix: rotateMatrix(matrix, bestRotation),
    bestRotation: parseInt(bestRotation),
    reverseRotation: 4 - bestRotation
  };
}

let total_sudokus_generated = 0;
function generateSudokus(initialSudoku, accumulator) {
  const nextRows = initialSudoku.generateRows();
  nextRows.forEach((row, index) => {
    const isFinalNextRow = index == nextRows.length - 1;
    //Reuse initialSudoku for final row
    const s = isFinalNextRow ? initialSudoku : initialSudoku.clone();
    if (!isFinalNextRow) {
      total_sudokus_generated++;
    }
    if (s.addRow(row)) {
      accumulator.push(s.matrix);
      return;
    }
    generateSudokus(s, accumulator);
  })
}

/** Main function */
(() => {
  let fileContent;
  try {
    fileContent = require(process.argv[2]);
  } catch (_) {
    //Load default file
    fileContent = require(DEFAULT_INPUT_FILE);
  }

  const matrixes = [];
  const size = fileContent.length;
  const timer = new Timer().start();
  //Heuristic computation is included in the measured time
  const { matrix: initialState, bestRotation, reverseRotation } = heuristicRotation(fileContent);
  console.log(`Heuristic rotation applied: ${bestRotation}`);
  const initialSudoku = new Sudoku(size, initialState);
  generateSudokus(initialSudoku, matrixes);
  if (matrixes.length !== 1) {
    console.log(`Something went wrong. Number of possible sudokus found: ${matrixes.length}`);
    process.exit(0);
  }
  const solvedMatrix = matrixes[0];
  //Reverse heuristic rotation
  const finalMatrix = rotateMatrix(solvedMatrix, reverseRotation);
  
  console.log(formatMatrix(finalMatrix));
  console.log(`Execution time: ${timer.stop()} s`);
  console.log(`Total Heap Memory use: ${process.memoryUsage().heapTotal / (1024 ** 2)} MB`);
  console.log(`Total sudokus generated: ${total_sudokus_generated}`);
})();
