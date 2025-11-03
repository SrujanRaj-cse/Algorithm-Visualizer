import React, { useState, useEffect } from 'react';

export default function GridPathsInput({ gridMatrix, setGridMatrix, onCompute }) {
    const [rows, setRows] = useState(3);
    const [cols, setCols] = useState(3);
    const [tempGrid, setTempGrid] = useState([
        [0, 0, 0],
        [0, -1, 0],
        [0, 0, 0]
    ]);

    // Initialize grid when dimensions change
    useEffect(() => {
        const newGrid = Array(rows).fill(null).map(() => Array(cols).fill(0));
        setTempGrid(newGrid);
    }, [rows, cols]);

    const handleCellClick = (r, c) => {
        // Don't allow changing start or end
        if ((r === 0 && c === 0) || (r === rows-1 && c === cols-1)) return;
        
        const newGrid = tempGrid.map(row => [...row]);
        // Toggle between 0 (empty) and -1 (obstacle)
        newGrid[r][c] = newGrid[r][c] === 0 ? -1 : 0;
        setTempGrid(newGrid);
    };

    const handleSetGrid = () => {
        setGridMatrix(tempGrid);
    };

    const handleStartVisualization = () => {
        if (!tempGrid || tempGrid.length === 0) {
            alert("Please set the grid first!");
            return;
        }
        
        // Check if start or end is blocked
        if (tempGrid[0][0] === -1 || tempGrid[rows-1][cols-1] === -1) {
            alert("Start or end position is blocked! No path possible.");
            return;
        }
        
        setGridMatrix(tempGrid);
        onCompute();
    };

    const handleReset = () => {
        const newGrid = Array(rows).fill(null).map(() => Array(cols).fill(0));
        setTempGrid(newGrid);
        setGridMatrix(null);
    };

    const handleRandomObstacles = () => {
        const newGrid = Array(rows).fill(null).map((_, r) => 
            Array(cols).fill(null).map((_, c) => {
                // Don't block start and end
                if ((r === 0 && c === 0) || (r === rows-1 && c === cols-1)) {
                    return 0;
                }
                // 20% chance of obstacle
                return Math.random() < 0.2 ? -1 : 0;
            })
        );
        setTempGrid(newGrid);
    };

    const handleClearObstacles = () => {
        const newGrid = Array(rows).fill(null).map(() => Array(cols).fill(0));
        setTempGrid(newGrid);
    };

    const getCellColor = (r, c, value) => {
        if (r === 0 && c === 0) return 'bg-green-500'; // Start
        if (r === rows-1 && c === cols-1) return 'bg-red-500'; // End
        if (value === -1) return 'bg-gray-800'; // Obstacle
        return 'bg-gray-600'; // Empty
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold">Rows:</label>
                    <input 
                        type="number"
                        min={2}
                        max={8}
                        value={rows}
                        onChange={(e) => setRows(Math.max(2, Math.min(8, parseInt(e.target.value) || 2)))}
                        className="border p-2 w-20 rounded"
                    />
                </div>
                
                <div className="flex items-center gap-2">
                    <label className="text-sm font-semibold">Cols:</label>
                    <input 
                        type="number"
                        min={2}
                        max={8}
                        value={cols}
                        onChange={(e) => setCols(Math.max(2, Math.min(8, parseInt(e.target.value) || 2)))}
                        className="border p-2 w-20 rounded"
                    />
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={handleRandomObstacles}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                        Random Obstacles
                    </button>
                    <button 
                        onClick={handleClearObstacles}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
                    >
                        Clear
                    </button>
                    <button 
                        onClick={handleReset}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* Grid Display */}
            <div className="flex flex-col gap-2">
                <p className="text-xs text-slate-600">
                    Click cells to toggle obstacles. 
                    <span className="text-green-600 font-bold"> Green = Start</span>, 
                    <span className="text-red-600 font-bold"> Red = End</span>
                </p>
                <div className="flex justify-center">
                    <div className="inline-block border-2 border-slate-700">
                        {tempGrid.map((row, r) => (
                            <div key={r} className="flex">
                                {row.map((cell, c) => (
                                    <button
                                        key={`${r}-${c}`}
                                        onClick={() => handleCellClick(r, c)}
                                        disabled={(r === 0 && c === 0) || (r === rows-1 && c === cols-1)}
                                        className={`
                                            ${getCellColor(r, c, cell)}
                                            hover:opacity-80
                                            transition-all
                                            border border-slate-900
                                            flex items-center justify-center
                                            font-bold text-white
                                            ${(r === 0 && c === 0) || (r === rows-1 && c === cols-1) ? 'cursor-not-allowed' : 'cursor-pointer'}
                                            w-12 h-12 sm:w-16 sm:h-16
                                        `}
                                    >
                                        {r === 0 && c === 0 ? 'S' : 
                                         r === rows-1 && c === cols-1 ? 'E' : 
                                         cell === -1 ? '✖' : ''}
                                    </button>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button 
                onClick={handleStartVisualization}
                className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded font-medium transition-colors"
            >
                Compute Steps
            </button>
        </div>
    );
}

