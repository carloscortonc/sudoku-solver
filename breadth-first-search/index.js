const BreadthFirstSolver = require("./BreadthFirstSolver");
const applyHeuristics = require("../heuristics");
const { log: utilslog } = require("../utils");

const MODULE = "BFS";

/** Main function */
function solve(fileContent, options) {
  let solvedMatrix;
  const size = fileContent.length;
  const { matrix: initialState, reverse } = applyHeuristics(fileContent, options);
  const initialNode = new BreadthFirstSolver(size, initialState);
  let total_nodes_visited = 0;

  const log = (message) => utilslog(message, MODULE, options.log);

  const queue = [initialNode];
  while (true) {
    const node = queue.shift();
    if (node === undefined) {
      break;
    }
    total_nodes_visited++;
    const nextRows = node.generateRows(), nextNodes = [];
    for(let i = 0; i < nextRows.length; i++){
      const row = nextRows[i], isFinalNextRow = i === nextRows.length - 1;
      //Reuse node for final row
      const n = isFinalNextRow ? node : node.clone();
      if (n.addRow(row)) {
        solvedMatrix = n.matrix;
        break;
      } else {
        nextNodes.push(n);
      }
    }
    queue.push(...nextNodes);
  }

  if (!solvedMatrix) {
    return undefined;
  }
  //Reverse heuristic rotation, if applied
  const finalMatrix = reverse(solvedMatrix);
  log(`Total visited nodes: ${total_nodes_visited}`);
  return finalMatrix;
};

module.exports = solve;