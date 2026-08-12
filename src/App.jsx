import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import WarningSignalBanner from './components/WarningSignalBanner';
import PromptEditor from './components/PromptEditor';
import ProbabilityGauge from './components/ProbabilityGauge';
import TokenBreakdownChart from './components/TokenBreakdownChart';
import PreSendModal from './components/PreSendModal';
import PresetPrompts from './components/PresetPrompts';

import { AI_MODELS, TASK_PROFILES } from './utils/tokenModels';
import { estimateTokens } from './utils/tokenizerEngine';
import { evaluateWarningSignal } from './utils/probabilityEvaluator';

export default function App() {
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [riskAlpha, setRiskAlpha] = useState(0.10); // 10% risk tolerance threshold
  const [taskProfile, setTaskProfile] = useState(TASK_PROFILES[0]);

  const [systemPrompt, setSystemPrompt] = useState('You are an expert AI assistant providing concise, accurate technical responses.');
  const [userPrompt, setUserPrompt] = useState('Please write a Python script that implements a Binary Search Tree with insert, delete, and in-order traversal algorithms. Include inline comments explaining time complexity.');
  const [ragContext, setRagContext] = useState('');

  const [isPreSendModalOpen, setIsPreSendModalOpen] = useState(false);

  // 1. Live Token Estimation for each section
  const tokenStats = useMemo(() => {
    const sys = estimateTokens(systemPrompt, selectedModel.subwordFactor);
    const user = estimateTokens(userPrompt, selectedModel.subwordFactor);
    const context = estimateTokens(ragContext, selectedModel.subwordFactor);

    return { sys, user, context };
  }, [systemPrompt, userPrompt, ragContext, selectedModel]);

  // 2. Automated Warning Signal Evaluation with Probability Parameter
  const evaluation = useMemo(() => {
    return evaluateWarningSignal({
      systemTokens: tokenStats.sys.tokens,
      userTokens: tokenStats.user.tokens,
      contextTokens: tokenStats.context.tokens,
      selectedModel,
      taskProfile,
      riskAlpha
    });
  }, [tokenStats, selectedModel, taskProfile, riskAlpha]);

  // 3. Auto-compression & prompt optimization handler
  const handleAutoCompress = () => {
    // Remove duplicate blank lines and trim whitespace
    const compressedUser = userPrompt
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s*\n+/g, '\n\n')
      .trim();

    const compressedSys = systemPrompt
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s*\n+/g, '\n\n')
      .trim();

    // If RAG context is huge, truncate redundant repeat blocks
    let compressedRag = ragContext;
    if (ragContext.length > 5000) {
      compressedRag = ragContext.substring(0, 4500) + '\n\n[... RAG Context Auto-Truncated for Token Safety ...]';
    }

    setUserPrompt(compressedUser);
    setSystemPrompt(compressedSys);
    setRagContext(compressedRag);
  };

  const handleLoadPreset = (preset) => {
    if (preset.sys !== undefined) setSystemPrompt(preset.sys);
    if (preset.user !== undefined) setUserPrompt(preset.user);
    if (preset.rag !== undefined) setRagContext(preset.rag);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white flex flex-col">
      
      {/* Top App Bar */}
      <Header
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        riskAlpha={riskAlpha}
        onChangeRiskAlpha={setRiskAlpha}
        evaluation={evaluation}
      />

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 flex flex-col gap-6">
        
        {/* Real-time Warning Signal Alert Banner */}
        <WarningSignalBanner
          evaluation={evaluation}
          onAutoCompress={handleAutoCompress}
        />

        {/* Quick Test Scenarios */}
        <PresetPrompts onLoadPreset={handleLoadPreset} />

        {/* Main Grid: Left Prompt Studio | Right Probability & Metrics Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Prompt Composition Studio (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <PromptEditor
              systemPrompt={systemPrompt}
              setSystemPrompt={setSystemPrompt}
              userPrompt={userPrompt}
              setUserPrompt={setUserPrompt}
              ragContext={ragContext}
              setRagContext={setRagContext}
              taskProfile={taskProfile}
              setTaskProfile={setTaskProfile}
              tokenStats={tokenStats}
              evaluation={evaluation}
              onTriggerSend={() => setIsPreSendModalOpen(true)}
              onLoadPreset={handleLoadPreset}
            />
          </div>

          {/* Right Column: Probabilistic Risk Gauge & Token Breakdown (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Probability Risk Gauge & Gaussian Curve */}
            <ProbabilityGauge
              evaluation={evaluation}
              selectedModel={selectedModel}
            />

            {/* Token Composition & Multi-Model Comparative Costs */}
            <TokenBreakdownChart
              tokenStats={tokenStats}
              evaluation={evaluation}
              selectedModel={selectedModel}
            />

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        Prompt Token Usage Predictor &bull; Real-time Automated Warning Evaluation Engine with Probability Parameter (&alpha;)
      </footer>

      {/* Pre-Send Interception Evaluation Modal */}
      <PreSendModal
        isOpen={isPreSendModalOpen}
        onClose={() => setIsPreSendModalOpen(false)}
        evaluation={evaluation}
        selectedModel={selectedModel}
        onAutoCompress={handleAutoCompress}
      />

    </div>
  );
}
