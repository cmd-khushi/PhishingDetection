'use client';

export default function Header({
  hasUsableKey,
  detectedModel,
  onOpenKeyModal,
  activeTab,
  setActiveTab,
  onExportReport,
  hasAnalysis
}) {
  return (
    <header className="border-b border-zinc-800 bg-[#0e1117] sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Engine Status */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2.5">
            <span className="font-mono font-extrabold text-base text-white tracking-tight">
              PHISHGUARD
            </span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              AUDIT v1.0
            </span>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-zinc-400 pl-3 border-l border-zinc-800">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-zinc-300 font-medium">Heuristics</span>
            </span>
            <span>/</span>
            <span className="flex items-center space-x-1.5">
              <span className={`w-2 h-2 rounded-full ${hasUsableKey ? 'bg-emerald-500' : 'bg-zinc-600'}`}></span>
              <span className={hasUsableKey ? 'text-zinc-200 font-medium' : 'text-zinc-400'}>
                {hasUsableKey ? `Gemini (${detectedModel || 'active'})` : 'Gemini (inactive)'}
              </span>
            </span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            onClick={onOpenKeyModal}
            className={`px-3 py-1.5 rounded-md text-xs font-mono border transition ${
              hasUsableKey
                ? 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:border-zinc-500'
                : 'bg-zinc-800 border-amber-600/40 text-amber-300 hover:bg-zinc-700'
            }`}
          >
            {hasUsableKey ? `API Key [Configured]` : `[+ Add Gemini Key]`}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'playbooks' ? 'overview' : 'playbooks')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono border transition ${
              activeTab === 'playbooks'
                ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-bold'
                : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            Playbooks
          </button>

          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'quiz' ? 'overview' : 'quiz')}
            className={`px-3 py-1.5 rounded-md text-xs font-mono border transition ${
              activeTab === 'quiz'
                ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-bold'
                : 'bg-zinc-900 text-zinc-300 border-zinc-800 hover:border-zinc-700'
            }`}
          >
            Assessment Quiz
          </button>

          {hasAnalysis && (
            <button
              type="button"
              onClick={onExportReport}
              className="px-3 py-1.5 rounded-md text-xs font-mono bg-zinc-900 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 transition"
              title="Export report as structured JSON"
            >
              Export JSON
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
