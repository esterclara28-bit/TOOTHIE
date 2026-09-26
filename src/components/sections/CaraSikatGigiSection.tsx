import React, { useState, useEffect } from 'react';
import { BRUSHING_STEPS } from '../../data/dentalData';
import { BrushingStep } from '../../types';
import { ToothieMascot } from '../mascot/ToothieMascot';
import { ToothbrushCharacter } from '../mascot/ToothbrushCharacter';
import { ToothpasteCharacter } from '../mascot/ToothpasteCharacter';
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Sparkles, CheckCircle2, Clock, Volume2, Award } from 'lucide-react';
import { playPop, playSuccess, playBrushSound, playFanfare, speakText } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface CaraSikatProps {
  onUnlockBadge?: (badgeId: string) => void;
}

export const CaraSikatGigiSection: React.FC<CaraSikatProps> = ({ onUnlockBadge }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep: BrushingStep = BRUSHING_STEPS[currentStepIndex];

  // 2-minute interactive practice timer
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 120 seconds = 2 minutes
  const [timerCompleted, setTimerCompleted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            setTimerCompleted(true);
            playFanfare();
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
            if (onUnlockBadge) {
              onUnlockBadge('jago-sikat');
            }
            return 0;
          }
          if (prev % 2 === 0) {
            playBrushSound();
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!timerActive && interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timeLeft, onUnlockBadge]);

  const handleNextStep = () => {
    if (currentStepIndex < BRUSHING_STEPS.length - 1) {
      playPop();
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      speakText(`Langkah ${nextIdx + 1}: ${BRUSHING_STEPS[nextIdx].title}. ${BRUSHING_STEPS[nextIdx].tip}`);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      playPop();
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      speakText(`Langkah ${prevIdx + 1}: ${BRUSHING_STEPS[prevIdx].title}`);
    }
  };

  const toggleTimer = () => {
    playPop();
    if (!timerActive && timeLeft === 0) {
      setTimeLeft(120);
      setTimerCompleted(false);
    }
    setTimerActive(!timerActive);
  };

  const resetTimer = () => {
    playPop();
    setTimerActive(false);
    setTimeLeft(120);
    setTimerCompleted(false);
  };

  // Timer focus area helper
  const getTimerFocusArea = () => {
    if (timeLeft > 90) return 'Sikat Gigi Bagian Depan & Luar Atas (Gerakan Memutar)';
    if (timeLeft > 60) return 'Sikat Gigi Bagian Belakang & Permukaan Kunyah Atas';
    if (timeLeft > 30) return 'Sikat Gigi Bagian Luar & Dalam Bawah';
    return 'Sikat Permukaan Kunyah Bawah & Bersihkan Lidah!';
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-400 via-teal-400 to-sky-400 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-white">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Materi 2 • Panduan Praktik Menyikat Gigi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Cara Menyikat Gigi yang Benar 🪥
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-emerald-950 font-bold max-w-xl">
            Ikuti 7 langkah seru agar seluruh kuman kabur dan gigimu putih berkilau setiap hari!
          </p>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <ToothieMascot
            size="md"
            expression="brushing"
            speechBubbleText="Sikat gigi 2 menit ya!"
          />
          <ToothbrushCharacter size="md" animated={true} />
        </div>
      </div>

      {/* Golden Rules Box */}
      <div className="bg-amber-50 rounded-2xl p-4 sm:p-6 border-2 border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 text-white font-black text-2xl flex items-center justify-center shadow-md flex-shrink-0">
            ☀️
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-black text-amber-950">
              Aturan Emas: Sikat Gigi 2 Kali Sehari!
            </h4>
            <p className="text-xs sm:text-sm font-bold text-amber-800">
              1 kali di pagi hari <strong>setelah sarapan</strong> dan 1 kali di malam hari <strong>sebelum tidur</strong>.
            </p>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-indigo-500 text-white font-black text-2xl flex items-center justify-center shadow-md flex-shrink-0">
          🌙
        </div>
      </div>

      {/* Step by Step Interactive Tutorial Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-sky-100 shadow-xl space-y-8">
        {/* Step Progress Dots */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {BRUSHING_STEPS.map((step, idx) => (
            <button
              key={step.stepNumber}
              onClick={() => {
                playPop();
                setCurrentStepIndex(idx);
              }}
              className={`flex-1 min-w-[36px] h-10 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center ${
                currentStepIndex === idx
                  ? 'bg-emerald-500 text-white shadow-md scale-105'
                  : currentStepIndex > idx
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        {/* Step Main Content View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Visual 3D Step Animation Illustration */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-sky-50 to-teal-50/50 rounded-3xl border-2 border-sky-100">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
              {/* Dynamic SVG / Mascot for each step */}
              {currentStep.visualType === 'setup' && (
                <div className="flex items-center gap-3">
                  <ToothbrushCharacter size="lg" hasPaste={true} />
                  <ToothpasteCharacter size="md" />
                </div>
              )}

              {currentStep.visualType === 'outside' && (
                <div className="relative">
                  <ToothieMascot size="lg" expression="happy" />
                  <div className="absolute top-1/2 -right-4 animate-brush">
                    <ToothbrushCharacter size="sm" hasPaste={true} />
                  </div>
                </div>
              )}

              {currentStep.visualType === 'inside' && (
                <div className="relative">
                  <ToothieMascot size="lg" expression="excited" />
                  <div className="absolute top-1/3 left-4 animate-brush">
                    <ToothbrushCharacter size="sm" />
                  </div>
                </div>
              )}

              {currentStep.visualType === 'chewing' && (
                <div className="relative">
                  <ToothieMascot size="lg" expression="proud" />
                  <div className="absolute top-0 right-2 animate-bounce">
                    <ToothbrushCharacter size="sm" />
                  </div>
                </div>
              )}

              {currentStep.visualType === 'tongue' && (
                <div className="relative text-center">
                  <div className="text-7xl mb-2 animate-pulse">👅</div>
                  <ToothbrushCharacter size="sm" animated={true} />
                </div>
              )}

              {currentStep.visualType === 'rinse' && (
                <div className="relative text-center">
                  <div className="text-7xl mb-2 animate-bounce">💧🫧</div>
                  <ToothieMascot size="md" expression="sparkle" />
                </div>
              )}

              {currentStep.visualType === 'store' && (
                <div className="relative text-center">
                  <div className="text-6xl mb-2">🪥✨</div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                    Sikat Disimpan Tegak & Kering!
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs font-black text-slate-500 bg-white px-3 py-1.5 rounded-full border">
              <Clock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Estimasi: {currentStep.duration}</span>
            </div>
          </div>

          {/* Step Text & Controls */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full">
                  Langkah {currentStep.stepNumber} dari {BRUSHING_STEPS.length}
                </span>
                <button
                  onClick={() => speakText(`Langkah ${currentStep.stepNumber}: ${currentStep.title}. ${currentStep.description}. ${currentStep.tip}`)}
                  className="p-1.5 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg"
                  title="Dengarkan Suara"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
                {currentStep.title}
              </h2>
            </div>

            <p className="text-base sm:text-lg font-bold text-slate-700 leading-relaxed">
              {currentStep.description}
            </p>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black text-amber-900 uppercase tracking-wide block">
                  Tips dari Kapten Toothie:
                </span>
                <p className="text-sm font-bold text-amber-950 mt-0.5">
                  {currentStep.tip}
                </p>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className={`py-3 px-5 rounded-2xl font-black text-sm flex items-center gap-1.5 transition-all ${
                  currentStepIndex === 0
                    ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                    : 'btn-3d-white text-slate-700'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <button
                onClick={handleNextStep}
                disabled={currentStepIndex === BRUSHING_STEPS.length - 1}
                className={`py-3 px-6 rounded-2xl font-black text-sm flex items-center gap-1.5 transition-all ${
                  currentStepIndex === BRUSHING_STEPS.length - 1
                    ? 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400'
                    : 'btn-3d-emerald text-white'
                }`}
              >
                <span>Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Minute Toothbrushing Simulator & Practice Timer */}
      <div className="bg-gradient-to-br from-indigo-500 via-sky-600 to-teal-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl border-4 border-white">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 px-3.5 py-1 rounded-full text-xs font-black">
              <Clock className="w-4 h-4 text-yellow-300" />
              <span>Simulasi Sikat Gigi Interaktif</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-black">
              Timer Sikat Gigi 2 Menit ⏱️
            </h3>

            <p className="text-sm sm:text-base font-bold text-sky-100 max-w-lg leading-relaxed">
              Tekan tombol mulai dan sikat gigimu mengikuti instruksi area di layar sampai selesai untuk membuka piala <strong>&ldquo;Jago Sikat Gigi&rdquo;</strong>!
            </p>

            {/* Current Focus Area Prompt */}
            <div className="p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 text-white font-extrabold text-sm sm:text-base">
              👉 Sedang Disikat: <br />
              <span className="text-yellow-300 text-base sm:text-lg underline">
                {timerActive ? getTimerFocusArea() : 'Siap untuk mulai sikat gigi?'}
              </span>
            </div>
          </div>

          {/* Timer Clock Circle & Controls */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-white/20 backdrop-blur-md border-6 border-white flex flex-col items-center justify-center shadow-2xl">
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
                {formattedTime}
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-sky-100 mt-1">
                {timerActive ? 'Lanjutkan!' : timerCompleted ? 'Hebat!' : '2 Menit'}
              </span>

              {/* Progress ring indicator */}
              <div
                className="absolute inset-0 rounded-full border-4 border-yellow-300 border-t-transparent animate-spin opacity-40 pointer-events-none"
                style={{ animationDuration: '6s', display: timerActive ? 'block' : 'none' }}
              />
            </div>

            {/* Timer Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTimer}
                className="btn-3d-amber px-6 py-3 rounded-2xl text-white font-black text-base flex items-center gap-2 shadow-lg"
              >
                {timerActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                <span>{timerActive ? 'Jeda' : timeLeft === 120 ? 'Mulai Sikat!' : 'Lanjutkan'}</span>
              </button>

              <button
                onClick={resetTimer}
                title="Reset Timer"
                className="btn-3d-white p-3 rounded-2xl text-slate-700 font-black shadow-lg"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {timerCompleted && (
              <div className="p-3 bg-white text-emerald-800 rounded-2xl font-black text-xs sm:text-sm text-center shadow-lg animate-bounce flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>Luar biasa! Kamu menyelesaikan sikat gigi 2 menit!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
