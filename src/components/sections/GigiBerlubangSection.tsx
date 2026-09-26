import React, { useState } from 'react';
import { CAVITY_STAGES } from '../../data/dentalData';
import { CavityStage } from '../../types';
import { ToothieMascot } from '../mascot/ToothieMascot';
import { Sparkles, ShieldAlert, HeartPulse, Stethoscope, CheckCircle2, ChevronRight } from 'lucide-react';
import { playPop, playBoing, speakText } from '../../utils/soundEffects';

interface GigiBerlubangProps {
  onUnlockBadge?: (badgeId: string) => void;
}

export const GigiBerlubangSection: React.FC<GigiBerlubangProps> = ({ onUnlockBadge }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const currentStage: CavityStage = CAVITY_STAGES[currentIdx];

  const handleSelectStage = (idx: number) => {
    setCurrentIdx(idx);
    if (idx === 0) playPop();
    else playBoing();
    speakText(`Tahap ${idx + 1}: ${CAVITY_STAGES[idx].title}. ${CAVITY_STAGES[idx].description}`);
    if (onUnlockBadge && idx >= 2) {
      onUnlockBadge('musuh-plak');
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-white">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black">
            <Sparkles className="w-4 h-4 text-yellow-200" />
            <span>Materi 5 • Pencegahan Karies & Gigi Berlubang</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Kenapa Gigi Bisa Berlubang? 🛡️
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-rose-100 font-bold max-w-xl">
            Kalau gigi sering terkena makanan manis dan tidak dibersihkan dengan baik, gigi bisa mengalami kerusakan lho!
          </p>
        </div>

        <div className="flex-shrink-0">
          <ToothieMascot
            size="lg"
            expression={currentIdx === 0 ? 'sparkle' : currentIdx === 1 ? 'thinking' : 'worried'}
            speechBubbleText={currentIdx === 0 ? 'Ayo jaga gigimu!' : 'Lindungi dari asam!'}
          />
        </div>
      </div>

      {/* The Cavity Formula Simplified for Kids */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-100 shadow-lg text-center space-y-4">
        <span className="text-xs font-black text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full">
          Rumus Rahasia Terjadinya Lubang Gigi
        </span>
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-base sm:text-xl font-black text-slate-800">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2">
            <span>🍬 Sisa Gula</span>
          </div>
          <span className="text-rose-500 text-2xl">+</span>
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl flex items-center gap-2">
            <span>🦠 Kuman Mulut</span>
          </div>
          <span className="text-rose-500 text-2xl">=</span>
          <div className="p-3 bg-rose-50 border border-rose-300 rounded-2xl flex items-center gap-2 text-rose-700">
            <span>🧪 Zat Asam Perusak Gigi!</span>
          </div>
        </div>
        <p className="text-sm font-bold text-slate-600 max-w-2xl mx-auto">
          Zat asam ini bekerja seperti tetesan lemon tajam yang perlahan melarutkan zirah email pelindung gigimu jika tidak segera dibilas air atau disikat!
        </p>
      </div>

      {/* 4 Stages Progression */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-sky-100 shadow-xl space-y-8">
        <div>
          <span className="text-xs font-black text-rose-600 uppercase tracking-wider">
            Tahap Kerusakan Gigi
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
            Dari Bercak Kecil Hingga Lubang Sakit
          </h2>
        </div>

        {/* Stage Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CAVITY_STAGES.map((st, idx) => (
            <button
              key={st.stage}
              onClick={() => handleSelectStage(idx)}
              className={`p-4 rounded-2xl border-2 text-left transition-all flex flex-col justify-between ${
                currentIdx === idx
                  ? 'border-rose-500 bg-rose-50/70 text-rose-950 shadow-md ring-2 ring-rose-200'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white border">
                  Tahap {st.stage}
                </span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    st.warningLevel === 'Aman'
                      ? 'bg-emerald-100 text-emerald-800'
                      : st.warningLevel === 'Waspada'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {st.warningLevel}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-black line-clamp-1">
                {st.title}
              </span>
            </button>
          ))}
        </div>

        {/* Stage Detailed Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-b from-slate-50 to-rose-50/30 p-6 sm:p-8 rounded-3xl border border-rose-100">
          {/* Visual 3D Cavity Anatomy */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 sm:w-56 sm:h-56">
              <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-md">
                <defs>
                  <linearGradient id="cavityToothGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#e2e8f0" />
                  </linearGradient>
                </defs>

                {/* Tooth Base */}
                <path
                  d="M 52 35 C 40 35, 28 48, 28 72 C 28 110, 35 130, 52 170 C 60 190, 75 190, 82 170 C 90 150, 95 130, 100 130 C 105 130, 110 150, 118 170 C 125 190, 140 190, 148 170 C 165 130, 172 110, 172 72 C 172 48, 160 35, 148 35 C 134 35, 122 45, 100 45 C 78 45, 66 35, 52 35 Z"
                  fill="url(#cavityToothGrad)"
                  stroke="#cbd5e1"
                  strokeWidth="3"
                />

                {/* Internal Pulp Chamber */}
                <path
                  d="M 85 90 C 80 90, 78 100, 82 135 C 88 155, 96 170, 98 170 C 102 170, 110 155, 116 135 C 120 100, 118 90, 113 90 Z"
                  fill="#f43f5e"
                  opacity={currentIdx === 3 ? 1 : 0.4}
                />

                {/* Stage 1: Small Chalky spot */}
                {currentIdx === 1 && (
                  <ellipse cx="100" cy="52" rx="10" ry="6" fill="#fef08a" stroke="#d97706" strokeWidth="1.5" />
                )}

                {/* Stage 2: Cavity hole into Dentin */}
                {currentIdx === 2 && (
                  <g>
                    <path d="M 90 46 Q 100 68 110 46 Z" fill="#78350f" stroke="#451a03" strokeWidth="2" />
                    <circle cx="100" cy="62" r="7" fill="#451a03" />
                  </g>
                )}

                {/* Stage 3: Deep Cavity reaching Pulp (Red Pulse) */}
                {currentIdx === 3 && (
                  <g>
                    <path d="M 85 45 Q 100 95 115 45 Z" fill="#1e1b4b" stroke="#000000" strokeWidth="2" />
                    {/* Shockwaves */}
                    <circle cx="100" cy="115" r="16" fill="none" stroke="#ef4444" strokeWidth="2.5" className="animate-ping" />
                  </g>
                )}

                {/* Mascot Expression on Tooth */}
                {currentIdx === 0 && (
                  <g>
                    <circle cx="72" cy="95" r="4.5" fill="#0f172a" />
                    <circle cx="128" cy="95" r="4.5" fill="#0f172a" />
                    <path d="M 85 112 Q 100 124 115 112" stroke="#0f172a" strokeWidth="3" fill="none" strokeLinecap="round" />
                  </g>
                )}
                {currentIdx === 1 && (
                  <g>
                    <circle cx="72" cy="95" r="4.5" fill="#0f172a" />
                    <circle cx="128" cy="95" r="4.5" fill="#0f172a" />
                    <line x1="88" y1="112" x2="112" y2="112" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
                  </g>
                )}
                {currentIdx >= 2 && (
                  <g>
                    {/* Pain expression */}
                    <circle cx="72" cy="95" r="4.5" fill="#0f172a" />
                    <circle cx="128" cy="95" r="4.5" fill="#0f172a" />
                    <path d="M 88 116 Q 100 106 112 116" stroke="#e11d48" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                    {/* Bandage */}
                    <rect x="55" y="125" width="26" height="12" rx="4" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.5" transform="rotate(-15 55 125)" />
                  </g>
                )}
              </svg>
            </div>

            <span className="mt-2 text-xs font-black px-3 py-1 bg-white border border-rose-200 rounded-full text-rose-800">
              {currentStage.warningLevel}
            </span>
          </div>

          {/* Detailed Content */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-2xl font-black text-slate-800">
              {currentStage.title}
            </h3>

            <p className="text-base font-bold text-slate-700 leading-relaxed">
              {currentStage.description}
            </p>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <HeartPulse className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black text-amber-900 uppercase tracking-wide block">
                  Sensasi yang Dirasakan:
                </span>
                <p className="text-sm font-bold text-amber-950 mt-0.5">
                  {currentStage.sensation}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-black text-emerald-900 uppercase tracking-wide block">
                  Tindakan Penyelamatan:
                </span>
                <p className="text-sm font-bold text-emerald-950 mt-0.5">
                  {currentStage.action}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prevention Super Tips Card */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl">
            🦸‍♂️
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black">
              4 Jurus Sakti Cegah Gigi Berlubang!
            </h3>
            <p className="text-teal-100 text-xs sm:text-sm font-bold">
              Yuk rajin menyikat gigi dan menjaga kebersihan mulut setiap hari!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 text-slate-900">
          <div className="bg-white p-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm">
            <span>🪥</span>
            <span>Sikat Gigi 2x Sehari</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm">
            <span>🥗</span>
            <span>Kurangi Makanan Manis</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm">
            <span>💧</span>
            <span>Kumur Air Setelah Makan</span>
          </div>
          <div className="bg-white p-3.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-sm">
            <span>👩‍⚕️</span>
            <span>Periksa Gigi Tiap 6 Bulan</span>
          </div>
        </div>
      </div>
    </div>
  );
};
