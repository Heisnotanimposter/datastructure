export const AI_MODELS = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o (OpenAI)',
    maxContext: 128000,
    maxOutput: 4096,
    inputCostPer1k: 0.0025,
    outputCostPer1k: 0.010,
    provider: 'OpenAI',
    color: '#10a37f',
    subwordFactor: 1.15,
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet (Anthropic)',
    maxContext: 200000,
    maxOutput: 8192,
    inputCostPer1k: 0.0030,
    outputCostPer1k: 0.015,
    provider: 'Anthropic',
    color: '#d97706',
    subwordFactor: 1.20,
  },
  {
    id: 'gemini-1-5-pro',
    name: 'Gemini 1.5 Pro (Google)',
    maxContext: 2000000,
    maxOutput: 8192,
    inputCostPer1k: 0.00125,
    outputCostPer1k: 0.0050,
    provider: 'Google Cloud',
    color: '#3b82f6',
    subwordFactor: 1.10,
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B (Meta / Open)',
    maxContext: 8192,
    maxOutput: 2048,
    inputCostPer1k: 0.0007,
    outputCostPer1k: 0.0009,
    provider: 'Meta',
    color: '#8b5cf6',
    subwordFactor: 1.25,
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo (Legacy)',
    maxContext: 16385,
    maxOutput: 4096,
    inputCostPer1k: 0.0005,
    outputCostPer1k: 0.0015,
    provider: 'OpenAI',
    color: '#06b6d4',
    subwordFactor: 1.18,
  }
];

export const TASK_PROFILES = [
  { id: 'auto', name: 'Auto-detect Task', outputRatio: 1.5, outputStdRatio: 0.6 },
  { id: 'qa', name: 'Concise Q&A', outputRatio: 0.5, outputStdRatio: 0.25 },
  { id: 'code', name: 'Code Generation', outputRatio: 2.2, outputStdRatio: 0.8 },
  { id: 'summary', name: 'Summarization & Synthesis', outputRatio: 0.8, outputStdRatio: 0.3 },
  { id: 'reasoning', name: 'Deep Reasoning / Math', outputRatio: 3.5, outputStdRatio: 1.2 },
  { id: 'creative', name: 'Creative Writing / Essay', outputRatio: 4.0, outputStdRatio: 1.5 }
];

export const PRESET_CONTEXTS = [
  {
    id: 'none',
    title: 'No Context',
    content: '',
    tokenEst: 0
  },
  {
    id: 'db-schema',
    title: 'Enterprise DB Schema (PostgreSQL)',
    content: `-- PostgreSQL Enterprise E-Commerce Schema Definition\n` +
      Array.from({ length: 40 }, (_, i) => 
        `CREATE TABLE user_account_${i} (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  username VARCHAR(255) NOT NULL UNIQUE,\n  email VARCHAR(255) NOT NULL,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,\n  metadata JSONB DEFAULT '{}'::jsonb\n);\n`
      ).join('\n'),
    tokenEst: 1850
  },
  {
    id: 'api-spec',
    title: 'OpenAPI 3.0 REST Spec',
    content: `# OpenAPI Specification v3.0.3\ninfo:\n  title: Core Service API\n  version: 2.4.0\npaths:\n` +
      Array.from({ length: 30 }, (_, i) => 
        `  /api/v1/resource_${i}:\n    get:\n      summary: Fetch item ${i}\n      responses:\n        '200':\n          description: Success response with paginated JSON metadata.\n`
      ).join('\n'),
    tokenEst: 1420
  },
  {
    id: 'large-codebase',
    title: 'Full React Component AST Dump',
    content: `// React Application State Engine AST Dump\n` +
      Array.from({ length: 80 }, (_, i) => 
        `export function useModuleState_${i}(initialValue) {\n  const [state, setState] = React.useState(initialValue);\n  React.useEffect(() => {\n    console.log("Module ${i} state updated:", state);\n  }, [state]);\n  return [state, setState];\n}\n`
      ).join('\n'),
    tokenEst: 3800
  }
];
