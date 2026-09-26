import React from 'react';
import { NavSection } from '../../types';
import { ToothieMascot } from '../mascot/ToothieMascot';
import { Volume2, VolumeX, Mic, MicOff, Award, Sparkles, BookOpen } from 'lucide-react';
import { playPop, toggleSound, toggleSpeech, isSoundEnabled, isSpeechEnabled } from '../../utils/soundEffects';

interface NavbarProps {
  currentSection: NavSection;
  onNavigate: (section: NavSection) => void;
  unlockedBadgeCount: number;
  totalBadgeCount: number;
  onOpenBadgesModal: () => void;
  onOpenAboutModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onNavigate,
  unlockedBadgeCount,
  totalBadgeCount,
  onOpenBadgesModal,
  onOpenAboutModal,
}) => {
  const [soundOn, setSoundOn] = React.useState(isSoundEnabled());
  const [speechOn, setSpeechOn] = React.useState(isSpeechEnabled());

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const handleToggleSpeech = () => {
    const newState = toggleSpeech();
    setSpeechOn(newState);
  };

  const navItems: { id: NavSection; label: string; icon: string }[] = [
    { id: 'beranda', label: 'Beranda', icon: '🏠' },
    { id: 'kenali-gigi', label: 'Kenali Gigi', icon: '🦷' },
    { id: 'cara-sikat', label: 'Cara Sikat', icon: '🪥' },
    { id: 'makanan', label: 'Makanan & Minuman', icon: '🍎' },
    { id: 'plak-karang', label: 'Plak & Karang', icon: '🦠' },
    { id: 'gigi-berlubang', label: 'Gigi Berlubang', icon: '🛡️' },
    { id: 'quiz-games', label: 'Quiz & Games', icon: '🎮' },
    { id: 'post-test', label: 'Post-Test', icon: '🏆' },
    { id: 'faq', label: 'FAQ', icon: '❓' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-sky-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <button
            onClick={() => {
              playPop();
              onNavigate('beranda');
            }}
            className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none"
          >
            <div className="relative">
              <ToothieMascot size="sm" expression="excited" interactive={false} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform inline-block">
                  Toothie
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 text-[11px] font-bold text-sky-700 bg-sky-100 rounded-full">
                  ✨ Ramah Anak
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-sky-600 font-semibold tracking-wide">
                Let’s Learn, Play & Smile!
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1 bg-sky-50/80 p-1.5 rounded-2xl border border-sky-100/80">
            {navItems.map((item) => {
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    playPop();
                    onNavigate(item.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-white text-sky-700 shadow-md shadow-sky-200/50 scale-105'
                      : 'text-slate-600 hover:text-sky-600 hover:bg-white/60'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Tools: Sound, Speech, Badges, About */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Audio Synth Toggle */}
            <button
              onClick={handleToggleSound}
              title={soundOn ? 'Matikan Suara Efek' : 'Nyalakan Suara Efek'}
              className={`p-2 sm:p-2.5 rounded-xl border text-sm font-bold transition-all flex items-center justify-center ${
                soundOn
                  ? 'bg-sky-50 border-sky-200 text-sky-600 hover:bg-sky-100 shadow-sm'
                  : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
              }`}
            >
              {soundOn ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-sky-500" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* Voice Speech Assistant Toggle */}
            <button
              onClick={handleToggleSpeech}
              title={speechOn ? 'Suara Narator Aktif' : 'Nyalakan Narator Suara'}
              className={`p-2 sm:p-2.5 rounded-xl border text-sm font-bold transition-all flex items-center justify-center ${
                speechOn
                  ? 'bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100 shadow-sm'
                  : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
              }`}
            >
              {speechOn ? <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 animate-pulse" /> : <MicOff className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>

            {/* Badges Collection Button */}
            <button
              onClick={() => {
                playPop();
                onOpenBadgesModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-amber-300/40 hover:scale-105 active:scale-95 transition-all"
            >
              <Award className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span>{unlockedBadgeCount}/{totalBadgeCount}</span>
              <span className="hidden sm:inline">Piala</span>
            </button>

            {/* Info & References Modal Button */}
            <button
              onClick={() => {
                playPop();
                onOpenAboutModal();
              }}
              title="Tentang Media & Sumber Referensi"
              className="hidden lg:flex items-center gap-1 px-2.5 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 hover:bg-teal-100 text-xs font-bold transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>Tentang</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
