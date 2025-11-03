function generateFactorialSteps(n) {
  const steps = [];
  let callCount = 0;
  const computed = {}; // Track all computed factorial values

  const recordStep = (action, message, currentN = null, result = null, callId = null, isReturning = false) => {
    steps.push({
      action,
      message,
      currentN: currentN !== null ? currentN : null,
      result: result !== null ? result : null,
      callId,
      isReturning,
      computed: { ...computed }, // Include all computed values in each step
      callStack: 'factorial(' + (currentN !== null ? currentN : 'N/A') + ')'
    });
  };

  const factorial = (num, depth) => {
    callCount++;
    const currentCallId = callCount;

    recordStep('CALL', `Computing factorial(${num})`, num, null, currentCallId);
    
    if (num === 0 || num === 1) {
      const result = 1;
      computed[num] = result;
      recordStep('BASE_CASE', `Base case: factorial(${num}) = 1`, num, result, currentCallId, true);
      return result;
    }

    recordStep('RECURSION', `Recursing: factorial(${num}) = ${num} × factorial(${num-1})`, num, null, currentCallId);
    
    const subResult = factorial(num - 1, depth + 1);
    const result = num * subResult;
    computed[num] = result;
    
    recordStep('RETURN', `Returning: factorial(${num}) = ${num} × ${subResult} = ${result}`, num, result, currentCallId, true);
    
    return result;
  };

  recordStep('START', `Computing factorial(${n})`);
  
  if (n < 0) {
    recordStep('ERROR', `Factorial is not defined for negative numbers: ${n}`);
    return { steps, result: null, isValid: false };
  }

  if (n > 20) {
    recordStep('WARNING', `Large number: ${n}. May cause performance issues.`);
  }

  const result = factorial(n, 0);
  recordStep('COMPLETED', `Final result: factorial(${n}) = ${result}`, n, result);

  return { steps, result, isValid: true };
}

module.exports = { generateFactorialSteps };

