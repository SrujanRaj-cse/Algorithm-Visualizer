import { useEffect, useState, useRef, useMemo } from 'react';

export const useCustomBTreeHooks = (init, cust, headNode, modified, setModified) => {
    const h_cnt = useRef({});
    const [positions, setPositions] = useState({});
    const [positionsReady, setPositionsReady] = useState(false);
    const [potentialNodes, setPotentialNodes] = useState({});

    const flattenTreeLevOrd = (node, level, arr, nodeId, metric, parentId = null, isLeft = null) => {
        if (level > metric.h) metric.h = level;

        if (node == null) {
            if (!arr[level]) arr[level] = [];
            arr[level].push({ 
                node: null, 
                index: nodeId.current,
                parentId: parentId,
                isLeft: isLeft 
            });
            nodeId.current++;
            return arr;
        }

        metric.cnt++;
        if (!arr[level]) arr[level] = [];
        const currentId = nodeId.current;
        arr[level].push({ 
            node: node, 
            index: currentId,
            parentId: parentId,
            isLeft: isLeft 
        });
        nodeId.current++;

        flattenTreeLevOrd(node.left, level + 1, arr, nodeId, metric, currentId, true);
        flattenTreeLevOrd(node.right, level + 1, arr, nodeId, metric, currentId, false);

        return arr;
    };

    const allNodes = useMemo(() => {
        if (!headNode) return [];
        const metric = { h: 0, cnt: 0 };
        const nodeIDcounter = { current: 0 };
        var nodes = flattenTreeLevOrd(headNode, 0, [], nodeIDcounter, metric);
        h_cnt.current = metric;
        return nodes;
    }, [init, cust, modified, headNode]);

    useEffect(() => {
        if (!h_cnt.current || !allNodes || allNodes.length === 0 || !headNode) {
            setPositionsReady(false);
            return;
        }

        // Calculate max height (without considering leaf children)
        const calculateMaxHeight = (node) => {
            if (!node) return 0;
            // Leaf nodes don't count toward height
            if (!node.left && !node.right) return 0;
            const leftHeight = node.left ? calculateMaxHeight(node.left) + 1 : 0;
            const rightHeight = node.right ? calculateMaxHeight(node.right) + 1 : 0;
            return Math.max(leftHeight, rightHeight);
        };
        
        const maxHeight = calculateMaxHeight(headNode);
        const maxHeightPlusOne = maxHeight + 1; // Add 1 for potential leaf children

        const defaultPos = {};
        const potentialNodePositions = {};
        const verticalGap = 120;
        const baseSpacing = 200;
        
        // Calculate spacing for each level (decreasing as depth increases)
        const levelSpacings = [];
        for (let level = 0; level <= maxHeightPlusOne; level++) {
            levelSpacings[level] = baseSpacing * Math.pow(0.7, level);
        }

        // Map to store node positions during calculation
        const nodeToPos = new Map(); // node -> {x, y, index}
        
        // Recursively assign positions ensuring no overlaps
        const assignPositions = (node, level, parentX, parentIndex, isLeft) => {
            if (!node || level > maxHeightPlusOne) return;
            
            let x;
            const spacing = levelSpacings[level];
            
            if (parentIndex === null) {
                // Root node: center
                const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
                x = windowWidth / 2;
            } else {
                // Child node: position relative to parent
                x = parentX + (isLeft ? -spacing : spacing);
            }
            
            const y = 100 + (level * verticalGap);
            
            // Find index in allNodes structure
            let nodeIndex = null;
            allNodes.forEach((levelArr, levelIdx) => {
                if (levelIdx === level) {
                    levelArr.forEach((elem) => {
                        if (elem.node === node) {
                            nodeIndex = elem.index;
                        }
                    });
                }
            });
            
            if (nodeIndex !== null) {
                nodeToPos.set(node, { x, y, index: nodeIndex });
            }
            
            // Recurse for children
            if (level < maxHeightPlusOne) {
                assignPositions(node.left, level + 1, x, nodeIndex, true);
                assignPositions(node.right, level + 1, x, nodeIndex, false);
            }
        };
        
        assignPositions(headNode, 0, null, null, null);
        
        // Convert to index-based positions
        allNodes.forEach((levelArr, levelIndex) => {
            levelArr.forEach((elem) => {
                if (elem.node !== null && nodeToPos.has(elem.node)) {
                    const pos = nodeToPos.get(elem.node);
                    defaultPos[pos.index] = { x: pos.x, y: pos.y };
                    
                    // Calculate potential node positions
                    if (levelIndex < maxHeightPlusOne) {
                        const childLevel = levelIndex + 1;
                        const childSpacing = levelSpacings[childLevel];
                        const childY = 100 + (childLevel * verticalGap);
                        
                        if (!elem.node.left) {
                            potentialNodePositions[`${pos.index}-left`] = {
                                x: pos.x - childSpacing,
                                y: childY,
                                parentIndex: pos.index,
                                isLeft: true,
                                parentNode: elem.node
                            };
                        }
                        
                        if (!elem.node.right) {
                            potentialNodePositions[`${pos.index}-right`] = {
                                x: pos.x + childSpacing,
                                y: childY,
                                parentIndex: pos.index,
                                isLeft: false,
                                parentNode: elem.node
                            };
                        }
                    }
                }
            });
        });

        setModified(false);
        setPotentialNodes(potentialNodePositions);
        setPositions(defaultPos);
        setPositionsReady(true);
    }, [allNodes, modified, headNode, setModified]);

    return {
        allNodes,
        positions,
        potentialNodes,
        positionsReady
    };
};

