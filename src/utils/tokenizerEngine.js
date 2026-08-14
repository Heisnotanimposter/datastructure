/**
 * Advanced Tokenizer Engine (Approximate BPE Subword Token Estimator)
 */

// Heuristic calculation based on subword tokenizers (tiktoken / Llama BPE / SentencePiece)
export function estimateTokens(text = '', subwordFactor = 1.15) {
  if (!text || text.trim() === '') {
    return {
      tokens: 0,
      characters: 0,
      words: 0,
      lines: 0,
      nonAsciiChars: 0,
      codeDensity: 0
    };
  }

  const characters = text.length;
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const lines = text.split('\n').length;

  // Code indicators check (brackets, semicolons, function keywords)
  const codeChars = (text.match(/[{}[\]()<>=;:$#_.]/g) || []).length;
  const codeDensity = characters > 0 ? codeChars / characters : 0;

  // Non-ASCII character count (CJK, Korean, Japanese, Emoji have higher token ratios)
  const nonAsciiMatches = text.match(/[^\x00-\x7F]/g) || [];
  const nonAsciiChars = nonAsciiMatches.length;

  // Base English word-to-token ratio: ~1.3 tokens per word
  // Characters per token: ~4 characters per token in standard English text
  let baseTokenEstimate = (words * 1.30) + ((characters - (words * 5)) * 0.15);

  // Apply non-ASCII multiplier (CJK/Korean averages 1.2 to 2.5 tokens per character in standard BPE)
  const asciiChars = characters - nonAsciiChars;
  let estimatedTokens = (asciiChars / 4.0) + (nonAsciiChars * 1.5);

  // Adjust for code density (code has many short symbols / single char tokens)
  if (codeDensity > 0.12) {
    estimatedTokens *= (1 + (codeDensity * 0.45));
  }

  // Multiply by model specific BPE vocabulary subword factor
  estimatedTokens = Math.max(Math.ceil(estimatedTokens * subwordFactor), words > 0 ? 1 : 0);

  return {
    tokens: estimatedTokens,
    characters,
    words,
    lines,
    nonAsciiChars,
    codeDensity: Math.round(codeDensity * 100)
  };
}

export function formatTokenNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toLocaleString();
}
