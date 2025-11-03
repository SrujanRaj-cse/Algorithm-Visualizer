import React, { useState, useEffect } from 'react';
import GridPathsInput from './GridPathsInput';
import CustomBTrees from '../CustomBTrees';

export default function GiveAlgoInput({
  algoo, input, setInput, onCompute, 
  gridMatrix, setGridMatrix, 
  headNode, setHeadNode, headChanged, setHeadChanged,
  // New props
  str1, setStr1, str2, setStr2,
  coins, setCoins, amount, setAmount,
  weights, setWeights, values, setValues, capacity, setCapacity,
  adjacencyList, setAdjacencyList, startNode, setStartNode, endNode, setEndNode,
  target, setTarget
}) {
    // Grid Paths - custom component
    if (algoo === 'gridpaths') {
        return <GridPathsInput gridMatrix={gridMatrix} setGridMatrix={setGridMatrix} onCompute={onCompute} />;
    }

    // Binary Tree - custom component
    if (['inorder','preorder','postorder'].includes(algoo)) {
        return (
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Binary Tree Input:</label>
                <p className="text-xs text-slate-600 mb-2">
                    Click nodes to edit values. Hover over empty positions to add new nodes. Click "Set Tree" when done.
                </p>
                <CustomBTrees setHeadNode={setHeadNode} headNode={headNode} onSetTree={onCompute} headChanged={headChanged} setHeadChanged={setHeadChanged} />
            </div>
        );
    }
    
    // N-Queen
    if (algoo === 'nqueen') {
        return (
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Board Size (N):</label>
                <input 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500" 
                    placeholder="4 (n x n board size)"
                    type="text"
                />
                <p className="text-xs text-slate-500">Note: Board size limited to 4-8 to prevent memory issues</p>
                <button onClick={onCompute} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded font-medium transition-colors">
                    Compute Steps
                </button>
            </div>
        );
    }
    
    // Factorial & Fibonacci
    if (algoo === 'factorial' || algoo === 'fibonacci') {
        return (
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Enter number:</label>
                <input 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500" 
                    placeholder={algoo === 'factorial' ? 'Enter n (0-20)' : 'Enter n (0-40)'}
                    type="text"
                />
                <p className="text-xs text-slate-500">
                    {algoo === 'factorial' ? 'Note: Keep n below 20 to avoid performance issues' : 'Note: Large numbers use memoization'}
                </p>
                <button onClick={onCompute} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded font-medium transition-colors">
                    Compute Steps
                </button>
            </div>
        );
    }
    
    // LCS
    if (algoo === 'lcs') {
        return (
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Longest Common Subsequence:</label>
                <input 
                    value={str1} 
                    onChange={(e) => setStr1(e.target.value)} 
                    placeholder="String 1"
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 mb-2"
                />
                <input 
                    value={str2} 
                    onChange={(e) => setStr2(e.target.value)} 
                    placeholder="String 2"
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 mb-2"
                />
                <button onClick={onCompute} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded font-medium transition-colors">
                    Compute Steps
                </button>
            </div>
        );
    }
    
    // Knapsack 0/1
    if (algoo === 'knapsack01') {
        const [stringWeights, setStringWeights] = useState('2,3,4');
        const [stringValues, setStringValues] = useState('10,20,30');

        const handleWeightsChange = (e) => {
            setStringWeights(e.target.value);
            const value = e.target.value;
            // Allow typing with commas
            if (value === '') {
                setWeights([]);
                return;
            }
            // Parse comma-separated values, allowing trailing comma
            const parts = value.split(',').map(v => v.trim()).filter(v => v !== '');
            const parsed = parts.map(v => parseInt(v)).filter(v => !isNaN(v));
            if (parsed.length > 0 || value.endsWith(',') || value === '') {
                setWeights(parsed.length > 0 ? parsed : []);
            }
        };

        const handleValuesChange = (e) => {
            setStringValues(e.target.value);
            const value = e.target.value;
            // Allow typing with commas
            if (value === '') {
                setValues([]);
                return;
            }
            // Parse comma-separated values, allowing trailing comma
            const parts = value.split(',').map(v => v.trim()).filter(v => v !== '');
            const parsed = parts.map(v => parseInt(v)).filter(v => !isNaN(v));
            if (parsed.length > 0 || value.endsWith(',') || value === '') {
                setValues(parsed.length > 0 ? parsed : []);
            }
        };

        return (
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">0/1 Knapsack:</label>
                <div>
                    <label className="text-xs text-slate-600 mb-1 block">Weights (comma-separated):</label>
                    <input 
                        onChange={handleWeightsChange}
                        value={stringWeights}
                        placeholder="2,3,4"
                        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 mb-2 w-full"
                        type="text"
                    />
                </div>
                <div>
                    <label className="text-xs text-slate-600 mb-1 block">Values (comma-separated):</label>
                    <input 
                        value={stringValues} 
                        onChange={handleValuesChange}
                        placeholder="10,20,30"
                        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 mb-2 w-full"
                        type="text"
                    />
                </div>
                <div>
                    <label className="text-xs text-slate-600 mb-1 block">Capacity:</label>
                    <input 
                        value={capacity} 
                        onChange={(e) => setCapacity(parseInt(e.target.value) || 0)} 
                        placeholder="5"
                        type="text"
                        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 mb-2 w-full"
                    />
                </div>
                <button onClick={onCompute} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded font-medium transition-colors">
                    Compute Steps
                </button>
            </div>
        );
    }
    
    // Coin Change
    if (algoo === 'coinchange') {
        const [stringCoins, setStringCoins] = useState('1,3,4');
        const handleCoinsChange = (e) => {
            setStringCoins(e.target.value);
            const value = e.target.value;
            // Allow typing with commas
            if (value === '') {
                setCoins([]);
                return;
            }
            // Parse comma-separated values, allowing trailing comma
            const parts = value.split(',').map(v => v.trim()).filter(v => v !== '');
            const parsed = parts.map(v => parseInt(v)).filter(v => !isNaN(v));
            if (parsed.length > 0 || value.endsWith(',') || value === '') {
                console.log(parsed);
                setCoins(parsed.length > 0 ? parsed : []);
            }
        };

        return (
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Coin Change:</label>
                <div>
                    <label className="text-xs text-slate-600 mb-1 block">Coins (comma-separated):</label>
                    <input 
                        value={stringCoins}
                        onChange={handleCoinsChange}
                        placeholder="1,3,4"
                        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 mb-2 w-full"
                        type="text"
                    />
                </div>
                <div>
                    <label className="text-xs text-slate-600 mb-1 block">Amount:</label>
                    <input 
                        value={amount} 
                        onChange={(e) => setAmount(parseInt(e.target.value) || 0)} 
                        placeholder="6"
                        type="text"
                        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 mb-2 w-full"
                    />
                </div>
                <button onClick={onCompute} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded font-medium transition-colors">
                    Compute Steps
                </button>
            </div>
        );
    }
    
    // BFS, DFS, Dijkstra
    if (algoo === 'bfs' || algoo === 'dfs' || algoo === 'dijkstra') {
        const exampleGraph = algoo === 'dijkstra' 
            ? '{"A": {"B": 4, "C": 2}, "B": {"D": 5}, "C": {"B": 1, "D": 8}}'
            : '{"A": ["B", "C"], "B": ["D"], "C": ["D"]}';
        const graphDescription = algoo === 'dijkstra'
            ? 'Enter graph as JSON object where each node maps to its neighbors with edge weights. Example: {"A": {"B": 4, "C": 2}} means A→B (weight 4) and A→C (weight 2)'
            : 'Enter graph as JSON object where each node maps to array of neighbors. Example: {"A": ["B", "C"]} means A connects to B and C';
        
        // Store raw text value to allow editing even with invalid JSON
        const [jsonText, setJsonText] = useState(JSON.stringify(adjacencyList, null, 2));
        
        useEffect(() => {
            // Update JSON text when adjacencyList changes externally
            setJsonText(JSON.stringify(adjacencyList, null, 2));
        }, [adjacencyList]);
        
        return (
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Graph Setup:</label>
                <div>
                    <label className="text-xs text-slate-600 mb-1 block">Adjacency List (JSON format):</label>
                    <textarea 
                        value={jsonText}
                        onChange={(e) => {
                            const newText = e.target.value;
                            setJsonText(newText); // Always update text, allow invalid JSON during typing
                            try {
                                const parsed = JSON.parse(newText);
                                setAdjacencyList(parsed); // Only update adjacencyList if valid JSON
                            } catch (err) {
                                // Invalid JSON, don't update adjacencyList but keep text for editing
                            }
                        }}
                        placeholder={exampleGraph}
                        rows={6}
                        className="border p-2 rounded font-mono text-xs focus:outline-none focus:ring-2 focus:ring-sky-500 mb-2 w-full"
                    />
                    <p className="text-xs text-slate-500 mb-2">{graphDescription}</p>
                </div>
                <div>
                    <label className="text-xs text-slate-600 mb-1 block">Start Node:</label>
                    <input 
                        value={startNode} 
                        onChange={(e) => setStartNode(e.target.value)} 
                        placeholder="A"
                        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 mb-2 w-full"
                        type="text"
                    />
                </div>
                {algoo === 'dijkstra' && (
                    <div>
                        <label className="text-xs text-slate-600 mb-1 block">End Node (target):</label>
                        <input 
                            value={endNode} 
                            onChange={(e) => setEndNode(e.target.value)} 
                            placeholder="D"
                            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 mb-2 w-full"
                            type="text"
                        />
                    </div>
                )}
                <button onClick={onCompute} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded font-medium transition-colors">
                    Compute Steps
                </button>
            </div>
        );
    }
    
    // Linear Search & Binary Search
    if (algoo === 'linearsearch' || algoo === 'binarysearch') {
        return (
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">{algoo === 'binarysearch' ? 'Binary Search (sorted array):' : 'Linear Search:'}</label>
                <div>
                    <label className="text-xs text-slate-600 mb-1 block">Array (comma-separated numbers):</label>
                    <input 
                        value={input} 
                        onChange={(e) => setInput(e.target.value)} 
                        placeholder="1,2,3,4,5"
                        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 mb-2 w-full"
                        type="text"
                    />
                </div>
                <div>
                    <label className="text-xs text-slate-600 mb-1 block">Target value:</label>
                    <input 
                        value={target || ''} 
                        onChange={(e) => {
                            const val = e.target.value.trim();
                            if (val === '') {
                                setTarget('');
                            } else {
                                const num = parseInt(val);
                                if (!isNaN(num)) {
                                    setTarget(num);
                                }
                            }
                        }} 
                        placeholder="3"
                        type="text"
                        className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 mb-2 w-full"
                    />
                </div>
                {algoo === 'binarysearch' && (
                    <p className="text-xs text-red-600">⚠️ Array must be sorted for Binary Search</p>
                )}
                <button onClick={onCompute} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded font-medium transition-colors">
                    Compute Steps
                </button>
            </div>
        );
    }

    // Default: Sorting algorithms (bubble, selection, insertion, merge, quick)
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Input array (comma separated):</label>
            <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        onCompute();
                    }
                }}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-sky-500" 
                placeholder="5,3,8,1,2,7"
                type="text"
            />
            <button 
                onClick={onCompute}
                className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded font-medium transition-colors"
            >
                Compute Steps
            </button>
        </div>
    );
};
