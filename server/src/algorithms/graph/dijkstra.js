function generateDijkstraSteps(adjacencyList, startNode, endNode = null) {
  const steps = [];
  
  try {
    // Validate input parameters
    if (!adjacencyList || typeof adjacencyList !== 'object') {
      return { steps: [], distances: {}, path: [], error: "Invalid adjacency list" };
    }
    
    if (!startNode || !adjacencyList[startNode]) {
      return { steps: [], distances: {}, path: [], error: "Invalid start node" };
    }

    const distances = {};
    const previous = {};
    const visited = new Set();
    
    // Find all nodes in the graph (including those that only appear as neighbors)
    const allNodes = new Set(Object.keys(adjacencyList));
    for (const node in adjacencyList) {
      for (const neighbor in adjacencyList[node]) {
        allNodes.add(neighbor);
      }
    }
    
    // Initialize distances for ALL nodes
    for (const node of allNodes) {
      distances[node] = Infinity;
      previous[node] = null;
    }
    distances[startNode] = 0;

    const recordStep = (action, message, currentNode = null, visitedNode = null, distanceUpdated = null) => {
      steps.push({
        action,
        message,
        currentNode: currentNode !== null ? currentNode : null,
        visitedNode: visitedNode !== null ? visitedNode : null,
        distanceUpdated: distanceUpdated !== null ? distanceUpdated : null,
        distances: { ...distances },
        visited: Array.from(visited),
        previous: { ...previous }
      });
    };

    recordStep('START', `Starting Dijkstra's algorithm from node ${startNode}`);

    while (true) {
      // Find unvisited node with minimum distance
      let minNode = null;
      for (let node in distances) {
        if (!visited.has(node) && (minNode === null || distances[node] < distances[minNode])) {
          minNode = node;
        }
      }

      if (minNode === null || distances[minNode] === Infinity) {
        break;
      }

      visited.add(minNode);
      recordStep('VISIT', `Visiting node ${minNode} (distance: ${distances[minNode]})`, null, minNode);

      // Safely get neighbors or default to empty object if undefined
      const neighbors = adjacencyList[minNode] || {};
      
      for (let neighbor in neighbors) {
        // Skip if neighbor is not in distances (not a valid node)
        if (distances[neighbor] === undefined) {
          recordStep('ERROR', `Skipping invalid neighbor: ${neighbor} (not in graph)`, null, null);
          continue;
        }
        
        if (visited.has(neighbor)) {
          recordStep('SKIP', `Skipping already visited neighbor: ${neighbor}`, null, null);
          continue;
        }

        const edgeWeight = neighbors[neighbor];
        
        // Validate edge weight
        if (typeof edgeWeight !== 'number' || isNaN(edgeWeight) || edgeWeight < 0) {
          recordStep('ERROR', `Invalid edge weight for ${minNode} -> ${neighbor}: ${edgeWeight}`, null, null);
          continue;
        }
        
        const newDistance = distances[minNode] + edgeWeight;
        const oldDistance = distances[neighbor];
        
        if (newDistance < oldDistance) {
          distances[neighbor] = newDistance;
          previous[neighbor] = minNode;
          recordStep('UPDATE', `Updating distance to ${neighbor}: ${newDistance} (via ${minNode})`, null, null, { node: neighbor, oldDist: oldDistance, newDist: newDistance });
        } else {
          recordStep('NO_UPDATE', `No improvement for ${neighbor}: ${newDistance} >= ${oldDistance}`, null, null);
        }
      }
    }

    // Reconstruct path if endNode is provided
    let path = [];
    if (endNode) {
      if (distances[endNode] === undefined) {
        recordStep('ERROR', `End node ${endNode} is not in the graph`, null, null);
      } else if (distances[endNode] !== Infinity) {
        let current = endNode;
        while (current !== null) {
          path.unshift(current);
          current = previous[current];
        }
      }
    }

    recordStep('COMPLETED', `Algorithm completed. Shortest distance to ${endNode || 'all nodes'}: ${endNode ? (distances[endNode] !== Infinity ? distances[endNode] : 'unreachable') : 'see distances'}`, null, null);

    return { steps, distances, path };
  } catch (error) {
    console.error("Error in Dijkstra algorithm:", error);
    return { 
      steps: [...steps, { action: 'ERROR', message: `Algorithm failed: ${error.message}` }], 
      distances: {}, 
      path: [],
      error: error.message
    };
  }
}

module.exports = { generateDijkstraSteps };

// Example usage for testing:
/*
const graph = {
  'A': {'B': 4, 'C': 2},
  'B': {'A': 4, 'D': 2, 'E': 3},
  'C': {'A': 2, 'D': 4, 'F': 3},
  'D': {'B': 2, 'C': 4, 'E': 1, 'F': 5},
  'E': {'B': 3, 'D': 1, 'F': 7},
  'F': {'C': 3, 'D': 5, 'E': 7}
};

const result = generateDijkstraSteps(graph, 'A', 'F');
console.log('Path:', result.path);
console.log('Distance:', result.distances['F']);
*/

