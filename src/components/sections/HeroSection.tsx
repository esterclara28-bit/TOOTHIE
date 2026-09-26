import React from 'react';
import { NavSection, UserProgress } from '../../types';
import { ToothieMascot } from '../mascot/ToothieMascot';
import { ToothbrushCharacter } from '../mascot/ToothbrushCharacter';
import { ToothpasteCharacter } from '../mascot/ToothpasteCharacter';
import { Sparkles, ArrowRight, Play, Award, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';
import { playPop, playSuccess } from '../../utils/soundEffects';

interface HeroSectionProps {
  onNavigate: (section: NavSection) => void;
  userProgress: UserProgress;
  totalBadges: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onNavigate,
  userProgress,
  totalBadges,
}) => {
  const journeySteps: { id: NavSection; label: string; icon: string }[] = [
    { id: 'kenali-gigi', label: 'Kenali Gigi', icon: '🦷' },
    { id: 'cara-sikat', label: 'Cara Sikat', icon: '🪥' },
    { id: 'makanan', label: 'Pilah Makanan', icon: '🍎' },
    { id: 'plak-karang', label: 'Plak & Karang', icon: '🦠' },
    { id: 'gigi-berlubang', label: 'Gigi Berlubang', icon: '🛡️' },
    { id: 'quiz-games', label: 'Quiz & Main', icon: '🎮' },
    { id: 'post-test', label: 'Post-Test', icon: '🏆' },
  ];

  const menuCards: {
    id: NavSection;
    title: string;
    subtitle: string;
    icon: string;
    badge: string;
    gradient: string;
    border: string;
    btnClass: string;
  }[] = [
    {
      id: 'kenali-gigi',
      title: 'Kenali Gigi',
      subtitle: 'Pelajari gigi seri, taring, geraham & lapisan pelindung email!',
      icon: '🦷',
      badge: 'Materi Dasar',
      gradient: 'from-sky-50 to-blue-50/70',
      border: 'border-sky-200',
      btnClass: 'btn-3d-cyan text-white',
    },
    {
      id: 'cara-sikat',
      title: 'Cara Menyikat Gigi',
      subtitle: 'Tutorial 7 langkah sikat gigi + Timer interaktif 2 menit!',
      icon: '🪥',
      badge: 'Praktik Seru',
      gradient: 'from-emerald-50 to-teal-50/70',
      border: 'border-emerald-200',
      btnClass: 'btn-3d-emerald text-white',
    },
    {
      id: 'makanan',
      title: 'Makanan & Minuman',
      subtitle: 'Pilah makanan yang menyehatkan gigi vs camilan manis!',
      icon: '🍎',
      badge: 'Interaktif',
      gradient: 'from-amber-50 to-orange-50/70',
      border: 'border-amber-200',
      btnClass: 'btn-3d-amber text-white',
    },
    {
      id: 'plak-karang',
      title: 'Plak & Karang Gigi',
      subtitle: 'Lihat perubahan gigi bersih menjadi plak & karang gigi!',
      icon: '🦠',
      badge: 'Visual 3D',
      gradient: 'from-purple-50 to-pink-50/70',
      border: 'border-purple-200',
      btnClass: 'btn-3d-rose text-white',
    },
    {
      id: 'gigi-berlubang',
      title: 'Gigi Berlubang',
      subtitle: 'Cari tahu kenapa gigi bisa berlubang dan cara mencegahnya!',
      icon: '🛡️',
      badge: 'Pencegahan',
      gradient: 'from-indigo-50 to-sky-50/70',
      border: 'border-indigo-200',
      btnClass: 'btn-3d-cyan text-white',
    },
    {
      id: 'quiz-games',
      title: 'Quiz & Games',
      subtitle: 'Asah pengetahuanmu dan mainkan game Basmi Kuman!',
      icon: '🎮',
      badge: 'Hadiah Bintang',
      gradient: 'from-yellow-50 to-amber-50/70',
      border: 'border-yellow-200',
      btnClass: 'btn-3d-amber text-white',
    },
  ];

  const completedStepsCount = journeySteps.filter((s) =>
    userProgress.visitedSections.includes(s.id)
  ).length;

  const progressPercentage = Math.round(
    (completedStepsCount / journeySteps.length) * 100
  );

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-400 via-sky-300 to-teal-200 p-6 sm:p-10 lg:p-14 text-white shadow-xl shadow-sky-200/60 border-4 border-white">
        {/* Soft Background Cartoon Clouds & Sparkles */}
        <div className="absolute top-4 left-6 w-24 h-12 bg-white/30 rounded-full blur-xs animate-float-slow pointer-events-none" />
        <div className="absolute top-14 right-16 w-36 h-14 bg-white/25 rounded-full blur-xs animate-float-gentle pointer-events-none" />
        <div className="absolute bottom-8 left-1/3 w-28 h-10 bg-white/20 rounded-full blur-xs animate-float-slow pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & CTA */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/30 backdrop-blur-md text-sky-950 font-extrabold text-xs sm:text-sm border border-white/50 shadow-xs">
              <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
              <span>Dunia Edukasi Kesehatan Gigi Anak #1</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight drop-shadow-sm text-sky-950">
              Yuk, Kenali <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                Gigi Sehat! 🦷✨
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-sky-900 font-bold max-w-xl mx-auto lg:mx-0 leading-relaxed drop-shadow-xs">
              Belajar menjaga kesehatan gigi jadi lebih seru dan menyenangkan bersama <strong className="text-white">Kapten Toothie</strong>! Gigimu bersih, senyummu berseri!
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
              <button
                onClick={() => {
                  playSuccess();
                  onNavigate('kenali-gigi');
                }}
                className="btn-3d-amber px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-white font-black text-base sm:text-lg flex items-center gap-2 shadow-lg"
              >
                <span>Mulai Belajar 🚀</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  playPop();
                  onNavigate('quiz-games');
                }}
                className="btn-3d-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-sky-800 font-black text-base sm:text-lg flex items-center gap-2 shadow-lg"
              >
                <span>Main & Belajar 🎮</span>
                <Play className="w-5 h-5 text-sky-600 fill-sky-600" />
              </button>
            </div>

            {/* Quick Microcopy Tagline */}
            <div className="flex items-center justify-center lg:justify-start gap-4 text-xs sm:text-sm font-extrabold text-sky-950/80 pt-2">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" /> Bebas Iklan
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-yellow-300" /> Standar PDGI & Kemenkes
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <HeartHandshake className="w-4 h-4 text-pink-300" /> 100% Ramah Anak
              </span>
            </div>
          </div>

          {/* Right 3D Mascots Hub */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="relative flex items-center justify-center">
              {/* Soft glow circle behind Toothie */}
              <div className="absolute w-64 h-64 sm:w-80 sm:h-80 bg-white/40 rounded-full blur-2xl -z-10 animate-pulse-glow" />

              {/* Central Mascot: Kapten Toothie */}
              <ToothieMascot
                size="hero"
                expression="sparkle"
                hasCape={true}
                speechBubbleText="Halo Sahabat Pintar! Klik aku!"
                className="z-20"
              />

              {/* Companion 1: Sikat Sparkle */}
              <div className="absolute -bottom-4 -left-6 sm:-left-10 z-20">
                <ToothbrushCharacter size="md" hasPaste={true} />
              </div>

              {/* Companion 2: Pasta Minty */}
              <div className="absolute -top-4 -right-4 sm:-right-8 z-10">
                <ToothpasteCharacter size="md" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Learning Journey Progress Tracker */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-100 shadow-lg shadow-sky-100/50">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-sky-600 font-extrabold text-sm uppercase tracking-wider">
              <span>🎯 Petualangan Belajarmu</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              Jejak Langkah Pahlawan Gigi
            </h2>
          </div>

          {/* Progress Percent Pill */}
          <div className="flex items-center gap-3 bg-sky-50 px-4 py-2 rounded-2xl border border-sky-200">
            <div className="w-24 sm:w-32 bg-sky-200 h-3 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-500 to-teal-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="text-sm font-black text-sky-800">
              {progressPercentage}% Selesai
            </span>
          </div>
        </div>

        {/* Horizontal Step Route */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {journeySteps.map((step, idx) => {
            const isCompleted = userProgress.visitedSections.includes(step.id);
            return (
              <button
                key={step.id}
                onClick={() => {
                  playPop();
                  onNavigate(step.id);
                }}
                className={`relative p-3.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1.5 group ${
                  isCompleted
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-800 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-sky-300 hover:bg-sky-50/50'
                }`}
              >
                {/* Step number badge */}
                <span className="absolute -top-2.5 -right-2 w-6 h-6 rounded-full text-xs font-black flex items-center justify-center bg-white border-2 border-sky-300 text-sky-700 shadow-xs">
                  {idx + 1}
                </span>

                <span className="text-2xl sm:text-3xl group-hover:scale-125 transition-transform">
                  {step.icon}
                </span>
                <span className="text-xs font-bold leading-tight line-clamp-1">
                  {step.label}
                </span>

                {isCompleted ? (
                  <span className="text-[10px] font-black text-emerald-600 flex items-center gap-0.5">
                    ✓ Sudah
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-sky-600 group-hover:underline">
                    Ayo Mulai
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3D Menu Cards Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-sky-600 bg-sky-100 px-3 py-1 rounded-full">
            Dunia Pengetahuan Gigi
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight">
            Pilih Materi Belajar Favoritmu!
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-semibold">
            Klik kartu di bawah ini untuk memulai petualangan seru bersama Toothie dan kawan-kawan!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuCards.map((card) => (
            <div
              key={card.id}
              className={`card-3d bg-gradient-to-b ${card.gradient} border-2 ${card.border} p-6 flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl border border-sky-100">
                    {card.icon}
                  </div>
                  <span className="text-xs font-black px-3 py-1 bg-white/80 border border-sky-200 text-sky-800 rounded-full shadow-2xs">
                    {card.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-800">
                    {card.title}
                  </h3>
                  <p className="text-sm font-bold text-slate-600 mt-1 leading-snug">
                    {card.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => {
                    playPop();
                    onNavigate(card.id);
                  }}
                  className={`w-full py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 ${card.btnClass}`}
                >
                  <span>Buka Materi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Post-Test & Certification Banner */}
      <section className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-white">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black">
            <Award className="w-4 h-4 text-yellow-300" />
            <span>Ujian Akhir & Sertifikat</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black">
            Seberapa Jago Kamu Menjaga Gigi?
          </h3>
          <p className="text-sm sm:text-base text-purple-100 font-bold max-w-xl">
            Selesaikan Post-Test 5 soal untuk mendapatkan <span className="underline decoration-yellow-300">Sertifikat Resmi Pahlawan Gigi Sehat Toothie</span> dengan namamu sendiri!
          </p>
        </div>

        <button
          onClick={() => {
            playSuccess();
            onNavigate('post-test');
          }}
          className="btn-3d-amber px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-white font-black text-base whitespace-nowrap shadow-lg flex items-center gap-2"
        >
          <span>Ikuti Post-Test 🏆</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>
    </div>
  );
};
