import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../assets/API_URL';

export default function SaveRunButton({ algo, arr, nSize, gridMatrix, headNode, str1, str2, coins, amount, weights, values, capacity, adjacencyList, startNode, endNode, target, speed, steps }) {
  const [saving, setSaving] = useState(false);

  const buildPayload = () => {
    switch (algo) {
      case 'bubble':
      case 'selection':
      case 'insertion':
      case 'merge':
      case 'quick':
        return { algorithm: algo, input: { array: arr } };
      case 'nqueen':
        return { algorithm: algo, input: { nSize } };
      case 'gridpaths':
        return { algorithm: algo, input: { gridMatrix } };
      case 'inorder':
      case 'preorder':
      case 'postorder':
        return { algorithm: algo, input: { adjList: toAdjacencyList(headNode) } };
      case 'lcs':
        return { algorithm: algo, input: { str1, str2 } };
      case 'coinchange':
        return { algorithm: algo, input: { coins, amount } };
      case 'knapsack01':
        return { algorithm: algo, input: { weights, values, capacity } };
      case 'bfs':
      case 'dfs':
        return { algorithm: algo, input: { adjacencyList, startNode } };
      case 'dijkstra':
        return { algorithm: algo, input: { adjacencyList, startNode, endNode } };
      case 'linearsearch':
      case 'binarysearch':
        return { algorithm: algo, input: { array: arr, target } };
      case 'factorial':
      case 'fibonacci':
        return { algorithm: algo, input: { n: Array.isArray(arr) ? arr[0] : arr } };
      default:
        return { algorithm: algo, input: {} };
    }
  };

  function toAdjacencyList(head) {
    const adj = {};
    let id = 0;
    const map = new Map();
    const getId = (node) => {
      if (!node) return null;
      if (map.has(node)) return map.get(node);
      const nid = String(id++);
      map.set(node, nid);
      return nid;
    };
    const dfs = (node) => {
      if (!node) return null;
      const nid = getId(node);
      const leftId = node.left ? getId(node.left) : null;
      const rightId = node.right ? getId(node.right) : null;
      adj[nid] = { val: node.val, left: leftId, right: rightId };
      if (node.left) dfs(node.left);
      if (node.right) dfs(node.right);
      return nid;
    };
    const rootId = dfs(head);
    adj.__root = rootId;
    return adj;
  }

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to save custom inputs.');
        setSaving(false);
        return;
      }
      const payload = buildPayload();
      payload.preferences = { speed };
      payload.steps = Array.isArray(steps) ? steps : [];
      const res = await axios.post(`${API_URL}api/runs/saveInput`, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      alert(res.data?.message || 'Saved');
    } catch (e) {
      const msg = e.response?.data?.message || 'Save failed';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <button onClick={handleSave} disabled={saving} className={`px-3 py-2 rounded text-white ${saving ? 'bg-slate-400' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
      {saving ? 'Saving...' : 'Save Custom Input'}
    </button>
  );
}


