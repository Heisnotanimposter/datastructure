import React from 'react';
import { calculateGaussianCDF } from '../utils/probabilityEvaluator';
import { Activity, Percent, ShieldCheck, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function ProbabilityGauge({ evaluation, selectedModel }) {
  const {
    totalExpectedTokens,
    combinedStdDev,
    overflowProbability,
    riskAlpha,
    status
  } = evaluation;

  const maxContext = selectedModel.maxContext;
  const riskPercent = (overflowProbability * 100).toFixed(1);
  const alphaPercent = (riskAlpha * 100).toFixed(0);

  // Generate Gaussian Distribution points for Recharts curve
  const chartData = [];
  if (combinedStdDev > 0) {
    const minX = Math.max(0, Math.floor(totalExpectedTokens - 3.5 * combinedStdDev));
    const maxX = Math.ceil(totalExpectedTokens + 3.5 * combinedStdDev);
    const step = Math.max(1, Math.floor((maxX - minX) / 40));

    for (let x = minX; x <= maxX; x += step) {
      // Gaussian probability density function f(x)
      const exponent = -Math.pow(x - totalExpectedTokens, 2) / (2 * Math.pow(combinedStdDev, 2));
      const density = (1 / (combinedStdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
      
      chartData.push({
        tokens: x,
        density: density * 1000, // scaled for visualization
        isOverLimit: x >= maxContext
      });
    }
  }

  const getGaugeColor = () => {
    if (status === 'DANGER') return '#f43f5e';
    if (status === 'HIGH_RISK') return '#f59e0b';
    if (status === 'CAUTION') return '#eab308';
    return '#10b981';
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-md flex flex-col gap-4 shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-purple-400" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Probabilistic Risk Evaluation
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          &sigma; = &plusmn;{Math.round(combinedStdDev)} tokens
        </span>
      </div>

      {/* Main Gauge & Risk Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Risk Percentage Metric Card */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-medium">Overrun Risk P(X &gt; Limit)</span>
            <Percent className="w-4 h-4 text-purple-400" />
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono" style={{ color: getGaugeColor() }}>
              {riskPercent}%
            </span>
            <span className="text-xs text-slate-400">
              vs max allowed ({alphaPercent}%)
            </span>
          </div>

          {/* Progress Bar comparison */}
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full transition-all duration-500 rounded-full"
              style={{
                width: `${Math.min(100, (overflowProbability / Math.max(0.01, riskAlpha)) * 100)}%`,
                backgroundColor: getGaugeColor()
              }}
            />
          </div>

          <p className="text-[11px] text-slate-400 mt-2">
            {overflowProbability >= riskAlpha ? (
              <span className="text-rose-400 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Exceeds probability parameter threshold!
              </span>
            ) : (
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Within user risk tolerance (&alpha; = {riskAlpha})
              </span>
            )}
          </p>
        </div>

        {/* Expected Total Tokens Metric Card */}
        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-xs text-slate-400 font-medium">Expected Total (&mu;<sub>total</sub>)</span>
            <span className="text-xs font-mono font-bold text-slate-400">{selectedModel.name.split(' ')[0]}</span>
          </div>

          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-slate-100">
              {totalExpectedTokens.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">
              / {maxContext.toLocaleString()} limit
            </span>
          </div>

          {/* Context Window Capacity Bar */}
          <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden flex">
            <div
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${Math.min(100, (evaluation.inputTokens / maxContext) * 100)}%` }}
              title="Input tokens"
            />
            <div
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${Math.min(100 - (evaluation.inputTokens / maxContext) * 100, (evaluation.expectedOutput / maxContext) * 100)}%` }}
              title="Predicted completion tokens"
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-mono">
            <span>Input: {evaluation.inputTokens.toLocaleString()}</span>
            <span>Est Output: ~{evaluation.expectedOutput.toLocaleString()}</span>
          </div>
        </div>

      </div>

      {/* Gaussian Distribution Bell Curve Chart */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs px-1">
          <span className="text-slate-300 font-semibold">Predicted Token Probability Curve</span>
          <span className="text-[10px] text-slate-400 font-mono">Normal Distribution N(&mu;, &sigma;&sup2;)</span>
        </div>

        <div className="h-36 w-full mt-1">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="tokens"
                  stroke="#64748b"
                  fontSize={10}
                  tickFormatter={(val) => `${(val / 1000).toFixed(1)}k`}
                />
                <YAxis stroke="#64748b" fontSize={10} hide />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-2 rounded text-xs font-mono text-slate-200">
                          <div>Tokens: {data.tokens.toLocaleString()}</div>
                          <div className="text-purple-300">Density: {data.density.toFixed(4)}</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="density"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#curveGradient)"
                />
                <ReferenceLine
                  x={maxContext}
                  stroke="#ef4444"
                  strokeDasharray="3 3"
                  label={{ value: 'Hard Limit', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              Type prompt text to visualize probability curve...
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
