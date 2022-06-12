const { processCliOptions, printHelp, Timer, formatMatrix } = require("./utils");
const summary = require("./summary");

const DEFAULT_INPUT_FILE = "./input/level-1.json";
const DEFAULT_ALGORITHM = "depth-first-search";

const CLI_OPTIONS = {
  input: {
    aliases: ["--input", "-i"],
    defaultValue: DEFAULT_INPUT_FILE,
    description: "Input file"
  },
  algorithm: {
    aliases: ["--algorithm", "-a"],
    defaultValue: DEFAULT_ALGORITHM,
    description: "Name of the algorithm to execute"
  },
  heuristics: {
    aliases: ["--heuristics", "-he"],
    type: "boolean",
    defaultValue: true,
    description: "Whether to apply heuristics"
  },
  summary: {
    aliases: ["--summary", "-s"],
    type: "boolean",
    description: "Display an execution summary for all algorithms on available inputs"
  },
  help: {
    aliases: ["--help", "-h"],
    type: "boolean",
    description: "Show available options"
  }
};

/** Main function */
(() => {
  const options = processCliOptions(process.argv.slice(2), CLI_OPTIONS);
  if (options.help) {
    return printHelp(CLI_OPTIONS);
  } else if (options.summary) {
    return summary(options);
  }

  let fileContent, solver;
  try {
    fileContent = require(options.input);
  } catch (_) {
    return console.log(`Error loading input: ${options.input}`);
  }
  try {
    solver = require(`./${options.algorithm}`);
  } catch (_) {
    //Load default solver
    options.algorithm = DEFAULT_ALGORITHM;
    solver = require(`./${options.algorithm}`);
  }

  console.log(`Using algorithm: ${options.algorithm}`);
  console.log(`Using input: ${options.input}`);
  console.log(`Using heuristics: ${options.heuristics}`);

  const timer = new Timer().start();
  const solvedMatrix = solver(fileContent, options);
  const executionTime = timer.stop();

  if (solvedMatrix) {
    console.log(formatMatrix(solvedMatrix));
  } else {
    console.log("ERROR: no solved matrix");
  }
  console.log(`Execution time: ${executionTime} s`)
  console.log(`Total Heap Memory used: ${process.memoryUsage().heapTotal / (1024 ** 2)} MB`);
})();