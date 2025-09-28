import React from 'react';
import { useNavigate } from 'react-router-dom';

const algorithms = [
  { id: 'bubble', name: 'Bubble Sort', category: 'Sorting', desc: 'Simple comparison-based sort.' },
  { id: 'insertion', name: 'Insertion Sort', category: 'Sorting', desc: 'Builds sorted array one item at a time.' },
  { id: 'bfs', name: 'BFS', category: 'Graph', desc: 'Breadth-first search traversal.' }
];

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        {algorithms.map(a => (
          <div key={a.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">{a.name}</h3>
            <p className="text-sm text-slate-600">{a.desc}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => navigate(`/visualizer?algo=${a.id}`)} className="bg-sky-600 text-white px-3 py-1 rounded text-sm">Open</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
