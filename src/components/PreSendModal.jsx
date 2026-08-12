import React from 'react';
import confetti from 'canvas-confetti';
import { ShieldCheck, AlertTriangle, ShieldAlert, Sparkles, X, ArrowRight, Zap, CheckCircle } from 'lucide-react';

export default function PreSendModal({ isOpen, onClose, evaluation, selectedModel, onAutoCompress }) {
  if (!isOpen) return null;

  const { status, title, message, overflowProbability, riskAlpha, inputTokens, expectedOutput, utilizationPercent } = evaluation;

  const riskPercent = (overflowProbability * 100).toFixed(1);
  const alphaPercent = (riskAlpha * 100).toFixed(0);

  const handleConfirmedSend = () => {
    if (status === 'SAFE') {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    alert(`[PRE-SEND EVALUATION PASSED]\n\nPrompt validated successfully!\nModel: ${selectedModel.name}\nTotal Tokens: ${(inputTokens + expectedOutput).toLocaleString()}\nStatus: ${status}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-5 relative">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${
            status === 'DANGER' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
            status === 'HIGH_RISK' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
            status === 'CAUTION' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
            'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {status === 'DANGER' ? <ShieldAlert className="w-6 h-6 animate-pulse" /> :
             status === 'HIGH_RISK' ? <AlertTriangle className="w-6 h-6" /> :
             status === 'CAUTION' ? <AlertTriangle className="w-6 h-6" /> :
             <ShieldCheck className="w-6 h-6" />}
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 font-mono">
              Pre-Send Interception Evaluation
            </span>
            <h3 className="text-base font-bold text-white">
              {title}
            </h3>
          </div>
        </div>

        {/* Evaluation Summary Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 font-sans text-xs">
          <p className="text-slate-300 leading-relaxed">
            {message}
          </p>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-slate-400 block">Evaluated Risk:</span>
              <strong className={overflowProbability >= riskAlpha ? 'text-rose-400 text-sm' : 'text-emerald-400 text-sm'}>
                {riskPercent}%
              </strong>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-slate-400 block">Probability Limit (&alpha;):</span>
              <strong className="text-purple-300 text-sm">{alphaPercent}%</strong>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-slate-400 block">Input Tokens:</span>
              <strong className="text-slate-200 text-sm">{inputTokens.toLocaleString()}</strong>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-slate-800">
              <span className="text-slate-400 block">Expected Output:</span>
              <strong className="text-amber-300 text-sm">~{expectedOutput.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
          {status !== 'SAFE' && (
            <button
              onClick={() => {
                onAutoCompress();
                onClose();
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              <span>Apply Auto-Compress & Re-evaluate</span>
            </button>
          )}

          <button
            onClick={handleConfirmedSend}
            className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              status === 'DANGER'
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30'
            }`}
          >
            <span>{status === 'SAFE' ? 'Confirm & Send Prompt' : 'Bypass Warning & Send'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
