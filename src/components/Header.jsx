import React from 'react';
import { AI_MODELS } from '../utils/tokenModels';
import { ShieldAlert, Zap, Sliders, Cpu, Activity } from 'lucide-react';

export default function Header({
  selectedModel,
  onSelectModel,
  riskAlpha,
  onChangeRiskAlpha,
  evaluation
}) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'DANGER': return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'HIGH_RISK': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'CAUTION': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      default: return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Title & Badge */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-400">
                Prompt Token Usage Predictor
              </h1>
              <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                Pre-Send Warning Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Activity className="w-3 h-3 text-indigo-400" />
              Automated probability signal evaluation before user hits send
            </p>
          </div>
        </div>

        {/* Dynamic Controls Header Bar */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          {/* Target Model Selector */}
          <div className="flex items-center gap-2 bg-slate-800/80 rounded-lg px-3 py-1.5 border border-slate-700/80">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span className="text-xs text-slate-400 font-medium">Model:</span>
            <select
              value={selectedModel.id}
              onChange={(e) => {
                const found = AI_MODELS.find(m => m.id === e.target.value);
                if (found) onSelectModel(found);
              }}
              className="bg-transparent text-xs font-semibold text-slate-200 border-none outline-none cursor-pointer focus:ring-0"
            >
              {AI_MODELS.map((model) => (
                <option key={model.id} value={model.id} className="bg-slate-900 text-slate-200">
                  {model.name} (Max {model.maxContext.toLocaleString()}t)
                </option>
              ))}
            </select>
          </div>

          {/* Risk Probability Parameter (\alpha) Slider */}
          <div className="flex items-center gap-2 bg-slate-800/80 rounded-lg px-3 py-1.5 border border-slate-700/80">
            <Sliders className="w-4 h-4 text-purple-400" />
            <div className="flex flex-col">
              <div className="flex justify-between text-[11px]">
                <span className="text-slate-400 font-medium">Risk Tolerance (&alpha;):</span>
                <span className="text-purple-300 font-bold ml-2">{(riskAlpha * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.35"
                step="0.01"
                value={riskAlpha}
                onChange={(e) => onChangeRiskAlpha(parseFloat(e.target.value))}
                className="w-24 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                title="Probability threshold parameter for trigger warning signal"
              />
            </div>
          </div>

          {/* Current Status Pill */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${getStatusColor(evaluation.status)}`}>
            <ShieldAlert className="w-4 h-4" />
            <span>{evaluation.status.replace('_', ' ')}</span>
          </div>

        </div>
      </div>
    </header>
  );
}
