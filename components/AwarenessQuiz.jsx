'use client';

import { useState } from 'react';
import { AWARENESS_QUIZ } from '../lib/quiz';

export default function AwarenessQuiz({ onReturnToAudit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [answersHistory, setAnswersHistory] = useState([]);

  const currentQuestion = AWARENESS_QUIZ[currentIndex];

  const handleSelect = (idx) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    const chosen = currentQuestion.options[selectedOption];
    const isCorrect = chosen.correct;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }
    setAnswersHistory(prev => [
      ...prev,
      {
        questionId: currentQuestion.id,
        isCorrect,
        chosenIdx: selectedOption
      }
    ]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < AWARENESS_QUIZ.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setScore(0);
    setCompleted(false);
    setAnswersHistory([]);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="bg-[#12151d] border border-zinc-800 rounded-xl p-6 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="text-sm font-mono font-bold text-white">
                PHISHING THREAT RECOGNITION ASSESSMENT
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-semibold">
                SECURITY DRILL
              </span>
            </div>
            <p className="text-sm text-zinc-300 font-sans mt-1">
              Test your ability to spot social engineering, typosquatting, and link deception tactics.
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

        {/* Progress & Metrics */}
        <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
          <span className="font-semibold">
            {completed ? 'ASSESSMENT COMPLETED' : `QUESTION ${currentIndex + 1} OF ${AWARENESS_QUIZ.length}`}
          </span>
          <span className="font-bold">
            SCORE: {score} / {completed ? AWARENESS_QUIZ.length : currentIndex + (isSubmitted ? 1 : 0)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{
              width: `${completed ? 100 : ((currentIndex) / AWARENESS_QUIZ.length) * 100}%`
            }}
          />
        </div>
      </div>

      {!completed ? (
        /* Active Question Card */
        <div className="bg-[#12151d] border border-zinc-800 rounded-xl p-6 space-y-6 shadow-md">
          {/* Question Text */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              Scenario #{currentQuestion.id}
            </span>
            <p className="text-base font-semibold text-white font-sans leading-relaxed">
              {currentQuestion.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let optionStyle = 'bg-[#181c26] border-zinc-800 text-zinc-200 hover:border-zinc-600 hover:text-white';

              if (isSubmitted) {
                if (opt.correct) {
                  optionStyle = 'bg-emerald-950/30 border-emerald-500/80 text-emerald-200 font-semibold shadow-xs';
                } else if (isSelected && !opt.correct) {
                  optionStyle = 'bg-red-950/30 border-red-500/80 text-red-200 font-semibold shadow-xs';
                } else {
                  optionStyle = 'bg-[#12151d] border-zinc-800 text-zinc-500 opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'bg-zinc-800 border-zinc-300 text-white font-semibold shadow-xs';
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isSubmitted}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-4 rounded-xl border text-sm font-sans transition flex items-start space-x-3.5 cursor-pointer ${optionStyle}`}
                >
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-black/40 border border-white/10 shrink-0">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="space-y-2 flex-1">
                    <div className="leading-snug">{opt.text}</div>
                    {isSubmitted && (opt.correct || isSelected) && (
                      <div className={`text-xs font-sans ${opt.correct ? 'text-emerald-300' : 'text-red-300'} pt-2 border-t border-white/10 leading-relaxed`}>
                        {opt.explanation}
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Button */}
          <div className="flex justify-end pt-3 border-t border-zinc-800">
            {!isSubmitted ? (
              <button
                type="button"
                disabled={selectedOption === null}
                onClick={handleSubmit}
                className="px-5 py-2.5 rounded-lg text-sm font-mono font-bold bg-zinc-100 text-zinc-950 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer shadow-sm"
              >
                Submit Answer
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 rounded-lg text-sm font-mono font-bold bg-emerald-500 text-zinc-950 hover:bg-emerald-400 transition cursor-pointer shadow-sm"
              >
                {currentIndex + 1 < AWARENESS_QUIZ.length ? 'Next Question →' : 'View Final Score →'}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Results Card */
        <div className="bg-[#12151d] border border-zinc-800 rounded-xl p-8 space-y-6 text-center shadow-lg">
          <div className="space-y-2.5">
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
              AUDIT COMPLETE
            </span>
            <h3 className="text-3xl font-extrabold font-mono text-white">
              Score: {score} / {AWARENESS_QUIZ.length}
            </h3>
            <p className="text-sm font-sans text-zinc-300 max-w-lg mx-auto leading-relaxed">
              {score === 5
                ? 'Outstanding vigilance! You demonstrated advanced technical proficiency in spotting typosquatting, display name spoofing, and social engineering manipulation.'
                : score >= 3
                ? 'Solid awareness. You caught major threat indicators, but review the out-of-band verification procedures to harden against sophisticated BEC attacks.'
                : 'Refresher training recommended. Attackers frequently exploit urgency and link spoofing to compromise accounts.'}
            </p>
          </div>

          <div className="flex justify-center space-x-3.5 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-lg text-xs font-mono font-bold bg-[#181c26] text-zinc-200 border border-zinc-700 hover:border-zinc-500 hover:text-white transition cursor-pointer"
            >
              ↺ Retake Drill
            </button>
            <button
              type="button"
              onClick={onReturnToAudit}
              className="px-5 py-2.5 rounded-lg text-xs font-mono font-bold bg-zinc-100 text-zinc-950 hover:bg-white transition cursor-pointer shadow-sm"
            >
              Back to Triage Engine
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
