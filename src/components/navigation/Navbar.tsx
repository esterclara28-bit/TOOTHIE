import React from 'react';
import { NavSection, UserProgress } from '../../types';
import { ToothieMascot } from '../mascot/ToothieMascot';
import { Volume2, VolumeX, Mic, MicOff, Award, Sparkles, BookOpen, LogIn, LogOut, Shield, Users, Lock, User as UserIcon } from 'lucide-react';
import { playPop, toggleSound, toggleSpeech, isSoundEnabled, isSpeechEnabled } from '../../utils/soundEffects';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  currentSection: NavSection;
  onNavigate: (section: NavSection) => void;
  unlockedBadgeCount: number;
  totalBadgeCount: number;
  onOpenBadgesModal: () => void;
  onOpenAboutModal: () => void;
  completedModules: string[];
}

export const Navbar: React.FC<NavbarProps> = ({
  currentSection,
  onNavigate,
  unlockedBadgeCount,
  totalBadgeCount,
  onOpenBadgesModal,
  onOpenAboutModal,
  completedModules,
}) => {
  const { currentUser, userProfile, role, isSuperAdmin, isAdmin, isKader, isViewer, signInGoogle, signOutAccount } = useAuth();

  const [soundOn, setSoundOn] = React.useState(isSoundEnabled());
  const [speechOn, setSpeechOn] = React.useState(isSpeechEnabled());
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
  };

  const handleToggleSpeech = () => {
    const newState = toggleSpeech();
    setSpeechOn(newState);
  };

  // Gamification prerequisites
  const isQuizLocked = !isAdmin && !completedModules.includes('plak-karang');
  const isPostTestLocked = !isAdmin && (!completedModules.includes('gigi-berlubang') || !completedModules.includes('quiz-games'));

  const navItems: { id: NavSection; label: string; icon: string; locked?: boolean }[] = [
    { id: 'beranda', label: 'Beranda', icon: '🏠' },
    { id: 'pre-test', label: 'Pre-Test', icon: '📝' },
    { id: 'kenali-gigi', label: 'Kenali Gigi', icon: '🦷' },
    { id: 'cara-sikat', label: 'Cara Sikat', icon: '🪥' },
    { id: 'makanan', label: 'Makanan', icon: '🍎' },
    { id: 'plak-karang', label: 'Plak & Karang', icon: '🦠' },
    { id: 'gigi-berlubang', label: 'Gigi Berlubang', icon: '🛡️' },
    { id: 'quiz-games', label: 'Quiz', icon: '🎮', locked: isQuizLocked },
    { id: 'post-test', label: 'Post-Test', icon: '🏆', locked: isPostTestLocked },
    { id: 'rekomendasi', label: 'Saran', icon: '💡' },
  ];

  if (isAdmin || isViewer) {
    navItems.push({ id: 'admin-dashboard', label: 'Admin', icon: '🛡️' });
  }

  if (isAdmin || isKader) {
    navItems.push({ id: 'kader-records', label: 'Kader', icon: '📋' });
  }

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
            className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-none flex-shrink-0"
          >
            <div className="relative">
              <ToothieMascot size="sm" expression="excited" interactive={false} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-sky-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform inline-block">
                  Toothie
                </span>
                <span className="hidden lg:inline-flex items-center px-2 py-0.5 text-[10px] font-bold text-sky-700 bg-sky-100 rounded-full">
                  ✨ Ramah Anak
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-sky-600 font-semibold tracking-wide">
                Let’s Learn, Play & Smile!
              </p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1 bg-sky-50/80 p-1.5 rounded-2xl border border-sky-100/80 overflow-x-auto max-w-2xl">
            {navItems.map((item) => {
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    playPop();
                    onNavigate(item.id);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-sky-700 shadow-md shadow-sky-200/50 scale-105'
                      : 'text-slate-600 hover:text-sky-600 hover:bg-white/60'
                  }`}
                >
                  <span className="text-xs">{item.icon}</span>
                  <span>{item.label}</span>
                  {item.locked && (
                    <Lock className="w-3 h-3 text-amber-500 inline ml-0.5" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Tools: Sound, Speech, Badges, Login/Profile */}
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
              {soundOn ? <Volume2 className="w-4 h-4 text-sky-500" /> : <VolumeX className="w-4 h-4" />}
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
              {speechOn ? <Mic className="w-4 h-4 text-amber-500 animate-pulse" /> : <MicOff className="w-4 h-4" />}
            </button>

            {/* Badges Collection Button */}
            <button
              onClick={() => {
                playPop();
                onOpenBadgesModal();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-white font-extrabold text-xs shadow-md shadow-amber-300/40 hover:scale-105 active:scale-95 transition-all"
            >
              <Award className="w-4 h-4" />
              <span>{unlockedBadgeCount}/{totalBadgeCount}</span>
            </button>

            {/* Google Gmail Sign In or User Profile Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border-2 border-sky-200 hover:border-sky-400 transition-all shadow-xs"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Akun'}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-sky-300 object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-500 text-white font-black flex items-center justify-center text-xs">
                      {currentUser.displayName?.charAt(0) || 'U'}
                    </div>
                  )}

                  <div className="hidden md:flex flex-col text-left pr-1">
                    <span className="text-xs font-black text-slate-800 line-clamp-1 max-w-[100px]">
                      {currentUser.displayName || 'Pengguna'}
                    </span>
                    <span className="text-[10px] font-black uppercase text-sky-600">
                      {role.replace('_', ' ')}
                    </span>
                  </div>
                </button>

                {/* Profile Popup Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border-2 border-sky-100 p-3 space-y-3 z-50 animate-in fade-in">
                    <div className="border-b pb-2">
                      <div className="font-black text-slate-900 text-sm">
                        {currentUser.displayName}
                      </div>
                      <div className="text-xs text-slate-500 truncate">{currentUser.email}</div>
                      <div className="mt-1 inline-block px-2 py-0.5 bg-sky-100 text-sky-800 text-[10px] font-black rounded-md uppercase">
                        Peran: {role.replace('_', ' ')}
                      </div>
                    </div>

                    {(isAdmin || isViewer) && (
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigate('admin-dashboard');
                        }}
                        className="w-full text-left py-2 px-3 text-xs font-bold text-slate-700 hover:bg-sky-50 rounded-xl flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4 text-sky-600" />
                        <span>Buka Dashboard Admin</span>
                      </button>
                    )}

                    {(isAdmin || isKader) && (
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigate('kader-records');
                        }}
                        className="w-full text-left py-2 px-3 text-xs font-bold text-slate-700 hover:bg-emerald-50 rounded-xl flex items-center gap-2"
                      >
                        <Users className="w-4 h-4 text-emerald-600" />
                        <span>Buku Catatan Kader</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onNavigate('rekomendasi');
                      }}
                      className="w-full text-left py-2 px-3 text-xs font-bold text-slate-700 hover:bg-amber-50 rounded-xl flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Rekomendasi Belajar</span>
                    </button>

                    <button
                      onClick={async () => {
                        setProfileDropdownOpen(false);
                        await signOutAccount();
                      }}
                      className="w-full text-left py-2 px-3 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 border-t pt-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={signInGoogle}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border-2 border-sky-300 hover:border-sky-500 text-sky-800 font-black text-xs shadow-xs hover:scale-105 transition-all"
              >
                <LogIn className="w-4 h-4 text-sky-600" />
                <span className="hidden sm:inline">Masuk</span> Gmail
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
