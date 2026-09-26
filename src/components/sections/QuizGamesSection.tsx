import React, { useState, useEffect } from 'react';
import { QUIZ_QUESTIONS } from '../../data/dentalData';
import { QuizQuestion } from '../../types';
import { ToothieMascot } from '../mascot/ToothieMascot';
import { GermCharacter } from '../mascot/GermCharacter';
import { Sparkles, Award, Star, ArrowRight, RotateCcw, CheckCircle2, XCircle, Heart, Play, Trophy } from 'lucide-react';
import { playPop, playSuccess, playBoing, playFanfare, playBrushSound, speakText } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface QuizGamesProps {
  onUnlockBadge?: (badgeId: string) => void;
  onRecordScore?: (score: number) => void;
}

export const QuizGamesSection: React.FC<QuizGamesProps> = ({ onUnlockBadge, onRecordScore }) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'germ-game'>('quiz');

  // QUIZ STATE
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [mascotMood, setMascotMood] = useState<'happy' | 'excited' | 'thinking' | 'worried'>('thinking');

  const question: QuizQuestion = QUIZ_QUESTIONS[currentQuestionIdx];

  const handleSelectOption = (idx: number) => {
    if (showFeedback) return;
    setSelectedOptionIdx(idx);
    setShowFeedback(true);

    const isCorrect = question.options[idx].isCorrect;
    if (isCorrect) {
      playSuccess();
      setScore((prev) => prev + 10);
      setMascotMood('excited');
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
      speakText('Hebat! Jawabanmu benar sekali!');
    } else {
      playBoing();
      setMascotMood('worried');
      speakText('Hampir benar! Yuk kita pelajari bersama.');
    }
  };

  const handleNextQuestion = () => {
    playPop();
    setShowFeedback(false);
    setSelectedOptionIdx(null);
    setMascotMood('thinking');

    if (currentQuestionIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      playFanfare();
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { y: 0.5 },
      });
      if (onRecordScore) onRecordScore(score + (question.options[selectedOptionIdx || 0]?.isCorrect ? 10 : 0));
      if (onUnlockBadge) onUnlockBadge('ahli-gigi-sehat');
    }
  };

  const resetQuiz = () => {
    playPop();
    setCurrentQuestionIdx(0);
    setSelectedOptionIdx(null);
    setScore(0);
    setShowFeedback(false);
    setQuizFinished(false);
    setMascotMood('thinking');
  };

  // MINI GAME STATE: GERM BUSTER
  const [gameActive, setGameActive] = useState(false);
  const [gameTimeLeft, setGameTimeLeft] = useState(25);
  const [germsDefeated, setGermsDefeated] = useState(0);
  const [germPositions, setGermPositions] = useState<{ id: number; top: number; left: number; type: 'mimi' | 'dodo' }[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    let spawnTimer: NodeJS.Timeout | null = null;

    if (gameActive && gameTimeLeft > 0) {
      timer = setInterval(() => {
        setGameTimeLeft((prev) => {
          if (prev <= 1) {
            setGameActive(false);
            playFanfare();
            confetti({ particleCount: 90, spread: 80 });
            if (onUnlockBadge) onUnlockBadge('musuh-plak');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      spawnTimer = setInterval(() => {
        setGermPositions((prev) => {
          if (prev.length >= 6) return prev;
          const newGerm: { id: number; top: number; left: number; type: 'mimi' | 'dodo' } = {
            id: Date.now() + Math.random(),
            top: 20 + Math.random() * 60,
            left: 15 + Math.random() * 70,
            type: Math.random() > 0.5 ? 'mimi' : 'dodo',
          };
          return [...prev, newGerm];
        });
      }, 1200);
    }

    return () => {
      if (timer) clearInterval(timer);
      if (spawnTimer) clearInterval(spawnTimer);
    };
  }, [gameActive, gameTimeLeft, onUnlockBadge]);

  const startGermGame = () => {
    playPop();
    setGameTimeLeft(25);
    setGermsDefeated(0);
    setGermPositions([
      { id: 1, top: 30, left: 25, type: 'mimi' },
      { id: 2, top: 45, left: 65, type: 'dodo' },
      { id: 3, top: 60, left: 40, type: 'mimi' },
    ]);
    setGameActive(true);
  };

  const handleDefeatGerm = (id: number) => {
    playBrushSound();
    playPop(520);
    setGermsDefeated((prev) => prev + 1);
    setGermPositions((prev) => prev.filter((g) => g.id !== id));
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-yellow-400 to-teal-400 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-white">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black">
            <Trophy className="w-4 h-4 text-amber-900" />
            <span className="text-amber-950 font-black">Arena Bermain & Berlatih</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-amber-950">
            Quiz & Games Seru! 🎮
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-amber-950 font-bold max-w-xl">
            Tunjukkan seberapa jago kamu menjaga kesehatan gigi dan raih bintang piala emas!
          </p>
        </div>

        <div className="flex-shrink-0">
          <ToothieMascot
            size="lg"
            expression={mascotMood}
            speechBubbleText="Ayo coba, kamu pasti bisa!"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-amber-100/60 rounded-2xl max-w-sm mx-auto">
        <button
          onClick={() => {
            playPop();
            setActiveTab('quiz');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-all ${
            activeTab === 'quiz'
              ? 'bg-white text-amber-800 shadow-md scale-102'
              : 'text-slate-600 hover:text-amber-800'
          }`}
        >
          ⭐ Kuis Petualangan
        </button>
        <button
          onClick={() => {
            playPop();
            setActiveTab('germ-game');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-all ${
            activeTab === 'germ-game'
              ? 'bg-white text-purple-800 shadow-md scale-102'
              : 'text-slate-600 hover:text-purple-800'
          }`}
        >
          🦠 Game Basmi Kuman
        </button>
      </div>

      {/* TAB 1: KUIS INTERAKTIF */}
      {activeTab === 'quiz' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {!quizFinished ? (
            <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-sky-100 shadow-xl space-y-6">
              {/* Question Header & Score Bar */}
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black px-3 py-1 bg-amber-100 text-amber-900 rounded-full">
                    Soal {currentQuestionIdx + 1} dari {QUIZ_QUESTIONS.length}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="text-sm font-black text-amber-900">
                    Skor: {score} Poin
                  </span>
                </div>
              </div>

              {/* Question Text */}
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
                {question.question}
              </h2>

              {/* Options */}
              <div className="space-y-3 pt-2">
                {question.options.map((opt, idx) => {
                  const isSelected = selectedOptionIdx === idx;
                  const isCorrect = opt.isCorrect;

                  let cardStyle =
                    'border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-slate-700';
                  if (showFeedback) {
                    if (isCorrect) {
                      cardStyle =
                        'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-md ring-2 ring-emerald-200';
                    } else if (isSelected && !isCorrect) {
                      cardStyle =
                        'border-rose-400 bg-rose-50 text-rose-950';
                    } else {
                      cardStyle = 'border-slate-200 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={showFeedback}
                      className={`w-full p-4 rounded-2xl border-2 text-left font-bold text-sm sm:text-base transition-all flex items-center justify-between ${cardStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-white border flex items-center justify-center font-black text-xs text-slate-600 shadow-2xs">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{opt.text}</span>
                      </div>

                      {showFeedback && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      )}
                      {showFeedback && isSelected && !isCorrect && (
                        <XCircle className="w-5 h-5 text-rose-500 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Positive Feedback Box */}
              {showFeedback && (
                <div
                  className={`p-4 rounded-2xl border-2 space-y-2 animate-bounce-short ${
                    question.options[selectedOptionIdx || 0]?.isCorrect
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}
                >
                  <div className="flex items-center gap-2 font-black text-sm">
                    {question.options[selectedOptionIdx || 0]?.isCorrect ? (
                      <>
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>Hebat! Jawaban kamu benar! 🎉</span>
                      </>
                    ) : (
                      <>
                        <Heart className="w-4 h-4 text-amber-600 fill-amber-600" />
                        <span>Coba lagi, kamu pasti bisa! Berikut penjelasannya:</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm font-bold leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              )}

              {/* Next Button */}
              {showFeedback && (
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNextQuestion}
                    className="btn-3d-amber text-white font-black text-sm px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg"
                  >
                    <span>
                      {currentQuestionIdx < QUIZ_QUESTIONS.length - 1
                        ? 'Soal Berikutnya'
                        : 'Lihat Hasil Akhir'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Quiz Completed Reward View */
            <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-sky-100 shadow-2xl text-center space-y-6">
              <div className="text-6xl animate-bounce">🏆⭐🎉</div>
              <h2 className="text-3xl font-black text-slate-800">
                Luar Biasa, Sahabat Toothie!
              </h2>
              <p className="text-base font-bold text-slate-600 max-w-md mx-auto">
                Kamu telah menyelesaikan Kuis Petualangan Gigi dengan skor luar biasa:
              </p>

              <div className="inline-block p-6 rounded-3xl bg-gradient-to-r from-amber-400 to-yellow-400 text-white shadow-xl">
                <span className="text-xs font-black uppercase tracking-wider block">
                  Total Nilai:
                </span>
                <span className="text-5xl font-black">{score} Poin</span>
                <div className="flex justify-center gap-1 mt-2 text-2xl">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>

              <div className="pt-4 flex justify-center gap-4">
                <button
                  onClick={resetQuiz}
                  className="btn-3d-white px-6 py-3 rounded-2xl text-slate-700 font-black text-sm flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Main Kuis Lagi</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MINI GAME BASMI KUMAN */}
      {activeTab === 'germ-game' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-100 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4">
              <div>
                <span className="text-xs font-black text-purple-700 uppercase tracking-wider">
                  Mini Game Ketangkasan
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-800">
                  Basmi Kuman Gigi (Germ Buster) 🦠
                </h3>
              </div>

              {/* Game Stats */}
              <div className="flex items-center gap-3">
                <div className="px-3.5 py-1.5 bg-purple-50 rounded-2xl border border-purple-200 text-purple-900 font-black text-sm">
                  ⏱️ Waktu: {gameTimeLeft}s
                </div>
                <div className="px-3.5 py-1.5 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 font-black text-sm">
                  ✨ Kuman Terbasmi: {germsDefeated}
                </div>
              </div>
            </div>

            {/* Game Canvas / Arena */}
            <div className="relative w-full h-80 sm:h-96 bg-gradient-to-b from-sky-100 to-indigo-100 rounded-3xl border-4 border-dashed border-sky-300 overflow-hidden flex items-center justify-center select-none">
              {/* Big Giant Tooth in the background */}
              <div className="absolute opacity-35 pointer-events-none">
                <ToothieMascot size="hero" expression="happy" interactive={false} />
              </div>

              {/* In-Game Active Germs */}
              {gameActive ? (
                germPositions.map((germ) => (
                  <div
                    key={germ.id}
                    onClick={() => handleDefeatGerm(germ.id)}
                    style={{ top: `${germ.top}%`, left: `${germ.left}%` }}
                    className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform animate-bounce"
                  >
                    <GermCharacter type={germ.type} size="md" />
                    <span className="text-[10px] font-black bg-white px-2 py-0.5 rounded-full text-purple-700 shadow-xs block text-center">
                      Sikat Aku! 🪥
                    </span>
                  </div>
                ))
              ) : (
                /* Start Game Screen */
                <div className="relative z-10 text-center space-y-4 p-6 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl max-w-sm border-2 border-purple-200">
                  <div className="text-4xl">🪥✨</div>
                  <h4 className="text-xl font-black text-slate-800">
                    Ayo Bantu Toothie!
                  </h4>
                  <p className="text-xs sm:text-sm font-bold text-slate-600">
                    Klik atau sentuh kuman-kuman nakal yang muncul di permukaan gigi secepat mungkin sebelum waktu habis!
                  </p>

                  <button
                    onClick={startGermGame}
                    className="btn-3d-emerald px-6 py-3 rounded-2xl text-white font-black text-base shadow-lg"
                  >
                    Mulai Main Game! 🚀
                  </button>
                </div>
              )}
            </div>

            {/* Game Footer tip */}
            <p className="text-center text-xs font-bold text-slate-500">
              💡 Tips: Kuman di dunia nyata bisa dibasmi dengan menyikat gigi secara teratur 2 menit setiap hari!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
