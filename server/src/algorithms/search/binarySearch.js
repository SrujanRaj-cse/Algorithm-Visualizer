function generateBinarySearchSteps(array, target) {
  const steps = [];
  
  if (!array || array.length === 0) {
    return { steps: [], found: false, index: -1 };
  }

  // Check if array is sorted
  let isSorted = true;
  for (let i = 1; i < array.length; i++) {
    if (array[i] < array[i-1]) {
      isSorted = false;
      break;
    }
  }

  if (!isSorted) {
    steps.push({
      action: 'ERROR',
      message: 'Array must be sorted for Binary Search',
      array: [...array],
      target,
      currentIndex: null,
      left: null,
      right: null
    });
    return { steps, found: false, index: -1, error: 'Array not sorted' };
  }

  let left = 0;
  let right = array.length - 1;

  const recordStep = (action, message, currentIndex = null, leftBound = null, rightBound = null) => {
    steps.push({
      action,
      message,
      currentIndex: currentIndex !== null ? currentIndex : null,
      left: leftBound !== null ? leftBound : left,
      right: rightBound !== null ? rightBound : right,
      array: [...array],
      target
    });
  };

  recordStep('START', `Starting Binary Search for ${target} in sorted array`, null, left, right);

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    recordStep('MID', `Calculating mid = (${left} + ${right}) / 2 = ${mid}`, mid, left, right);
    recordStep('COMPARE', `Comparing array[${mid}] = ${array[mid]} with target ${target}`, mid, left, right);
    
    if (array[mid] === target) {
      recordStep('FOUND', `Found ${target} at index ${mid}`, mid, left, right);
      return { steps, found: true, index: mid };
    }
    
    if (array[mid] < target) {
      left = mid + 1;
      recordStep('GO_RIGHT', `${array[mid]} < ${target}, searching right half`, mid, left, right);
    } else {
      right = mid - 1;
      recordStep('GO_LEFT', `${array[mid]} > ${target}, searching left half`, mid, left, right);
    }
  }

  recordStep('NOT_FOUND', `Target ${target} not found in array`);
  return { steps, found: false, index: -1 };
}

module.exports = { generateBinarySearchSteps };

