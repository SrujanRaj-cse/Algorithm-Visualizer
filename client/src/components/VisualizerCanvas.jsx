import React from 'react';

export default function VisualizerCanvas({ step }) {
  if (!step) return <div className="h-64 flex items-center justify-center text-slate-500">No data</div>;

  const arr = step.array || [];
  const max = Math.max(...arr, 1);

  return (
    <div className="h-64 flex items-end gap-1">
      {arr.map((v, i) => {
        const isCompare = step.compare && step.compare.includes(i);
        const isSwap = step.swapped && step.swapped.includes(i);
        const height = (v / max) * 100;
        return (
          <div key={i} className="flex-1">
            <div style={{ height: `${height}%` }} className={`w-full rounded-t ${isSwap ? 'bg-rose-500' : isCompare ? 'bg-amber-400' : 'bg-sky-500'}`} title={`${v}`} />
            <div className="text-center text-xs mt-1">{v}</div>
          </div>
        );
      })}
    </div>
  );
}

