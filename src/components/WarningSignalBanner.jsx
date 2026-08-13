import React from 'react';
import { AlertTriangle, CheckCircle2, ShieldAlert, Zap, ArrowRight, Sparkles } from 'lucide-react';

export default function WarningSignalBanner({ evaluation, onAutoCompress }) {
  const { status, title, message, overflowProbability, riskAlpha, recommendedAction } = evaluation;

  const riskPercent = (overflowProbability * 100).toFixed(1);
  const alphaPercent = (riskAlpha * 100).toFixed(0);

  const getStyle = () => {
    switch (status) {
      case 'DANGER':
        return {
          container: 'bg-rose-950/60 border-rose-600/60 text-rose-200 shadow-lg shadow-rose-950/50',
          badge: 'bg-rose-500 text-white',
          icon: <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0 animate-bounce" />,
          btn: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
        };
      case 'HIGH_RISK':
        return {
          container: 'bg-amber-950/60 border-amber-500/60 text-amber-200 shadow-lg shadow-amber-950/50',
          badge: 'bg-amber-500 text-slate-950 font-black',
          icon: <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0" />,
          btn: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
        };
      case 'CAUTION':
        return {
          container: 'bg-yellow-950/40 border-yellow-500/50 text-yellow-200',
          badge: 'bg-yellow-500 text-slate-950 font-bold',
          icon: <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0" />,
          btn: 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-yellow-600/30'
        };
      default:
        return {
          container: 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200',
          badge: 'bg-emerald-500 text-slate-950 font-bold',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          btn: 'bg-emerald-600 hover:bg-emerald-500 text-white'
        };
    }
  };

  const style = getStyle();

  return (
    <div className={`rounded-xl border p-4 transition-all duration-300 backdrop-blur-md ${style.container}`}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Left: Icon & Text */}
        <div className="flex items-start gap-3.5 flex-1">
          {style.icon}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-[11px] font-black uppercase px-2 py-0.5 rounded ${style.badge}`}>
                {status} SIGNAL
              </span>
              <h3 className="font-bold text-sm tracking-wide text-white">
                {title}
              </h3>
            </div>
            
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {message}
            </p>

            {/* Probability parameter details */}
            <div className="flex flex-wrap items-center gap-4 mt-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1">
                <span>Evaluated Overrun Risk:</span>
                <span className={`font-bold ${overflowProbability >= riskAlpha ? 'text-rose-400 font-mono' : 'text-slate-200'}`}>
                  {riskPercent}%
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span>Max Allowed (&alpha; Parameter):</span>
                <span className="font-bold text-purple-300 font-mono">{alphaPercent}%</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Capacity Usage:</span>
                <span className="font-bold text-slate-200">{evaluation.utilizationPercent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Action Button if Warning */}
        {status !== 'SAFE' && (
          <div className="shrink-0 w-full md:w-auto">
            <button
              onClick={onAutoCompress}
              className={`w-full md:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 ${style.btn}`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Auto-Compress & Fix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
