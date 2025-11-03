function generateLinearSearchSteps(array, target) {
  const steps = [];
  
  if (!array || array.length === 0) {
    return { steps: [], found: false, index: -1 };
  }

  const recordStep = (action, message, currentIndex = null, currentValue = null, foundIndex = null) => {
    steps.push({
      action,
      message,
      currentIndex: currentIndex !== null ? currentIndex : null,
      currentValue: currentValue !== null ? currentValue : null,
      foundIndex: foundIndex !== null ? foundIndex : -1,
      array: [...array],
      target
    });
  };

  recordStep('START', `Starting Linear Search for ${target}`);

  for (let i = 0; i < array.length; i++) {
    recordStep('COMPARE', `Comparing array[${i}] = ${array[i]} with target ${target}`, i, array[i]);
    
    if (array[i] === target) {
      recordStep('FOUND', `Found ${target} at index ${i}`, i, array[i], i);
      return { steps, found: true, index: i };
    }
    
    recordStep('CONTINUE', `${array[i]} !== ${target}, continuing search`, i, array[i]);
  }

  recordStep('NOT_FOUND', `Target ${target} not found in array`);
  return { steps, found: false, index: -1 };
}

module.exports = { generateLinearSearchSteps };

