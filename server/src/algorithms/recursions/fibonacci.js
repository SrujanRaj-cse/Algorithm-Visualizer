function generateFibonacciSteps(n) {
  const steps = [];
  let callCount = 0;
  const memo = {};

  const recordStep = (action, message, currentN = null, result = null, callId = null, isMemoized = false) => {
    steps.push({
      action,
      message,
      currentN: currentN !== null ? currentN : null,
      result: result !== null ? result : null,
      callId,
      isMemoized,
      memo: { ...memo },
      callStack: 'fibonacci(' + (currentN !== null ? currentN : 'N/A') + ')'
    });
  };

  const fibonacci = (num, depth) => {
    callCount++;
    const currentCallId = callCount;

    // Check memoization
    if (memo[num] !== undefined) {
      recordStep('MEMOIZED', `Memoized result: fibonacci(${num}) = ${memo[num]}`, num, memo[num], currentCallId, true);
      return memo[num];
    }

    recordStep('CALL', `Computing fibonacci(${num})`, num, null, currentCallId);
    
    if (num <= 1) {
      const result = num;
      memo[num] = result;
      recordStep('BASE_CASE', `Base case: fibonacci(${num}) = ${num}`, num, result, currentCallId);
      return result;
    }

    recordStep('RECURSION', `Recursing: fibonacci(${num}) = fibonacci(${num-1}) + fibonacci(${num-2})`, num, null, currentCallId);
    
    const subResult1 = fibonacci(num - 1, depth + 1);
    const subResult2 = fibonacci(num - 2, depth + 1);
    const result = subResult1 + subResult2;
    
    memo[num] = result;
    recordStep('RETURN', `Returning: fibonacci(${num}) = ${subResult1} + ${subResult2} = ${result}`, num, result, currentCallId);
    
    return result;
  };

  recordStep('START', `Computing fibonacci(${n})`);
  
  if (n < 0) {
    recordStep('ERROR', `Fibonacci is not defined for negative numbers: ${n}`);
    return { steps, result: null, isValid: false };
  }

  if (n > 40) {
    recordStep('WARNING', `Large number: ${n}. Will use memoization.`);
  }

  const result = fibonacci(n, 0);
  recordStep('COMPLETED', `Final result: fibonacci(${n}) = ${result}`, n, result);

  return { steps, result, isValid: true };
}

module.exports = { generateFibonacciSteps };

