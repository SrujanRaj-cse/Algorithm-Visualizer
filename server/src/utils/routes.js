const express = require('express');
const router = express.Router();
const algoController  = require('../controllers/algoController');

router.get('/',(req,res)=>{
    return res.status(200).json({message: "API is Working"});
});

router.post('/bubbleSteps',algoController.calcBubbleSteps);
router.post('/selectionSteps',algoController.calcSelectionSteps);
router.post('/insertionSteps',algoController.calcInsertionSteps);
router.post('/mergeSteps',algoController.calcMergeSteps);
router.post('/quickSteps',algoController.calcQuickSteps);
router.post('/nQueenSteps',algoController.calcNQueenSteps);
router.post('/gridPaths2Steps',algoController.calcGridPaths2Steps);
router.post('/inorderSteps',algoController.calcInorderSteps);
router.post('/preorderSteps',algoController.calcPreorderSteps);
router.post('/postorderSteps',algoController.calcPostorderSteps);
router.post('/knapsack01Steps',algoController.calcKnapsack01Steps);
router.post('/lcsSteps',algoController.calcLCSSteps);
router.post('/coinChangeSteps',algoController.calcCoinChangeSteps);
router.post('/factorialSteps',algoController.calcFactorialSteps);
router.post('/fibonacciSteps',algoController.calcFibonacciSteps);
router.post('/bfsSteps',algoController.calcBFSSteps);
router.post('/dfsSteps',algoController.calcDFSSteps);
router.post('/dijkstraSteps',algoController.calcDijkstraSteps);
router.post('/linearSearchSteps',algoController.calcLinearSearchSteps);
router.post('/binarySearchSteps',algoController.calcBinarySearchSteps);

module.exports = router;