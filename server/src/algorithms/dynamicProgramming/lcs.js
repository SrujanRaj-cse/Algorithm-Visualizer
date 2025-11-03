function generateLCSSteps(str1, str2) {
  const steps = [];
  
  if (!str1 || !str2) {
    return { steps: [], lcsLength: 0, lcsString: '' };
  }

  const m = str1.length;
  const n = str2.length;
  const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  const recordStep = (action, message, i = null, j = null, match = null) => {
    steps.push({
      dp: dp.map(row => [...row]),
      action,
      message,
      currentI: i !== null ? i : null,
      currentJ: j !== null ? j : null,
      match: match !== null ? match : null,
      lcsLength: dp[m][n],
      str1: str1,
      str2: str2
    });
  };

  recordStep('START', `Starting LCS for '${str1}' and '${str2}'`);

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      recordStep('COMPUTING', `Comparing str1[${i-1}]='${str1[i-1]}' with str2[${j-1}]='${str2[j-1]}'`, i-1, j-1);
      
      if (str1[i-1] === str2[j-1]) {
        dp[i][j] = dp[i-1][j-1] + 1;
        recordStep('MATCH', `Characters match! LCS[${i}][${j}] = ${dp[i][j]}`, i-1, j-1, true);
      } else {
        dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
        recordStep('NO_MATCH', `Characters don't match. LCS[${i}][${j}] = max(${dp[i-1][j]}, ${dp[i][j-1]}) = ${dp[i][j]}`, i-1, j-1, false);
      }
    }
  }

  const lcsLength = dp[m][n];
  const lcsString = reconstructLCS(str1, str2, dp);
  
  // Add lcsString to the completed step
  const completedStep = {
    dp: dp.map(row => [...row]),
    action: 'COMPLETED',
    message: `LCS Length: ${lcsLength}, LCS String: '${lcsString}'`,
    currentI: null,
    currentJ: null,
    match: null,
    lcsLength: lcsLength,
    lcsString: lcsString,
    str1: str1,
    str2: str2
  };
  steps.push(completedStep);

  return { steps, lcsLength, lcsString };
}

function reconstructLCS(str1, str2, dp) {
  let lcs = '';
  let i = str1.length;
  let j = str2.length;

  while (i > 0 && j > 0) {
    if (str1[i-1] === str2[j-1]) {
      lcs = str1[i-1] + lcs;
      i--;
      j--;
    } else if (dp[i-1][j] > dp[i][j-1]) {
      i--;
    } else {
      j--;
    }
  }

  return lcs;
}

module.exports = { generateLCSSteps };

