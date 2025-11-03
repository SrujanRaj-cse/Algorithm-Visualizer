function generateNQueenSteps(nSize) {
  const steps = [];
  let solutionCount = 0;
  const solutions = []; // Store all solutions
  const MAX_STEPS = 50000; // Limit steps to prevent memory issues
  const MAX_SOLUTIONS_DISPLAY = 100; // Limit solutions displayed (prevent memory issues)

  const recordStep = (board, action, message, highlight = null) => {
    if (steps.length >= MAX_STEPS) return; // Stop recording if too many steps
    
    steps.push({
      board: board.map(q => ({ ...q })),
      action,
      message,
      highlight: highlight ? { ...highlight } : null,
      solutionCount
    });
  };

  const isSafe = (board, row, col) => {
    for (let queen of board) {
      if (queen.col === col) {
        if (steps.length < MAX_STEPS) {
          recordStep(board, 'CONFLICT', `Conflict: Column ${col} occupied`, { row, col, conflictWith: { row: queen.row, col: queen.col } });
        }
        return false;
      }
      const rowDiff = Math.abs(row - queen.row);
      const colDiff = Math.abs(col - queen.col);
      if (rowDiff === colDiff) {
        if (steps.length < MAX_STEPS) {
          recordStep(board, 'CONFLICT', `Conflict: Diagonal attack`, { row, col, conflictWith: { row: queen.row, col: queen.col } });
        }
        return false;
      }
    }
    if (steps.length < MAX_STEPS) {
      recordStep(board, 'SAFE', `Position (${row}, ${col}) is safe`, { row, col });
    }
    return true;
  };

  const solveNQueens = (board, row) => {
    if (steps.length >= MAX_STEPS) return; // Stop early if too many steps
    
    if (row === nSize) {
      solutionCount++;
      // Convert board to grid format for easier display
      const solutionGrid = Array(nSize).fill(null).map(() => Array(nSize).fill(0));
      board.forEach(queen => {
        solutionGrid[queen.row][queen.col] = 1;
      });
      
      // Store solution if under limit
      if (solutions.length < MAX_SOLUTIONS_DISPLAY) {
        solutions.push({
          solutionNumber: solutionCount,
          positions: board.map(q => ({ row: q.row, col: q.col })),
          grid: solutionGrid
        });
      }
      
      if (solutionCount <= 10 && steps.length < MAX_STEPS) {
        recordStep(board, 'SOLUTION_FOUND', `Solution #${solutionCount} found!`);
      }
      return;
    }

    for (let col = 0; col < nSize; col++) {
      if (steps.length >= MAX_STEPS) return; // Stop early
      
      if (steps.length < MAX_STEPS) {
        recordStep(board, 'TRYING', `Trying position (${row}, ${col})`, { row, col });
      }
      
      if (isSafe(board, row, col)) {
        const newBoard = [...board, { row, col }];
        if (steps.length < MAX_STEPS) {
          recordStep(newBoard, 'PLACING', `Queen placed at (${row}, ${col})`, { row, col });
        }
        
        solveNQueens(newBoard, row + 1);
        
        if (steps.length < MAX_STEPS) {
          recordStep(board, 'BACKTRACKING', `Backtracking from row ${row}`, { row, col });
        }
      }
    }
  };

  recordStep([], 'START', `Starting N-Queens solver for N=${nSize}`);
  solveNQueens([], 0);
  
  if (steps.length >= MAX_STEPS) {
    recordStep([], 'COMPLETED', `Algorithm stopped early (step limit reached). Solutions found so far: ${solutionCount}. Total solutions: Many (calculation stopped).`);
  } else {
    recordStep([], 'COMPLETED', `Algorithm completed. Total solutions: ${solutionCount}`);
  }

  return { steps, solutionCount, solutions };
}

module.exports = { generateNQueenSteps };

