function generateKnapsack01Steps(weights, values, capacity) {
  const steps = [];
  
  if (!weights || !values || weights.length !== values.length || weights.length === 0) {
    return { steps: [], maxValue: 0 };
  }

  const n = weights.length;
  const dp = Array(n + 1).fill(null).map(() => Array(capacity + 1).fill(0));

  const recordStep = (action, message, currentItem = null, currentCapacity = null) => {
    steps.push({
      dp: dp.map(row => [...row]),
      action,
      message,
      currentItem: currentItem !== null ? currentItem : null,
      currentCapacity: currentCapacity !== null ? currentCapacity : null,
      maxValue: dp[n][capacity]
    });
  };

  recordStep('START', `Starting 0/1 Knapsack with ${n} items and capacity ${capacity}`);

  for (let i = 1; i <= n; i++) {
    for (let w = 1; w <= capacity; w++) {
      recordStep('COMPUTING', `Processing item ${i-1} (weight: ${weights[i-1]}, value: ${values[i-1]}) at capacity ${w}`, i-1, w);
      
      if (weights[i-1] <= w) {
        const withoutItem = dp[i-1][w];
        const withItem = dp[i-1][w - weights[i-1]] + values[i-1];
        
        if (withItem > withoutItem) {
          dp[i][w] = withItem;
          recordStep('INCLUDE', `Include item ${i-1}: ${withItem} (previous: ${withoutItem})`, i-1, w);
        } else {
          dp[i][w] = withoutItem;
          recordStep('EXCLUDE', `Exclude item ${i-1}: ${withoutItem} (would be: ${withItem})`, i-1, w);
        }
      } else {
        dp[i][w] = dp[i-1][w];
        recordStep('SKIP', `Skip item ${i-1} (too heavy: ${weights[i-1]} > ${w})`, i-1, w);
      }
    }
  }

  const maxValue = dp[n][capacity];
  recordStep('COMPLETED', `Maximum value: ${maxValue}`, null, null);

  return { steps, maxValue };
}

module.exports = { generateKnapsack01Steps };

