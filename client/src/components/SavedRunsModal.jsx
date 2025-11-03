import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../assets/API_URL';

export default function SavedRunsModal({ open, onClose, algo, onSelect }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to retrieve saved inputs.');
      onClose && onClose();
      return;
    }
    (async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.get(`${API_URL}api/runs/list`, {
          params: { algorithm: algo, limit: 5 },
          headers: { Authorization: `Bearer ${token}` }
        });
        setItems(Array.isArray(res.data?.items) ? res.data.items : []);
      } catch (e) {
        setError(e.response?.data?.message || 'Failed to load saved runs');
      } finally {
        setLoading(false);
      }
    })();
  }, [open, algo, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded shadow p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">Retrieve Custom Input — {algo}</div>
          <button className="text-slate-500 hover:text-slate-700" onClick={onClose}>✕</button>
        </div>
        {loading ? (
          <div className="p-6 text-center text-slate-600">Loading...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600 text-sm">{error}</div>
        ) : (
          <div className="max-h-80 overflow-auto divide-y">
            {items.length === 0 && (
              <div className="p-4 text-sm text-slate-500">No saved runs.</div>
            )}
            {items.map((it) => (
              <button key={it._id} className="w-full text-left p-3 hover:bg-slate-50" onClick={() => onSelect && onSelect(it)}>
                <div className="text-sm text-slate-800">
                  {renderInputPreview(algo, it.input)}
                </div>
                <div className="text-xs text-slate-500 mt-1">{new Date(it.createdAt).toLocaleString()}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function renderInputPreview(algo, input) {
  if (!input) return '—';
  switch (algo) {
    case 'bubble':
    case 'selection':
    case 'insertion':
    case 'merge':
    case 'quick':
    case 'linearsearch':
    case 'binarysearch':
      return Array.isArray(input.array) ? `[${input.array.join(', ')}]` : '—';
    case 'nqueen':
      return `N = ${input.nSize}`;
    case 'gridpaths':
      return Array.isArray(input.gridMatrix) ? `${input.gridMatrix.length}x${input.gridMatrix[0]?.length}` : '—';
    case 'inorder':
      return input.adjList ? 'Binary Tree (adjacency list)' : 'Binary Tree';
    case 'lcs':
      return `${input.str1} vs ${input.str2}`;
    case 'coinchange':
      return `coins=[${input.coins?.join(', ')}], amount=${input.amount}`;
    case 'knapsack01':
      return `weights=[${input.weights?.join(', ')}], values=[${input.values?.join(', ')}], cap=${input.capacity}`;
    case 'bfs':
    case 'dfs':
      return `start=${input.startNode}`;
    case 'dijkstra':
      return `start=${input.startNode}, end=${input.endNode}`;
    case 'factorial':
    case 'fibonacci':
      return `n=${input.n}`;
    default:
      return '—';
  }
}


