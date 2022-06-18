const { Timer, ColumnFormatter, deepClone } = require("./utils");
const path = require("path")
const fs = require("fs");

const IGNORED_FOLDERS = [".git", "input"];
const BASE_INPUT_LOCATION = "./input";

function summary() {
  const baseInputLocation = path.resolve(BASE_INPUT_LOCATION);
  //Determine input list
  const inputFiles = fs.readdirSync(baseInputLocation)
    .map(i => path.join(baseInputLocation, i))
  //Determine algorithm list
  const algorithms = fs.readdirSync(".", { withFileTypes: true })
    .filter(d => d.isDirectory() && !IGNORED_FOLDERS.includes(d.name))
    .map(d => d.name);
  //Determine heuristics list
  const heuristicsOptions = [false, true];

  const formatter = new ColumnFormatter()
    .process("algorithm", algorithms)
    .process("input", inputFiles.map(i => path.relative(baseInputLocation, i)));

  const results = [], timer = new Timer();
  let fileContent, solver;
  for (const input of inputFiles) {
    try {
      fileContent = require(input);
    } catch (_) {
      continue;
    }
    for (const algorithm of algorithms) {
      try {
        solver = require(`./${algorithm}`);
      } catch (_) {
        continue;
      }
      for (const heuristics of heuristicsOptions) {
        const solverOptions = { heuristics, log: false };
        const formattedInput = path.relative(baseInputLocation, input);
        console.log("Executing ", formatter.format("algorithm", algorithm), " on ", formatter.format("input", formattedInput), " with options", solverOptions);
        timer.start();
        const matrix = solver(deepClone(fileContent), solverOptions);
        //TODO validate against pre-existing solution
        const solved = matrix !== undefined ? "yes" : "no";
        const rawExecutionTime = timer.stop();
        const executionTime = rawExecutionTime.toFixed(3).concat("s");
        results.push({ input: formattedInput, algorithm, heuristics, solved, executionTime });
      }
    }
  }

  //Print formatted results
  const MARGIN_LEFT = 2, COLUMN_SPACING = 4;
  const COLUMNS = ["input", "algorithm", "heuristics", "solved", "executionTime"];
  const FORCED_REPEATED_COLUMNS = ["solved","executionTime"]

  const formatTitle = value => value.replace(/([A-Z])/g, "_$1").toUpperCase();
  const formatRow = (currentEntry, previousEntry = {}) => COLUMNS.reduce((acc, column) => {
    let value = currentEntry[column].toString();
    const sameValue = previousEntry[column]?.toString() === value;
    if (!FORCED_REPEATED_COLUMNS.includes(column) && sameValue) {
      value = "";
    }
    return acc + formatter.format(column, value, COLUMN_SPACING);
  }, " ".repeat(MARGIN_LEFT)).concat("\n");

  COLUMNS.forEach(c => {
    formatter.process(c, results.map(r => r[c].toString()).concat(formatTitle(c)));
  });

  const formattedResult = results.reduce((acc, entry, index, list) => {
    const previous = index > 0 ? list[index - 1] : {};
    return acc + formatRow(entry, previous);
  }, "\n" + formatRow(COLUMNS.reduce((acc, c) => ({ ...acc, [c]: formatTitle(c) }), {})));

  console.log(formattedResult);
}

module.exports = summary;