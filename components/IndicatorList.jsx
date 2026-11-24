'use client';

export default function IndicatorList({ indicators, detectedKeywords }) {
  const totalFindings =
    indicators.critical.length + indicators.warnings.length + indicators.safeSignals.length;

  if (totalFindings === 0 && (!detectedKeywords || detectedKeywords.length === 0)) {
    return (
      <div className="p-8 text-center bg-[#12151d] border border-zinc-800 rounded-xl text-zinc-400 font-mono text-sm">
        No specific technical anomalies detected in this message.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Findings List */}
      <div className="space-y-2">
        {indicators.critical.map((item, idx) => (
          <div
            key={`crit-${idx}`}
            className="p-3.5 rounded-lg bg-[#141722] border border-red-500/30 flex items-start justify-between gap-3"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-red-950/70 text-red-300 border border-red-500/40">
                  CRITICAL
                </span>
                <span className="font-semibold text-zinc-100 text-sm">{item.title}</span>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed">{item.detail}</p>
            </div>
            <span className="text-xs font-mono text-red-400 font-bold shrink-0">
              +{item.weight} pts
            </span>
          </div>
        ))}

        {indicators.warnings.map((item, idx) => (
          <div
            key={`warn-${idx}`}
            className="p-3.5 rounded-lg bg-[#141722] border border-amber-500/30 flex items-start justify-between gap-3"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-500/40">
                  WARNING
                </span>
                <span className="font-semibold text-zinc-100 text-sm">{item.title}</span>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed">{item.detail}</p>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold shrink-0">
              +{item.weight} pts
            </span>
          </div>
        ))}

        {indicators.safeSignals.map((item, idx) => (
          <div
            key={`safe-${idx}`}
            className="p-3 rounded-lg bg-[#141722] border border-emerald-500/30 flex items-start justify-between gap-3"
          >
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-500/40">
                  VERIFIED
                </span>
                <span className="font-semibold text-zinc-100 text-sm">{item.title}</span>
              </div>
              <p className="text-zinc-300 text-sm leading-relaxed">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Flagged Phrasing Pills */}
      {detectedKeywords && detectedKeywords.length > 0 && (
        <div className="p-3.5 rounded-lg bg-[#12151d] border border-zinc-800 space-y-2">
          <span className="text-xs font-mono uppercase font-semibold text-zinc-400 block">
            Coercive / Urgency Phrases:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {detectedKeywords.map((kw, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1.5 px-2 py-0.5 rounded bg-[#181c26] border border-zinc-700 text-xs font-mono text-zinc-200"
              >
                <span className="text-amber-300 font-medium">"{kw.match}"</span>
                <span className="text-zinc-400 text-[11px]">&bull; {kw.label}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
