'use client';

import { useState } from 'react';

export default function ActionChecklist({ safeNextSteps, classification, senderDomain }) {
  const [completedSteps, setCompletedSteps] = useState({});
  const [copied, setCopied] = useState(false);

  const toggleStep = (index) => {
    setCompletedSteps(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const isPhishing = classification === 'Likely Phishing';
  const isSuspicious = classification === 'Suspicious';

  const defaultProtocols = isPhishing
    ? [
        {
          title: 'Cease All Direct Engagement',
          detail: 'Do not click links, open attachments, or reply to the email.',
          priority: 'CRITICAL'
        },
        {
          title: 'Verify Out-of-Band',
          detail: `Contact ${senderDomain || 'organization'} via an independently looked-up telephone number or app.`,
          priority: 'REQUIRED'
        },
        {
          title: 'Forward to Security Team',
          detail: 'Send the email to your internal phishing or IT helpdesk with full headers.',
          priority: 'RECOMMENDED'
        },
        {
          title: 'Credential Containment',
          detail: 'If passwords or MFA codes were entered, immediately reset your password and revoke sessions.',
          priority: 'CONTAINMENT'
        }
      ]
    : isSuspicious
    ? [
        {
          title: 'Confirm Sender via Known Channel',
          detail: 'Call or message the sender via official company chat or phone before acting.',
          priority: 'HIGH'
        },
        {
          title: 'Inspect Link Destinations',
          detail: 'Examine raw destination domains in the Links tab before clicking.',
          priority: 'HIGH'
        },
        {
          title: 'Do Not Share Credentials',
          detail: 'Never enter login credentials on redirected forms from unverified emails.',
          priority: 'STANDARD'
        }
      ]
    : [
        {
          title: 'Standard Caution',
          detail: 'Email appears legitimate. Maintain routine awareness for unexpected changes.',
          priority: 'LOW'
        },
        {
          title: 'Confirm Financial Modifications',
          detail: 'Always verbally verify any bank routing or wire account updates.',
          priority: 'STANDARD'
        }
      ];

  const itemsToDisplay = safeNextSteps && safeNextSteps.length > 0
    ? safeNextSteps.map((step) => ({
        title: step.action,
        detail: step.description,
        priority: step.severity?.toUpperCase() || 'INFO'
      }))
    : defaultProtocols;

  const handleCopyChecklist = () => {
    const text = itemsToDisplay.map((item, i) => `[${completedSteps[i] ? 'X' : ' '}] ${item.title}: ${item.detail}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-1">
        <span className="text-xs font-mono uppercase font-semibold text-zinc-400">
          Recommended Incident Response:
        </span>
        <button
          type="button"
          onClick={handleCopyChecklist}
          className="text-xs font-mono px-2.5 py-1 rounded bg-[#181c26] text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 transition cursor-pointer"
        >
          {copied ? '✓ Copied' : 'Copy Steps'}
        </button>
      </div>

      <div className="space-y-2">
        {itemsToDisplay.map((item, idx) => {
          const isDone = Boolean(completedSteps[idx]);
          return (
            <label
              key={idx}
              className={`flex items-start space-x-3 p-3 rounded-lg border transition cursor-pointer select-none ${
                isDone
                  ? 'bg-zinc-900/30 border-zinc-800/50 opacity-50'
                  : 'bg-[#141722] border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <input
                type="checkbox"
                checked={isDone}
                onChange={() => toggleStep(idx)}
                className="mt-1 rounded border-zinc-600 bg-zinc-900 text-zinc-200 focus:ring-0 focus:ring-offset-0 cursor-pointer w-4 h-4 shrink-0"
              />
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-sm font-semibold ${isDone ? 'line-through text-zinc-500' : 'text-zinc-100'}`}>
                    {item.title}
                  </span>
                  <span className={`text-[11px] font-mono px-1.5 py-0.2 rounded border font-semibold ${
                    item.priority === 'CRITICAL' || item.priority === 'HIGH'
                      ? 'border-red-500/50 text-red-300 bg-red-950/30'
                      : item.priority === 'REQUIRED'
                      ? 'border-amber-500/50 text-amber-300 bg-amber-950/30'
                      : 'border-zinc-700 text-zinc-300 bg-zinc-800/60'
                  }`}>
                    {item.priority}
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${isDone ? 'line-through text-zinc-600' : 'text-zinc-300'}`}>
                  {item.detail}
                </p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
