'use client';

export default function EmailAnatomy({ sender, subject, body, detectedKeywords }) {
  return (
    <div className="bg-[#12151d] border border-zinc-800 rounded-xl p-5 space-y-4 shadow-md">
      <div className="flex items-center justify-between text-xs font-mono border-b border-zinc-800 pb-3">
        <span className="font-bold text-zinc-200 text-sm tracking-wide">[MIME PAYLOAD INSPECTOR]</span>
        <span className="text-zinc-400 text-xs">Monospace raw inspection</span>
      </div>

      {/* Header Breakdown */}
      <div className="p-3.5 rounded-lg bg-[#0b0d13] border border-zinc-800 font-mono text-xs space-y-1.5">
        <div>
          <span className="text-zinc-400 font-medium">From: </span>
          <span className="text-zinc-100 font-semibold">{sender}</span>
        </div>
        <div>
          <span className="text-zinc-400 font-medium">Subject: </span>
          <span className="text-zinc-100 font-bold">{subject}</span>
        </div>
      </div>

      {/* Body View */}
      <div className="p-4 rounded-lg bg-[#0b0d13] border border-zinc-800 font-mono text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto">
        {body}
      </div>

      {/* Trigger Index */}
      {detectedKeywords && detectedKeywords.length > 0 && (
        <div className="space-y-2 text-xs font-mono pt-3 border-t border-zinc-800">
          <span className="text-zinc-400 uppercase font-semibold">Indexed Suspicious Fragments:</span>
          <div className="flex flex-wrap gap-1.5">
            {detectedKeywords.map((kw, i) => (
              <span key={i} className="px-2 py-0.5 rounded bg-zinc-800 text-amber-300 border border-zinc-700 text-xs">
                {kw.match}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
