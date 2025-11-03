import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import VisualizerCanvas from '../components/VisualizerCanvas';
import ControlsPanel from '../components/ControlsPanel';
import GiveAlgoInput from '../components/algo-inputs/index.jsx';
import { ServerVariables } from '../utils/ServerVariables.jsx';
import { useAPI } from '../utils/utils.services.js';
import PerformancePanel from '../components/PerformancePanel.jsx';
import { algorithmComplexities, computeOperationCounts } from '../utils/complexities.js';
import SaveRunButton from '../components/SaveRunButton.jsx';
import SavedRunsModal from '../components/SavedRunsModal.jsx';

export default function Visualizer() {
  const {data,error,loading, fetchSteps, setError, clearData} = useAPI();
  const [searchParams] = useSearchParams();
  const algo = searchParams.get('algo') || 'bubble';
  const [code, setCode] = useState('');
  
  // Initialize input based on algorithm type
  const getInitialInput = (algorithm) => {
    if (['nqueen'].includes(algorithm)) {
      return '';
    }
    if (['factorial', 'fibonacci'].includes(algorithm)) {
      return '5'; // Initial default value
    }
    if (['linearsearch', 'binarysearch'].includes(algorithm)) {
      return '1,2,3,4,5';
    }
    return '5,3,8,1,2,7';
  };
  
  const [input, setInput] = useState(getInitialInput(algo));
  const [arr, setArr] = useState(
    ['nqueen'].includes(algo) ? [] :
    ['factorial', 'fibonacci'].includes(algo) ? [5] : // Initial value for factorial/fibonacci
    ['linearsearch', 'binarysearch'].includes(algo) ? [1,2,3,4,5] : 
    [5,3,8,1,2,7]
  );
  const [nSize, setNSize] = useState(4);
  const [gridMatrix, setGridMatrix] = useState([[0, 0, 0], [0, -1, 0], [0, 0, 0]]);
  const [headNode, setHeadNode] = useState(null);
  const [headChanged, setHeadChanged] = useState(true);
  
  // New state for different algorithm types
  const [str1, setStr1] = useState('ABCBDAB');
  const [str2, setStr2] = useState('BDCABA');
  const [coins, setCoins] = useState([1, 3, 4]);
  const [amount, setAmount] = useState(6);
  const [weights, setWeights] = useState([2, 3, 4]);
  const [values, setValues] = useState([10, 20, 30]);
  const [capacity, setCapacity] = useState(5);
  const [adjacencyList, setAdjacencyList] = useState({ 'A': ['B', 'C'], 'B': ['D'], 'C': ['D'] });
  const [startNode, setStartNode] = useState('A');
  const [endNode, setEndNode] = useState('D');
  const [target, setTarget] = useState(5);
  
  // Flags to control when algorithms should compute (only on button click)
  const [shouldComputeLCS, setShouldComputeLCS] = useState(true);
  const [shouldComputeCoinChange, setShouldComputeCoinChange] = useState(true);
  const [shouldComputeLinearSearch, setShouldComputeLinearSearch] = useState(true);
  const [shouldComputeBinarySearch, setShouldComputeBinarySearch] = useState(true);
  
  const [steps, setSteps] = useState([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const timerRef = useRef(null);
  const [counts, setCounts] = useState({ comparisons: 0, swaps: 0, shifts: 0, inserts: 0, selections: 0, pivots: 0 });
  const [elapsedMs, setElapsedMs] = useState(null);
  const requestStartRef = useRef(null);
  const [showSavedRuns, setShowSavedRuns] = useState(false);

  const validateInput = (inputStr) => {
    if (!inputStr || inputStr.trim() === '') {
      alert('Error: Input cannot be empty.');
      return { valid: false, numbers: null, defaultInput: '5,3,8,1,2,7' };
    }
    const validPattern = /^[\d\s,\-]+$/;
    if (!validPattern.test(inputStr)) {
      alert('Error: Invalid input.');
      return { valid: false, numbers: null, defaultInput: '5,3,8,1,2,7' };
    }
    const parts = inputStr.split(',');
    if (parts.length === 0) {
      alert('Error: Invalid format.');
      return { valid: false, numbers: null, defaultInput: '5,3,8,1,2,7' };
    }
    const numbers = [];
    for (let i = 0; i < parts.length; i++) {
      const trimmed = parts[i].trim();
      if (trimmed === '') {
        alert(`Error: Empty value found at position ${i + 1}.`);
        return { valid: false, numbers: null, defaultInput: '5,3,8,1,2,7' };
      }
      const num = Number(trimmed);
      if (isNaN(num)) {
        alert(`Error: "${trimmed}" is not a valid number.`);
        return { valid: false, numbers: null, defaultInput: '5,3,8,1,2,7' };
      }
      numbers.push(num);
    }
    if (numbers.length === 0) {
      alert('Error: No valid numbers found.');
      return { valid: false, numbers: null, defaultInput: '5,3,8,1,2,7' };
    }
    return { valid: true, numbers, defaultInput: inputStr };
  };

  const handleCompute = () => {
    // Sorting algorithms
    if (['bubble', 'selection', 'insertion', 'merge', 'quick'].includes(algo)) {
      const validation = validateInput(input);
      if (validation.valid) {
        setArr(validation.numbers);
      } else {
        setInput(validation.defaultInput);
        setArr([5, 3, 8, 1, 2, 7]);
      }
      handleComputeAPI(); // Call API after validation
      return;
    }
    
    // N-Queen
    if (algo === 'nqueen') {
      const n = parseInt(input);
      if (isNaN(n) || n < 4 || n > 8) {
        alert('Error: N must be between 4 and 8.');
        setNSize(4);
        return;
      }
      setNSize(n);
      setArr([n]);
      handleComputeAPI(); // Call API after validation
      return;
    }
    
    // Grid Paths & Inorder - handled by their own components
    if (algo === 'gridpaths' || algo === 'inorder') {
      handleComputeAPI(); // Call API
      return;
    }
    
    // Recursion - Factorial & Fibonacci
    if (algo === 'factorial' || algo === 'fibonacci') {
      const n = parseInt(input);
      if (isNaN(n) || n < 0) {
        alert('Error: Please enter a valid non-negative number.');
        return;
      }
      if (algo === 'fibonacci' && n > 40) {
        alert('Warning: Large numbers may take a while to compute.');
      }
      setArr([n]);
      handleComputeAPI(); // Call API after validation
      return;
    }
    
    // Knapsack 0/1 - validation
    if (algo === 'knapsack01') {
      if (weights.length !== values.length) {
        alert(`Error: Weights and Values arrays must have the same length. Weights: ${weights.length}, Values: ${values.length}`);
        return;
      }
      if (weights.length === 0) {
        alert('Error: Please enter at least one weight and value.');
        return;
      }
      handleComputeAPI(); // Call API after validation
      return;
    }
    
    // LCS - validation (no auto-compute, only on button click)
    if (algo === 'lcs') {
      if (!str1 || !str2) {
        alert('Error: Please enter both strings.');
        return;
      }
      handleComputeAPI(); // Call API after validation
      return;
    }
    
    // Coin Change - validation (no auto-compute, only on button click)
    if (algo === 'coinchange') {
      if (!coins || coins.length === 0) {
        alert('Error: Please enter at least one coin value.');
        return;
      }
      if (amount < 0) {
        alert('Error: Amount must be non-negative.');
        return;
      }
      handleComputeAPI(); // Call API after validation
      return;
    }
    
    // Search algorithms
    if (algo === 'linearsearch' || algo === 'binarysearch') {
      const validation = validateInput(input);
      if (validation.valid) {
        let finalArray = validation.numbers;
        // Sort array for binary search
        if (algo === 'binarysearch') {
          finalArray = [...validation.numbers].sort((a, b) => a - b);
          setInput(finalArray.join(','));
        }
        setArr(finalArray);
        // Validate target
        const targetNum = Number(target);
        if (isNaN(targetNum) || targetNum === undefined || targetNum === null || targetNum === '') {
          alert(`Please enter a valid target value for ${algo === 'linearsearch' ? 'Linear' : 'Binary'} Search`);
          return;
        }
        handleComputeAPI(); // Call API after validation
      } else {
        setInput('1,2,3,4,5');
        setArr([1, 2, 3, 4, 5]);
      }
      return;
    }
    
    // For any other algorithm
    handleComputeAPI();
  };

  // Add flags for all algorithms to control when they should compute
  const [shouldComputeSorting, setShouldComputeSorting] = useState(false);
  const [shouldComputeNQueen, setShouldComputeNQueen] = useState(false);
  const [shouldComputeFactorial, setShouldComputeFactorial] = useState(false);
  const [shouldComputeFibonacci, setShouldComputeFibonacci] = useState(false);
  const [shouldComputeKnapsack, setShouldComputeKnapsack] = useState(false);
  const [shouldComputeBFS, setShouldComputeBFS] = useState(false);
  const [shouldComputeDFS, setShouldComputeDFS] = useState(false);
  const [shouldComputeDijkstra, setShouldComputeDijkstra] = useState(false);
  const [shouldComputeGridPaths, setShouldComputeGridPaths] = useState(false);
  const [shouldComputeInorder, setShouldComputeInorder] = useState(false);
  const [shouldComputePreorder, setShouldComputePreorder] = useState(false);
  const [shouldComputePostorder, setShouldComputePostorder] = useState(false);
  
  // Modified handleCompute to set the appropriate computation flag
  const handleComputeAPI = () => {
    requestStartRef.current = performance.now();
    // Set the appropriate flag based on algorithm type
    if (['bubble', 'selection', 'insertion', 'merge', 'quick'].includes(algo)) {
      setShouldComputeSorting(true);
    } else if (algo === 'nqueen') {
      setShouldComputeNQueen(true);
    } else if (algo === 'factorial') {
      setShouldComputeFactorial(true);
    } else if (algo === 'fibonacci') {
      setShouldComputeFibonacci(true);
    } else if (algo === 'knapsack01') {
      setShouldComputeKnapsack(true);
    } else if (algo === 'lcs') {
      setShouldComputeLCS(true);
    } else if (algo === 'coinchange') {
      setShouldComputeCoinChange(true);
    } else if (algo === 'bfs') {
      setShouldComputeBFS(true);
    } else if (algo === 'dfs') {
      setShouldComputeDFS(true);
    } else if (algo === 'dijkstra') {
      setShouldComputeDijkstra(true);
    } else if (algo === 'linearsearch') {
      setShouldComputeLinearSearch(true);
    } else if (algo === 'binarysearch') {
      setShouldComputeBinarySearch(true);
    } else if (algo === 'gridpaths') {
      setShouldComputeGridPaths(true);
    } else if (algo === 'inorder') {
      setShouldComputeInorder(true);
    } else if (algo === 'preorder') {
      setShouldComputePreorder(true);
    } else if (algo === 'postorder') {
      setShouldComputePostorder(true);
    }
  };

  useEffect(() => {
    let endpoint = '';
    let payload = {};
    
    switch(algo) {
      // Sorting
      case 'bubble':
      case 'selection':
      case 'insertion':
      case 'merge':
      case 'quick':
        endpoint = ServerVariables[`${algo}Steps`];
        payload = { inputs: arr };
        break;
      
      // Recursion - existing
      case 'nqueen':
        endpoint = ServerVariables.nQueenSteps;
        if (nSize >= 4 && nSize <= 8) {
          payload = { nSize: nSize };
        } else {
          return;
        }
        break;
      
      // Recursion - new
      case 'factorial':
        endpoint = ServerVariables.factorialSteps;
        if (arr.length > 0) {
          payload = { n: arr[0] };
        } else {
          return;
        }
        break;
      case 'fibonacci':
        endpoint = ServerVariables.fibonacciSteps;
        if (arr.length > 0) {
          payload = { n: arr[0] };
        } else {
          return;
        }
        break;
      
      // Dynamic Programming
      case 'knapsack01':
        endpoint = ServerVariables.knapsack01Steps;
        payload = { weights, values, capacity };
        break;
      case 'lcs':
        endpoint = ServerVariables.lcsSteps;
        payload = { str1, str2 };
        break;
      case 'coinchange':
        endpoint = ServerVariables.coinChangeSteps;
        payload = { coins, amount };
        break;
      
      // Graph
      case 'bfs':
        endpoint = ServerVariables.bfsSteps;
        payload = { adjacencyList, startNode };
        break;
      case 'dfs':
        endpoint = ServerVariables.dfsSteps;
        payload = { adjacencyList, startNode };
        break;
      case 'dijkstra':
        endpoint = ServerVariables.dijkstraSteps;
        payload = { adjacencyList, startNode, endNode };
        break;
      
      // Search
      case 'linearsearch':
        endpoint = ServerVariables.linearSearchSteps;
        if (!arr || arr.length === 0) {
          console.warn('Linear search requires non-empty array');
          return;
        }
        const targetValueLS = Number(target);
        if (isNaN(targetValueLS)) {
          console.warn('Linear search requires valid target number');
          return;
        }
        payload = { array: arr, target: targetValueLS };
        break;
      case 'binarysearch':
        endpoint = ServerVariables.binarySearchSteps;
        if (!arr || arr.length === 0) {
          console.warn('Binary search requires non-empty array');
          return;
        }
        const targetValueBS = Number(target);
        if (isNaN(targetValueBS)) {
          console.warn('Binary search requires valid target number');
          return;
        }
        payload = { array: arr, target: targetValueBS };
        break;
      
      // Other
      case 'gridpaths':
        endpoint = ServerVariables.gridPaths2Steps;
        if (!gridMatrix) return;
        payload = { gridMatrix };
        break;
      case 'inorder':
        endpoint = ServerVariables.inorderSteps;
        if (!headNode) return;
        payload = { tree: headNode };
        break;
      case 'preorder':
        endpoint = ServerVariables.preorderSteps;
        if (!headNode) return;
        payload = { tree: headNode };
        break;
      case 'postorder':
        endpoint = ServerVariables.postorderSteps;
        if (!headNode) return;
        payload = { tree: headNode };
        break;
      
      default:
        console.warn('Unknown algorithm:', algo);
        return;
    }
    
    // Execute fetch only when the corresponding flag is true
    if (endpoint) {
      if (algo === 'inorder' && headNode && shouldComputeInorder) {
        fetchSteps(endpoint, payload);
        if (headChanged) setHeadChanged(false);
        setShouldComputeInorder(false);
      } else if (algo === 'gridpaths' && gridMatrix && shouldComputeGridPaths) {
        fetchSteps(endpoint, payload);
        setShouldComputeGridPaths(false);
      } else if (algo === 'nqueen' && nSize >= 4 && nSize <= 8 && shouldComputeNQueen) {
        fetchSteps(endpoint, payload);
        setShouldComputeNQueen(false);
      } else if (algo === 'factorial' && arr.length > 0 && shouldComputeFactorial) {
        fetchSteps(endpoint, payload);
        setShouldComputeFactorial(false);
      } else if (algo === 'fibonacci' && arr.length > 0 && shouldComputeFibonacci) {
        fetchSteps(endpoint, payload);
        setShouldComputeFibonacci(false);
      } else if (algo === 'inorder' && headNode && shouldComputeInorder) {
        fetchSteps(endpoint, payload);
        setShouldComputeInorder(false);
      } else if (algo === 'preorder' && headNode && shouldComputePreorder) {
        fetchSteps(endpoint, payload);
        setShouldComputePreorder(false);
      } else if (algo === 'postorder' && headNode && shouldComputePostorder) {
        fetchSteps(endpoint, payload);
        setShouldComputePostorder(false);
      } else if (algo === 'bfs' && shouldComputeBFS) {
        fetchSteps(endpoint, payload);
        setShouldComputeBFS(false);
      } else if (algo === 'dfs' && shouldComputeDFS) {
        fetchSteps(endpoint, payload);
        setShouldComputeDFS(false);
      } else if (algo === 'dijkstra' && shouldComputeDijkstra) {
        fetchSteps(endpoint, payload);
        setShouldComputeDijkstra(false);
      } else if (algo === 'knapsack01' && shouldComputeKnapsack) {
        fetchSteps(endpoint, payload);
        setShouldComputeKnapsack(false);
      } else if (algo === 'lcs' && shouldComputeLCS) {
        fetchSteps(endpoint, payload);
        setShouldComputeLCS(false);
      } else if (algo === 'coinchange' && shouldComputeCoinChange) {
        fetchSteps(endpoint, payload);
        setShouldComputeCoinChange(false);
      } else if (algo === 'linearsearch' && shouldComputeLinearSearch) {
        fetchSteps(endpoint, payload);
        setShouldComputeLinearSearch(false);
      } else if (algo === 'binarysearch' && shouldComputeBinarySearch) {
        fetchSteps(endpoint, payload);
        setShouldComputeBinarySearch(false);
      } else if (['bubble', 'selection', 'insertion', 'merge', 'quick'].includes(algo) && shouldComputeSorting) {
        fetchSteps(endpoint, payload);
        setShouldComputeSorting(false);
      }
    }
  }, [algo, arr, nSize, gridMatrix, headNode, headChanged, 
      str1, str2, coins, amount, weights, values, capacity,
      adjacencyList, startNode, endNode, target, fetchSteps,
      shouldComputeLCS, shouldComputeCoinChange, shouldComputeLinearSearch, shouldComputeBinarySearch,
      shouldComputeSorting, shouldComputeNQueen, shouldComputeFactorial, shouldComputeFibonacci,
      shouldComputeKnapsack, shouldComputeBFS, shouldComputeDFS, shouldComputeDijkstra,
      shouldComputeGridPaths, shouldComputeInorder, shouldComputePreorder, shouldComputePostorder]);

  const [allSolutions, setAllSolutions] = useState([]);

  useEffect(() => {
    if (data && data.steps && Array.isArray(data.steps) && data.steps.length > 0) {
      setSteps(data.steps);
      setCode(data.code || '');
      setIndex(0);
      setPlaying(false);
      setCounts(computeOperationCounts(data.steps));
      if (requestStartRef.current) {
        setElapsedMs(performance.now() - requestStartRef.current);
        requestStartRef.current = null;
      }
      // Store solutions if available (for NQueen)
      if (data.solutions) {
        setAllSolutions(data.solutions);
      }
      // Clear timer when new data arrives
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else if (data && !data.steps) {
      // Data received but no steps - might be an error response
      console.warn('Received data but no steps:', data);
    }
  }, [data]);
  
  // Reset visualization state when algorithm changes (but keep input/arr for auto-fetch)
  useEffect(() => {
    // Clear timer first
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Clear API data to prevent stale data
    clearData();
    
    // Only reset visualization-related state, not input data
    setSteps([]);
    setIndex(0);
    setPlaying(false);
    setCode('');
    setError(null); // Clear error state
    setAllSolutions([]); // Clear solutions
  }, [algo, clearData]);
  
    // Reset input data when algorithm changes (separate effect)
  useEffect(() => {
    setInput(getInitialInput(algo));
    setArr(
      ['nqueen'].includes(algo) ? [] :
      ['factorial', 'fibonacci'].includes(algo) ? [5] :
      ['linearsearch', 'binarysearch'].includes(algo) ? [1,2,3,4,5] : 
      [5,3,8,1,2,7]
    );
    
    // Reset flags
    setShouldComputeLCS(false);
    setShouldComputeCoinChange(false);
    setShouldComputeLinearSearch(false);
    setShouldComputeBinarySearch(false);
    
    // Reset target for search algorithms
    if (['linearsearch', 'binarysearch'].includes(algo)) {
      setTarget(3);
    }
    
    // Reset graph state
    if (['bfs', 'dfs', 'dijkstra'].includes(algo)) {
      if (algo === 'dijkstra') {
        setAdjacencyList({ 'A': { 'B': 4, 'C': 2 }, 'B': { 'D': 5 }, 'C': { 'B': 1, 'D': 8 } });
      } else {
        setAdjacencyList({ 'A': ['B', 'C'], 'B': ['D'], 'C': ['D'] });
      }
      setStartNode('A');
      setEndNode('D');
    }
  }, [algo]);

  useEffect(() => {
    // Clear any existing interval
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    if (playing && steps.length) {
      timerRef.current = setInterval(() => {
        setIndex(i => {
          if (i >= steps.length - 1) {
            clearInterval(timerRef.current);
            setPlaying(false);
            return i;
          }
          return i + 1;
        });
      }, speed);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [playing, speed, steps.length]);

  const stepForward = () => setIndex(i => Math.min(i + 1, steps.length - 1));
  const stepBack = () => setIndex(i => Math.max(i - 1, 0));
  const reset = () => { setIndex(0); setPlaying(false); };

  // Build a binary tree from adjacency list: { id: { val, left, right } }
  function buildTreeFromAdjList(adj) {
    if (!adj) return null;
    const nodes = {};
    const ensure = (id) => {
      if (!id && id !== 0) return null;
      if (!nodes[id]) nodes[id] = { val: null, left: null, right: null };
      return nodes[id];
    };
    let rootId = adj.__root || null;
    const hasParent = new Set();
    Object.keys(adj).forEach((id) => {
      if (id === '__root') return;
      const n = ensure(id);
      const spec = adj[id] || {};
      if (typeof spec.val !== 'undefined') n.val = spec.val;
      if (spec.left !== undefined && spec.left !== null) {
        n.left = ensure(String(spec.left));
        hasParent.add(String(spec.left));
      }
      if (spec.right !== undefined && spec.right !== null) {
        n.right = ensure(String(spec.right));
        hasParent.add(String(spec.right));
      }
    });
    if (!rootId) {
      const ids = Object.keys(adj).filter(k => k !== '__root');
      for (const id of ids) {
        if (!hasParent.has(String(id))) { rootId = id; break; }
      }
    }
    // Convert to Nodee class from CustomBTrees for consistency
    function toNodee(obj) {
      if (!obj) return null;
      // mimic Nodee structure used elsewhere: { val, left, right }
      return { val: obj.val, left: toNodee(obj.left), right: toNodee(obj.right) };
    }
    return toNodee(nodes[rootId]);
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Visualizer — {algo}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-4 rounded shadow">
          <ControlsPanel
            playing={playing} setPlaying={setPlaying}
            stepForward={stepForward} stepBack={stepBack}
            reset={reset}
            speed={speed} setSpeed={setSpeed}
          />
          <div className="mt-3">
            <SaveRunButton
              algo={algo}
              arr={arr}
              nSize={nSize}
              gridMatrix={gridMatrix}
              headNode={headNode}
              str1={str1}
              str2={str2}
              coins={coins}
              amount={amount}
              weights={weights}
              values={values}
              capacity={capacity}
              adjacencyList={adjacencyList}
              startNode={startNode}
              endNode={endNode}
              target={target}
              speed={speed}
              steps={steps}
            />
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow"> 
          <GiveAlgoInput
            algoo={algo}
            input={input} setInput={setInput}
            onCompute={handleCompute}
            gridMatrix={gridMatrix} setGridMatrix={setGridMatrix}
            headNode={headNode} setHeadNode={setHeadNode}
            headChanged={headChanged} setHeadChanged={setHeadChanged}
            // New props for different algorithms
            str1={str1} setStr1={setStr1} str2={str2} setStr2={setStr2}
            coins={coins} setCoins={setCoins} amount={amount} setAmount={setAmount}
            weights={weights} setWeights={setWeights} 
            values={values} setValues={setValues} capacity={capacity} setCapacity={setCapacity}
            adjacencyList={adjacencyList} setAdjacencyList={setAdjacencyList}
            startNode={startNode} setStartNode={setStartNode} 
            endNode={endNode} setEndNode={setEndNode}
            target={target} setTarget={setTarget}
          />
          <div className="mt-3 flex gap-2">
            <button className="px-3 py-2 rounded border border-slate-300 hover:bg-slate-50" onClick={() => setShowSavedRuns(true)}>Retrieve Custom Input</button>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <PerformancePanel algo={algo} counts={counts} elapsedMs={elapsedMs} complexities={algorithmComplexities} steps={steps} />
      </div>
      <div className="mb-5">
        <div className="bg-white p-4 rounded shadow overflow-x-auto">
          {loading && (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <div className="text-lg font-semibold text-blue-600 mb-2">Computing steps...</div>
                <div className="text-sm text-slate-500">This may take a few seconds</div>
              </div>
            </div>
          )}
          {error && !loading && (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-semibold text-red-600 mb-2">Error loading steps</div>
                <div className="text-sm text-slate-600 mb-2">{error}</div>
                <div className="text-xs text-slate-500">Check browser console for details</div>
              </div>
            </div>
          )}
          {!loading && !error && (
            <>
              <VisualizerCanvas 
                step={steps && steps.length > 0 ? steps[index] : null} 
                algo={algo} 
                nSize={nSize} 
                gridMatrix={gridMatrix}
                adjacencyList={adjacencyList}
                startNode={startNode}
                endNode={endNode}
                allSolutions={allSolutions}
              />
              <div className="mt-3 text-sm text-slate-600">
                {steps && steps.length > 0 ? `Step: ${index + 1}/${steps.length}` : 'No steps computed. Click "Compute Steps" or wait for auto-load.'}
              </div>
            </>
          )}
        </div>
      </div>
      <SavedRunsModal
        open={showSavedRuns}
        onClose={() => setShowSavedRuns(false)}
        algo={algo}
        onSelect={(it) => {
          setShowSavedRuns(false);
          // Load inputs per algorithm
          const input = it.input || {};
          if (['bubble','selection','insertion','merge','quick'].includes(algo)) {
            if (Array.isArray(input.array)) { setInput(input.array.join(',')); setArr(input.array); }
          } else if (algo === 'nqueen') {
            if (typeof input.nSize === 'number') { setInput(String(input.nSize)); setNSize(input.nSize); setArr([input.nSize]); }
          } else if (algo === 'gridpaths') {
            if (Array.isArray(input.gridMatrix)) { setGridMatrix(input.gridMatrix); }
          } else if (algo === 'inorder' || algo === 'preorder' || algo === 'postorder') {
            if (input.adjList) {
              const head = buildTreeFromAdjList(input.adjList);
              setHeadNode(head);
              setHeadChanged(true);
            }
          } else if (algo === 'lcs') {
            if (typeof input.str1 === 'string') setStr1(input.str1);
            if (typeof input.str2 === 'string') setStr2(input.str2);
          } else if (algo === 'coinchange') {
            if (Array.isArray(input.coins)) setCoins(input.coins);
            if (typeof input.amount === 'number') setAmount(input.amount);
          } else if (algo === 'knapsack01') {
            if (Array.isArray(input.weights)) setWeights(input.weights);
            if (Array.isArray(input.values)) setValues(input.values);
            if (typeof input.capacity === 'number') setCapacity(input.capacity);
          } else if (algo === 'bfs' || algo === 'dfs') {
            if (input.adjacencyList) setAdjacencyList(input.adjacencyList);
            if (input.startNode) setStartNode(input.startNode);
          } else if (algo === 'dijkstra') {
            if (input.adjacencyList) setAdjacencyList(input.adjacencyList);
            if (input.startNode) setStartNode(input.startNode);
            if (input.endNode) setEndNode(input.endNode);
          } else if (algo === 'linearsearch' || algo === 'binarysearch') {
            if (Array.isArray(input.array)) { setInput(input.array.join(',')); setArr(input.array); }
            if (typeof input.target !== 'undefined') setTarget(input.target);
          } else if (algo === 'factorial' || algo === 'fibonacci') {
            if (typeof input.n === 'number') { setInput(String(input.n)); setArr([input.n]); }
          }
          // Load steps directly
          if (Array.isArray(it.steps)) {
            setSteps(it.steps);
            setIndex(0);
            setPlaying(false);
          }
        }}
      />
      <div className="rounded mb-5 overflow-auto" style={{ background: "#1e1e1e" }}>
        <div className="px-3 py-1 text-xs font-bold" style={{ background: "#23272e", color: "#abb2bf" }}>
          JavaScript
        </div>
        <pre className="whitespace-pre-wrap font-mono text-sm p-4 overflow-auto max-h-96" style={{ color: "#d4d4d4", background: "inherit" }}>
          {code?code:'//code not found'}
        </pre>
      </div>
    </div>
  );
}
