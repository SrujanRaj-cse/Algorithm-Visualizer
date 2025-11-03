function generateCoinChangeSteps(coins, amount) {
  const steps = [];
  
  if (!coins || coins.length === 0 || amount < 0) {
    return { steps: [], minCoins: -1 };
  }

  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  const recordStep = (action, message, currentAmount = null, coinUsed = null) => {
    steps.push({
      dp: [...dp],
      action,
      message,
      currentAmount: currentAmount !== null ? currentAmount : null,
      coinUsed: coinUsed !== null ? coinUsed : null,
      minCoins: dp[amount] === Infinity ? -1 : dp[amount]
    });
  };

  recordStep('START', `Starting Coin Change with coins [${coins.join(', ')}] for amount ${amount}`);

  for (let i = 1; i <= amount; i++) {
    recordStep('COMPUTING', `Finding minimum coins for amount ${i}`, i);
    
    for (let coin of coins) {
      if (coin <= i) {
        const previous = dp[i - coin];
        if (previous !== Infinity) {
          const newValue = previous + 1;
          if (newValue < dp[i]) {
            dp[i] = newValue;
            recordStep('UPDATE', `Using coin ${coin}: dp[${i}] = min(${dp[i]}, ${newValue})`, i, coin);
          } else {
            recordStep('NO_UPDATE', `Coin ${coin} doesn't improve: ${newValue} >= ${dp[i]}`, i, coin);
          }
        }
      }
    }
    
    if (dp[i] === Infinity) {
      recordStep('IMPOSSIBLE', `Cannot form amount ${i} with given coins`, i);
    }
  }

  const minCoins = dp[amount] === Infinity ? -1 : dp[amount];
  if (minCoins === -1) {
    recordStep('COMPLETED', `Cannot form amount ${amount} with given coins`, null);
  } else {
    recordStep('COMPLETED', `Minimum coins needed: ${minCoins}`, null);
  }

  return { steps, minCoins };
}

module.exports = { generateCoinChangeSteps };

