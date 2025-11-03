function generateDFSSteps(adjacencyList, startNode) {
  const steps = [];
  
  if (!adjacencyList || !startNode || !adjacencyList[startNode]) {
    return { steps: [], traversal: [] };
  }

  // Make graph undirected - add reverse edges
  const undirectedList = {};
  for (let node in adjacencyList) {
    undirectedList[node] = [...(adjacencyList[node] || [])];
  }
  // Add reverse edges
  for (let node in adjacencyList) {
    const neighbors = adjacencyList[node] || [];
    for (let neighbor of neighbors) {
      if (!undirectedList[neighbor]) {
        undirectedList[neighbor] = [];
      }
      if (!undirectedList[neighbor].includes(node)) {
        undirectedList[neighbor].push(node);
      }
    }
  }

  const visited = new Set();
  const traversal = [];

  const recordStep = (action, message, currentNode = null, stackState = null, visitedState = null) => {
    steps.push({
      action,
      message,
      currentNode: currentNode !== null ? currentNode : null,
      stack: stackState !== null ? [...stackState] : null,
      visited: visitedState !== null ? Array.from(visitedState) : Array.from(visited),
      traversal: [...traversal]
    });
  };

  const dfs = (node, depth = 0) => {
    if (visited.has(node)) {
      recordStep('BACKTRACK', `Backtracking from already visited node: ${node}`, node, null, visited);
      return;
    }

    visited.add(node);
    recordStep('VISIT', `Visiting node ${node} (depth: ${depth})`, node, null, visited);
    traversal.push(node);

    const neighbors = undirectedList[node] || [];
    
    for (let neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        recordStep('EXPLORE', `Exploring edge ${node} -> ${neighbor}`, node, null, visited);
        dfs(neighbor, depth + 1);
      } else {
        recordStep('SKIP', `Skipping already visited neighbor: ${neighbor}`, node, null, visited);
      }
    }
  };

  recordStep('START', `Starting DFS from node ${startNode}`);
  dfs(startNode);
  recordStep('COMPLETED', `DFS completed. Traversal: [${traversal.join(', ')}]`);

  return { steps, traversal };
}

module.exports = { generateDFSSteps };

