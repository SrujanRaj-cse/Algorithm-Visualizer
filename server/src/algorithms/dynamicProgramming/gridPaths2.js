function generateGridPaths2Steps(gridMatrix) {
  const steps = [];
  
  if (!gridMatrix || gridMatrix.length === 0 || gridMatrix[0].length === 0) {
    return { steps: [], totalPaths: 0 };
  }

  const rows = gridMatrix.length;
  const cols = gridMatrix[0].length;
  const dp = Array(rows).fill(null).map(() => Array(cols).fill(0));

  if (gridMatrix[0][0] === -1 || gridMatrix[rows-1][cols-1] === -1) {
    steps.push({
      dp: dp.map(row => [...row]),
      action: 'OBSTACLE',
      message: 'Start or end position is blocked',
      currentCell: null,
      totalPaths: 0
    });
    return { steps, totalPaths: 0 };
  }

  const recordStep = (action, message, currentCell = null) => {
    steps.push({
      dp: dp.map(row => [...row]),
      action,
      message,
      currentCell: currentCell ? { ...currentCell } : null,
      totalPaths: dp[rows-1][cols-1]
    });
  };

  recordStep('START', `Starting Grid Paths algorithm on ${rows}x${cols} grid`);

  dp[0][0] = 1;
  recordStep('BASE_CASE', 'Starting position (0,0) has 1 path', { row: 0, col: 0 });

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (i === 0 && j === 0) continue;

      recordStep('COMPUTING', `Processing cell (${i},${j})`, { row: i, col: j });
      
      if (gridMatrix[i][j] === -1) {
        dp[i][j] = 0;
        recordStep('OBSTACLE', `Cell (${i},${j}) is obstacle`, { row: i, col: j });
        continue;
      }

      const fromTop = i > 0 ? dp[i-1][j] : 0;
      const fromLeft = j > 0 ? dp[i][j-1] : 0;
      dp[i][j] = fromTop + fromLeft;

      recordStep('SUMMING', `Cell (${i},${j}): ${fromTop} from top + ${fromLeft} from left = ${dp[i][j]}`, { row: i, col: j });
    }
  }

  const totalPaths = dp[rows-1][cols-1];
  recordStep('COMPLETED', `Total unique paths: ${totalPaths}`, null);

  return { steps, totalPaths };
}

module.exports = { generateGridPaths2Steps };

