import React from 'react';

export default function VisualizerCanvas({ step,algo,nSize,gridMatrix, adjacencyList, startNode, endNode, allSolutions }) {
  if (!step) return <div className="h-64 flex items-center justify-center text-slate-500">No data</div>;

  const action = step.action || 'Waiting';
  
  // Handle non-sorting algorithms
  if (algo === 'nqueen') {
    return <NQueenVisualizer step={step} action={action} nSize={nSize} allSolutions={allSolutions} />;
  }
  
  if (algo === 'gridpaths') {
    return <GridPathsVisualizer step={step} action={action} gridMatrix={gridMatrix} />;
  }
  
  if (algo === 'inorder' || algo === 'preorder' || algo === 'postorder') {
    return <InorderVisualizer step={step} action={action} />;
  }
  
  // Dynamic Programming
  if (algo === 'knapsack01') {
    return <KnapsackVisualizer step={step} action={action} />;
  }
  
  if (algo === 'lcs') {
    return <LCSVisualizer step={step} action={action} />;
  }
  
  if (algo === 'coinchange') {
    return <CoinChangeVisualizer step={step} action={action} />;
  }
  
  // Recursion - new
  if (algo === 'factorial' || algo === 'fibonacci') {
    return <RecursionVisualizer step={step} action={action} algo={algo} />;
  }
  
  // Graph algorithms
  if (algo === 'bfs' || algo === 'dfs') {
    return <GraphVisualizer step={step} action={action} algo={algo} adjacencyList={adjacencyList} startNode={startNode} />;
  }
  
  if (algo === 'dijkstra') {
    return <DijkstraVisualizer step={step} action={action} adjacencyList={adjacencyList} startNode={startNode} endNode={endNode} />;
  }
  
  // Search algorithms
  if (algo === 'linearsearch' || algo === 'binarysearch') {
    return <SearchVisualizer step={step} action={action} algo={algo} />;
  }

  // Sorting algorithms (default)
  const arr = step.array || [];
  const max = Math.max(...arr, 1);
  
  const getBarColor = (i) => {
    const isCompare = step.compare && step.compare.includes(i);
    const isSwap = step.swapped && step.swapped.includes(i);
    const isSorted = step.sorted !== undefined && i <= step.sorted;
    
    if (algo === 'bubble') {
      if (isSwap) return 'bg-rose-500';
      if (isCompare) return 'bg-amber-400';
      if (isSorted) return 'bg-green-500';
      return 'bg-sky-500';
    }
    
    if (algo === 'selection') {
      const isSelected = step.selected !== undefined && i === step.selected;
      if (isSwap) return 'bg-rose-500';
      if (isSelected) return 'bg-purple-500';
      if (isCompare) return 'bg-amber-400';
      if (isSorted) return 'bg-green-500';
      return 'bg-sky-500';
    }
    
    if (algo === 'insertion') {
      const isInserted = step.inserted !== undefined && i === step.inserted;
      const isShifted = step.shifted && step.shifted.includes(i);
      if (isInserted) return 'bg-purple-500';
      if (isShifted) return 'bg-amber-400';
      if (isCompare) return 'bg-yellow-400';
      if (isSorted) return 'bg-green-500';
      return 'bg-sky-500';
    }
    
    if (algo === 'merge' || algo === 'quick') {
      const divId = step.division !== undefined ? step.division : null;
      const left = step.left !== undefined ? step.left : -1;
      const right = step.right !== undefined ? step.right : -1;
      const isPivot = algo === 'quick' && step.pivot !== undefined && i === step.pivot;
      
      if (isPivot) return 'bg-red-600';
      if (isSwap) return 'bg-rose-500';
      if (isCompare) return 'bg-amber-400';
      
      // Color by division/partition
      if (left !== -1 && right !== -1 && i >= left && i <= right) {
        const colors = [
          'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-pink-500',
          'bg-indigo-500', 'bg-orange-500', 'bg-teal-500', 'bg-cyan-500'
        ];
        const colorIndex = divId !== null && divId !== undefined ? divId % colors.length : 0;
        return colors[colorIndex];
      }
      
      if (isSorted) return 'bg-green-500';
      return 'bg-sky-500';
    }
    
    return 'bg-sky-500';
  };

  return (
    <div className="relative h-64">
      {/* Action display box - fixed top right */}
      <div className="absolute top-2 left-2 z-10 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="text-xs text-slate-400 mb-1">Current Action</div>
        <div className="text-sm font-semibold">{action}</div>
      </div>
      
      {/* Bars visualization */}
      <div className="h-full flex items-end gap-1">
        {arr.map((v, i) => {
          const height = (v / max) * 100;
          const colorClass = getBarColor(i);
          return (
            <div key={i} className="flex-1 p-6">
              <div 
                style={{ height: `${height}px` }} 
                className={`w-full rounded ${colorClass}`} 
                title={`${v}`} 
              />
              <div className="text-center text-s mt-1">{v}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// N-Queens Visualizer
function NQueenVisualizer({ step, action, nSize = 4, allSolutions = [] }) {
  const board = step.board || [];
  const highlight = step.highlight || null;
  const isCompleted = action === 'COMPLETED';
  
  const hasQueen = (row, col) => {
    return board.some(q => q.row === row && q.col === col);
  };
  
  const isHighlighted = (row, col) => {
    if (!highlight) return false;
    return highlight.row === row && highlight.col === col;
  };
  
  const isConflict = (row, col) => {
    if (!highlight || !highlight.conflictWith) return false;
    return (highlight.row === row && highlight.col === col) || 
           (highlight.conflictWith.row === row && highlight.conflictWith.col === col);
  };

  return (
    <div className="relative min-h-64">
      <div className="absolute top-2 left-2 z-10 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="text-xs text-slate-400 mb-1">Current Action</div>
        <div className="text-sm font-semibold">{action}</div>
      </div>
      
      <div className="flex justify-center items-center p-4">
        <div className="grid gap-0 border-2 border-slate-700" style={{ gridTemplateColumns: `repeat(${nSize}, minmax(0, 1fr))` }}>
          {Array.from({ length: nSize }).map((_, row) =>
            Array.from({ length: nSize }).map((_, col) => {
              const isDark = (row + col) % 2 === 0;
              const hasQ = hasQueen(row, col);
              const isHigh = isHighlighted(row, col);
              const isConf = isConflict(row, col);
              
              return (
                <div
                  key={`${row}-${col}`}
                  className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center border border-slate-600 ${
                    isDark ? 'bg-slate-700' : 'bg-slate-500'
                  } ${isConf ? 'bg-red-600' : isHigh ? 'bg-yellow-500' : hasQ ? 'bg-green-600' : ''}`}
                >
                  {hasQ && <span className="text-2xl text-yellow-200">♛</span>}
                </div>
              );
            })
          )}
        </div>
      </div>
      
      {step.message && (
        <div className="mt-2 text-center text-sm text-slate-600">{step.message}</div>
      )}
      
      {/* Display all solutions as scrollable JSON when completed */}
      {isCompleted && allSolutions && allSolutions.length > 0 && (
        <div className="mt-4 border-2 border-green-500 rounded-lg bg-green-50 p-4 max-h-96 overflow-auto">
          <div className="text-lg font-bold text-green-800 mb-2">All Solutions ({allSolutions.length}):</div>
          <div className="bg-white p-3 rounded border border-green-300 overflow-auto max-h-64">
            <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap">
              {JSON.stringify(allSolutions.map(sol => ({
                solutionNumber: sol.solutionNumber,
                positions: sol.positions,
                grid: sol.grid
              })), null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

// Grid Paths Visualizer
function GridPathsVisualizer({ step, action, gridMatrix = null }) {
  const dp = step.dp || [];
  const currentCell = step.currentCell || null;
  const rows = dp.length;
  const cols = rows > 0 ? dp[0].length : 0;

  // Check if cell is obstacle from original gridMatrix
  const isObstacle = (i, j) => {
    if (!gridMatrix || i >= gridMatrix.length || j >= gridMatrix[0].length) return false;
    return gridMatrix[i][j] === -1;
  };

  return (
    <div className="relative min-h-64">
      <div className="absolute top-2 left-2 z-10 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="text-xs text-slate-400 mb-1">Current Action</div>
        <div className="text-sm font-semibold">{action}</div>
      </div>
      
      <div className="flex justify-center items-center p-4">
        <div className="grid gap-1 border-2 border-slate-700" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {dp.map((row, i) =>
            row.map((val, j) => {
              const isCurrent = currentCell && currentCell.row === i && currentCell.col === j;
              const isStart = i === 0 && j === 0;
              const isEnd = i === rows-1 && j === cols-1;
              
              const isObst = isObstacle(i, j);
              let bgColor = 'bg-slate-100';
              if (isCurrent) bgColor = 'bg-yellow-500 ring-2 ring-yellow-300';
              else if (isStart) bgColor = 'bg-green-500';
              else if (isEnd) bgColor = 'bg-red-500';
              else if (isObst) bgColor = 'bg-gray-800';
              
              return (
                <div
                  key={`${i}-${j}`}
                  className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center border border-slate-600 rounded ${bgColor}`}
                >
                  {isObst ? (
                    <span className="text-white text-xl font-bold">✖</span>
                  ) : (
                    <span className={`text-xs font-semibold ${isStart || isEnd ? 'text-white' : 'text-slate-900'}`}>{val}</span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
      
      {step.message && (
        <div className="mt-2 text-center text-sm text-slate-600">{step.message}</div>
      )}
      {step.totalPaths !== undefined && (
        <div className="mt-2 text-center text-lg font-bold text-green-600">
          Total Paths: {step.totalPaths}
        </div>
      )}
    </div>
  );
}

// Inorder Traversal Visualizer
function InorderVisualizer({ step, action }) {
  const tree = step.tree;
  const currentNode = step.currentNode;
  const nextNode = step.nextNode;

  return (
    <div className="relative min-h-96">
      <div className="absolute top-2 left-2 z-10 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="text-xs text-slate-400 mb-1">Current Action</div>
        <div className="text-sm font-semibold">{action}</div>
      </div>
      
      <div className="flex justify-center items-start p-8 min-h-96">
        {tree ? (
          <TreeVisualization tree={tree} currentNode={currentNode} nextNode={nextNode} />
        ) : (
          <div className="text-slate-500">Tree visualization will be displayed here</div>
        )}
      </div>
      
      {currentNode && (
        <div className="mt-2 text-center text-sm text-slate-600">
          Current Node: {currentNode.val}
        </div>
      )}
      {step.message && (
        <div className="mt-2 text-center text-sm text-slate-600">{step.message}</div>
      )}
    </div>
  );
}

// Simple Tree Visualization Component
function TreeVisualization({ tree, currentNode, nextNode }) {
  const nodes = [];
  const lines = [];
  const traversalArrows = [];
  const nodeRadius = 25;
  const nodePositions = new Map(); // Store node positions: val -> {x, y}
  
  // Calculate angle for arrow direction
  const calculateAngle = (x1, y1, x2, y2) => {
    return Math.atan2(y2 - y1, x2 - x1);
  };
  
  // Arrow marker definitions for static lines and dynamic traversal
  const arrowMarkers = (
    <defs>
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="10"
        refX="9"
        refY="3"
        orient="auto"
      >
        <polygon
          points="0 0, 10 3, 0 6"
          fill="#666"
        />
      </marker>
      <marker
        id="traversalArrowhead"
        markerWidth="12"
        markerHeight="12"
        refX="10"
        refY="4"
        orient="auto"
      >
        <polygon
          points="0 0, 12 4, 0 8"
          fill="#fbbf24"
        />
      </marker>
    </defs>
  );
  
  const calculateLayout = (node, x = 400, y = 50, depth = 0) => {
    if (!node) return { x, y, width: 0 };
    
    const horizontalGap = Math.max(200 - depth * 20, 80);
    const verticalGap = 80;
    const isCurrent = currentNode && currentNode.val === node.val;
    const isNext = nextNode && nextNode.val === node.val;
    
    // Store node position for traversal arrow calculation
    nodePositions.set(node.val, { x, y });
    
    // Calculate children positions
    const leftChild = node.left ? calculateLayout(node.left, x - horizontalGap, y + verticalGap, depth + 1) : null;
    const rightChild = node.right ? calculateLayout(node.right, x + horizontalGap, y + verticalGap, depth + 1) : null;
    
    // Add lines to children (from center to center)
    if (leftChild) {
      const angle = calculateAngle(x, y, leftChild.x, leftChild.y);
      // Calculate edge points (where line touches node circles)
      const startX = x + nodeRadius * Math.cos(angle);
      const startY = y + nodeRadius * Math.sin(angle);
      const endX = leftChild.x - nodeRadius * Math.cos(angle);
      const endY = leftChild.y - nodeRadius * Math.sin(angle);
      
      lines.push(
        <line
          key={`line-${node.val}-left`}
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="#666"
          strokeWidth="2"
        />
      );
    }
    if (rightChild) {
      const angle = calculateAngle(x, y, rightChild.x, rightChild.y);
      // Calculate edge points (where line touches node circles)
      const startX = x + nodeRadius * Math.cos(angle);
      const startY = y + nodeRadius * Math.sin(angle);
      const endX = rightChild.x - nodeRadius * Math.cos(angle);
      const endY = rightChild.y - nodeRadius * Math.sin(angle);
      
      lines.push(
        <line
          key={`line-${node.val}-right`}
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="#666"
          strokeWidth="2"
        />
      );
    }
    
    // Add node
    nodes.push(
      <g key={`node-${node.val}-${depth}`}>
        <circle
          cx={x}
          cy={y}
          r={nodeRadius}
          fill={isCurrent ? '#fbbf24' : isNext ? '#86efac' : '#3b82f6'}
          stroke={isCurrent ? '#f59e0b' : isNext ? '#4ade80' : '#2563eb'}
          strokeWidth="2"
          className="cursor-pointer"
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="14"
          fontWeight="bold"
        >
          {node.val}
        </text>
      </g>
    );
    
    return { x, y, width: horizontalGap * 2 };
  };

  // Calculate layout and store positions
  if (tree) {
    calculateLayout(tree);
  }

  // Create dynamic traversal arrow if both currentNode and nextNode exist
  if (currentNode && nextNode && currentNode.val !== nextNode.val) {
    const currentPos = nodePositions.get(currentNode.val);
    const nextPos = nodePositions.get(nextNode.val);
    
    if (currentPos && nextPos) {
      const angle = calculateAngle(currentPos.x, currentPos.y, nextPos.x, nextPos.y);
      
      // Calculate edge points (where arrow touches node circles)
      const startX = currentPos.x + nodeRadius * Math.cos(angle);
      const startY = currentPos.y + nodeRadius * Math.sin(angle);
      const endX = nextPos.x - nodeRadius * Math.cos(angle);
      const endY = nextPos.y - nodeRadius * Math.sin(angle);
      
      // Determine arrow colors based on node states
      // Current node: yellow (#fbbf24), next node: green (#86efac)
      const currentColor = '#fbbf24';
      const currentStroke = '#f59e0b';
      const nextColor = '#86efac';
      const nextStroke = '#4ade80';
      
      // Use gradient from current to next, or blend
      const arrowColor = currentColor; // Start with current node color
      const arrowStroke = currentStroke;
      const markerColor = nextColor; // Arrow head uses next node color
      const markerStroke = nextStroke;
      
      // Create unique marker ID for this step to avoid conflicts
      const traversalMarkerId = `traversalArrowhead-${currentNode.val}-${nextNode.val}`;
      const gradientId = `traversalGradient-${currentNode.val}-${nextNode.val}`;
      
      traversalArrows.push(
        <g key="traversal-arrow-group">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={currentColor} />
              <stop offset="100%" stopColor={nextColor} />
            </linearGradient>
            <marker
              id={traversalMarkerId}
              markerWidth="12"
              markerHeight="12"
              refX="10"
              refY="4"
              orient="auto"
            >
              <polygon
                points="0 0, 12 4, 0 8"
                fill={markerColor}
                stroke={markerStroke}
                strokeWidth="1"
              />
            </marker>
          </defs>
          <line
            key="traversal-arrow"
            x1={startX}
            y1={startY}
            x2={endX}
            y2={endY}
            stroke={`url(#${gradientId})`}
            strokeWidth="3"
            markerEnd={`url(#${traversalMarkerId})`}
            opacity="0.9"
          />
        </g>
      );
    }
  }

  return (
    <svg width="100%" height="500" viewBox="0 0 800 500" style={{ minHeight: '400px' }}>
      {arrowMarkers}
      {lines}
      {nodes}
      {traversalArrows}
    </svg>
  );
}

// Dynamic Programming Visualizers
function KnapsackVisualizer({ step, action }) {
  const dp = step.dp || [];
  const currentItem = step.currentItem;
  const currentCapacity = step.currentCapacity;
  const maxValue = step.maxValue;
  
  return (
    <div className="relative min-h-64">
      <div className="absolute top-2 left-2 z-10 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="text-xs text-slate-400 mb-1">Current Action</div>
        <div className="text-sm font-semibold">{action}</div>
      </div>
      <div className="p-4">
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-green-600">Max Value: {maxValue}</div>
        </div>
        {dp.length > 0 && (
          <div className="grid gap-1 border-2 border-slate-700 max-w-md mx-auto" style={{ gridTemplateColumns: `repeat(${dp[0].length}, minmax(0, 1fr))` }}>
            {dp.map((row, i) =>
              row.map((val, j) => {
                const isCurrent = currentItem !== null && currentItem !== undefined && 
                                  currentCapacity !== null && currentCapacity !== undefined &&
                                  i === currentItem + 1 && j === currentCapacity;
                const bgColor = isCurrent ? 'bg-yellow-500 ring-2 ring-yellow-300' : 'bg-slate-100';
                return (
                  <div key={`${i}-${j}`} className={`w-12 h-12 flex items-center justify-center border border-slate-600 ${bgColor}`}>
                    <span className="text-xs font-semibold">{val}</span>
                  </div>
                );
              })
            )}
          </div>
        )}
        {step.message && (
          <div className="mt-2 text-center text-sm text-slate-600">{step.message}</div>
        )}
      </div>
    </div>
  );
}

function LCSVisualizer({ step, action }) {
  const dp = step.dp || [];
  const lcsLength = step.lcsLength;
  const lcsString = step.lcsString;
  const currentI = step.currentI;
  const currentJ = step.currentJ;
  const match = step.match;
  const isCompleted = action === 'COMPLETED';
  const str1 = step.str1 || '';
  const str2 = step.str2 || '';
  
  return (
    <div className="relative min-h-64">
      <div className="absolute top-2 left-2 z-10 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="text-xs text-slate-400 mb-1">Current Action</div>
        <div className="text-sm font-semibold">{action}</div>
      </div>
      <div className="p-4 space-y-4">
        {/* Result Display - Top Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border-2 border-green-400 shadow-lg">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-700 mb-3">Longest Common Subsequence</div>
            <div className="flex items-center justify-center gap-6 mb-4">
              <div className="bg-white px-6 py-3 rounded-lg border-2 border-green-500 shadow-md">
                <div className="text-sm text-slate-600 mb-1">Length</div>
                <div className="text-2xl font-bold text-green-600">{lcsLength !== undefined ? lcsLength : '...'}</div>
              </div>
              {lcsString && (
                <div className="bg-white px-6 py-3 rounded-lg border-2 border-blue-500 shadow-md">
                  <div className="text-sm text-slate-600 mb-1">LCS String</div>
                  <div className="text-xl font-mono font-bold text-blue-700">"{lcsString}"</div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Comparing Sequences - Middle Section */}
        {str1 && str2 && (
          <div className="bg-white p-5 rounded-xl border-2 border-blue-300 shadow-md">
            <div className="text-lg font-bold text-blue-800 mb-3 text-center">Comparing Characters</div>
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs font-semibold text-slate-600 mb-2">String 1:</div>
                <div className="flex gap-2 justify-center flex-wrap">
                  {str1.split('').map((char, idx) => {
                    const isHighlight = currentI !== null && idx === currentI;
                    return (
                      <div 
                        key={idx} 
                        className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold text-lg transition-all ${
                          isHighlight 
                            ? 'bg-yellow-400 border-yellow-600 scale-110 shadow-lg' 
                            : 'bg-blue-50 border-blue-300'
                        }`}
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-600 mb-2">String 2:</div>
                <div className="flex gap-2 justify-center flex-wrap">
                  {str2.split('').map((char, idx) => {
                    const isHighlight = currentJ !== null && idx === currentJ;
                    return (
                      <div 
                        key={idx} 
                        className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-bold text-lg transition-all ${
                          isHighlight 
                            ? 'bg-yellow-400 border-yellow-600 scale-110 shadow-lg' 
                            : 'bg-blue-50 border-blue-300'
                        }`}
                      >
                        {char}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {match !== null && (
              <div className={`text-center py-2 rounded-lg font-semibold ${
                match ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {match ? '✓ Characters Match!' : '✗ Characters Do Not Match'}
              </div>
            )}
          </div>
        )}
        
        {/* DP Table - Bottom Section */}
        {dp.length > 0 && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-300">
            <div className="text-sm font-semibold text-slate-700 mb-3">
              DP Table {!isCompleted && '(building...)'}
            </div>
            <div className="overflow-auto max-h-80">
              <div className="inline-block border-2 border-slate-400 rounded-lg p-2 bg-white">
                <table className="border-collapse">
                  <thead>
                    <tr>
                      <th className="border border-slate-400 bg-slate-200 p-2 text-xs font-bold">-</th>
                      <th className="border border-slate-400 bg-slate-200 p-2 text-xs font-bold">-</th>
                      {str2 && str2.split('').map((char, idx) => (
                        <th key={idx} className="border border-slate-400 bg-slate-200 p-2 text-xs font-bold w-12">
                          {char}
                        </th>
                      ))}
                    </tr>
                    <tr>
                      <th className="border border-slate-400 bg-slate-200 p-2 text-xs font-bold">-</th>
                      <th className="border border-slate-400 bg-slate-200 p-2 text-xs font-bold">0</th>
                      {str2 && str2.split('').map((_, idx) => (
                        <th key={idx} className="border border-slate-400 bg-slate-200 p-2 text-xs font-bold">
                          {idx + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dp.map((row, i) => {
                      const rowChar = i === 0 ? '-' : str1[i - 1];
                      return (
                        <tr key={i}>
                          <td className="border border-slate-400 bg-slate-200 p-2 text-xs font-bold">{rowChar}</td>
                          <td className="border border-slate-400 bg-slate-200 p-2 text-xs font-bold">{i}</td>
                          {row.map((val, j) => {
                            const isCurrent = currentI !== null && currentJ !== null && i === currentI + 1 && j === currentJ + 1;
                            let bgColor = 'bg-slate-50';
                            if (isCurrent) bgColor = match ? 'bg-green-300' : 'bg-yellow-300';
                            return (
                              <td 
                                key={j} 
                                className={`border border-slate-400 p-3 text-center font-bold ${bgColor} min-w-[3rem]`}
                              >
                                {val}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {step.message && (
          <div className="text-center text-sm text-slate-600 bg-slate-100 p-2 rounded">{step.message}</div>
        )}
      </div>
    </div>
  );
}

function CoinChangeVisualizer({ step, action }) {
  const dp = step.dp || [];
  const minCoins = step.minCoins;
  const currentAmount = step.currentAmount;
  
  return (
    <div className="relative min-h-64">
      <div className="absolute top-2 left-2 z-10 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="text-xs text-slate-400 mb-1">Current Action</div>
        <div className="text-sm font-semibold">{action}</div>
      </div>
      <div className="p-4">
        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-green-600">Min Coins: {minCoins === -1 ? 'Impossible' : minCoins}</div>
        </div>
        <div className="flex items-end gap-1 max-h-64 overflow-auto">
          {dp.map((val, i) => {
            const isCurrent = currentAmount !== null && i === currentAmount;
            const isImpossible = val === Infinity;
            const height = isImpossible ? 20 : val * 20;
            const bgColor = isCurrent ? 'bg-yellow-500' : isImpossible ? 'bg-red-500' : 'bg-blue-500';
            return (
              <div key={i} className="flex-1 p-2 text-center">
                <div style={{ height: `${height}px` }} className={`w-full rounded mb-2 ${bgColor} flex items-center justify-center`}>
                  {!isImpossible && <span className="text-white text-xs font-bold">{val}</span>}
                </div>
                <div className="text-xs">{i}</div>
              </div>
            );
          })}
        </div>
        {step.message && (
          <div className="mt-2 text-center text-sm text-slate-600">{step.message}</div>
        )}
      </div>
    </div>
  );
}

// Recursion Visualizers
function RecursionVisualizer({ step, action, algo }) {
  // Extract all computed values from memo or computed if available
  const memo = step.memo || step.computed || {};
  const computedValues = Object.keys(memo).length > 0 ? memo : null;
  
  return (
    <div className="relative min-h-64">
      <div className="absolute top-2 left-2 z-10 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="text-xs text-slate-400 mb-1">Current Action</div>
        <div className="text-sm font-semibold">{action}</div>
      </div>
      <div className="p-4 flex flex-col items-center justify-center min-h-64">
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-purple-600">
            {algo === 'factorial' ? '!' : 'F'}
          </div>
          <div className="text-2xl font-bold text-green-600 mt-2">
            {step.currentN !== null ? step.currentN : 'N/A'} = {step.result !== null ? step.result : '?'}
          </div>
        </div>
        {step.callStack && (
          <div className="bg-slate-100 p-4 rounded-lg text-center">
            <div className="text-sm text-slate-600">{step.callStack}</div>
          </div>
        )}
        {step.message && (
          <div className="mt-4 text-center text-lg text-slate-700 max-w-md">{step.message}</div>
        )}
        {/* Show all computed values at completion */}
        {action === 'COMPLETED' && computedValues && (
          <div className="mt-6 bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
            <div className="text-lg font-bold text-blue-800 mb-2">
              {algo === 'fibonacci' ? 'Fibonacci Sequence:' : 'Factorial Values:'}
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {Object.entries(computedValues)
                .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                .map(([n, val]) => (
                  <div key={n} className="bg-white px-3 py-1 rounded border border-blue-300">
                    <span className="text-sm font-semibold text-blue-700">
                      {algo === 'fibonacci' ? `F(${n})` : `${n}!`} = {val}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Graph Visualizers
function GraphVisualizer({ step, action, algo, adjacencyList, startNode }) {
  const queue = step.queue || [];
  const visited = step.visited || [];
  const traversal = step.traversal || [];
  const currentNode = step.currentNode;
  
  // Calculate node positions for graph visualization
  // Collect ALL nodes (both keys and all neighbors)
  const getAllNodes = (adjList) => {
    const nodeSet = new Set();
    
    // Add all keys (source nodes)
    Object.keys(adjList).forEach(node => nodeSet.add(node));
    
    // Add all neighbors (target nodes)
    Object.values(adjList).forEach(neighbors => {
      if (Array.isArray(neighbors)) {
        neighbors.forEach(neighbor => nodeSet.add(neighbor));
      } else if (typeof neighbors === 'object' && neighbors !== null) {
        Object.keys(neighbors).forEach(neighbor => nodeSet.add(neighbor));
      }
    });
    
    return Array.from(nodeSet);
  };
  
  const getNodePositions = (adjList) => {
    const allNodes = getAllNodes(adjList);
    const positions = {};
    const radius = Math.min(150, Math.max(120, 150 - (allNodes.length * 5))); // Adjust radius based on node count
    const centerX = 400;
    const centerY = 250;
    
    allNodes.forEach((node, idx) => {
      const angle = (2 * Math.PI * idx) / allNodes.length;
      positions[node] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });
    
    return positions;
  };
  
  const nodePositions = getNodePositions(adjacencyList || {});
  
  return (
    <div className="relative min-h-64">
      <div className="absolute top-2 left-2 z-10 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="text-xs text-slate-400 mb-1">Current Action</div>
        <div className="text-sm font-semibold">{action}</div>
      </div>
      <div className="p-4">
        {/* Graph Visualization */}
        {adjacencyList && Object.keys(adjacencyList).length > 0 && (
          <div className="mb-4 border-2 border-slate-300 rounded-lg bg-slate-50 p-4">
            <div className="text-xs text-slate-600 mb-2 font-semibold">Graph Visualization:</div>
            <svg width="100%" height="300" viewBox="0 0 800 500" className="border border-slate-200 rounded">
              {/* Draw edges */}
              {Object.entries(adjacencyList).map(([node, neighbors]) => {
                const sourcePos = nodePositions[node];
                if (!sourcePos) return null;
                
                const neighborList = Array.isArray(neighbors) ? neighbors : Object.keys(neighbors);
                
                return neighborList.map((neighbor) => {
                  const targetPos = nodePositions[neighbor];
                  if (!targetPos) return null;
                  
                  // Check if this edge was actually used in traversal
                  const nodeIndex = traversal.indexOf(node);
                  const neighborIndex = traversal.indexOf(neighbor);
                  
                  // For BFS/DFS: An edge is traversed if both nodes are visited
                  // We also check if the edge was used during the algorithm execution
                  // An edge is used if the neighbor was discovered from the current node
                  const bothVisited = visited.includes(node) && visited.includes(neighbor);
                  
                  // Check if nodes are consecutive in traversal (one discovered the other)
                  const isConsecutive = nodeIndex !== -1 && neighborIndex !== -1 && 
                    (neighborIndex === nodeIndex + 1 || nodeIndex === neighborIndex + 1);
                  
                  // Also check if we're currently exploring this edge
                  const isCurrentlyExploring = currentNode === node && visited.includes(neighbor);
                  
                  // For BFS/DFS: highlight edge if both nodes are visited (graph was traversed)
                  // This ensures all edges in the visited subgraph are shown
                  const isTraversed = bothVisited || isCurrentlyExploring;
                  
                  return (
                    <line
                      key={`${node}-${neighbor}`}
                      x1={sourcePos.x}
                      y1={sourcePos.y}
                      x2={targetPos.x}
                      y2={targetPos.y}
                      stroke={isTraversed ? '#10b981' : '#94a3b8'}
                      strokeWidth={isTraversed ? '4' : '2'}
                      strokeDasharray={isTraversed ? '0' : '5,5'}
                      opacity={isTraversed ? '1' : '0.4'}
                    />
                  );
                });
              })}
              
              {/* Draw nodes */}
              {Object.entries(nodePositions).map(([node, pos]) => {
                const isVisited = visited.includes(node);
                const isInQueue = queue.includes(node);
                const isCurrent = currentNode === node;
                
                let fillColor = '#3b82f6'; // Default blue
                if (isCurrent) fillColor = '#fbbf24'; // Yellow for current
                else if (isVisited) fillColor = '#10b981'; // Green for visited
                else if (isInQueue) fillColor = '#60a5fa'; // Light blue for in queue
                
                return (
                  <g key={node}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="25"
                      fill={fillColor}
                      stroke={isCurrent ? '#f59e0b' : '#1e40af'}
                      strokeWidth="2"
                    />
                    <text
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="14"
                      fontWeight="bold"
                    >
                      {node}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-blue-50 p-3 rounded">
            <div className="text-xs text-slate-600 mb-1">Queue</div>
            <div className="text-lg font-bold text-blue-600">{queue.join(', ') || '-'}</div>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <div className="text-xs text-slate-600 mb-1">Visited</div>
            <div className="text-lg font-bold text-green-600">{visited.join(', ') || '-'}</div>
          </div>
          <div className="bg-purple-50 p-3 rounded">
            <div className="text-xs text-slate-600 mb-1">Visitation Order</div>
            <div className="text-sm font-bold text-purple-600">{traversal.join(' → ') || '-'}</div>
            <div className="text-xs text-slate-500 mt-1 italic">(Order nodes were visited, not graph path)</div>
          </div>
        </div>
        
        {/* Show actual graph connections vs traversal path */}
        <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-300">
          <div className="text-xs font-semibold text-amber-800 mb-2">Graph Structure:</div>
          <div className="text-xs text-amber-700">
            {Object.entries(adjacencyList || {}).map(([node, neighbors]) => {
              const neighborList = Array.isArray(neighbors) ? neighbors : Object.keys(neighbors || {});
              return (
                <div key={node} className="mb-1">
                  <span className="font-bold">{node}</span> → {neighborList.join(', ') || 'none'}
                </div>
              );
            })}
          </div>
        </div>
        
        {step.message && (
          <div className="mt-2 text-center text-lg text-slate-700">{step.message}</div>
        )}
      </div>
    </div>
  );
}

function DijkstraVisualizer({ step, action, adjacencyList, startNode, endNode }) {
  const distances = step.distances || {};
  const visited = step.visited || [];
  const visitedNode = step.visitedNode;
  
  // Calculate node positions for graph visualization
  // Collect ALL nodes (both keys and all neighbors)
  const getAllNodes = (adjList) => {
    const nodeSet = new Set();
    
    // Add all keys (source nodes)
    Object.keys(adjList).forEach(node => nodeSet.add(node));
    
    // Add all neighbors (target nodes) from weighted edges
    Object.values(adjList).forEach(neighbors => {
      if (typeof neighbors === 'object' && neighbors !== null) {
        Object.keys(neighbors).forEach(neighbor => nodeSet.add(neighbor));
      }
    });
    
    return Array.from(nodeSet);
  };
  
  const getNodePositions = (adjList) => {
    const allNodes = getAllNodes(adjList);
    const positions = {};
    const radius = Math.min(150, Math.max(120, 150 - (allNodes.length * 5))); // Adjust radius based on node count
    const centerX = 400;
    const centerY = 250;
    
    allNodes.forEach((node, idx) => {
      const angle = (2 * Math.PI * idx) / allNodes.length;
      positions[node] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      };
    });
    
    return positions;
  };
  
  const nodePositions = getNodePositions(adjacencyList || {});
  
  return (
    <div className="relative min-h-64">
      <div className="absolute top-2 left-2 z-10 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="text-xs text-slate-400 mb-1">Current Action</div>
        <div className="text-sm font-semibold">{action}</div>
      </div>
      <div className="p-4">
        {/* Graph Visualization */}
        {adjacencyList && Object.keys(adjacencyList).length > 0 && (
          <div className="mb-4 border-2 border-slate-300 rounded-lg bg-slate-50 p-4">
            <div className="text-xs text-slate-600 mb-2 font-semibold">Graph Visualization:</div>
            <svg width="100%" height="300" viewBox="0 0 800 500" className="border border-slate-200 rounded">
              {/* Draw edges with weights */}
              {Object.entries(adjacencyList).map(([node, neighbors]) => {
                const sourcePos = nodePositions[node];
                if (!sourcePos) return null;
                
                return Object.entries(neighbors).map(([neighbor, weight]) => {
                  const targetPos = nodePositions[neighbor];
                  if (!targetPos) return null;
                  
                  const isVisitedEdge = visited.includes(node) && visited.includes(neighbor);
                  
                  return (
                    <g key={`${node}-${neighbor}`}>
                      <line
                        x1={sourcePos.x}
                        y1={sourcePos.y}
                        x2={targetPos.x}
                        y2={targetPos.y}
                        stroke={isVisitedEdge ? '#10b981' : '#94a3b8'}
                        strokeWidth={isVisitedEdge ? '3' : '2'}
                        strokeDasharray={isVisitedEdge ? '0' : '5,5'}
                      />
                      {/* Weight label */}
                      <text
                        x={(sourcePos.x + targetPos.x) / 2}
                        y={(sourcePos.y + targetPos.y) / 2 - 5}
                        textAnchor="middle"
                        fill="#1e40af"
                        fontSize="12"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {weight}
                      </text>
                    </g>
                  );
                });
              })}
              
              {/* Draw nodes */}
              {Object.entries(nodePositions).map(([node, pos]) => {
                const isVisited = visited.includes(node);
                const isCurrent = visitedNode === node;
                const distance = distances[node];
                
                let fillColor = '#3b82f6'; // Default blue
                if (isCurrent) fillColor = '#fbbf24'; // Yellow for current
                else if (isVisited) fillColor = '#10b981'; // Green for visited
                else if (distance !== undefined && distance !== Infinity) fillColor = '#60a5fa'; // Light blue for updated
                
                return (
                  <g key={node}>
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r="25"
                      fill={fillColor}
                      stroke={isCurrent ? '#f59e0b' : '#1e40af'}
                      strokeWidth="2"
                    />
                    <text
                      x={pos.x}
                      y={pos.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="14"
                      fontWeight="bold"
                    >
                      {node}
                    </text>
                    {/* Distance label */}
                    {distance !== undefined && (
                      <text
                        x={pos.x}
                        y={pos.y + 35}
                        textAnchor="middle"
                        fill={distance === Infinity ? '#ef4444' : '#1e40af'}
                        fontSize="10"
                        fontWeight="bold"
                      >
                        {distance === Infinity ? '∞' : distance}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-yellow-50 p-3 rounded">
            <div className="text-xs text-slate-600 mb-1">Visiting</div>
            <div className="text-lg font-bold text-yellow-600">{visitedNode || '-'}</div>
          </div>
          <div className="bg-green-50 p-3 rounded">
            <div className="text-xs text-slate-600 mb-1">Visited</div>
            <div className="text-lg font-bold text-green-600">{visited.join(', ') || '-'}</div>
          </div>
        </div>
        <div className="bg-slate-50 p-3 rounded">
          <div className="text-xs text-slate-600 mb-2">Shortest Distances</div>
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(distances).map(([node, dist]) => (
              <div key={node} className="text-center">
                <div className="text-xs text-slate-600">{node}</div>
                <div className={`text-lg font-bold ${dist === Infinity ? 'text-red-600' : 'text-blue-600'}`}>
                  {dist === Infinity ? '∞' : dist}
                </div>
              </div>
            ))}
          </div>
        </div>
        {step.message && (
          <div className="mt-2 text-center text-lg text-slate-700">{step.message}</div>
        )}
      </div>
    </div>
  );
}

// Search Visualizers
function SearchVisualizer({ step, action, algo }) {
  const arr = step.array || [];
  const target = step.target;
  const currentIndex = step.currentIndex;
  const foundIndex = step.foundIndex;
  const left = step.left;
  const right = step.right;
  
  if (!arr || arr.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500">
        <div className="text-center">
          <div className="text-lg font-semibold mb-2">No array data</div>
          <div className="text-sm">Please enter an array and target value, then click "Compute Steps"</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative min-h-64">
      <div className="absolute top-2 left-2 z-10 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-lg">
        <div className="text-xs text-slate-400 mb-1">Current Action</div>
        <div className="text-sm font-semibold">{action}</div>
      </div>
      <div className="p-4">
        <div className="text-center mb-4 bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
          <div className="text-2xl font-bold text-blue-600">Target: {target}</div>
          {foundIndex !== -1 && (
            <div className="text-xl font-bold text-green-600 mt-2">
              ✓ Found at index {foundIndex}!
            </div>
          )}
          {action === 'NOT_FOUND' && (
            <div className="text-xl font-bold text-red-600 mt-2">
              ✗ Target not found in array
            </div>
          )}
        </div>
        <div className="flex items-end gap-2 overflow-x-auto pb-4">
          {arr.map((val, i) => {
            const isCurrent = currentIndex !== null && i === currentIndex;
            const isFound = foundIndex !== -1 && i === foundIndex;
            const isInRange = algo === 'binarysearch' && left !== null && right !== null && i >= left && i <= right;
            const isOutOfRange = algo === 'binarysearch' && left !== null && right !== null && (i < left || i > right);
            
            let bgColor = 'bg-blue-500';
            if (isFound) bgColor = 'bg-green-500';
            else if (isCurrent) bgColor = 'bg-yellow-500';
            else if (isInRange) bgColor = 'bg-blue-300';
            else if (isOutOfRange) bgColor = 'bg-gray-300 opacity-50';
            
            return (
              <div key={i} className="flex flex-col items-center min-w-16">
                <div className={`w-16 h-20 rounded-lg flex items-center justify-center shadow-lg transition-all ${bgColor}`}>
                  <span className="text-white font-bold text-lg">{val}</span>
                </div>
                <div className="text-xs mt-2 font-semibold">[{i}]</div>
                {isCurrent && (
                  <div className="text-xs mt-1 font-bold text-yellow-600">↑ Current</div>
                )}
              </div>
            );
          })}
        </div>
        {algo === 'binarysearch' && left !== null && right !== null && (
          <div className="mt-2 text-center text-sm text-blue-600 font-semibold">
            Search Range: [{left}, {right}]
          </div>
        )}
        {step.message && (
          <div className="mt-4 text-center text-lg text-slate-700 bg-slate-100 p-3 rounded">{step.message}</div>
        )}
      </div>
    </div>
  );
}

