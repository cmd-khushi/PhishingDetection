'use client';

export default function UrlInspector({ urls }) {
  if (!urls || urls.length === 0) {
    return (
      <div className="p-8 text-center bg-[#12151d] border border-zinc-800 rounded-xl text-zinc-400 font-mono text-sm">
        No hyperlinks detected in this email payload.
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {urls.map((link, idx) => {
        const isHigh = link.riskScore >= 40;
        const isMed = link.riskScore > 0 && link.riskScore < 40;

        return (
          <div
            key={idx}
            className={`p-3.5 rounded-lg bg-[#141722] border space-y-2 ${
              isHigh ? 'border-red-500/40' : isMed ? 'border-amber-500/40' : 'border-zinc-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-1">
                <div className="font-mono text-sm font-semibold text-zinc-100 break-all select-all">
                  {link.raw}
                </div>
                <div className="text-xs font-mono text-zinc-400 flex flex-wrap gap-2.5">
                  <span>Host: <strong className="text-zinc-200">{link.hostname}</strong></span>
                  <span>TLD: <strong className="text-zinc-200">{link.tld}</strong></span>
                  <span>Proto: <strong className="text-zinc-200">{link.protocol}</strong></span>
                </div>
              </div>

              <span className={`text-xs px-2 py-0.5 rounded font-mono font-bold border shrink-0 ${
                isHigh
                  ? 'bg-red-950/60 text-red-300 border-red-500/50'
                  : isMed
                  ? 'bg-amber-950/60 text-amber-300 border-amber-500/50'
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
              }`}>
                RISK: {link.riskScore}%
              </span>
            </div>

            {link.reasons && link.reasons.length > 0 && (
              <div className="pt-2 border-t border-zinc-800/80 space-y-0.5">
                {link.reasons.map((r, rIdx) => (
                  <div key={rIdx} className="text-xs font-mono text-red-300">
                    ⚠ {r}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
