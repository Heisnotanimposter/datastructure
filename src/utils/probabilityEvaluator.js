/**
 * Automated Warning Signal Evaluation with Probability Parameter
 */

// Error function approximation for Gaussian CDF calculation
function erf(x) {
  // Constants for Abramowitz and Stegun approximation
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p  = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return sign * y;
}

// Cumulative Distribution Function for N(mu, sigma^2)
export function calculateGaussianCDF(x, mu, sigma) {
  if (sigma <= 0) return x >= mu ? 1.0 : 0.0;
  const z = (x - mu) / (sigma * Math.sqrt(2));
  return 0.5 * (1.0 + erf(z));
}

/**
 * Main evaluation algorithm for automated warning signals
 */
export function evaluateWarningSignal({
  systemTokens = 0,
  userTokens = 0,
  contextTokens = 0,
  selectedModel,
  taskProfile,
  riskAlpha = 0.10, // Probability Parameter threshold (e.g. 10% max risk allowed)
  customMaxOutput = null
}) {
  const inputTokens = systemTokens + userTokens + contextTokens;
  const maxContext = selectedModel.maxContext;
  const modelMaxOutput = selectedModel.maxOutput;
  const effectiveMaxOutput = customMaxOutput ? Math.min(customMaxOutput, modelMaxOutput) : modelMaxOutput;

  // 1. Estimate expected completion length (mu_completion) & variance (sigma_completion)
  const outputRatio = taskProfile?.outputRatio || 1.5;
  const outputStdRatio = taskProfile?.outputStdRatio || 0.6;

  let expectedOutput = Math.round(Math.max(60, userTokens * outputRatio));
  expectedOutput = Math.min(expectedOutput, effectiveMaxOutput);

  // Std deviation of output tokens based on task type variance
  let outputStdDev = Math.round(Math.max(40, expectedOutput * outputStdRatio));

  // Std deviation of input tokenization error (~7% estimation uncertainty)
  let inputStdDev = Math.round(Math.max(5, inputTokens * 0.07));

  // Total prompt + completion distribution parameters
  const totalExpectedTokens = inputTokens + expectedOutput;
  const combinedStdDev = Math.sqrt(Math.pow(inputStdDev, 2) + Math.pow(outputStdDev, 2));

  // 2. Probability of exceeding hard context limit P(X > maxContext)
  const cdfMaxContext = calculateGaussianCDF(maxContext, totalExpectedTokens, combinedStdDev);
  const overflowProbability = Math.min(1.0, Math.max(0.0, 1.0 - cdfMaxContext));

  // 3. Probability of hitting max output truncation buffer
  const cdfOutputCap = calculateGaussianCDF(effectiveMaxOutput, expectedOutput, outputStdDev);
  const truncationProbability = Math.min(1.0, Math.max(0.0, 1.0 - cdfOutputCap));

  // 4. Capacity utilization metrics
  const utilizationPercent = Math.min(100, Math.round((totalExpectedTokens / maxContext) * 1000) / 10);
  const remainingTokens = Math.max(0, maxContext - totalExpectedTokens);
  const maxOutputHeadroom = Math.max(0, maxContext - inputTokens);

  // 5. Automated Signal Evaluation Rules against Probability Parameter (riskAlpha)
  let status = 'SAFE'; // SAFE | CAUTION | HIGH_RISK | DANGER
  let title = 'Prompt Ready (Safe Execution)';
  let message = `Expected token usage is well within model limits (${utilizationPercent}% of context capacity).`;
  let signalCode = 'GREEN_LIGHT';
  let recommendedAction = null;

  const riskAlphaPercent = Math.round(riskAlpha * 100);

  if (inputTokens >= maxContext) {
    status = 'DANGER';
    signalCode = 'INPUT_OVERFLOW';
    title = 'CRITICAL: Input Exceeds Context Window';
    message = `Input tokens (${inputTokens.toLocaleString()}) exceed total context capacity (${maxContext.toLocaleString()}). Prompt WILL be rejected!`;
    recommendedAction = 'TRUNCATE_CONTEXT';
  } else if (overflowProbability >= riskAlpha) {
    status = 'DANGER';
    signalCode = 'PROBABILITY_BREACH';
    title = `DANGER: High Overrun Risk (${(overflowProbability * 100).toFixed(1)}% > ${riskAlphaPercent}% Threshold)`;
    message = `Probability of context limit overflow exceeds your set risk tolerance (${riskAlphaPercent}%). Prompt execution carries high risk of rejection or severe truncation.`;
    recommendedAction = 'COMPRESS_PROMPT';
  } else if (overflowProbability >= riskAlpha * 0.5 || utilizationPercent >= 85) {
    status = 'HIGH_RISK';
    signalCode = 'ELEVATED_RISK';
    title = `WARNING: Elevated Risk (${(overflowProbability * 100).toFixed(1)}% Overflow Probability)`;
    message = `Token consumption is close to capacity limit (${utilizationPercent}%). Output generation may be limited.`;
    recommendedAction = 'OPTIMIZE_TOKENS';
  } else if (utilizationPercent >= 70 || truncationProbability >= 0.25) {
    status = 'CAUTION';
    signalCode = 'SOFT_WARNING';
    title = `CAUTION: Approaching Capacity (${utilizationPercent}%)`;
    message = `Input is substantial. Ensure expected output fits in remaining headroom (${maxOutputHeadroom.toLocaleString()} tokens).`;
    recommendedAction = 'REVIEW_OUTPUT_CAP';
  }

  // Generate remediation suggestion details
  let suggestedTrimTokens = 0;
  if (status !== 'SAFE') {
    const targetTokenTarget = Math.floor(maxContext * 0.75 - expectedOutput);
    suggestedTrimTokens = Math.max(0, inputTokens - targetTokenTarget);
  }

  return {
    inputTokens,
    expectedOutput,
    outputStdDev,
    totalExpectedTokens,
    combinedStdDev,
    overflowProbability,
    truncationProbability,
    utilizationPercent,
    remainingTokens,
    maxOutputHeadroom,
    riskAlpha,
    status,
    signalCode,
    title,
    message,
    recommendedAction,
    suggestedTrimTokens
  };
}
