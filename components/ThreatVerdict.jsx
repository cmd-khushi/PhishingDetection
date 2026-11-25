'use client';

export default function ThreatVerdict({ analysis, geminiResult, isGeminiLoading, geminiError }) {
  if (!analysis) return null;

  // Blended consensus score: 50% Heuristic + 50% Gemini LLM (if available)
  const displayScore = geminiResult && typeof geminiResult.score === 'number'
    ? Math.round((analysis.score + geminiResult.score) / 2)
    : analysis.score;

  const isPhishing = analysis.classification === 'Likely Phishing';
  const isSuspicious = analysis.classification === 'Suspicious';

  const badgeStyle = isPhishing
    ? 'bg-red-500/15 border-red-500/60 text-red-300'
    : isSuspicious
    ? 'bg-amber-500/15 border-amber-500/60 text-amber-300'
    : 'bg-emerald-500/15 border-emerald-500/60 text-emerald-300';

  const statusLabel = isPhishing
    ? 'LIKELY PHISHING'
    : isSuspicious
    ? 'SUSPICIOUS'
    : 'LIKELY LEGITIMATE';

  // Segmented risk meter calculation (10 segments)
  const activeSegments = Math.ceil((displayScore / 100) * 10);

  return (
    <div className={`p-5 rounded-xl border bg-[#12151d] space-y-4 shadow-md ${
      isPhishing ? 'border-red-500/40' : isSuspicious ? 'border-amber-500/40' : 'border-emerald-500/40'
    }`}>
      {/* Top Classification Header */}
      <div className="flex items-center justify-between gap-3 border-b border-zinc-800 pb-3.5">
        <div className="flex items-center space-x-2.5">
          <span className={`px-3 py-1 rounded-md text-sm font-mono font-bold border tracking-wide ${badgeStyle}`}>
            {statusLabel}
          </span>
          <span className="text-xs font-mono text-zinc-400">
            {isPhishing ? 'Critical Risk' : isSuspicious ? 'Review Required' : 'Low Risk'}
          </span>
        </div>

        {/* Score & Segmented Bar */}
        <div className="flex items-center space-x-3">
          <div className="flex items-baseline space-x-1 font-mono">
            <span className="text-2xl font-bold text-white">{displayScore}</span>
            <span className="text-xs text-zinc-400 font-semibold">/100</span>
          </div>
          <div className="flex space-x-1">
            {Array.from({ length: 10 }).map((_, idx) => {
              const isFilled = idx < activeSegments;
              let segColor = 'bg-zinc-800';
              if (isFilled) {
                segColor = isPhishing ? 'bg-red-500' : isSuspicious ? 'bg-amber-500' : 'bg-emerald-500';
              }
              return (
                <div
                  key={idx}
                  className={`w-3 h-2 rounded-xs transition-colors ${segColor}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Metadata Chips Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-[#0b0d13] border border-zinc-800">
          <span className="text-zinc-400 block text-[11px]">INTENT</span>
          <span className="text-zinc-100 font-bold truncate block">
            {geminiResult?.primaryIntent || analysis.primaryIntent || 'Analyzing...'}
          </span>
        </div>
        <div className="p-2.5 rounded-lg bg-[#0b0d13] border border-zinc-800">
          <span className="text-zinc-400 block text-[11px]">TONE</span>
          <span className="text-zinc-100 font-bold truncate block">
            {geminiResult?.toneAnalysis || analysis.toneAnalysis || 'Neutral'}
          </span>
        </div>
        <div className="p-2.5 rounded-lg bg-[#0b0d13] border border-zinc-800">
          <span className="text-zinc-400 block text-[11px]">HEURISTIC</span>
          <span className="text-zinc-100 font-bold block">{analysis.score}%</span>
        </div>
        <div className="p-2.5 rounded-lg bg-[#0b0d13] border border-zinc-800">
          <span className="text-zinc-400 block text-[11px]">AI SCORE</span>
          <span className="text-zinc-100 font-bold block">
            {isGeminiLoading
              ? 'Evaluating...'
              : geminiResult
              ? `${geminiResult.score}%`
              : 'Standby'}
          </span>
        </div>
      </div>

      {/* AI Assessment */}
      {isGeminiLoading && (
        <div className="p-3 rounded-lg bg-[#0b0d13] border border-zinc-800 text-xs font-mono flex items-center space-x-2 text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Evaluating intent and linguistic coercion with Gemini...</span>
        </div>
      )}

      {geminiResult?.summary && (
        <div className="p-3.5 rounded-lg bg-[#0b0d13] border border-zinc-800 space-y-1.5 text-sm">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-emerald-400 uppercase tracking-wide">
              Gemini Cognitive Summary ({geminiResult._meta?.model || 'AI'})
            </span>
          </div>
          <p className="text-zinc-200 text-sm leading-relaxed">
            {geminiResult.summary}
          </p>
        </div>
      )}

      {geminiError && (
        <div className="p-3 rounded-lg bg-red-950/30 border border-red-500/40 text-xs font-mono text-red-200">
          <strong className="text-red-400">Notice:</strong> {geminiError}
        </div>
      )}
    </div>
  );
}
