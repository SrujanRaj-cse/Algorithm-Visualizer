export function generateBubbleSteps(array) {
  const a = array.slice();
  const steps = [];
  steps.push({ type: 'snapshot', array: a.slice(), compare: [] });

  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < a.length - i - 1; j++) {
      steps.push({ type: 'compare', array: a.slice(), compare: [j, j + 1] });
      if (a[j] > a[j + 1]) {
        const tmp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = tmp;
        steps.push({ type: 'swap', array: a.slice(), swapped: [j, j + 1] });
      }
    }
    steps.push({ type: 'sortedIndex', array: a.slice(), sorted: a.length - i - 1 });
  }
  steps.push({ type: 'done', array: a.slice() });
  return steps;
}
