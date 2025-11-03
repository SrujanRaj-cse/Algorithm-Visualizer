function generateInsertionSteps(array) {
  const a = array.slice();
  const steps = [];
  steps.push({ type: 'snapshot', array: a.slice(), compare: [], action: 'Initializing' });

  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    steps.push({ type: 'insert', array: a.slice(), inserted: i, compare: [i], action: 'Inserting' });
    
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      steps.push({ type: 'compare', array: a.slice(), inserted: i, compare: [j, j + 1], action: 'Comparing' });
      a[j + 1] = a[j];
      steps.push({ type: 'shift', array: a.slice(), inserted: i, shifted: [j, j + 1], action: 'Shifting' });
      j--;
    }
    
    a[j + 1] = key;
    steps.push({ type: 'insert', array: a.slice(), inserted: j + 1, compare: [], action: 'Inserting' });
    steps.push({ type: 'sortedIndex', array: a.slice(), sorted: i, action: 'Sorted' });
  }
  steps.push({ type: 'done', array: a.slice(), action: 'Completed' });
  return steps;
}

module.exports = { generateInsertionSteps };

