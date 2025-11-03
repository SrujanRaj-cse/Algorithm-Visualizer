function generateSelectionSteps(array) {
  const a = array.slice();
  const steps = [];
  steps.push({ type: 'snapshot', array: a.slice(), compare: [], action: 'Initializing' });

  for (let i = 0; i < a.length - 1; i++) {
    let minIdx = i;
    steps.push({ type: 'select', array: a.slice(), selected: i, compare: [i], action: 'Selecting' });
    
    for (let j = i + 1; j < a.length; j++) {
      steps.push({ type: 'compare', array: a.slice(), selected: i, compare: [minIdx, j], action: 'Comparing' });
      if (a[j] < a[minIdx]) {
        minIdx = j;
        steps.push({ type: 'select', array: a.slice(), selected: i, compare: [minIdx], action: 'Selecting' });
      }
    }
    
    if (minIdx !== i) {
      const tmp = a[i];
      a[i] = a[minIdx];
      a[minIdx] = tmp;
      steps.push({ type: 'swap', array: a.slice(), swapped: [i, minIdx], selected: i, action: 'Swapping' });
    }
    
    steps.push({ type: 'sortedIndex', array: a.slice(), sorted: i, action: 'Sorted' });
  }
  steps.push({ type: 'sortedIndex', array: a.slice(), sorted: a.length - 1, action: 'Sorted' });
  steps.push({ type: 'done', array: a.slice(), action: 'Completed' });
  return steps;
}

module.exports = { generateSelectionSteps };

