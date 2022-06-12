/** Process cli arguments based on defined options with default values */
function processCliOptions(optionsArray, existingOptions) {
  const evaluateValue = (value, type) => {
    if (type === "boolean") {
      return [true, "true"].includes(value);
    } else if (type === "list") {
      return value.split(",");
    }
    return value;
  }
  //Create object where each alias points to option definition object. Initialize default values
  const { aliases, options } = Object.entries(existingOptions).reduce((acc, [optionKey, optionDefinition]) => {
    for (const alias of optionDefinition.aliases) {
      acc.aliases[alias] = optionDefinition;
      acc.aliases[alias].key = optionKey;
    }
    acc.options[optionKey] = optionDefinition.defaultValue;
    return acc;
  }, { aliases: {}, options: {} });

  for (let i = 0; i < optionsArray.length; i++) {
    const curr = optionsArray[i], next = optionsArray[i + 1], optionDefinition = aliases[curr];
    if (aliases.hasOwnProperty(curr) && !aliases.hasOwnProperty(next) && next !== undefined) {
      options[optionDefinition.key] = evaluateValue(next, optionDefinition.type);
      i++; //skip next array value, already processed
    } else if (aliases.hasOwnProperty(curr)) {
      options[optionDefinition.key] = true;
    }
  }
  return options;
}

/** Utility class to format column values to a fixed length */
class ColumnFormatter {
  maxLengths;
  constructor() {
    this.maxLengths = {};
    return this;
  }
  process(id, column) {
    this.maxLengths[id] = Math.max(...column.map(e => e.length));
    return this;
  }
  format(id, value, additionalSpacing = 0) {
    return value.concat(" ".repeat(this.maxLengths[id] + additionalSpacing - value.length));
  }
}

/** Generate help based on existing options definition */
function printHelp(existingOptions) {
  const ALIASES_SPACING = 3;
  const formatAliases = aliases => aliases.join(", ")
  const formatter = new ColumnFormatter()
    .process("aliases", Object.values(existingOptions).map(({aliases}) => formatAliases(aliases)));

  const formattedHelp = Object.values(existingOptions).reduce((acc, { aliases, defaultValue, description }) => {
    const defaultHint = defaultValue !== undefined ? ` (default: ${defaultValue})` : "";
    return acc.concat(`  ${formatter.format("aliases", formatAliases(aliases), ALIASES_SPACING)}${description}${defaultHint}\n`);
  }, "\nExisting options:\n");

  console.log(formattedHelp);
}

/** Utility class to measure elapsed time */
class Timer {
  constructor() {
    this.time = undefined;
  }
  start() {
    this.time = new Date().getTime();
    return this;
  }
  stop() {
    const current = new Date().getTime();
    const diff = current - this.time;
    return diff / 1000;
  }
}

/** Calculate the block index, counting from left to right and top to bottom */
function calculateBlockIndex(size, row, column) {
  const blockLength = Math.sqrt(size);
  return Math.floor(row / blockLength) * blockLength + Math.floor(column / blockLength);
}


/** Returns a new matrix after applying the given number of rotations */
function rotateMatrix(matrix, times) {
  const n_rotations = times % 4;
  const size = matrix.length;
  const newMatrix = Array.from(Array(size).keys()).map(() => []);
  const next = (row, col) => [col, size - 1 - row];
  matrix.forEach((row, rowIndex) => {
    row.forEach((number, columnIndex) => {
      let newRowIndex = rowIndex, newColumnIndex = columnIndex;
      for (let i = 0; i < n_rotations; i++) {
        [newRowIndex, newColumnIndex] = next(newRowIndex, newColumnIndex);
      }
      newMatrix[newRowIndex][newColumnIndex] = number;
    })
  })
  return newMatrix;
}

/** Generate a formatted string version of a given matrix */
function formatMatrix(matrix, spacing = 1) {
  let formattedMatrix = "\n";
  matrix.forEach(row => {
    row.forEach(number => {
      const space = ' '.repeat(spacing);
      formattedMatrix += `${space}${number}`;
    })
    formattedMatrix += '\n';
  })
  return formattedMatrix;
}

/** Simple method to print logs in a consistent way */
function log(message, module, enabled){
  [true, undefined].includes(enabled) && console.log(`[${module}] ${message}`);
}

/** Create a copy of an object */
const deepClone = (content) => JSON.parse(JSON.stringify(content));

module.exports = {
  ColumnFormatter,
  Timer,
  processCliOptions,
  printHelp,
  calculateBlockIndex,
  rotateMatrix,
  formatMatrix,
  deepClone,
  log,
}
