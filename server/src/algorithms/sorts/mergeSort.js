function generateMergeSteps(array) {
  const a = array.slice();
  const steps = [];

  steps.push({ type: 'snapshot', array: a.slice(), compare: [], action: 'Initializing' });

  function merge(arr, left, mid, right, divId) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    
    steps.push({ type: 'merge', array: arr.slice(), division: divId, compare: [], left: left, right: right, action: 'Merging' });
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArr.length && j < rightArr.length) {
      steps.push({ type: 'compare', array: arr.slice(), division: divId, compare: [left + i, mid + 1 + j], action: 'Comparing' });
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      steps.push({ type: 'merge', array: arr.slice(), division: divId, compare: [], left: left, right: right, action: 'Merging' });
      k++;
    }
    
    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      steps.push({ type: 'merge', array: arr.slice(), division: divId, compare: [], left: left, right: right, action: 'Merging' });
      i++;
      k++;
    }
    
    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      steps.push({ type: 'merge', array: arr.slice(), division: divId, compare: [], left: left, right: right, action: 'Merging' });
      j++;
      k++;
    }
  }

  function mergeSort(arr, left, right, divId) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      const leftDivId = divId * 2 + 1;
      const rightDivId = divId * 2 + 2;
      
      steps.push({ type: 'divide', array: arr.slice(), division: divId, compare: [], left: left, right: right, action: 'Dividing' });
      
      mergeSort(arr, left, mid, leftDivId);
      mergeSort(arr, mid + 1, right, rightDivId);
      
      merge(arr, left, mid, right, divId);
    } else {
      steps.push({ type: 'divide', array: arr.slice(), division: divId, compare: [], left: left, right: right, action: 'Dividing' });
    }
  }

  mergeSort(a, 0, a.length - 1, 0);
  steps.push({ type: 'done', array: a.slice(), action: 'Completed' });
  return steps;
}

module.exports = { generateMergeSteps };

