import React from 'react';
import { NavSection, UserProgress } from '../../types';
import { ToothieMascot } from '../mascot/ToothieMascot';
import { ToothbrushCharacter } from '../mascot/ToothbrushCharacter';
import { ToothpasteCharacter } from '../mascot/ToothpasteCharacter';
import { Sparkles, ArrowRight, Play, Award, CheckCircle2, ShieldCheck, HeartHandshake, Lock, BrainCircuit, BarChart3, Users } from 'lucide-react';
import { playPop, playSuccess, playBoing, speakText } from '../../utils/soundEffects';
import { useAuth } from '../../context/AuthContext';

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
  const { currentUser, role, isSuperAdmin, isAdmin, isKader, isViewer } = useAuth();
  const completed = userProgress.visitedSections || [];

  // Helper to check if a step is unlocked in the sequential learning pathway
  const isUnlocked = (stepId: NavSection): boolean => {
    if (isAdmin) return true; // Admins have full access
    switch (stepId) {
      case 'pre-test':
        return true;
      case 'kenali-gigi':
        return userProgress.preTestCompleted || completed.includes('pre-test');
      case 'cara-sikat':
        return completed.includes('kenali-gigi');
      case 'makanan':
        return completed.includes('cara-sikat');
      case 'plak-karang':
        return completed.includes('makanan');
      case 'gigi-berlubang':
        return completed.includes('plak-karang');
      case 'quiz-games':
        // Gamification Requirement 3: Locked until fundamental materials are read!
        return completed.includes('plak-karang');
      case 'post-test':
        return completed.includes('gigi-berlubang') && completed.includes('quiz-games');
      case 'rekomendasi':
        return true;
      default:
        return true;
    }
  };

  const handleStepClick = (stepId: NavSection, label: string) => {
    if (isUnlocked(stepId)) {
      playPop();
      onNavigate(stepId);
    } else {
      playBoing();
      speakText(`Materi ${label} masih terkunci! Selesaikan materi sebelumnya terlebih dahulu ya.`);
    }
  };

  const journeySteps: { id: NavSection; label: string; icon: string; prereqText?: string }[] = [
    { id: 'pre-test', label: '1. Pre-Test', icon: '📝' },
    { id: 'kenali-gigi', label: '2. Kenali Gigi', icon: '🦷', prereqText: 'Selesaikan Pre-Test' },
    { id: 'cara-sikat', label: '3. Cara Sikat', icon: '🪥', prereqText: 'Baca Kenali Gigi' },
    { id: 'makanan', label: '4. Makanan', icon: '🍎', prereqText: 'Baca Cara Sikat' },
    { id: 'plak-karang', label: '5. Plak & Karang', icon: '🦠', prereqText: 'Baca Makanan' },
    { id: 'gigi-berlubang', label: '6. Gigi Berlubang', icon: '🛡️', prereqText: 'Baca Plak' },
    { id: 'quiz-games', label: '7. Quiz Seru', icon: '🎮', prereqText: 'Selesaikan Plak' },
    { id: 'post-test', label: '8. Post-Test', icon: '🏆', prereqText: 'Selesaikan Kuis' },
    { id: 'rekomendasi', label: '9. Saran Belajar', icon: '💡' },
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
      id: 'pre-test',
      title: 'Tes Awal (Pre-Test)',
      subtitle: 'Cek pemahaman awalmu sebelum mulai mempelajari modul materi!',
      icon: '📝',
      badge: 'Langkah Awal',
      gradient: 'from-sky-50 to-cyan-50/70',
      border: 'border-sky-200',
      btnClass: 'btn-3d-cyan text-white',
    },
    {
      id: 'kenali-gigi',
      title: 'Kenali Gigi',
      subtitle: 'Pelajari gigi seri, taring, geraham & lapisan pelindung email!',
      icon: '🦷',
      badge: 'Materi 1',
      gradient: 'from-sky-50 to-blue-50/70',
      border: 'border-sky-200',
      btnClass: 'btn-3d-cyan text-white',
    },
    {
      id: 'cara-sikat',
      title: 'Cara Menyikat Gigi',
      subtitle: 'Tutorial 7 langkah sikat gigi + Timer interaktif 2 menit!',
      icon: '🪥',
      badge: 'Materi 2',
      gradient: 'from-emerald-50 to-teal-50/70',
      border: 'border-emerald-200',
      btnClass: 'btn-3d-emerald text-white',
    },
    {
      id: 'makanan',
      title: 'Makanan & Minuman',
      subtitle: 'Pilah makanan yang menyehatkan gigi vs camilan manis!',
      icon: '🍎',
      badge: 'Materi 3',
      gradient: 'from-amber-50 to-orange-50/70',
      border: 'border-amber-200',
      btnClass: 'btn-3d-amber text-white',
    },
    {
      id: 'plak-karang',
      title: 'Plak & Karang Gigi',
      subtitle: 'Lihat perubahan gigi bersih menjadi plak & karang gigi!',
      icon: '🦠',
      badge: 'Materi 4',
      gradient: 'from-purple-50 to-pink-50/70',
      border: 'border-purple-200',
      btnClass: 'btn-3d-rose text-white',
    },
    {
      id: 'gigi-berlubang',
      title: 'Gigi Berlubang (Karies)',
      subtitle: 'Cari tahu kenapa gigi bisa berlubang dan cara mencegahnya!',
      icon: '🛡️',
      badge: 'Materi 5',
      gradient: 'from-indigo-50 to-sky-50/70',
      border: 'border-indigo-200',
      btnClass: 'btn-3d-cyan text-white',
    },
    {
      id: 'quiz-games',
      title: 'Quiz & Games',
      subtitle: 'Asah pengetahuanmu dan mainkan game Basmi Kuman! (Terkunci sebelum baca materi)',
      icon: '🎮',
      badge: 'Uji Kemampuan',
      gradient: 'from-yellow-50 to-amber-50/70',
      border: 'border-yellow-200',
      btnClass: 'btn-3d-amber text-white',
    },
  ];

  const completedStepsCount = journeySteps.filter((s) => completed.includes(s.id)).length;
  const progressPercentage = Math.round((completedStepsCount / journeySteps.length) * 100);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-400 via-sky-300 to-teal-200 p-6 sm:p-10 lg:p-14 text-white shadow-xl shadow-sky-200/60 border-4 border-white">
        <div className="absolute top-4 left-6 w-24 h-12 bg-white/30 rounded-full blur-xs animate-float-slow pointer-events-none" />
        <div className="absolute top-14 right-16 w-36 h-14 bg-white/25 rounded-full blur-xs animate-float-gentle pointer-events-none" />
        <div className="absolute bottom-8 left-1/3 w-28 h-10 bg-white/20 rounded-full blur-xs animate-float-slow pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Text & CTA */}
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/30 backdrop-blur-md text-sky-950 font-extrabold text-xs sm:text-sm border border-white/50 shadow-xs">
              <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" />
              <span>Media Edukasi Gigi Anak & Manajemen Masyarakat</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight drop-shadow-sm text-sky-950">
              Yuk, Kenali <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                Gigi Sehat! 🦷✨
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-sky-900 font-bold max-w-xl mx-auto lg:mx-0 leading-relaxed drop-shadow-xs">
              Belajar tahap demi tahap menjaga kesehatan gigi bersama <strong className="text-white">Kapten Toothie</strong>! Skor dan riwayat belajarmu tersimpan otomatis.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-2">
              <button
                onClick={() => {
                  playSuccess();
                  onNavigate(userProgress.preTestCompleted ? 'kenali-gigi' : 'pre-test');
                }}
                className="btn-3d-amber px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-white font-black text-base sm:text-lg flex items-center gap-2 shadow-lg"
              >
                <span>{userProgress.preTestCompleted ? 'Lanjut Belajar 🚀' : 'Mulai Pre-Test 📝'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  if (isUnlocked('quiz-games')) {
                    playPop();
                    onNavigate('quiz-games');
                  } else {
                    playBoing();
                    speakText('Kuis dikunci! Selesaikan materi Kenali Gigi, Sikat Gigi, dan Plak terlebih dahulu.');
                  }
                }}
                className="btn-3d-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-sky-800 font-black text-base sm:text-lg flex items-center gap-2 shadow-lg"
              >
                <span>Main Kuis 🎮</span>
                {!isUnlocked('quiz-games') && <Lock className="w-4 h-4 text-amber-500" />}
              </button>
            </div>

            {/* Role indicator or shortcut */}
            {(isAdmin || isKader || isViewer) && (
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-black">
                {isAdmin && (
                  <button
                    onClick={() => onNavigate('admin-dashboard')}
                    className="px-3 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Buka Dashboard Super Admin</span>
                  </button>
                )}
                {(isAdmin || isKader) && (
                  <button
                    onClick={() => onNavigate('kader-records')}
                    className="px-3 py-1.5 bg-emerald-700/80 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-1.5 shadow-sm"
                  >
                    <Users className="w-4 h-4 text-emerald-300" />
                    <span>Buku Catatan Kader Posyandu</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Right 3D Mascots Hub */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-64 h-64 sm:w-80 sm:h-80 bg-white/40 rounded-full blur-2xl -z-10 animate-pulse-glow" />

              <ToothieMascot
                size="hero"
                expression="sparkle"
                hasCape={true}
                speechBubbleText="Halo Sahabat Pintar! Klik aku!"
                className="z-20"
              />

              <div className="absolute -bottom-4 -left-6 sm:-left-10 z-20">
                <ToothbrushCharacter size="md" hasPaste={true} />
              </div>

              <div className="absolute -top-4 -right-4 sm:-right-8 z-10">
                <ToothpasteCharacter size="md" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sequential Learning Pathway (Sistem Pembelajaran Bertahap) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-100 shadow-lg shadow-sky-100/50 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-600 font-extrabold text-sm uppercase tracking-wider">
              <span>🎯 Jalur Pembelajaran Bertahap</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">
              Selesaikan Langkah Demi Langkah
            </h2>
          </div>

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

        {/* 9 Steps Route with Lock States */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
          {journeySteps.map((step, idx) => {
            const unlocked = isUnlocked(step.id);
            const isCompleted = completed.includes(step.id);

            return (
              <button
                key={step.id}
                onClick={() => handleStepClick(step.id, step.label)}
                className={`relative p-3 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-between min-h-[110px] group ${
                  isCompleted
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-800 shadow-sm'
                    : unlocked
                    ? 'bg-sky-50/40 border-sky-200 text-slate-700 hover:border-sky-400 hover:bg-sky-50'
                    : 'bg-slate-100/80 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                }`}
              >
                {/* Step badge */}
                <span className="absolute -top-2.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center bg-white border border-sky-300 text-sky-800 shadow-2xs">
                  {idx + 1}
                </span>

                <div className="text-2xl group-hover:scale-110 transition-transform mt-1">
                  {step.icon}
                </div>

                <div className="text-[11px] font-black leading-tight line-clamp-1 w-full text-center">
                  {step.label}
                </div>

                <div className="mt-1">
                  {isCompleted ? (
                    <span className="text-[9px] font-black text-emerald-600 flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Selesai
                    </span>
                  ) : unlocked ? (
                    <span className="text-[9px] font-bold text-sky-600 group-hover:underline">
                      Mulai
                    </span>
                  ) : (
                    <span className="text-[9px] font-bold text-slate-400 flex items-center gap-0.5">
                      <Lock className="w-2.5 h-2.5" /> Terkunci
                    </span>
                  )}
                </div>
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
            Pilih Modul Belajar
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-semibold">
            Pelajari setiap materi secara berurutan agar pemahamanmu utuh dan siap menghadapi kuis!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuCards.map((card) => {
            const unlocked = isUnlocked(card.id);
            const isFinished = completed.includes(card.id);

            return (
              <div
                key={card.id}
                className={`card-3d bg-gradient-to-b ${card.gradient} border-2 ${card.border} p-6 flex flex-col justify-between ${
                  !unlocked ? 'opacity-75' : ''
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-3xl border border-sky-100">
                      {card.icon}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {isFinished && (
                        <span className="text-xs font-black px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Selesai
                        </span>
                      )}
                      {!unlocked && (
                        <span className="text-xs font-black px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Terkunci
                        </span>
                      )}
                      <span className="text-xs font-black px-2.5 py-0.5 bg-white/80 border border-sky-200 text-sky-800 rounded-full shadow-2xs">
                        {card.badge}
                      </span>
                    </div>
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
                    onClick={() => handleStepClick(card.id, card.title)}
                    className={`w-full py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 ${
                      unlocked ? card.btnClass : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span>{unlocked ? 'Buka Modul' : 'Selesaikan Materi Sebelumnya'}</span>
                    {unlocked ? <ArrowRight className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            );
          })}
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
            Selesaikan Post-Test untuk mengukur peningkatan pemahamanmu (N-Gain) dan raih <span className="underline decoration-yellow-300">Sertifikat Resmi Pahlawan Gigi</span>!
          </p>
        </div>

        <button
          onClick={() => {
            if (isUnlocked('post-test')) {
              playSuccess();
              onNavigate('post-test');
            } else {
              playBoing();
              speakText('Post-Test terkunci! Selesaikan semua materi dan kuis terlebih dahulu.');
            }
          }}
          className="btn-3d-amber px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-white font-black text-base whitespace-nowrap shadow-lg flex items-center gap-2"
        >
          <span>{isUnlocked('post-test') ? 'Ikuti Post-Test 🏆' : 'Terkunci 🔒'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>
    </div>
  );
};
