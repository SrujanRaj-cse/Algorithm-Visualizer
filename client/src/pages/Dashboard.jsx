import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const algorithms = [
  { id: 'bubble', name: 'Bubble Sort', category: 'Sorting', desc: 'Simple comparison-based sort.', icon: '🔴', color: '#ef4444' },
  { id: 'selection', name: 'Selection Sort', category: 'Sorting', desc: 'Selects minimum element and places it in position.', icon: '🟡', color: '#eab308' },
  { id: 'insertion', name: 'Insertion Sort', category: 'Sorting', desc: 'Builds sorted array one item at a time.', icon: '🟢', color: '#22c55e' },
  { id: 'merge', name: 'Merge Sort', category: 'Sorting', desc: 'Divide and conquer algorithm.', icon: '🔵', color: '#3b82f6' },
  { id: 'quick', name: 'Quick Sort', category: 'Sorting', desc: 'Partition-based sorting algorithm.', icon: '🟣', color: '#a855f7' },
  
  { id: 'nqueen', name: 'N-Queens', category: 'Recursion', desc: 'Backtracking algorithm to place N queens.', icon: '👑', color: '#f59e0b' },
  { id: 'gridpaths', name: 'Grid Paths II', category: 'Dynamic Programming', desc: 'Count unique paths with obstacles.', icon: '🚧', color: '#06b6d4' },
  { id: 'inorder', name: 'Inorder Traversal', category: 'Binary Tree', desc: 'Inorder traversal of binary tree.', icon: '🌳', color: '#84cc16' },
  { id: 'preorder', name: 'Preorder Traversal', category: 'Binary Tree', desc: 'Preorder traversal of binary tree.', icon: '🌳', color: '#22c55e' },
  { id: 'postorder', name: 'Postorder Traversal', category: 'Binary Tree', desc: 'Postorder traversal of binary tree.', icon: '🌳', color: '#16a34a' },
  
  { id: 'knapsack01', name: '0/1 Knapsack', category: 'Dynamic Programming', desc: 'Maximize value within weight limit.', icon: '💼', color: '#8b5cf6' },
  { id: 'lcs', name: 'Longest Common Subsequence', category: 'Dynamic Programming', desc: 'Find longest common subsequence.', icon: '📊', color: '#06b6d4' },
  { id: 'coinchange', name: 'Coin Change', category: 'Dynamic Programming', desc: 'Min coins for given amount.', icon: '🪙', color: '#eab308' },
  
  { id: 'factorial', name: 'Factorial', category: 'Recursion', desc: 'Compute factorial of a number.', icon: '🔢', color: '#ec4899' },
  { id: 'fibonacci', name: 'Fibonacci', category: 'Recursion', desc: 'Fibonacci sequence with memoization.', icon: '🌀', color: '#f97316' },
  
  { id: 'bfs', name: 'Breadth-First Search', category: 'Graph', desc: 'Level-order graph traversal.', icon: '🔍', color: '#3b82f6' },
  { id: 'dfs', name: 'Depth-First Search', category: 'Graph', desc: 'Deep-first graph exploration.', icon: '🌊', color: '#06b6d4' },
  { id: 'dijkstra', name: "Dijkstra's Algorithm", category: 'Graph', desc: 'Shortest path in weighted graph.', icon: '🗺️', color: '#10b981' },
  
  { id: 'linearsearch', name: 'Linear Search', category: 'Search', desc: 'Sequential element search.', icon: '🔎', color: '#f59e0b' },
  { id: 'binarysearch', name: 'Binary Search', category: 'Search', desc: 'Fast search in sorted arrays.', icon: '⚡', color: '#ef4444' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  
  const categories = [...new Set(algorithms.map(a => a.category))];
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Algorithm Visualizer</h1>
        <p className="dashboard-subtitle">Explore, learn, and visualize complex algorithms step by step</p>
      </div>

      {categories.map(category => (
        <div key={category} className="category-section">
          <h2 className="category-title">{category}</h2>
          <div className="algorithms-grid">
            {algorithms
              .filter(a => a.category === category)
              .map(a => (
                <div key={a.id} className="algorithm-card" onClick={() => navigate(`/visualizer?algo=${a.id}`)}>
                  <div className="card-header" style={{ backgroundColor: a.color + '20' }}>
                    <span className="card-icon">{a.icon}</span>
                    <div className="card-glow" style={{ backgroundColor: a.color }}></div>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">{a.name}</h3>
                    <p className="card-desc">{a.desc}</p>
                  </div>
                  <div className="card-footer">
                    <button className="card-btn" style={{ borderColor: a.color, color: a.color }}>
                      Visualize →
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
