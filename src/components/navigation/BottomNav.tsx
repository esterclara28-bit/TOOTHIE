import React from 'react';
import { NavSection } from '../../types';
import { playPop } from '../../utils/soundEffects';
import { useAuth } from '../../context/AuthContext';

interface BottomNavProps {
  currentSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onOpenBadgesModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentSection,
  onNavigate,
  onOpenBadgesModal,
}) => {
  const { isAdmin, isKader, isViewer } = useAuth();

  const items: { id: NavSection | 'badges'; label: string; icon: string }[] = [
    { id: 'beranda', label: 'Home', icon: '🏠' },
    { id: 'pre-test', label: 'Pre-Test', icon: '📝' },
    { id: 'kenali-gigi', label: 'Materi', icon: '🦷' },
    { id: 'quiz-games', label: 'Kuis', icon: '🎮' },
    { id: 'post-test', label: 'Post-Test', icon: '🏆' },
    { id: 'rekomendasi', label: 'Saran', icon: '💡' },
  ];

  if (isAdmin || isViewer) {
    items.push({ id: 'admin-dashboard', label: 'Admin', icon: '🛡️' });
  } else if (isKader) {
    items.push({ id: 'kader-records', label: 'Kader', icon: '📋' });
  } else {
    items.push({ id: 'badges', label: 'Piala', icon: '🏅' });
  }

  return (
    <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t-2 border-sky-100 px-2 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {items.map((it) => {
          const isActive = it.id === currentSection;
          return (
            <button
              key={it.id}
              onClick={() => {
                playPop();
                if (it.id === 'badges') {
                  onOpenBadgesModal();
                } else {
                  onNavigate(it.id);
                }
              }}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all min-w-[40px] ${
                isActive
                  ? 'text-sky-600 bg-sky-50 font-extrabold scale-105'
                  : 'text-slate-500 font-semibold hover:text-sky-600'
              }`}
            >
              <span className="text-lg leading-none mb-0.5">{it.icon}</span>
              <span className="text-[9px] leading-tight font-black">{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
