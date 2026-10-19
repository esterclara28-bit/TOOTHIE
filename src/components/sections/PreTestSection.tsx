import React, { useState } from 'react';
import { PRE_TEST_QUESTIONS } from '../../data/dentalData';
import { QuizQuestion, NavSection } from '../../types';
import { ToothieMascot } from '../mascot/ToothieMascot';
import { Sparkles, CheckCircle2, ArrowRight, RotateCcw, BrainCircuit } from 'lucide-react';
import { playPop, playSuccess, playFanfare, speakText } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface PreTestProps {
  onFinishPreTest: (score: number) => void;
  onNavigate: (section: NavSection) => void;
  initialScore?: number;
  isAlreadyCompleted?: boolean;
}

export const PreTestSection: React.FC<PreTestProps> = ({
  onFinishPreTest,
  onNavigate,
  initialScore,
  isAlreadyCompleted = false,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(isAlreadyCompleted);
  const [finalScore, setFinalScore] = useState<number>(initialScore || 0);

  const question: QuizQuestion = PRE_TEST_QUESTIONS[currentIdx];

  const handleSelectAnswer = (optIdx: number) => {
    playPop();
    const newAnswers = [...answers];
    newAnswers[currentIdx] = optIdx;
    setAnswers(newAnswers);

    if (currentIdx < PRE_TEST_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      let correct = 0;
      PRE_TEST_QUESTIONS.forEach((q, idx) => {
        const chosen = idx === currentIdx ? optIdx : newAnswers[idx];
        if (chosen !== undefined && q.options[chosen]?.isCorrect) {
          correct++;
        }
      });
      const calculated = Math.round((correct / PRE_TEST_QUESTIONS.length) * 100);
      setFinalScore(calculated);
      setIsCompleted(true);
      playFanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      onFinishPreTest(calculated);
      speakText(`Pre-test selesai! Skormu adalah ${calculated}. Yuk kita mulai belajar!`);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-400 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-white">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black">
            <BrainCircuit className="w-4 h-4 text-yellow-300" />
            <span>Tes Awal Pengetahuan (Pre-Test)</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Tes Awal Sebelum Belajar 📝
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-sky-950 font-bold max-w-xl">
            Yuk cek seberapa jauh pemahaman awalmu tentang kesehatan gigi! Jangan khawatir, tes ini santai dan untuk mengukur peningkatan belajarmu nanti.
          </p>
        </div>

        <div className="flex-shrink-0">
          <ToothieMascot
            size="lg"
            expression={isCompleted ? 'sparkle' : 'thinking'}
            speechBubbleText={isCompleted ? 'Hebat, yuk lanjut!' : 'Semangat ya!'}
          />
        </div>
      </div>

      {!isCompleted ? (
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border-2 border-sky-100 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-800 rounded-full">
              Soal {currentIdx + 1} dari {PRE_TEST_QUESTIONS.length}
            </span>

            <div className="flex gap-1.5">
              {PRE_TEST_QUESTIONS.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-6 h-2 rounded-full transition-all ${
                    idx === currentIdx
                      ? 'bg-sky-600 scale-110'
                      : idx < currentIdx
                      ? 'bg-emerald-400'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
            {question.question}
          </h2>

          <div className="space-y-3 pt-2">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(idx)}
                className="w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-sky-400 hover:bg-sky-50/50 text-slate-800 text-left font-bold text-sm sm:text-base transition-all flex items-center gap-3 group"
              >
                <span className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-sky-600 group-hover:text-white border flex items-center justify-center font-black text-xs text-slate-700 transition-colors">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="group-hover:text-sky-950">{opt.text}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 sm:p-10 border-2 border-sky-100 shadow-xl text-center space-y-6">
          <div className="text-5xl animate-bounce">🎯✨</div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
            Pre-Test Berhasil Diselesaikan!
          </h2>
          <p className="text-sm sm:text-base font-bold text-slate-600 max-w-md mx-auto">
            Nilai awalmu adalah:
          </p>

          <div className="inline-block p-6 rounded-3xl bg-gradient-to-r from-sky-400 to-teal-400 text-white shadow-lg">
            <span className="text-xs font-black uppercase tracking-wider block text-sky-900">
              Skor Pre-Test:
            </span>
            <span className="text-5xl font-black">{finalScore} Poin</span>
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-500 max-w-lg mx-auto">
            Sekarang pintu materi belajar bertahap telah terbuka! Pelajari modul demi modul, lalu ikuti Post-Test untuk melihat peningkatan skormu!
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                playSuccess();
                onNavigate('kenali-gigi');
              }}
              className="btn-3d-amber px-6 py-3.5 rounded-2xl text-white font-black text-base flex items-center gap-2 shadow-lg"
            >
              <span>Mulai Materi 1: Kenali Gigi 🚀</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                setIsCompleted(false);
                setCurrentIdx(0);
                setAnswers([]);
              }}
              className="px-5 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50"
            >
              <RotateCcw className="w-4 h-4 inline mr-1" />
              <span>Ulangi Pre-Test</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
