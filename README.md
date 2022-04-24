# Sudoku solver

The strategy used in this solver is to generate all possible rows (taking into account initial values), from top to bottom, until only one completed matrix remains.
The steps followed are:

- Create a Sudoku object and process initial values, updating the Sudoku restrictions (rows, columns, blocks and set values).
- Recursively, all possible rows for the current analyzed Sudoku are generated. For each of these rows, a clone of the Sudoku is created and the row is assigned to it.
- At the end, only one Sudoku will have all rows completed (hopefully).
- An initial matrix-rotation heuristic was added, to reduce the number of generated rows.


## Requirements

This project was developed under node v14.18.1. No additional npm libraries are required.


## Usage

The main program is `sudoku-solver.js`. To solve a puzzle, execute:
```
node sudoku-solver.js puzzle.json
```

If no puzzle is provided, a default one will be used from the input folder

### Input puzzle format

\- &nbsp;The input must be a json file, consisting of a two-dimensional array representing the sudoku matrix.</br>
\- &nbsp;The first array contains the rows, and each of these contains the values for the corresponding puzzle row.</br>
\- &nbsp;The value `0` (negative values as well) are used to represent an empty value in the puzzle.</br>


### Program output

The output of the program includes:
- Heuristic rotation applied
- The solved matrix
- Execution time
- Total heap memory usage (extracted from `process.memoryUsage()`)
- Total number of generated Sudokus (count for every time a Sudoku fork is created)


## Additional notes

Honorable mention to Xabier Doural García, contributor to the idea of this project.
