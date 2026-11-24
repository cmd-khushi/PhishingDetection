'use client';

export default function EmailForm({
  sender,
  setSender,
  subject,
  setSubject,
  body,
  setBody,
  samples,
  selectedSampleId,
  onSelectSample,
  onClear,
  onAnalyze,
  autoRunGemini,
  setAutoRunGemini,
  hasUsableKey,
  onOpenKeyModal,
  isGeminiLoading
}) {
  const parsedDomain = (sender.match(/@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/) || [])[1] || '';

  return (
    <div className="bg-[#12151d] border border-zinc-800 rounded-xl p-5 space-y-4 shadow-md">
      {/* Preset Scenario Fixtures Bar */}
      <div className="space-y-2 pb-3.5 border-b border-zinc-800/80">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
          <span className="font-semibold text-zinc-300">LOAD TEST PAYLOAD:</span>
          <button
            type="button"
            onClick={onClear}
            className="text-zinc-400 hover:text-white underline cursor-pointer text-xs"
          >
            Clear Fields
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {samples.map(sample => {
            const isSelected = selectedSampleId === sample.id;
            return (
              <button
                key={sample.id}
                type="button"
                onClick={() => onSelectSample(sample)}
                className={`text-xs font-mono px-2.5 py-1.5 rounded-md transition border cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-bold shadow-sm'
                    : 'bg-[#181c26] text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:text-white'
                }`}
              >
                {sample.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Fields */}
      <form onSubmit={(e) => { e.preventDefault(); onAnalyze(); }} className="space-y-4">
        {/* Sender Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-mono text-zinc-200 font-semibold tracking-wide">
              SENDER (From) <span className="text-red-400">*</span>
            </label>
            {parsedDomain && (
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                @{parsedDomain}
              </span>
            )}
          </div>
          <input
            type="text"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            placeholder="e.g. PayPal Security <service-update@paypa1-security-desk.xyz>"
            className="w-full bg-[#0b0d13] border border-zinc-700/80 rounded-lg px-3.5 py-2.5 text-sm font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition"
          />
        </div>

        {/* Subject Line Input */}
        <div className="space-y-1.5">
          <label className="font-mono text-xs text-zinc-200 font-semibold tracking-wide">
            SUBJECT <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. URGENT: Your PayPal Account Has Been Suspended Within 24 Hours"
            className="w-full bg-[#0b0d13] border border-zinc-700/80 rounded-lg px-3.5 py-2.5 text-sm font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400 transition"
          />
        </div>

        {/* Email Body Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-mono text-zinc-200 font-semibold tracking-wide">
              EMAIL BODY (Plaintext or HTML) <span className="text-red-400">*</span>
            </label>
            <span className="font-mono text-xs text-zinc-400">
              {body.length} characters
            </span>
          </div>
          <textarea
            rows={8}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste raw email body here (including links, headers, or HTML tags)..."
            className="w-full bg-[#0b0d13] border border-zinc-700/80 rounded-lg p-3.5 text-sm font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-400 leading-relaxed transition"
          />
        </div>

        {/* AI Options Toolbar */}
        <div className="p-3 rounded-lg bg-[#0b0d13] border border-zinc-800 flex items-center justify-between text-xs font-mono">
          <label className="flex items-center space-x-2.5 cursor-pointer">
            <input
              type="checkbox"
              id="geminiAutoToggle"
              checked={autoRunGemini}
              onChange={() => setAutoRunGemini(!autoRunGemini)}
              className="rounded bg-zinc-900 border-zinc-600 text-zinc-100 focus:ring-0 w-4 h-4 cursor-pointer"
            />
            <span className="text-zinc-200 font-medium">
              Contextual AI analysis (Google Gemini)
            </span>
          </label>

          {!hasUsableKey && (
            <button
              type="button"
              onClick={onOpenKeyModal}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium underline"
            >
              Key required
            </button>
          )}
        </div>

        {/* Execute Audit CTA Button */}
        <button
          type="submit"
          disabled={isGeminiLoading}
          className="w-full py-3 px-4 rounded-lg font-mono font-bold text-sm bg-zinc-100 hover:bg-white text-zinc-950 transition active:scale-[0.99] disabled:opacity-50 cursor-pointer shadow-sm tracking-wide"
        >
          {isGeminiLoading ? 'ANALYZING (HEURISTICS + GEMINI)...' : 'EXECUTE THREAT AUDIT'}
        </button>
      </form>
    </div>
  );
}
