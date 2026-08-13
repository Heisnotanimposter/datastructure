import React, { useState } from 'react';
import { TASK_PROFILES, PRESET_CONTEXTS } from '../utils/tokenModels';
import { Send, FileText, Database, Layers, Sparkles, ChevronDown, ChevronUp, Trash2, Sliders } from 'lucide-react';

export default function PromptEditor({
  systemPrompt,
  setSystemPrompt,
  userPrompt,
  setUserPrompt,
  ragContext,
  setRagContext,
  taskProfile,
  setTaskProfile,
  tokenStats,
  evaluation,
  onTriggerSend,
  onLoadPreset
}) {
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [showRagContext, setShowRagContext] = useState(false);

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-4 shadow-xl">
      
      {/* Editor Top Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Prompt Composition Studio
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Task Type Profile Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 rounded-lg px-2.5 py-1 text-xs border border-slate-700">
            <Sliders className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400 font-medium hidden sm:inline">Task Type:</span>
            <select
              value={taskProfile.id}
              onChange={(e) => {
                const found = TASK_PROFILES.find(t => t.id === e.target.value);
                if (found) setTaskProfile(found);
              }}
              className="bg-transparent text-slate-200 text-xs font-semibold outline-none cursor-pointer"
            >
              {TASK_PROFILES.map((tp) => (
                <option key={tp.id} value={tp.id} className="bg-slate-900 text-slate-200">
                  {tp.name} (Output x{tp.outputRatio})
                </option>
              ))}
            </select>
          </div>

          {/* Preset Context Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 rounded-lg px-2.5 py-1 text-xs border border-slate-700">
            <Database className="w-3.5 h-3.5 text-purple-400" />
            <select
              onChange={(e) => {
                const preset = PRESET_CONTEXTS.find(p => p.id === e.target.value);
                if (preset) {
                  setRagContext(preset.content);
                  if (preset.content) setShowRagContext(true);
                }
              }}
              defaultValue="none"
              className="bg-transparent text-slate-200 text-xs font-semibold outline-none cursor-pointer"
            >
              <option value="none" disabled className="bg-slate-900 text-slate-400">Include RAG Data Preset...</option>
              {PRESET_CONTEXTS.map((ctx) => (
                <option key={ctx.id} value={ctx.id} className="bg-slate-900 text-slate-200">
                  {ctx.title} (~{ctx.tokenEst} tokens)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Collapsible System Prompt Section */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/40 overflow-hidden transition-all">
        <button
          onClick={() => setShowSystemPrompt(!showSystemPrompt)}
          className="w-full px-4 py-2.5 flex items-center justify-between bg-slate-800/40 hover:bg-slate-800/60 text-xs font-semibold text-slate-300 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <span>System Prompt Instructions</span>
            {tokenStats.sys.tokens > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-mono">
                {tokenStats.sys.tokens} tokens
              </span>
            )}
          </div>
          {showSystemPrompt ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showSystemPrompt && (
          <div className="p-3">
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="You are an expert AI assistant specialized in clean code and concise responses..."
              className="w-full h-20 bg-slate-900/90 text-slate-200 text-xs p-3 rounded-lg border border-slate-700/60 focus:border-sky-500 focus:outline-none resize-none font-mono"
            />
          </div>
        )}
      </div>

      {/* Main User Prompt Textarea */}
      <div className="relative flex flex-col gap-1.5">
        <div className="flex justify-between items-center text-xs">
          <label className="font-semibold text-slate-300 flex items-center gap-1.5">
            <span>User Prompt Input</span>
            <span className="text-[10px] text-slate-400 font-normal">
              (Live subword token evaluation enabled)
            </span>
          </label>
          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
            <span>{tokenStats.user.characters} chars</span>
            <span>{tokenStats.user.words} words</span>
            <span className="text-indigo-300 font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
              {tokenStats.user.tokens} tokens
            </span>
          </div>
        </div>

        <textarea
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          placeholder="Type your prompt here... (Try typing or pasting a long prompt to evaluate token usage and warning signals)"
          className="w-full h-44 bg-slate-950/80 text-slate-100 text-sm p-4 rounded-xl border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 focus:outline-none resize-y font-sans leading-relaxed shadow-inner"
        />

        {userPrompt && (
          <button
            onClick={() => setUserPrompt('')}
            className="absolute bottom-3 right-3 text-slate-500 hover:text-rose-400 text-xs p-1 rounded transition-colors"
            title="Clear prompt"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Collapsible RAG Context Block */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/40 overflow-hidden transition-all">
        <button
          onClick={() => setShowRagContext(!showRagContext)}
          className="w-full px-4 py-2.5 flex items-center justify-between bg-slate-800/40 hover:bg-slate-800/60 text-xs font-semibold text-slate-300 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-400" />
            <span>RAG Context / Knowledge Injection</span>
            {tokenStats.context.tokens > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono">
                {tokenStats.context.tokens} tokens
              </span>
            )}
          </div>
          {showRagContext ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showRagContext && (
          <div className="p-3 flex flex-col gap-2">
            <textarea
              value={ragContext}
              onChange={(e) => setRagContext(e.target.value)}
              placeholder="Paste custom documentation, API specs, or vector DB search results here..."
              className="w-full h-28 bg-slate-900/90 text-slate-200 text-xs p-3 rounded-lg border border-slate-700/60 focus:border-purple-500 focus:outline-none resize-y font-mono"
            />
            {ragContext && (
              <div className="flex justify-end">
                <button
                  onClick={() => setRagContext('')}
                  className="text-xs text-rose-400 hover:underline flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Remove RAG Context
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Pre-Send Interception Trigger Button */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Total Input Tokens:</span>
          <strong className="text-slate-100 font-mono font-bold text-sm">
            {evaluation.inputTokens.toLocaleString()}
          </strong>
        </div>

        <button
          onClick={onTriggerSend}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-lg active:scale-95 ${
            evaluation.status === 'DANGER'
              ? 'bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white shadow-rose-600/30'
              : evaluation.status === 'HIGH_RISK'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-600/30'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/30'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Send Prompt (Pre-Send Check)</span>
        </button>
      </div>

    </div>
  );
}
