'use client';

import { useState } from 'react';
import { VERIFICATION_PLAYBOOKS } from '../lib/playbooks';

export default function VerificationPlaybooks({ onReturnToAudit }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', ...new Set(VERIFICATION_PLAYBOOKS.map(p => p.category))];

  const filteredPlaybooks = VERIFICATION_PLAYBOOKS.filter(p => {
    const matchesSearch =
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.riskContext.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.verifiedProtocol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.keyPrinciple.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Navigation */}
      <div className="bg-[#12151d] border border-zinc-800 rounded-xl p-6 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-sm font-mono font-bold text-white tracking-wide">
                OUT-OF-BAND VERIFICATION STANDARD OPERATING PROCEDURES
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-semibold">
                SOP-DEF-04
              </span>
            </div>
            <p className="text-sm text-zinc-300 font-sans mt-1 leading-relaxed">
              When encountering high-risk email requests, never rely on in-band communication. Use independent channels to confirm legitimacy before executing actions.
            </p>
          </div>

          <button
            type="button"
            onClick={onReturnToAudit}
            className="self-start sm:self-auto px-4 py-2 rounded-lg text-xs font-mono bg-zinc-100 text-zinc-950 hover:bg-white font-bold transition shadow-xs cursor-pointer"
          >
            ← Back to Triage Engine
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter playbooks (e.g. SSO, wire transfer, DHL, banking)..."
            className="flex-1 bg-[#0b0d13] border border-zinc-700 rounded-lg px-4 py-2.5 text-sm font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-400"
          />

          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs font-mono px-3 py-1.5 rounded-md border transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-zinc-100 text-zinc-950 border-zinc-100 font-bold'
                    : 'bg-[#181c26] text-zinc-300 border-zinc-800 hover:border-zinc-600 hover:text-white'
                }`}
              >
                {cat === 'ALL' ? 'All Scenarios' : cat.split('&')[0].trim()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Playbook Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredPlaybooks.map((playbook, idx) => (
          <div
            key={idx}
            className="bg-[#12151d] border border-zinc-800 rounded-xl p-5 space-y-4 flex flex-col justify-between shadow-md"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
                <span className="text-sm font-mono font-bold text-white">
                  {playbook.category}
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                  REF-{String(idx + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Threat Context */}
              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-wider font-semibold text-zinc-400">
                  Threat Context
                </span>
                <p className="text-sm text-zinc-200 font-sans leading-relaxed">
                  {playbook.riskContext}
                </p>
              </div>

              {/* Unsafe Action to Avoid */}
              <div className="p-3.5 rounded-lg bg-red-950/25 border border-red-500/40 space-y-1.5">
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-red-300 flex items-center space-x-1.5">
                  <span>✗ High-Risk In-Band Reflex (DO NOT DO)</span>
                </span>
                <p className="text-sm text-red-100/90 font-sans leading-relaxed">
                  {playbook.unsafeAction}
                </p>
              </div>

              {/* Verified Protocol */}
              <div className="p-3.5 rounded-lg bg-emerald-950/25 border border-emerald-500/40 space-y-1.5">
                <span className="text-xs font-mono uppercase tracking-wider font-bold text-emerald-300 flex items-center space-x-1.5">
                  <span>✓ Verified Out-of-Band Protocol</span>
                </span>
                <p className="text-sm text-emerald-100/90 font-sans leading-relaxed">
                  {playbook.verifiedProtocol}
                </p>
              </div>
            </div>

            {/* Core Principle */}
            <div className="pt-3 border-t border-zinc-800/80 space-y-1">
              <span className="text-xs font-mono text-zinc-400 uppercase font-semibold block">
                Core Defense Principle:
              </span>
              <p className="text-sm text-zinc-300 font-sans italic leading-relaxed">
                "{playbook.keyPrinciple}"
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredPlaybooks.length === 0 && (
        <div className="p-10 text-center bg-[#12151d] border border-zinc-800 rounded-xl text-zinc-400 font-mono text-sm">
          No matching verification procedures found for "{searchQuery}".
        </div>
      )}
    </div>
  );
}
