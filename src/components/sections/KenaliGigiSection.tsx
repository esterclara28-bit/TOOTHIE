import React, { useState } from 'react';
import { TEETH_PARTS, TOOTH_LAYERS } from '../../data/dentalData';
import { ToothPart, ToothLayer } from '../../types';
import { ToothieMascot } from '../mascot/ToothieMascot';
import { Sparkles, Info, Heart, CheckCircle2, ChevronRight, Volume2 } from 'lucide-react';
import { playPop, playSparkle, speakText } from '../../utils/soundEffects';

interface KenaliGigiProps {
  onUnlockBadge?: (badgeId: string) => void;
}

export const KenaliGigiSection: React.FC<KenaliGigiProps> = ({ onUnlockBadge }) => {
  const [selectedTooth, setSelectedTooth] = useState<ToothPart>(TEETH_PARTS[0]);
  const [selectedLayer, setSelectedLayer] = useState<ToothLayer>(TOOTH_LAYERS[0]);
  const [activeTab, setActiveTab] = useState<'jenis' | 'lapisan' | 'fungsi'>('jenis');

  const handleSelectTooth = (tooth: ToothPart) => {
    setSelectedTooth(tooth);
    playPop();
    speakText(`Ini ${tooth.name}. Fungsinya ${tooth.role}.`);
    if (onUnlockBadge) {
      onUnlockBadge('detektif-gigi');
    }
  };

  const handleSelectLayer = (layer: ToothLayer) => {
    setSelectedLayer(layer);
    playSparkle();
    speakText(`Ini ${layer.name}. ${layer.characteristics}`);
    if (onUnlockBadge) {
      onUnlockBadge('detektif-gigi');
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-400 via-cyan-400 to-teal-400 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-white">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Materi 1 • Anatomi & Fungsi Gigi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Yuk, Kenali Gigimu! 🦷
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-sky-950 font-bold max-w-xl">
            Gigi bukan sekadar benda putih di mulutmu. Gigi adalah superhero kecil yang membantumu mengunyah makanan lezat dan berbicara jelas!
          </p>
        </div>

        <div className="flex-shrink-0">
          <ToothieMascot
            size="lg"
            expression="excited"
            speechBubbleText="Klik gigi di bawah untuk belajar!"
          />
        </div>
      </div>

      {/* Mode Navigation Tabs */}
      <div className="flex items-center justify-center gap-2 p-1.5 bg-sky-100/70 rounded-2xl max-w-md mx-auto">
        <button
          onClick={() => {
            playPop();
            setActiveTab('jenis');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-all ${
            activeTab === 'jenis'
              ? 'bg-white text-sky-700 shadow-md scale-102'
              : 'text-slate-600 hover:text-sky-700'
          }`}
        >
          🦷 Jenis-Jenis Gigi
        </button>
        <button
          onClick={() => {
            playPop();
            setActiveTab('lapisan');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-all ${
            activeTab === 'lapisan'
              ? 'bg-white text-sky-700 shadow-md scale-102'
              : 'text-slate-600 hover:text-sky-700'
          }`}
        >
          🔬 Bagian & Lapisan
        </button>
        <button
          onClick={() => {
            playPop();
            setActiveTab('fungsi');
          }}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black transition-all ${
            activeTab === 'fungsi'
              ? 'bg-white text-sky-700 shadow-md scale-102'
              : 'text-slate-600 hover:text-sky-700'
          }`}
        >
          ✨ Fungsi Gigi
        </button>
      </div>

      {/* Tab 1: Jenis-Jenis Gigi (Interactive Dental Arch) */}
      {activeTab === 'jenis' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Mouth Arch Visualizer */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-100 shadow-lg flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-black text-sky-600 uppercase tracking-wider">
                  Model Lengkung Gigi 3D
                </span>
                <h3 className="text-xl font-black text-slate-800">
                  Pilih Gigi untuk Diperiksa
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                Sentuh Gigi 👇
              </span>
            </div>

            {/* Stylized Upper Jaw Dental Arch */}
            <div className="relative w-full max-w-[340px] aspect-square flex items-center justify-center p-4">
              {/* Pink Gum Arch */}
              <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-xl">
                <defs>
                  <linearGradient id="gumGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f472b6" />
                    <stop offset="100%" stopColor="#e11d48" />
                  </linearGradient>
                  <radialGradient id="mouthCavity" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#881337" />
                    <stop offset="100%" stopColor="#4c0519" />
                  </radialGradient>
                </defs>

                {/* Mouth Dark Background */}
                <ellipse cx="150" cy="150" rx="125" ry="125" fill="url(#mouthCavity)" />

                {/* Upper Gum Arch */}
                <path
                  d="M 40 220 C 40 80, 260 80, 260 220 C 235 220, 220 140, 150 140 C 80 140, 65 220, 40 220 Z"
                  fill="url(#gumGrad)"
                  stroke="#be123c"
                  strokeWidth="3"
                />

                {/* Teeth Interactive Elements on Arch */}
                {/* 1. Gigi Geraham Kiri (Molar Left) */}
                <g
                  onClick={() => handleSelectTooth(TEETH_PARTS[2])}
                  className="cursor-pointer group"
                >
                  <rect
                    x="48"
                    y="170"
                    width="26"
                    height="28"
                    rx="8"
                    fill={selectedTooth.id === 'geraham' ? '#34d399' : '#ffffff'}
                    stroke={selectedTooth.id === 'geraham' ? '#059669' : '#cbd5e1'}
                    strokeWidth="3"
                  />
                  <rect
                    x="56"
                    y="135"
                    width="24"
                    height="26"
                    rx="7"
                    fill={selectedTooth.id === 'geraham' ? '#34d399' : '#ffffff'}
                    stroke={selectedTooth.id === 'geraham' ? '#059669' : '#cbd5e1'}
                    strokeWidth="3"
                  />
                </g>

                {/* 2. Gigi Taring Kiri (Canine Left) */}
                <g
                  onClick={() => handleSelectTooth(TEETH_PARTS[1])}
                  className="cursor-pointer group"
                >
                  <path
                    d="M 76 105 L 88 88 L 98 105 Z"
                    fill={selectedTooth.id === 'taring' ? '#fbbf24' : '#ffffff'}
                    stroke={selectedTooth.id === 'taring' ? '#d97706' : '#cbd5e1'}
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                </g>

                {/* 3. Gigi Seri Kiri & Kanan (Incisors Center) */}
                <g
                  onClick={() => handleSelectTooth(TEETH_PARTS[0])}
                  className="cursor-pointer group"
                >
                  <rect
                    x="104"
                    y="76"
                    width="18"
                    height="26"
                    rx="4"
                    fill={selectedTooth.id === 'seri' ? '#38bdf8' : '#ffffff'}
                    stroke={selectedTooth.id === 'seri' ? '#0284c7' : '#cbd5e1'}
                    strokeWidth="3"
                  />
                  <rect
                    x="126"
                    y="72"
                    width="22"
                    height="28"
                    rx="4"
                    fill={selectedTooth.id === 'seri' ? '#38bdf8' : '#ffffff'}
                    stroke={selectedTooth.id === 'seri' ? '#0284c7' : '#cbd5e1'}
                    strokeWidth="3"
                  />
                  <rect
                    x="152"
                    y="72"
                    width="22"
                    height="28"
                    rx="4"
                    fill={selectedTooth.id === 'seri' ? '#38bdf8' : '#ffffff'}
                    stroke={selectedTooth.id === 'seri' ? '#0284c7' : '#cbd5e1'}
                    strokeWidth="3"
                  />
                  <rect
                    x="178"
                    y="76"
                    width="18"
                    height="26"
                    rx="4"
                    fill={selectedTooth.id === 'seri' ? '#38bdf8' : '#ffffff'}
                    stroke={selectedTooth.id === 'seri' ? '#0284c7' : '#cbd5e1'}
                    strokeWidth="3"
                  />
                </g>

                {/* 4. Gigi Taring Kanan (Canine Right) */}
                <g
                  onClick={() => handleSelectTooth(TEETH_PARTS[1])}
                  className="cursor-pointer group"
                >
                  <path
                    d="M 202 105 L 212 88 L 224 105 Z"
                    fill={selectedTooth.id === 'taring' ? '#fbbf24' : '#ffffff'}
                    stroke={selectedTooth.id === 'taring' ? '#d97706' : '#cbd5e1'}
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                </g>

                {/* 5. Gigi Geraham Kanan (Molar Right) */}
                <g
                  onClick={() => handleSelectTooth(TEETH_PARTS[2])}
                  className="cursor-pointer group"
                >
                  <rect
                    x="220"
                    y="135"
                    width="24"
                    height="26"
                    rx="7"
                    fill={selectedTooth.id === 'geraham' ? '#34d399' : '#ffffff'}
                    stroke={selectedTooth.id === 'geraham' ? '#059669' : '#cbd5e1'}
                    strokeWidth="3"
                  />
                  <rect
                    x="226"
                    y="170"
                    width="26"
                    height="28"
                    rx="8"
                    fill={selectedTooth.id === 'geraham' ? '#34d399' : '#ffffff'}
                    stroke={selectedTooth.id === 'geraham' ? '#059669' : '#cbd5e1'}
                    strokeWidth="3"
                  />
                </g>
              </svg>
            </div>

            {/* Quick buttons */}
            <div className="flex gap-2 w-full mt-2">
              {TEETH_PARTS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTooth(t)}
                  className={`flex-1 py-2 px-1 text-xs font-black rounded-xl border-2 transition-all ${
                    selectedTooth.id === t.id
                      ? 'border-sky-500 bg-sky-50 text-sky-800 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tooth Detail Popup Card */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-100 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className="text-xs font-black px-3 py-1 bg-sky-100 text-sky-800 rounded-full">
                  {selectedTooth.indonesianName}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
                  {selectedTooth.name}
                </h2>
              </div>
              <button
                onClick={() => speakText(`Ini ${selectedTooth.name}. Fungsinya ${selectedTooth.role}. ${selectedTooth.funFact}`)}
                title="Dengarkan Suara"
                className="p-3 bg-sky-50 text-sky-600 rounded-2xl hover:bg-sky-100 transition-colors"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Primary Role */}
              <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200">
                <span className="text-xs font-black text-sky-700 uppercase tracking-wider block">
                  🎯 Fungsi Utama:
                </span>
                <p className="text-lg font-black text-sky-950 mt-1">
                  &ldquo;Ini {selectedTooth.name}. Fungsinya untuk {selectedTooth.role.toLowerCase()}.&rdquo;
                </p>
              </div>

              {/* Number of Teeth */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                  <span className="text-xs font-black text-amber-800 block">Jumlah di Mulut:</span>
                  <p className="text-sm font-extrabold text-amber-950 mt-0.5">{selectedTooth.count}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <span className="text-xs font-black text-emerald-800 block">Karakteristik:</span>
                  <p className="text-sm font-extrabold text-emerald-950 mt-0.5">
                    {selectedTooth.id === 'seri' ? 'Tipis & Tajam' : selectedTooth.id === 'taring' ? 'Runcing Kuat' : 'Lebar Bergelombang'}
                  </p>
                </div>
              </div>

              {/* Fun Fact Card */}
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex gap-3">
                <div className="text-2xl flex-shrink-0">💡</div>
                <div>
                  <span className="text-xs font-black text-purple-700 uppercase tracking-wider block">
                    Fakta Unik:
                  </span>
                  <p className="text-sm font-bold text-purple-950 mt-1 leading-relaxed">
                    {selectedTooth.funFact}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-between">
              <span className="text-xs font-black text-teal-800">
                ✨ Klik gigi lain untuk menjelajahi taring & geraham!
              </span>
              <button
                onClick={() => {
                  const idx = TEETH_PARTS.findIndex((t) => t.id === selectedTooth.id);
                  const nextTooth = TEETH_PARTS[(idx + 1) % TEETH_PARTS.length];
                  handleSelectTooth(nextTooth);
                }}
                className="btn-3d-cyan text-white text-xs font-black px-4 py-2 rounded-xl flex items-center gap-1"
              >
                <span>Gigi Berikutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Bagian-Bagian Gigi (Cross-Section Anatomy) */}
      {activeTab === 'lapisan' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* 3D Cross-Section Illustration */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-100 shadow-lg flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-black text-sky-600 uppercase tracking-wider">
                  Anatomi Penampang Gigi
                </span>
                <h3 className="text-xl font-black text-slate-800">
                  Lihat Bagian Dalam Gigi
                </h3>
              </div>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                Klik Lapisan 👇
              </span>
            </div>

            <div className="relative w-full max-w-[320px] aspect-square flex items-center justify-center">
              <svg viewBox="0 0 240 260" className="w-full h-full drop-shadow-xl">
                <defs>
                  <linearGradient id="enamelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#e0f2fe" />
                  </linearGradient>
                  <linearGradient id="dentinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fde68a" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                  <linearGradient id="pulpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="100%" stopColor="#be123c" />
                  </linearGradient>
                  <linearGradient id="gumSectionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fb7185" />
                    <stop offset="100%" stopColor="#e11d48" />
                  </linearGradient>
                  <linearGradient id="boneGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f1f5f9" />
                    <stop offset="100%" stopColor="#cbd5e1" />
                  </linearGradient>
                </defs>

                {/* Surrounding Bone & Gums */}
                <rect x="10" y="140" width="220" height="110" rx="10" fill="url(#boneGrad)" />
                <path d="M 10 140 C 40 140, 60 120, 80 140 C 100 160, 140 160, 160 140 C 180 120, 200 140, 230 140 L 230 170 L 10 170 Z" fill="url(#gumSectionGrad)" />

                {/* 1. Enamel (Outer White Shell) */}
                <g
                  onClick={() => handleSelectLayer(TOOTH_LAYERS[0])}
                  className="cursor-pointer group"
                >
                  <path
                    d="M 60 40 C 50 40, 38 60, 42 120 C 45 150, 60 210, 85 240 C 95 240, 100 200, 110 180 C 120 180, 125 200, 135 240 C 160 210, 175 150, 178 120 C 182 60, 170 40, 160 40 C 145 40, 130 50, 110 50 C 90 50, 75 40, 60 40 Z"
                    fill="url(#enamelGrad)"
                    stroke={selectedLayer.id === 'enamel' ? '#0284c7' : '#94a3b8'}
                    strokeWidth={selectedLayer.id === 'enamel' ? '4' : '2'}
                  />
                </g>

                {/* 2. Dentin (Yellow Middle Layer) */}
                <g
                  onClick={() => handleSelectLayer(TOOTH_LAYERS[1])}
                  className="cursor-pointer group"
                >
                  <path
                    d="M 70 55 C 62 55, 55 70, 58 120 C 62 145, 72 195, 88 220 C 96 220, 102 185, 110 170 C 118 185, 124 220, 132 220 C 148 195, 158 145, 162 120 C 165 70, 158 55, 150 55 C 138 55, 128 62, 110 62 C 92 62, 82 55, 70 55 Z"
                    fill="url(#dentinGrad)"
                    stroke={selectedLayer.id === 'dentin' ? '#b45309' : '#d97706'}
                    strokeWidth={selectedLayer.id === 'dentin' ? '4' : '2'}
                  />
                </g>

                {/* 3. Pulp (Red Center Nerve) */}
                <g
                  onClick={() => handleSelectLayer(TOOTH_LAYERS[2])}
                  className="cursor-pointer group"
                >
                  <path
                    d="M 85 85 C 80 85, 78 95, 80 120 C 82 140, 88 175, 96 195 C 100 175, 104 150, 110 135 C 116 150, 120 175, 124 195 C 132 175, 138 140, 140 120 C 142 95, 140 85, 135 85 C 128 85, 122 90, 110 90 C 98 90, 92 85, 85 85 Z"
                    fill="url(#pulpGrad)"
                    stroke={selectedLayer.id === 'pulpa' ? '#881337' : '#e11d48'}
                    strokeWidth={selectedLayer.id === 'pulpa' ? '4' : '2'}
                  />
                </g>
              </svg>
            </div>

            {/* Layer Selection Chips */}
            <div className="grid grid-cols-2 gap-2 w-full mt-3">
              {TOOTH_LAYERS.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => handleSelectLayer(layer)}
                  className={`py-2 px-2 text-xs font-black rounded-xl border-2 transition-all text-center ${
                    selectedLayer.id === layer.id
                      ? 'border-sky-500 bg-sky-50 text-sky-800 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {layer.name}
                </button>
              ))}
            </div>
          </div>

          {/* Layer Detail Card */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-100 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <span className={`text-xs font-black px-3 py-1 rounded-full ${selectedLayer.tagColor}`}>
                  {selectedLayer.title}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800 mt-2">
                  {selectedLayer.name}
                </h2>
              </div>
              <button
                onClick={() => speakText(`${selectedLayer.name}. ${selectedLayer.description} ${selectedLayer.careTip}`)}
                title="Dengarkan Suara"
                className="p-3 bg-sky-50 text-sky-600 rounded-2xl hover:bg-sky-100 transition-colors"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
                <span className="text-xs font-black text-sky-700 uppercase tracking-wider block">
                  Penjelasan:
                </span>
                <p className="text-base font-bold text-sky-950 mt-1 leading-relaxed">
                  {selectedLayer.description}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <span className="text-xs font-black text-amber-800 uppercase tracking-wider block">
                  Ciri Khas:
                </span>
                <p className="text-sm font-bold text-amber-950 mt-1">
                  {selectedLayer.characteristics}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-black text-emerald-800 uppercase tracking-wider block">
                    Tips Menjaganya:
                  </span>
                  <p className="text-sm font-bold text-emerald-950 mt-0.5">
                    {selectedLayer.careTip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Kenapa Gigi Begitu Penting? (Fungsi Gigi) */}
      {activeTab === 'fungsi' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border-2 border-sky-100 shadow-lg space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-600 mx-auto flex items-center justify-center text-3xl shadow-inner">
              🥗
            </div>
            <h3 className="text-xl font-black text-slate-800">
              Mengunyah Makanan Sehat
            </h3>
            <p className="text-sm font-bold text-slate-600 leading-relaxed">
              Gigi melumatkan makanan keras menjadi serpihan lembut sehingga perutmu mudah menyerap vitamin, kalsium, dan nutrisi penting untuk tumbuh tinggi!
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border-2 border-sky-100 shadow-lg space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-3xl shadow-inner">
              🗣️
            </div>
            <h3 className="text-xl font-black text-slate-800">
              Membantu Berbicara Jelas
            </h3>
            <p className="text-sm font-bold text-slate-600 leading-relaxed">
              Lidah dan gigi bekerja sama melafalkan huruf seperti <strong>S, T, D, L, dan TH</strong>. Tanpa gigi depan yang sehat, berbicara terasa sulit dan cadel!
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border-2 border-sky-100 shadow-lg space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center text-3xl shadow-inner">
              😁
            </div>
            <h3 className="text-xl font-black text-slate-800">
              Senyum Manis & Percaya Diri
            </h3>
            <p className="text-sm font-bold text-slate-600 leading-relaxed">
              Gigi yang bersih, putih, dan rapi membuat senyummu mempesona dan membuat teman-temanmu senang menyapamu setiap hari!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
