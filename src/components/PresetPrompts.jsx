import React from 'react';
import { Sparkles, AlertCircle, CheckCircle, Flame } from 'lucide-react';

export default function PresetPrompts({ onLoadPreset }) {
  const PRESETS = [
    {
      id: 'safe',
      label: 'Safe Prompt (~150 tokens)',
      icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />,
      badge: 'SAFE 🟢',
      sys: 'You are a helpful software engineering mentor.',
      user: 'What are the main differences between a Stack and a Queue data structure in terms of LIFO and FIFO processing? Provide a concise summary table.',
      rag: ''
    },
    {
      id: 'code-gen',
      label: 'Code Generation (~2,500 tokens)',
      icon: <Sparkles className="w-3.5 h-3.5 text-sky-400" />,
      badge: 'CODE 💻',
      sys: 'Write production-ready, fully typed TypeScript code with error handling and unit tests.',
      user: 'Please implement a distributed Red-Black Tree data structure in TypeScript. Include rotation methods, balance factor rebalancing, deletion cases, iterator traversal, and comprehensive Jest unit test suite covering edge cases.',
      rag: 'Requirements:\n- Support concurrent node locks\n- Custom memory allocator simulation\n- Export metrics for Prometheus monitoring'
    },
    {
      id: 'high-risk',
      label: 'RAG Context Breach Danger (~12,000+ tokens)',
      icon: <Flame className="w-3.5 h-3.5 text-rose-400" />,
      badge: 'DANGER 🔴',
      sys: 'Analyze the entire provided codebase and database schema dump below. Perform deep architectural audit, memory leak analysis, and write full replacement code.',
      user: 'Perform an exhaustive security and performance audit of all 50 database tables and AST dumps below. Write a 5,000-word comprehensive technical report detailing every potential bottleneck, missing index, and race condition.',
      rag: Array.from({ length: 90 }, (_, i) => `MODULE_${i}: function processChunk_${i}(buffer) {\n  let sum = 0;\n  for(let j=0; j<1000; j++) sum += buffer[j] * ${i};\n  return sum;\n}`).join('\n')
    }
  ];

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 backdrop-blur-md flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple-400" /> Quick Test Scenarios
        </span>
        <span className="text-[11px] text-slate-400">Click to load preset into editor</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {PRESETS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onLoadPreset(preset)}
            className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 transition-all text-left flex flex-col justify-between gap-2 group"
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {preset.badge}
              </span>
              {preset.icon}
            </div>

            <span className="text-xs font-semibold text-slate-200 group-hover:text-purple-300 transition-colors">
              {preset.label}
            </span>

            <p className="text-[11px] text-slate-400 line-clamp-2 leading-snug">
              {preset.user}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
