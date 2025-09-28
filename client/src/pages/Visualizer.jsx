import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import VisualizerCanvas from '../components/VisualizerCanvas';
import ControlsPanel from '../components/ControlsPanel';
import { generateBubbleSteps } from '../utils/algorithms';

export default function Visualizer() {
  const [searchParams] = useSearchParams();
  const algo = searchParams.get('algo') || 'bubble';

  const [input, setInput] = useState('5,3,8,1,2,7');
  const arr = useMemo(() => input.split(',').map(s => Number(s.trim() || 0)), [input]);

  const [steps, setSteps] = useState([]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(300);
  const timerRef = useRef(null);

  useEffect(() => {
    if (algo === 'bubble') {
      const s = generateBubbleSteps(arr);
      setSteps(s);
      setIndex(0);
      setPlaying(false);
    }
  }, [algo, input]);

  useEffect(() => {
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
    return () => clearInterval(timerRef.current);
  }, [playing, speed, steps.length]);

  const stepForward = () => setIndex(i => Math.min(i + 1, steps.length - 1));
  const stepBack = () => setIndex(i => Math.max(i - 1, 0));
  const reset = () => { setIndex(0); setPlaying(false); };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Visualizer — {algo}</h1>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3">
          <div className="bg-white p-4 rounded shadow flex flex-col gap-3">
            <label className="text-sm">Input array (comma separated)</label>
            <input value={input} onChange={(e) => setInput(e.target.value)} className="border p-2 rounded" />
            <ControlsPanel
              playing={playing} setPlaying={setPlaying}
              stepForward={stepForward} stepBack={stepBack}
              reset={reset}
              speed={speed} setSpeed={setSpeed}
            />
          </div>
        </div>
        <div className="col-span-9">
          <div className="bg-white p-4 rounded shadow">
            <VisualizerCanvas step={steps[index]} />
            <div className="mt-3 text-sm text-slate-600">Step: {index + 1}/{steps.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
