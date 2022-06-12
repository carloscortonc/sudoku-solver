# Sudoku solver

Two algorithms are implemented in this project:
- Breadth first search (https://en.wikipedia.org/wiki/Breadth-first_search)
- Depth first search (https://en.wikipedia.org/wiki/Depth-first_search)


## Requirements

This project was developed under node v14.18.1 (visit [here](https://nodejs.org/en/download/) to download). The use of [optional chaining](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining) requires a version of node >14.0.0. No additional modules or libraries are required.


## Usage

The main program is `sudoku-solver.js`. To solve a puzzle, execute:
```
node sudoku-solver.js
```

The available cli options are the following:

| Option | Default value | Description |
| - | - | - |
| --input, -i | ./input/level-1.json | Input puzzle |
| --algorithm, -a | depth-first-search | Name of the algorithm to execute |
| --heuristics, -he | true | Whether to apply heuristics |
| --summary, -s | - | Display an execution summary for all algorithms on available inputs |
| --help, h | - | Show available options |

<br/>

The summary mode differs from the regular mode in the following:
- It does not include logs for each executing algorithms
- It does not output memory usage for each execution
- It does not output solved matrices

### Input puzzle format

\- &nbsp;The input must be a json file, consisting of a two-dimensional array representing the sudoku matrix.</br>
\- &nbsp;The first array contains the rows, and each of these contains the values for the corresponding puzzle row.</br>
\- &nbsp;The value `0` (negative values as well) are used to represent an empty value in the puzzle.</br>

### Heuristics

Here is used the broad definition of the term [heuristic](https://en.wikipedia.org/wiki/Heuristic) as an approach that is not guaranteed to be optimal, but sufficient to reach a desired goal (in this case, reduce the execution time of the algorithms). For that, a unique heuristic was used which applies an initial rotation to the matrix, leaving the most number of set values in the upper rows, which reduces early bifurcations in the logic and in turn reduces the execution time.

### Program output

The output of regular execution mode (no summary) includes:
- Heuristic rotation applied (if enabled)
- The solved matrix
- Execution time
- Total heap memory usage (extracted from `process.memoryUsage()`)

If the summary mode is enabled, the output will consist of a table with the execution times for the different combinations of input, algorithm and heuristics.

## Extensibility
The code was organized so that more algorithms can be easily added. To add a new algorithm:
- Create a new folder with the algorithm name (this name will be used in the cli options)
- Create an `index.js` file inside this folder. This file must have a default export consisting of a function that takes in two parameters, the file content (in the format described above) and an options object, and outputs the solved matrix or `undefined` in case no solution was found.