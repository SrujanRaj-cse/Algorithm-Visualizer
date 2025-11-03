function generateBFSSteps(adjacencyList, startNode) {
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
  const queue = [startNode];
  const traversal = [];

  const recordStep = (action, message, currentNode = null, queueState = null, visitedState = null) => {
    steps.push({
      action,
      message,
      currentNode: currentNode !== null ? currentNode : null,
      queue: queueState !== null ? [...queueState] : [...queue],
      visited: visitedState !== null ? Array.from(visitedState) : Array.from(visited),
      traversal: [...traversal]
    });
  };

  recordStep('START', `Starting BFS from node ${startNode}`);

  visited.add(startNode);
  recordStep('VISIT', `Visiting node ${startNode}`, startNode, [startNode], visited);
  traversal.push(startNode);

  while (queue.length > 0) {
    const currentNode = queue.shift();
    
    recordStep('DEQUEUE', `Dequeuing node ${currentNode}`, currentNode, queue, visited);

    const neighbors = undirectedList[currentNode] || [];
    
    for (let neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        recordStep('ENQUEUE', `Found unvisited neighbor: ${neighbor}`, currentNode, queue, visited);
        recordStep('VISIT', `Visiting node ${neighbor}`, neighbor, queue, visited);
        traversal.push(neighbor);
      } else {
        recordStep('SKIP', `Skipping already visited neighbor: ${neighbor}`, currentNode, queue, visited);
      }
    }
  }

  recordStep('COMPLETED', `BFS completed. Traversal: [${traversal.join(', ')}]`);

  return { steps, traversal };
}

module.exports = { generateBFSSteps };

