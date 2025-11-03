import React, { useEffect, useState, useRef } from 'react';
import { useCustomBTreeHooks } from './hooks/useCustomBTreeHooks';

// Node Class
class Nodee {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.right = right;
        this.left = left;
    }
}

// Node Component
const Node = ({ elem, elemIndex, pos, setModified }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState(elem.node.val);

    if (!elem || !pos) return null;

    const handleNodeClick = () => {
        setIsEditing(true);
    };

    const handleInputSubmit = (e) => {
        if (e.key === 'Enter') {
            elem.node.val = parseInt(inputValue) || elem.node.val;
            setIsEditing(false);
            setModified(true);
        }
    };

    const handleInputBlur = () => {
        elem.node.val = parseInt(inputValue) || elem.node.val;
        setIsEditing(false);
        setModified(true);
    };

    return (
        <div
            className="absolute flex items-center justify-center rounded-full bg-sky-600 text-white border-4 border-sky-800 cursor-pointer text-xl font-bold shadow-xl hover:scale-125 hover:shadow-2xl transition-all z-10"
            style={{
                left: pos.x,
                top: pos.y,
                width: '70px',
                height: '70px',
                minWidth: '70px',
                minHeight: '70px',
            }}
            onClick={handleNodeClick}
        >
            {isEditing ? (
                <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleInputSubmit}
                    onBlur={handleInputBlur}
                    autoFocus
                    className="w-14 text-center border-2 border-white rounded bg-sky-700 text-white text-xl font-bold outline-none focus:ring-2 focus:ring-yellow-400"
                    onClick={(e) => e.stopPropagation()}
                />
            ) : (
                <span className="text-xl font-bold">{elem.node.val}</span>
            )}
        </div>
    );
};

// Potential Node Component
const PotentialNode = ({ position, onAdd }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleClick = () => {
        setShowInput(true);
    };

    const handleSubmit = (e) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            onAdd(parseInt(inputValue));
            setShowInput(false);
            setInputValue('');
        }
    };

    const handleCancel = () => {
        setShowInput(false);
        setInputValue('');
    };

    return (
        <div
            className="absolute flex items-center justify-center rounded-full border-3 border-dashed border-sky-500 cursor-pointer transition-all z-0"
            style={{
                left: position.x,
                top: position.y,
                width: '70px',
                height: '70px',
                backgroundColor: isHovered ? 'rgba(56, 189, 248, 0.4)' : 'rgba(56, 189, 248, 0.1)',
                opacity: isHovered ? 1 : 0.5,
                borderWidth: isHovered ? '3px' : '2px',
                transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
        >
            {showInput ? (
                <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleSubmit}
                    onBlur={handleCancel}
                    autoFocus
                    placeholder="?"
                    className="w-14 text-center border-2 border-sky-600 rounded-lg px-2 text-lg font-bold bg-white text-sky-700 focus:ring-2 focus:ring-yellow-400"
                    onClick={(e) => e.stopPropagation()}
                />
            ) : (
                isHovered && <span className="text-sky-700 text-4xl font-bold drop-shadow-lg">+</span>
            )}
        </div>
    );
};

