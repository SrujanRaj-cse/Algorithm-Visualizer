import React from 'react';

export default function ControlsPanel({ playing, setPlaying, stepForward, stepBack, reset, speed, setSpeed }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <button onClick={() => setPlaying(p => !p)} className="bg-sky-600 text-white px-3 py-1 rounded">{playing ? 'Pause' : 'Play'}</button>
        <button onClick={stepBack} className="bg-gray-200 px-3 py-1 rounded">Back</button>
        <button onClick={stepForward} className="bg-gray-200 px-3 py-1 rounded">Next</button>
        <button onClick={reset} className="bg-red-500 text-white px-3 py-1 rounded">Reset</button>
      </div>
      <div>
        <label className="text-sm">Speed: {speed} ms</label>
        <input type="range" min="50" max="1000" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="w-full" />
      </div>
    </div>
  );
}
