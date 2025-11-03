import React, { useMemo } from 'react';
import { computeDynamicTypeCounts } from '../utils/complexities';

export default function PerformancePanel({ algo, counts, elapsedMs, complexities, steps }) {
  const comp = complexities[algo] || null;
  const dynamic = useMemo(() => computeDynamicTypeCounts(steps), [steps]);
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-xs text-slate-500">Elapsed</div>
          <div className="text-lg font-semibold">{Number.isFinite(elapsedMs) ? `${Math.max(0, Math.round(elapsedMs))} ms` : '—'}</div>
        </div>
        <div className="col-span-2">
          <div className="text-xs text-slate-500">Step types (dynamic)</div>
          <div className="flex flex-wrap gap-2 mt-1">
            {Object.keys(dynamic).length === 0 ? (
              <span className="text-sm text-slate-500">—</span>
            ) : (
              Object.entries(dynamic).map(([k, v]) => (
                <span key={k} className="text-xs bg-slate-100 px-2 py-1 rounded border border-slate-200">
                  {k}: {v}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-sm font-semibold mb-1">Time & Space Complexity</div>
        {comp ? (
          <div className="text-sm text-slate-700 grid grid-cols-3 gap-3">
            <div>
              <div className="text-xs text-slate-500">Best</div>
              <div className="font-medium">{comp.time.best}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Average</div>
              <div className="font-medium">{comp.time.average}</div>
            </div>
            <div>
              <div className="text-xs text-slate-500">Worst</div>
              <div className="font-medium">{comp.time.worst}</div>
            </div>
            <div className="col-span-3 mt-2">
              <div className="text-xs text-slate-500">Space</div>
              <div className="font-medium">{comp.space}</div>
            </div>
          </div>
        ) : (
          <div className="text-sm text-slate-500">Complexity details unavailable for this algorithm.</div>
        )}
      </div>
    </div>
  );
}