// Main CustomBTrees Component
export default function CustomBTrees({ setHeadNode, headNode, onSetTree, headChanged, setHeadChanged }) {
    const [init, setInit] = useState(false);
    const [cust, setCust] = useState(true);
    const [modified, setModified] = useState(false);
    const [localHeadNode, setLocalHeadNode] = useState(null);

    // Initialize default tree
    useEffect(() => {
        if (!init) {
            const node4 = new Nodee(4);
            const node3 = new Nodee(3, null, node4);
            const node1 = new Nodee(1);
            const node2 = new Nodee(2, node3, node1);
            setLocalHeadNode(node2);
            setHeadNode(node2);
            setInit(true);
        }
    }, [init, setHeadNode]);

    // Update parent component's headNode when cust changes
    useEffect(() => {
        if (!cust && localHeadNode) {
            console.log("SET TREE CALLED - updating headNode", localHeadNode);
            setHeadNode(localHeadNode);
            setHeadChanged(true);
            setCust(true);
            if (onSetTree) {
                onSetTree();
            }
        }
    }, [cust, localHeadNode, setHeadNode, onSetTree]);

    // Sync external headNode updates (e.g., retrieval) into local editor
    useEffect(() => {
        if (headChanged && headNode) {
            setLocalHeadNode(headNode);
            setModified(true);
            setInit(true);
            setCust(true);
            setHeadChanged(false);
        }
    }, [headChanged, headNode, setHeadChanged]);

    const { 
        allNodes, 
        positions, 
        potentialNodes, 
        positionsReady
    } = useCustomBTreeHooks(init, cust, localHeadNode, modified, setModified);

    // Add new node to tree
    const addNodeToTree = (parentNode, isLeft, value) => {
        const newNode = new Nodee(value);
        if (isLeft) {
            parentNode.left = newNode;
        } else {
            parentNode.right = newNode;
        }
        setModified(true);
    };

    const handleReset = () => {
        setInit(false);
        setModified(true);
        setLocalHeadNode(null);
        setHeadNode(null);
    };

    const handleSetTree = () => {
        setCust(false);
    };

    if (!positionsReady) {
        return (
            <div className="h-96 flex items-center justify-center bg-slate-100 rounded">
                <div>Loading tree...</div>
            </div>
        );
    }

    return (
        <div className="relative h-[600px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-auto border-2 border-slate-300">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-lg">
                <button 
                    onClick={handleReset}
                    className="bg-sky-600 hover:bg-sky-700 px-6 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                >
                    Reset Tree
                </button>
                <button 
                    onClick={handleSetTree}
                    className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                >
                    Set Tree & Compute
                </button>
                <span className="text-sm ml-4 bg-white/10 px-4 py-2 rounded-lg">
                    💡 Click nodes to edit values • Hover over empty positions (+) to add nodes
                </span>
            </div>

            <div className="relative h-[calc(100%-80px)] overflow-auto bg-gradient-to-br from-blue-50 to-purple-50">
                {/* Draw connection lines */}
                <svg
                    className="absolute top-0 left-0 w-full h-full pointer-events-none"
                    style={{ zIndex: 1 }}
                >
                    {allNodes.map((levelArr) =>
                        levelArr
                            .filter(elem => elem && elem.node !== null)
                            .map((elem) => {
                                const arrows = [];
                                const parentPos = positions[elem.index];
                                if (!parentPos) return null;
                                
                                // Draw line to left child if exists
                                if (elem.node.left) {
                                    const leftChild = allNodes.flat().find(
                                        e => e && e.node === elem.node.left
                                    );
                                    if (leftChild && positions[leftChild.index]) {
                                        const childPos = positions[leftChild.index];
                                        arrows.push(
                                            <line
                                                key={`${elem.index}-left`}
                                                x1={parentPos.x + 30}
                                                y1={parentPos.y + 30}
                                                x2={childPos.x + 30}
                                                y2={childPos.y + 30}
                                                stroke="#666"
                                                strokeWidth="2"
                                            />
                                        );
                                    }
                                }
                                
                                // Draw line to right child if exists
                                if (elem.node.right) {
                                    const rightChild = allNodes.flat().find(
                                        e => e && e.node === elem.node.right
                                    );
                                    if (rightChild && positions[rightChild.index]) {
                                        const childPos = positions[rightChild.index];
                                        arrows.push(
                                            <line
                                                key={`${elem.index}-right`}
                                                x1={parentPos.x + 30}
                                                y1={parentPos.y + 30}
                                                x2={childPos.x + 30}
                                                y2={childPos.y + 30}
                                                stroke="#666"
                                                strokeWidth="2"
                                            />
                                        );
                                    }
                                }
                                
                                return arrows;
                            })
                    )}
                </svg>

                {/* Render existing nodes */}
                {allNodes.map((levelArr) =>
                    levelArr
                        .filter(elem => elem && elem.node !== null)
                        .map((elem) => (
                            <Node
                                key={`node-${elem.index}`}
                                elem={elem}
                                elemIndex={elem.index}
                                pos={positions[elem.index]}
                                setModified={setModified}
                            />
                        ))
                )}

                {/* Render potential nodes (hover to add) */}
                {Object.entries(potentialNodes).map(([key, potNode]) => (
                    <PotentialNode
                        key={key}
                        position={potNode}
                        onAdd={(value) => addNodeToTree(
                            potNode.parentNode,
                            potNode.isLeft,
                            value
                        )}
                    />
                ))}
            </div>
        </div>
    );
}

