'use client';

import { useState, useEffect } from 'react';

export default function GeminiSettingsModal({
  isOpen,
  onClose,
  apiKey,
  onSaveKey,
  selectedModel,
  hasServerKey
}) {
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [model, setModel] = useState(selectedModel || 'gemini-flash-lite-latest');
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [availableModels, setAvailableModels] = useState([]);

  useEffect(() => {
    setInputKey(apiKey || '');
    setModel(selectedModel || 'gemini-flash-lite-latest');
    setTestResult(null);
  }, [apiKey, selectedModel, isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(`/api/models?apiKey=${encodeURIComponent(inputKey.trim())}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({
          success: true,
          message: `Connection successful. Detected ${data.models?.length || 0} supported models.`,
          apiVersion: data.apiVersion,
          recommended: data.recommendedModel
        });
        if (data.models && data.models.length > 0) {
          setAvailableModels(data.models);
          if (data.recommendedModel) {
            setModel(data.recommendedModel);
          }
        }
      } else {
        setTestResult({
          success: false,
          message: data.error?.message || data.message || 'Verification failed. Please check the API key.'
        });
      }
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message || 'Network error while contacting API verification endpoint.'
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    onSaveKey(inputKey.trim(), model);
    onClose();
  };

  const handleClear = () => {
    setInputKey('');
    onSaveKey('', 'gemini-1.5-flash');
    setTestResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#12151d] border border-zinc-700/80 rounded-lg max-w-lg w-full p-5 space-y-4 shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="space-y-0.5">
            <span className="text-xs font-mono font-bold text-zinc-100">
              [GEMINI AI ENGINE CONFIGURATION]
            </span>
            <p className="text-[11px] text-zinc-500 font-mono">
              Configure Google Gemini API for contextual intent analysis
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 font-mono text-sm px-1.5 py-0.5 rounded hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        {/* Server Key Banner if exists */}
        {hasServerKey && !inputKey && (
          <div className="p-2.5 rounded bg-emerald-950/20 border border-emerald-500/30 text-xs font-mono text-emerald-300 flex items-center justify-between">
            <span>✓ Active GEMINI_API_KEY detected in server environment</span>
            <span className="text-[10px] text-emerald-500">ENV ACTIVE</span>
          </div>
        )}

        {/* Key Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <label className="text-zinc-300">GEMINI API KEY:</label>
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="text-[11px] text-zinc-500 hover:text-zinc-300 underline"
            >
              {showKey ? 'Hide Key' : 'Reveal Key'}
            </button>
          </div>

          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder={hasServerKey ? '(Using server env key - or enter custom key)' : 'AIzaSy...'}
              className="w-full bg-[#0b0d13] border border-zinc-800 rounded px-3 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
            />
          </div>
          <p className="text-[10px] text-zinc-500 font-mono">
            Keys are saved in your browser's local storage and forwarded only to your Next.js serverless route handler.
          </p>
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <label className="text-zinc-300">PREFERRED MODEL:</label>
            <span className="text-[10px] text-zinc-500">Auto-fallback supported</span>
          </div>

          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full bg-[#0b0d13] border border-zinc-700 rounded px-3 py-2 text-sm font-mono text-zinc-100 focus:outline-none focus:border-zinc-400 cursor-pointer"
          >
            <option value="gemini-flash-lite-latest">gemini-flash-lite-latest (Recommended, ultra-fast 1s response)</option>
            <option value="gemini-3.5-flash-lite">gemini-3.5-flash-lite (Stable fast lightweight)</option>
            <option value="gemini-3.8-flash">gemini-3.8-flash (Latest flash tier)</option>
            {availableModels
              .filter(m => !['gemini-flash-lite-latest', 'gemini-3.5-flash-lite', 'gemini-3.8-flash'].includes(m.name))
              .map(m => (
                <option key={m.name} value={m.name}>{m.displayName} ({m.name})</option>
              ))}
          </select>
        </div>

        {/* Test Result Indicator */}
        {testResult && (
          <div className={`p-3 rounded border text-xs font-mono space-y-1 ${
            testResult.success
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : 'bg-red-950/20 border-red-500/40 text-red-300'
          }`}>
            <div className="font-bold">
              {testResult.success ? '✓ VERIFICATION SUCCESSFUL' : '✗ VERIFICATION FAILED'}
            </div>
            <div className="text-[11px] leading-relaxed opacity-90">
              {testResult.message}
            </div>
            {testResult.apiVersion && (
              <div className="text-[10px] opacity-75">
                API Version: {testResult.apiVersion} | Recommended: {testResult.recommended}
              </div>
            )}
          </div>
        )}

        {/* Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-zinc-800">
          <div className="flex space-x-2">
            <button
              type="button"
              disabled={testing || (!inputKey && !hasServerKey)}
              onClick={handleTestConnection}
              className="px-3 py-1.5 rounded text-xs font-mono bg-[#181c26] text-zinc-300 border border-zinc-700 hover:border-zinc-500 disabled:opacity-40 transition"
            >
              {testing ? 'Testing...' : 'Test Connection'}
            </button>
            {inputKey && (
              <button
                type="button"
                onClick={handleClear}
                className="px-2.5 py-1.5 rounded text-xs font-mono text-zinc-500 hover:text-zinc-300 underline"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded text-xs font-mono text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded text-xs font-mono font-bold bg-zinc-100 text-zinc-950 hover:bg-white transition"
            >
              Save & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
