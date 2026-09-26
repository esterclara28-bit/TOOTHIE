import React, { useState } from 'react';
import { PLAK_STAGES } from '../../data/dentalData';
import { PlakStage } from '../../types';
import { ToothieMascot } from '../mascot/ToothieMascot';
import { GermCharacter } from '../mascot/GermCharacter';
import { Sparkles, Shield, ChevronRight, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { playPop, playSparkle, speakText } from '../../utils/soundEffects';

interface PlakKarangProps {
  onUnlockBadge?: (badgeId: string) => void;
}

export const PlakKarangSection: React.FC<PlakKarangProps> = ({ onUnlockBadge }) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const currentStage: PlakStage = PLAK_STAGES[currentStageIdx];

  const handleStageSelect = (idx: number) => {
    setCurrentStageIdx(idx);
    playPop();
    speakText(`Tahap ${idx + 1}: ${PLAK_STAGES[idx].title}. ${PLAK_STAGES[idx].description}`);
    if (onUnlockBadge && idx >= 2) {
      onUnlockBadge('musuh-plak');
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-sky-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-white">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Materi 4 • Detektif Plak & Karang Gigi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Plak & Karang Gigi 🦠
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-purple-100 font-bold max-w-xl">
            Yuk cari tahu rahasia bagaimana lapisan lengket bisa mengeras seperti batu karang dan cara melawannya!
          </p>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <ToothieMascot
            size="md"
            expression={currentStage.mascotMood === 'sad' ? 'worried' : currentStage.mascotMood === 'worried' ? 'thinking' : 'sparkle'}
            speechBubbleText="Ayo usir kuman!"
          />
          <GermCharacter type="mimi" size="md" />
        </div>
      </div>

      {/* Main Educational Takeaways */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-purple-50 rounded-3xl p-6 border-2 border-purple-200 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🦠</span>
            <h3 className="text-lg font-black text-purple-950">
              Apa itu Plak Gigi?
            </h3>
          </div>
          <p className="text-sm font-bold text-purple-900 leading-relaxed">
            <strong>Plak</strong> adalah lapisan lengket tak berwarna atau keputihan yang terbentuk dari campuran sisa makanan, air liur, dan bakteri. Plak masih lunak sehingga <em>bisa disapu bersih</em> dengan sikat gigi!
          </p>
        </div>

        <div className="bg-amber-50 rounded-3xl p-6 border-2 border-amber-200 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🪨</span>
            <h3 className="text-lg font-black text-amber-950">
              Apa itu Karang Gigi?
            </h3>
          </div>
          <p className="text-sm font-bold text-amber-900 leading-relaxed">
            <strong>Karang Gigi (Tartar)</strong> terjadi jika plak dibiarkan mengendap berhari-hari. Plak akan mengeras seperti batu karang dan <em>hanya bisa dibersihkan</em> oleh dokter gigi dengan alat scaling.
          </p>
        </div>
      </div>

      {/* Visual Progression 3D Stage Flow */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-sky-100 shadow-xl space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4">
          <div>
            <span className="text-xs font-black text-purple-600 uppercase tracking-wider">
              Perjalanan Perubahan Gigi (Progression 3D)
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
              Dari Gigi Bersih Menjadi Karang Gigi
            </h2>
          </div>
        </div>

        {/* 4 Steps Timeline Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PLAK_STAGES.map((st, idx) => (
            <button
              key={st.stage}
              onClick={() => handleStageSelect(idx)}
              className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                currentStageIdx === idx
                  ? 'border-purple-500 bg-purple-50 text-purple-900 shadow-md ring-2 ring-purple-200'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white border text-purple-700">
                  Tahap {st.stage}
                </span>
                <span className="text-xl">
                  {idx === 0 ? '✨' : idx === 1 ? '🍪' : idx === 2 ? '🦠' : '🪨'}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-black line-clamp-1">
                {st.title}
              </span>
            </button>
          ))}
        </div>

        {/* Stage Interactive Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-b from-slate-50 to-purple-50/40 p-6 sm:p-8 rounded-3xl border border-purple-100">
          {/* 3D Visual Tooth Representation */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center">
              {/* Tooth SVG with progressive layers */}
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg">
                <defs>
                  <linearGradient id="cleanTooth" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#dbeafe" />
                  </linearGradient>
                </defs>

                {/* Base Tooth */}
                <path
                  d="M 52 35 C 40 35, 28 48, 28 72 C 28 110, 35 130, 52 170 C 60 190, 75 190, 82 170 C 90 150, 95 130, 100 130 C 105 130, 110 150, 118 170 C 125 190, 140 190, 148 170 C 165 130, 172 110, 172 72 C 172 48, 160 35, 148 35 C 134 35, 122 45, 100 45 C 78 45, 66 35, 52 35 Z"
                  fill="url(#cleanTooth)"
                  stroke="#93c5fd"
                  strokeWidth="3"
                />

                {/* Tahap 2: Food crumbs */}
                {currentStageIdx >= 1 && (
                  <g className="animate-pulse">
                    <circle cx="65" cy="55" r="4.5" fill="#f59e0b" />
                    <circle cx="130" cy="58" r="4" fill="#f59e0b" />
                    <circle cx="95" cy="65" r="3.5" fill="#d97706" />
                    <rect x="140" y="80" width="6" height="5" rx="1.5" fill="#b45309" />
                  </g>
                )}

                {/* Tahap 3: Plaque sticky yellow-green film */}
                {currentStageIdx >= 2 && (
                  <g>
                    <path
                      d="M 32 75 Q 60 95 100 80 Q 140 95 168 75 C 172 110, 160 140, 148 160 C 110 145, 90 145, 52 160 C 40 140, 28 110, 32 75 Z"
                      fill="#fef08a"
                      opacity="0.75"
                    />
                    {/* Small bacterial spots */}
                    <circle cx="55" cy="110" r="5" fill="#a855f7" opacity="0.8" />
                    <circle cx="140" cy="115" r="5" fill="#a855f7" opacity="0.8" />
                    <circle cx="95" cy="120" r="4" fill="#10b981" opacity="0.8" />
                  </g>
                )}

                {/* Tahap 4: Hardened brown-yellow Tartar along gum line */}
                {currentStageIdx >= 3 && (
                  <g>
                    <path
                      d="M 40 140 Q 100 130 160 140 L 155 175 Q 100 165 45 175 Z"
                      fill="#78350f"
                      stroke="#451a03"
                      strokeWidth="2"
                    />
                    <path
                      d="M 50 145 Q 100 138 150 145 L 146 165 Q 100 158 54 165 Z"
                      fill="#ca8a04"
                    />
                  </g>
                )}

                {/* Cute eyes & face that change mood */}
                {currentStageIdx === 0 && (
                  <g>
                    <circle cx="72" cy="85" r="5" fill="#0f172a" />
                    <circle cx="128" cy="85" r="5" fill="#0f172a" />
                    <circle cx="70" cy="83" r="1.5" fill="#ffffff" />
                    <circle cx="126" cy="83" r="1.5" fill="#ffffff" />
                    <path d="M 85 98 Q 100 110 115 98" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </g>
                )}

                {currentStageIdx === 1 && (
                  <g>
                    <circle cx="72" cy="85" r="5" fill="#0f172a" />
                    <circle cx="128" cy="85" r="5" fill="#0f172a" />
                    <line x1="88" y1="98" x2="112" y2="98" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
                  </g>
                )}

                {currentStageIdx >= 2 && (
                  <g>
                    <circle cx="72" cy="85" r="5" fill="#0f172a" />
                    <circle cx="128" cy="85" r="5" fill="#0f172a" />
                    <path d="M 88 102 Q 100 95 112 102" stroke="#e11d48" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </g>
                )}
              </svg>
            </div>

            <span className="mt-3 text-xs font-black px-3 py-1 bg-white border rounded-full text-slate-700 shadow-xs">
              {currentStage.badgeText}
            </span>
          </div>

          {/* Description & Action Plan */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-2xl font-black text-slate-800">
              {currentStage.title}
            </h3>

            <p className="text-base font-bold text-slate-700 leading-relaxed">
              {currentStage.description}
            </p>

            <div className="p-4 rounded-2xl bg-white border-2 border-purple-200 space-y-2">
              <span className="text-xs font-black text-purple-700 uppercase tracking-wider block">
                Tampilan Visual Gigi:
              </span>
              <p className="text-sm font-bold text-slate-600">
                {currentStage.appearanceDescription}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black text-emerald-800 uppercase tracking-wider block">
                  Solusi Terbaik:
                </span>
                <p className="text-sm font-bold text-emerald-950 mt-0.5">
                  {currentStage.solution}
                </p>
              </div>
            </div>

            {/* Next Stage button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  const next = (currentStageIdx + 1) % PLAK_STAGES.length;
                  handleStageSelect(next);
                }}
                className="btn-3d-cyan text-white text-xs font-black px-5 py-2.5 rounded-xl flex items-center gap-1.5"
              >
                <span>Lihat Tahap Berikutnya</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
