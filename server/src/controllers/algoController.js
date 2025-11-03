const { generateBubbleSteps } = require("../algorithms/sorts/bubbleSort");
const { generateSelectionSteps } = require("../algorithms/sorts/selectionSort");
const { generateInsertionSteps } = require("../algorithms/sorts/insertionSort");
const { generateMergeSteps } = require("../algorithms/sorts/mergeSort");
const { generateQuickSteps } = require("../algorithms/sorts/quickSort");
const { generateNQueenSteps } = require("../algorithms/recursions/nQueen");
const { generateGridPaths2Steps } = require("../algorithms/dynamicProgramming/gridPaths2");
const { generateInorderSteps } = require("../algorithms/binaryTree/inorder");
const { generatePreorderSteps } = require("../algorithms/binaryTree/preorder");
const { generatePostorderSteps } = require("../algorithms/binaryTree/postorder");
const { generateKnapsack01Steps } = require("../algorithms/dynamicProgramming/knapsack01");
const { generateLCSSteps } = require("../algorithms/dynamicProgramming/lcs");
const { generateCoinChangeSteps } = require("../algorithms/dynamicProgramming/coinChange");
const { generateFactorialSteps } = require("../algorithms/recursions/factorial");
const { generateFibonacciSteps } = require("../algorithms/recursions/fibonacci");
const { generateBFSSteps } = require("../algorithms/graph/bfs");
const { generateDFSSteps } = require("../algorithms/graph/dfs");
const { generateDijkstraSteps } = require("../algorithms/graph/dijkstra");
const { generateLinearSearchSteps } = require("../algorithms/search/linearSearch");
const { generateBinarySearchSteps } = require("../algorithms/search/binarySearch");
const fs = require('fs');
const path = require('path');

const calcBubbleSteps = async(req,res) => {
    try{
        let data = req.body;
        let {inputs} = data;
        const steps = generateBubbleSteps(inputs);
        return res
        .status(200)
        .json({
            steps: steps,
            code: fs.readFileSync(path.join(__dirname, '../algorithms/sorts/bubbleSort.js'), 'utf8')
        });
    }catch(err){
        return res.status(400).json(err);
    }
};

const calcSelectionSteps = async(req,res) => {
    try{
        let data = req.body;
        let {inputs} = data;
        const steps = generateSelectionSteps(inputs);
        return res
        .status(200)
        .json({
            steps: steps,
            code: fs.readFileSync(path.join(__dirname, '../algorithms/sorts/selectionSort.js'), 'utf8')
        });
    }catch(err){
        return res.status(400).json(err);
    }
};

const calcInsertionSteps = async(req,res) => {
    try{
        let data = req.body;
        let {inputs} = data;
        const steps = generateInsertionSteps(inputs);
        return res
        .status(200)
        .json({
            steps: steps,
            code: fs.readFileSync(path.join(__dirname, '../algorithms/sorts/insertionSort.js'), 'utf8')
        });
    }catch(err){
        return res.status(400).json(err);
    }
};

const calcMergeSteps = async(req,res) => {
    try{
        let data = req.body;
        let {inputs} = data;
        const steps = generateMergeSteps(inputs);
        return res
        .status(200)
        .json({
            steps: steps,
            code: fs.readFileSync(path.join(__dirname, '../algorithms/sorts/mergeSort.js'), 'utf8')
        });
    }catch(err){
        return res.status(400).json(err);
    }
};

const calcQuickSteps = async(req,res) => {
    try{
        let data = req.body;
        let {inputs} = data;
        const steps = generateQuickSteps(inputs);
        return res
        .status(200)
        .json({
            steps: steps,
            code: fs.readFileSync(path.join(__dirname, '../algorithms/sorts/quickSort.js'), 'utf8')
        });
    }catch(err){
        return res.status(400).json(err);
    }
};

const calcNQueenSteps = async(req,res) => {
    try{
        let data = req.body;
        let {nSize} = data;
        const result = generateNQueenSteps(nSize);
        return res
        .status(200)
        .json({
            steps: result.steps,
            solutionCount: result.solutionCount,
            solutions: result.solutions || [], // All solutions as grid positions
            code: fs.readFileSync(path.join(__dirname, '../algorithms/recursions/nQueen.js'), 'utf8')
        });
    }catch(err){
        return res.status(400).json(err);
    }
};

const calcGridPaths2Steps = async(req,res) => {
    try{
        let data = req.body;
        let {gridMatrix} = data;
        const result = generateGridPaths2Steps(gridMatrix);
        return res
        .status(200)
        .json({
            steps: result.steps,
            totalPaths: result.totalPaths,
            code: fs.readFileSync(path.join(__dirname, '../algorithms/dynamicProgramming/gridPaths2.js'), 'utf8')
        });
    }catch(err){
        return res.status(400).json(err);
    }
};

const calcInorderSteps = async(req,res) => {
    try{
        let data = req.body;
        let {tree} = data;
        const steps = generateInorderSteps(tree);
        return res
        .status(200)
        .json({
            steps: steps,
            code: fs.readFileSync(path.join(__dirname, '../algorithms/binaryTree/inorder.js'), 'utf8')
        });
    }catch(err){
        return res.status(400).json(err);
    }
};

const calcPreorderSteps = async(req,res) => {
    try{
        let data = req.body;
        let {tree} = data;
        const steps = generatePreorderSteps(tree);
        return res
        .status(200)
        .json({
            steps: steps,
            code: fs.readFileSync(path.join(__dirname, '../algorithms/binaryTree/preorder.js'), 'utf8')
        });
    }catch(err){
        return res.status(400).json(err);
    }
};

