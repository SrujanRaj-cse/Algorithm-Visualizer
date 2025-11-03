function generateQuickSteps(array) {
  const a = array.slice();
  const steps = [];
  let divisionId = 0;

  steps.push({ type: 'snapshot', array: a.slice(), compare: [], action: 'Initializing' });

  function partition(arr, low, high, divId) {
    const pivot = arr[high];
    steps.push({ type: 'pivot', array: arr.slice(), division: divId, compare: [], pivot: high, left: low, right: high, action: 'Partitioning' });
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      steps.push({ type: 'compare', array: arr.slice(), division: divId, compare: [j, high], pivot: high, left: low, right: high, action: 'Comparing' });
      if (arr[j] < pivot) {
        i++;
        if (i !== j) {
          const tmp = arr[i];
          arr[i] = arr[j];
          arr[j] = tmp;
          steps.push({ type: 'swap', array: arr.slice(), swapped: [i, j], division: divId, pivot: high, left: low, right: high, action: 'Swapping' });
        }
      }
    }
    
    const tmp = arr[i + 1];
    arr[i + 1] = arr[high];
    arr[high] = tmp;
    steps.push({ type: 'pivot', array: arr.slice(), division: divId, compare: [], pivot: i + 1, left: low, right: high, action: 'Partitioning' });
    
    return i + 1;
  }

  function quickSort(arr, low, high, divId) {
    if (low < high) {
      steps.push({ type: 'divide', array: arr.slice(), division: divId, compare: [], left: low, right: high, action: 'Dividing' });
      
      const pi = partition(arr, low, high, divId);
      
      const leftDivId = divId * 2 + 1;
      const rightDivId = divId * 2 + 2;
      
      quickSort(arr, low, pi - 1, leftDivId);
      quickSort(arr, pi + 1, high, rightDivId);
    } else if (low === high) {
      steps.push({ type: 'sortedIndex', array: arr.slice(), sorted: low, action: 'Sorted' });
    }
  }

  quickSort(a, 0, a.length - 1, 0);
  steps.push({ type: 'done', array: a.slice(), action: 'Completed' });
  return steps;
}

module.exports = { generateQuickSteps };

