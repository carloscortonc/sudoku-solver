# Sudoku solver - breadth first search

This solver is based on breadth first search (BFS), where all the nodes from a given level of a tree are visited before moving on to the next. In this case, a level N cointains all matrices with N filled rows, and generating the next level consists of generating all possible rows for each matrix on the current level, and adding each generated row to the corresponding matrix.

With the current implementation, this algorithm uses more memory than DFS, because to generate each child node it creates a copy of the current node, which contains the matrix and other values.

### Algorithm output

On top of the output described in the upper Readme file, this algorithm also includes:
- Total number of visited nodes

## Additional notes

Honorable mention to Xabier Doural García, contributor to the idea of this implementation.