const calcPostorderSteps = async(req,res) => {
    try{
        let data = req.body;
        let {tree} = data;
        const steps = generatePostorderSteps(tree);
        return res
        .status(200)
        .json({
            steps: steps,
            code: fs.readFileSync(path.join(__dirname, '../algorithms/binaryTree/postorder.js'), 'utf8')
        });
    }catch(err){
        return res.status(400).json(err);
    }
};

const calcKnapsack01Steps = async(req,res) => {
    try{
        let data = req.body;
        let {weights, values, capacity} = data;
        const result = generateKnapsack01Steps(weights, values, capacity);
        return res
        .status(200)
        .json({
            steps: result.steps,
            maxValue: result.maxValue,
            code: fs.readFileSync(path.join(__dirname, '../algorithms/dynamicProgramming/knapsack01.js'), 'utf8')
        });
    }catch(err){
        return res.status(400).json(err);
    }
};

const calcLCSSteps = async(req,res) => {
    try{
        let data = req.body;
        let {str1, str2} = data;
        const result = generateLCSSteps(str1, str2);
        return res
        .status(200)
        .json({
            steps: result.steps,
            lcsLength: result.lcsLength,
            lcsString: result.lcsString,
            code: fs.readFileSync(path.join(__dirname, '../algorithms/dynamicProgramming/lcs.js'), 'utf8')
        });
    }catch(err){
        return res.status(400).json(err);
    }
};

const calcCoinChangeSteps = async(req,res) => {
    try{
        let data = req.body;
        let {coins, amount} = data;
        const result = generateCoinChangeSteps(coins, amount);
        return res
        .status(200)
        .json({
            steps: result.steps,
            minCoins: result.minCoins,
            code: fs.readFileSync(path.join(__dirname, '../algorithms/dynamicProgramming/coinChange.js'), 'utf8')
        });
    }catch(err){
        return res.status(400).json(err);
    }
};

const calcFactorialSteps = async(req,res) => {
    try{
        let data = req.body;
        let {n} = data;
        const result = generateFactorialSteps(n);
        return res
        .status(200)
        .json({
            steps: result.steps,
            result: result.result,
            isValid: result.isValid,
            code: fs.readFileSync(path.join(__dirname, '../algorithms/recursions/factorial.js'), 'utf8')
        });
    }catch(err){
        return res.status(400).json(err);
    }
};

const calcFibonacciSteps = async(req,res) => {
    try{
        let data = req.body;
        let {n} = data;
        const result = generateFibonacciSteps(n);
        return res
        .status(200)
        .json({
            steps: result.steps,
            result: result.result,
            isValid: result.isValid,
            code: fs.readFileSync(path.join(__dirname, '../algorithms/recursions/fibonacci.js'), 'utf8')
        });
    }catch(err){
        return res.status(400).json(err);
    }
};

const calcBFSSteps = async(req,res) => {
    try{
        let data = req.body;
        let {adjacencyList, startNode} = data;
        const result = generateBFSSteps(adjacencyList, startNode);
        return res
        .status(200)
        .json({
            steps: result.steps,
            traversal: result.traversal,
            code: fs.readFileSync(path.join(__dirname, '../algorithms/graph/bfs.js'), 'utf8')
        });
    }catch(err){
        return res.status(400).json(err);
    }
};

const calcDFSSteps = async(req,res) => {
    try{
        let data = req.body;
        let {adjacencyList, startNode} = data;
        const result = generateDFSSteps(adjacencyList, startNode);
        return res
        .status(200)
        .json({
            steps: result.steps,
            traversal: result.traversal,
            code: fs.readFileSync(path.join(__dirname, '../algorithms/graph/dfs.js'), 'utf8')
        });
    }catch(err){
        return res.status(400).json(err);
    }
};

const calcDijkstraSteps = async(req,res) => {
    try{
        let data = req.body;
        let {adjacencyList, startNode, endNode} = data;
        const result = generateDijkstraSteps(adjacencyList, startNode, endNode);
        return res
        .status(200)
        .json({
            steps: result.steps,
            distances: result.distances,
            path: result.path,
            code: fs.readFileSync(path.join(__dirname, '../algorithms/graph/dijkstra.js'), 'utf8')
        });
    }catch(err){
        return res.status(400).json(err);
    }
};

const calcLinearSearchSteps = async(req,res) => {
    try{
        let data = req.body;
        let {array, target} = data;
        const result = generateLinearSearchSteps(array, target);
        return res
        .status(200)
        .json({
            steps: result.steps,
            found: result.found,
            index: result.index,
            code: fs.readFileSync(path.join(__dirname, '../algorithms/search/linearSearch.js'), 'utf8')
        });
    }catch(err){
        return res.status(400).json(err);
    }
};

const calcBinarySearchSteps = async(req,res) => {
    try{
        let data = req.body;
        let {array, target} = data;
        const result = generateBinarySearchSteps(array, target);
        return res
        .status(200)
        .json({
            steps: result.steps,
            found: result.found,
            index: result.index,
            code: fs.readFileSync(path.join(__dirname, '../algorithms/search/binarySearch.js'), 'utf8')
        });
    }catch(err){
        return res.status(400).json(err);
    }
};

module.exports = {
  calcBubbleSteps,
  calcSelectionSteps,
  calcInsertionSteps,
  calcMergeSteps,
  calcQuickSteps,
  calcNQueenSteps,
  calcGridPaths2Steps,
  calcInorderSteps,
  calcKnapsack01Steps,
  calcLCSSteps,
  calcCoinChangeSteps,
  calcFactorialSteps,
  calcFibonacciSteps,
  calcBFSSteps,
  calcDFSSteps,
  calcDijkstraSteps,
  calcLinearSearchSteps,
  calcBinarySearchSteps,
  calcPreorderSteps,
  calcPostorderSteps
};