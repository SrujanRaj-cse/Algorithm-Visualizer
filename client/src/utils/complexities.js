export const algorithmComplexities = {
  // Sorting
  bubble: {
    time: { best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)' },
    space: 'O(1)'
  },
  selection: {
    time: { best: 'O(n^2)', average: 'O(n^2)', worst: 'O(n^2)' },
    space: 'O(1)'
  },
  insertion: {
    time: { best: 'O(n)', average: 'O(n^2)', worst: 'O(n^2)' },
    space: 'O(1)'
  },
  merge: {
    time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)' },
    space: 'O(n)'
  },
  quick: {
    time: { best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n^2)' },
    space: 'O(log n)'
  },

  // Searching
  linearsearch: {
    time: { best: 'O(1)', average: 'O(n)', worst: 'O(n)' },
    space: 'O(1)'
  },
  binarysearch: {
    time: { best: 'O(1)', average: 'O(log n)', worst: 'O(log n)' },
    space: 'O(1)'
  },

  // Graph
  bfs: {
    time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
    space: 'O(V)'
  },
  dfs: {
    time: { best: 'O(V + E)', average: 'O(V + E)', worst: 'O(V + E)' },
    space: 'O(V)'
  },
  dijkstra: {
    time: { best: 'O((V + E) log V)', average: 'O((V + E) log V)', worst: 'O((V + E) log V)' },
    space: 'O(V)'
  },

  // Dynamic Programming
  lcs: {
    time: { best: 'O(n*m)', average: 'O(n*m)', worst: 'O(n*m)' },
    space: 'O(n*m)'
  },
  coinchange: {
    time: { best: 'O(n*amount)', average: 'O(n*amount)', worst: 'O(n*amount)' },
    space: 'O(amount)'
  },
  knapsack01: {
    time: { best: 'O(n*W)', average: 'O(n*W)', worst: 'O(n*W)' },
    space: 'O(n*W)'
  },

  // Recursion / Others
  nqueen: {
    time: { best: 'O(N!)', average: 'O(N!)', worst: 'O(N!)' },
    space: 'O(N)'
  },
  factorial: {
    time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    space: 'O(n)'
  },
  fibonacci: {
    time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' }, // with memoization/DP visualization
    space: 'O(n)'
  },
  inorder: {
    time: { best: 'O(n)', average: 'O(n)', worst: 'O(n)' },
    space: 'O(h)'
  },
  gridpaths: {
    time: { best: 'O(rows*cols)', average: 'O(rows*cols)', worst: 'O(rows*cols)' },
    space: 'O(rows*cols)'
  }
};

export function computeOperationCounts(steps) {
  const counts = {
    comparisons: 0,
    swaps: 0,
    shifts: 0,
    inserts: 0,
    selections: 0,
    pivots: 0
  };
  if (!Array.isArray(steps)) return counts;
  for (const s of steps) {
    if (!s) continue;
    if (s.compare && Array.isArray(s.compare)) counts.comparisons += 1;
    if (s.swapped && Array.isArray(s.swapped)) counts.swaps += 1;
    if (s.shifted && Array.isArray(s.shifted)) counts.shifts += 1;
    if (s.inserted !== undefined) counts.inserts += 1;
    if (s.selected !== undefined) counts.selections += 1;
    if (s.pivot !== undefined) counts.pivots += 1;
  }
  return counts;
}

export function computeDynamicTypeCounts(steps) {
  const map = new Map();
  if (!Array.isArray(steps)) return {};
  for (const s of steps) {
    if (!s) continue;
    const key = (s.type || s.action || '').toString();
    if (!key) continue;
    map.set(key, (map.get(key) || 0) + 1);
  }
  return Object.fromEntries(map.entries());
}


