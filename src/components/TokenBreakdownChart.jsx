import React from 'react';
import { AI_MODELS } from '../utils/tokenModels';
import { PieChart, DollarSign, BarChart3, Layers } from 'lucide-react';

export default function TokenBreakdownChart({ tokenStats, evaluation, selectedModel }) {
  const { inputTokens, expectedOutput } = evaluation;

  // Calculate costs
  const inputCost = (inputTokens / 1000) * selectedModel.inputCostPer1k;
  const outputCost = (expectedOutput / 1000) * selectedModel.outputCostPer1k;
  const totalCost = inputCost + outputCost;
  const thousandRunsCost = totalCost * 1000;

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-4 shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Token Breakdown & Multi-Model Comparison
          </h2>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
          <DollarSign className="w-3.5 h-3.5" />
          <span>${totalCost.toFixed(5)} / req</span>
        </div>
      </div>

      {/* Token Distribution Breakdown */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs text-slate-300 font-medium">
          <span className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-slate-400" /> Token Composition
          </span>
          <span className="font-mono text-slate-400">
            Total Input + Output: {(inputTokens + expectedOutput).toLocaleString()} tokens
          </span>
        </div>

        {/* Stacked Composition Bar */}
        <div className="h-6 w-full bg-slate-950 rounded-lg overflow-hidden flex border border-slate-800 p-0.5">
          {tokenStats.sys.tokens > 0 && (
            <div
              className="bg-sky-500 h-full transition-all duration-300 rounded-l flex items-center justify-center text-[10px] font-bold text-white font-mono"
              style={{ width: `${(tokenStats.sys.tokens / (inputTokens + expectedOutput)) * 100}%` }}
              title={`System: ${tokenStats.sys.tokens} tokens`}
            >
              {(tokenStats.sys.tokens / (inputTokens + expectedOutput)) * 100 > 8 && 'Sys'}
            </div>
          )}
          {tokenStats.user.tokens > 0 && (
            <div
              className="bg-indigo-500 h-full transition-all duration-300 flex items-center justify-center text-[10px] font-bold text-white font-mono"
              style={{ width: `${(tokenStats.user.tokens / (inputTokens + expectedOutput)) * 100}%` }}
              title={`User Prompt: ${tokenStats.user.tokens} tokens`}
            >
              {(tokenStats.user.tokens / (inputTokens + expectedOutput)) * 100 > 10 && 'User'}
            </div>
          )}
          {tokenStats.context.tokens > 0 && (
            <div
              className="bg-purple-500 h-full transition-all duration-300 flex items-center justify-center text-[10px] font-bold text-white font-mono"
              style={{ width: `${(tokenStats.context.tokens / (inputTokens + expectedOutput)) * 100}%` }}
              title={`RAG Context: ${tokenStats.context.tokens} tokens`}
            >
              {(tokenStats.context.tokens / (inputTokens + expectedOutput)) * 100 > 10 && 'RAG'}
            </div>
          )}
          {expectedOutput > 0 && (
            <div
              className="bg-amber-500/80 h-full transition-all duration-300 rounded-r flex items-center justify-center text-[10px] font-bold text-slate-950 font-mono"
              style={{ width: `${(expectedOutput / (inputTokens + expectedOutput)) * 100}%` }}
              title={`Predicted Output: ~${expectedOutput} tokens`}
            >
              {(expectedOutput / (inputTokens + expectedOutput)) * 100 > 12 && 'Output'}
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 mt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <span>System: {tokenStats.sys.tokens}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span>User: {tokenStats.user.tokens}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span>RAG Data: {tokenStats.context.tokens}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Predicted Output: ~{expectedOutput}</span>
          </div>
        </div>
      </div>

      {/* Multi-Model Capacity Comparison Bars */}
      <div className="flex flex-col gap-2.5 mt-2">
        <span className="text-xs text-slate-300 font-semibold">
          Context Capacity Fit Across Top Models
        </span>

        <div className="flex flex-col gap-2">
          {AI_MODELS.map((model) => {
            const usagePct = Math.min(100, Math.round(((inputTokens + expectedOutput) / model.maxContext) * 100));
            const isSelected = model.id === selectedModel.id;
            const modelCost = ((inputTokens / 1000) * model.inputCostPer1k) + ((expectedOutput / 1000) * model.outputCostPer1k);

            return (
              <div
                key={model.id}
                className={`p-2 rounded-lg border transition-all text-xs ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500/50 text-slate-100'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2 font-medium">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: model.color }} />
                    <span className={isSelected ? 'font-bold text-white' : ''}>{model.name}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-slate-400">${modelCost.toFixed(5)}</span>
                    <span className={usagePct > 90 ? 'text-rose-400 font-bold' : usagePct > 70 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                      {usagePct}% used
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${usagePct}%`,
                      backgroundColor: usagePct > 90 ? '#ef4444' : usagePct > 70 ? '#f59e0b' : model.color
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cost Estimate Footer */}
      <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between text-xs font-mono text-slate-300">
        <div>
          <span className="text-slate-400">1k Request Projection:</span>{' '}
          <strong className="text-emerald-400">${thousandRunsCost.toFixed(2)}</strong>
        </div>
        <div>
          <span className="text-slate-400">Input:</span> ${(inputCost).toFixed(5)}{' | '}
          <span className="text-slate-400">Output:</span> ${(outputCost).toFixed(5)}
        </div>
      </div>

    </div>
  );
}
