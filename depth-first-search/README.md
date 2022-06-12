# Sudoku solver - depth first search

This solver is based on depth first search (DFS), where each branch is explored as far as possible before backtracking (undoing steps) and following another branch. The tree is traversed using preorder, where the root is first visited, then the left node and finally the right one (more precisely all nodes from the far left to the far right, as in this case the tree is not binary).

Applying this to the sudoku means finding all possible values for a cell, taking the first of the list and continuing to the next empty cell. When no options remain for a given cell, backtracking is performed and the next option for the previous evaluated cell is selected.

## Additional notes

Honorable mention to Laura Cortón Cobas, contributor to the idea of this implementation.