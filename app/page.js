'use client';

import { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import EmailForm from '../components/EmailForm';
import ThreatVerdict from '../components/ThreatVerdict';
import IndicatorList from '../components/IndicatorList';
import UrlInspector from '../components/UrlInspector';
import ActionChecklist from '../components/ActionChecklist';
import EmailAnatomy from '../components/EmailAnatomy';
import VerificationPlaybooks from '../components/VerificationPlaybooks';
import AwarenessQuiz from '../components/AwarenessQuiz';
import GeminiSettingsModal from '../components/GeminiSettingsModal';

import { analyzeEmail } from '../lib/detector';
import { SAMPLE_EMAILS } from '../lib/samples';

export default function Home() {
  // Form State initialized with the first sample
  const [sender, setSender] = useState(SAMPLE_EMAILS[0].sender);
  const [subject, setSubject] = useState(SAMPLE_EMAILS[0].subject);
  const [body, setBody] = useState(SAMPLE_EMAILS[0].body);
  const [selectedSampleId, setSelectedSampleId] = useState(SAMPLE_EMAILS[0].id);

  // Analysis State
  const [analysis, setAnalysis] = useState(null);
  const [geminiResult, setGeminiResult] = useState(null);
  const [isGeminiLoading, setIsGeminiLoading] = useState(false);
  const [geminiError, setGeminiError] = useState(null);

  // Gemini Configuration State
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-flash-lite-latest');
  const [hasServerKey, setHasServerKey] = useState(false);
  const [detectedModel, setDetectedModel] = useState('');
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [autoRunGemini, setAutoRunGemini] = useState(true);

  // View Navigation
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'playbooks' | 'quiz'
  const [resultTab, setResultTab] = useState('indicators'); // 'indicators' | 'actions' | 'links' | 'raw'

  // Check if API key exists in server environment or localStorage on mount
  useEffect(() => {
    // 1. Check server environment for key
    fetch('/api/models')
      .then(res => res.json())
      .then(data => {
        if (data.hasServerKey) {
          setHasServerKey(true);
        }
        if (data.recommendedModel) {
          setDetectedModel(data.recommendedModel);
        }
      })
      .catch(() => {});

    // 2. Check localStorage for user key
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('gemini_api_key');
      const storedModel = localStorage.getItem('gemini_selected_model');
      if (storedKey) setApiKey(storedKey);
      if (storedModel) setSelectedModel(storedModel);
    }
  }, []);

  const hasUsableKey = Boolean(apiKey || hasServerKey);

  // Core Analysis Function
  const runAnalysis = useCallback(async (customSender, customSubject, customBody, triggerGemini = true) => {
    const s = customSender !== undefined ? customSender : sender;
    const sub = customSubject !== undefined ? customSubject : subject;
    const b = customBody !== undefined ? customBody : body;

    // 1. Deterministic Heuristic Analysis
    const heuristicResult = analyzeEmail({ sender: s, subject: sub, body: b });
    setAnalysis(heuristicResult);
    setGeminiError(null);

    // 2. Gemini Contextual AI Analysis
    const canRunGemini = triggerGemini && autoRunGemini && hasUsableKey;
    if (canRunGemini) {
      setIsGeminiLoading(true);
      try {
        const res = await fetch('/api/gemini', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender: s,
            subject: sub,
            body: b,
            apiKey: apiKey || undefined,
            model: selectedModel || undefined
          })
        });

        const data = await res.json();
        if (res.ok && data.success && data.analysis) {
          setGeminiResult({
            ...data.analysis,
            _meta: {
              model: data.modelUsed
            }
          });
          if (data.modelUsed) {
            setDetectedModel(data.modelUsed);
          }
        } else {
          setGeminiError(data.error?.message || data.message || 'Gemini analysis failed');
        }
      } catch (err) {
        setGeminiError(err.message || 'Error communicating with Gemini Route');
      } finally {
        setIsGeminiLoading(false);
      }
    } else {
      setGeminiResult(null);
      setIsGeminiLoading(false);
    }
  }, [sender, subject, body, autoRunGemini, hasUsableKey, apiKey, selectedModel]);

  // Initial analysis on load
  useEffect(() => {
    if (SAMPLE_EMAILS[0]) {
      runAnalysis(SAMPLE_EMAILS[0].sender, SAMPLE_EMAILS[0].subject, SAMPLE_EMAILS[0].body, false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle preset sample selection
  const handleSelectSample = (sample) => {
    setSelectedSampleId(sample.id);
    setSender(sample.sender);
    setSubject(sample.subject);
    setBody(sample.body);
    setGeminiResult(null);
    runAnalysis(sample.sender, sample.subject, sample.body, true);
  };

  const handleClear = () => {
    setSelectedSampleId(null);
    setSender('');
    setSubject('');
    setBody('');
    setAnalysis(null);
    setGeminiResult(null);
    setGeminiError(null);
  };

  const handleSaveKey = (newKey, newModel) => {
    setApiKey(newKey);
    setSelectedModel(newModel);
    if (typeof window !== 'undefined') {
      if (newKey) {
        localStorage.setItem('gemini_api_key', newKey);
      } else {
        localStorage.removeItem('gemini_api_key');
      }
      if (newModel) {
        localStorage.setItem('gemini_selected_model', newModel);
      }
    }
  };

  // Export report as JSON download
  const handleExportReport = () => {
    if (!analysis) return;
    const reportData = {
      timestamp: new Date().toISOString(),
      sender,
      subject,
      bodyExcerpt: body.slice(0, 300),
      heuristicAnalysis: analysis,
      geminiAnalysis: geminiResult,
      verdict: {
        classification: analysis.classification,
        heuristicScore: analysis.score,
        geminiScore: geminiResult?.score,
        consensusScore: geminiResult ? Math.round((analysis.score + geminiResult.score) / 2) : analysis.score
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `phishguard-audit-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090a0f] text-zinc-100 font-sans antialiased selection:bg-zinc-800 selection:text-zinc-200">
      {/* Header Toolbar */}
      <Header
        hasUsableKey={hasUsableKey}
        detectedModel={detectedModel || selectedModel}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportReport={handleExportReport}
        hasAnalysis={Boolean(analysis)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'playbooks' ? (
          <VerificationPlaybooks onReturnToAudit={() => setActiveTab('overview')} />
        ) : activeTab === 'quiz' ? (
          <AwarenessQuiz onReturnToAudit={() => setActiveTab('overview')} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Email Input Form (5 cols) */}
            <div className="lg:col-span-5">
              <EmailForm
                sender={sender}
                setSender={setSender}
                subject={subject}
                setSubject={setSubject}
                body={body}
                setBody={setBody}
                samples={SAMPLE_EMAILS}
                selectedSampleId={selectedSampleId}
                onSelectSample={handleSelectSample}
                onClear={handleClear}
                onAnalyze={() => runAnalysis(sender, subject, body, true)}
                autoRunGemini={autoRunGemini}
                setAutoRunGemini={setAutoRunGemini}
                hasUsableKey={hasUsableKey}
                onOpenKeyModal={() => setIsKeyModalOpen(true)}
                isGeminiLoading={isGeminiLoading}
              />
            </div>

            {/* Right Column: Triage Results & Defense Protocols (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {analysis ? (
                <>
                  {/* Top Verdict & Risk Metric */}
                  <ThreatVerdict
                    analysis={analysis}
                    geminiResult={geminiResult}
                    isGeminiLoading={isGeminiLoading}
                    geminiError={geminiError}
                  />

                  {/* Segmented Detail View Tabs */}
                  <div className="bg-[#12151d] border border-zinc-800 rounded-xl p-4 space-y-4 shadow-md">
                    <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 pb-3 gap-2">
                      <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                        <button
                          type="button"
                          onClick={() => setResultTab('indicators')}
                          className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                            resultTab === 'indicators'
                              ? 'bg-zinc-100 text-zinc-950 font-bold shadow-xs'
                              : 'bg-[#181c26] text-zinc-300 hover:text-white hover:bg-zinc-800'
                          }`}
                        >
                          Findings ({analysis.indicators.critical.length + analysis.indicators.warnings.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setResultTab('actions')}
                          className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                            resultTab === 'actions'
                              ? 'bg-zinc-100 text-zinc-950 font-bold shadow-xs'
                              : 'bg-[#181c26] text-zinc-300 hover:text-white hover:bg-zinc-800'
                          }`}
                        >
                          Safe Steps ({analysis.safeNextSteps?.length || 4})
                        </button>
                        <button
                          type="button"
                          onClick={() => setResultTab('links')}
                          className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                            resultTab === 'links'
                              ? 'bg-zinc-100 text-zinc-950 font-bold shadow-xs'
                              : 'bg-[#181c26] text-zinc-300 hover:text-white hover:bg-zinc-800'
                          }`}
                        >
                          Links ({analysis.urls?.length || 0})
                        </button>
                        <button
                          type="button"
                          onClick={() => setResultTab('raw')}
                          className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                            resultTab === 'raw'
                              ? 'bg-zinc-100 text-zinc-950 font-bold shadow-xs'
                              : 'bg-[#181c26] text-zinc-300 hover:text-white hover:bg-zinc-800'
                          }`}
                        >
                          Raw Payload
                        </button>
                      </div>
                    </div>

                    {/* Active Tab Panel */}
                    <div>
                      {resultTab === 'indicators' && (
                        <IndicatorList
                          indicators={analysis.indicators}
                          detectedKeywords={analysis.detectedKeywords}
                        />
                      )}
                      {resultTab === 'actions' && (
                        <ActionChecklist
                          safeNextSteps={analysis.safeNextSteps}
                          classification={analysis.classification}
                          senderDomain={analysis.sender?.domain}
                        />
                      )}
                      {resultTab === 'links' && (
                        <UrlInspector urls={analysis.urls} />
                      )}
                      {resultTab === 'raw' && (
                        <EmailAnatomy
                          sender={sender}
                          subject={subject}
                          body={body}
                          detectedKeywords={analysis.detectedKeywords}
                        />
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-[#12151d] border border-zinc-800 rounded-xl p-12 text-center font-mono space-y-2">
                  <div className="text-sm font-semibold text-zinc-300">READY FOR AUDIT INPUT</div>
                  <div className="text-xs text-zinc-400 font-sans">
                    Paste email details on the left or select a sample fixture to initiate security triage.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 bg-[#0b0d13] py-4 px-6 text-center font-mono text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>PhishGuard Security Engine &bull; Heuristic Inspection + Google Gemini Flash</span>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setActiveTab('playbooks')}
              className="hover:text-zinc-200 underline cursor-pointer"
            >
              Verification SOPs
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quiz')}
              className="hover:text-zinc-200 underline cursor-pointer"
            >
              Awareness Drill
            </button>
            <button
              type="button"
              onClick={() => setIsKeyModalOpen(true)}
              className="hover:text-zinc-200 underline cursor-pointer"
            >
              Configure Gemini
            </button>
          </div>
        </div>
      </footer>

      {/* Gemini Settings Modal */}
      <GeminiSettingsModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveKey={handleSaveKey}
        selectedModel={selectedModel}
        hasServerKey={hasServerKey}
      />
    </div>
  );
}
