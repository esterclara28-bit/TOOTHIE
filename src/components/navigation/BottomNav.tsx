import React from 'react';
import { NavSection } from '../../types';
import { playPop } from '../../utils/soundEffects';

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
  const items: { id: NavSection | 'badges'; label: string; icon: string }[] = [
    { id: 'beranda', label: 'Home', icon: '🏠' },
    { id: 'kenali-gigi', label: 'Gigi', icon: '🦷' },
    { id: 'cara-sikat', label: 'Sikat', icon: '🪥' },
    { id: 'makanan', label: 'Makanan', icon: '🍎' },
    { id: 'quiz-games', label: 'Games', icon: '🎮' },
    { id: 'post-test', label: 'Tes', icon: '🏆' },
    { id: 'badges', label: 'Piala', icon: '🏅' },
  ];

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
              className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition-all min-w-[44px] ${
                isActive
                  ? 'text-sky-600 bg-sky-50 font-extrabold scale-105'
                  : 'text-slate-500 font-semibold hover:text-sky-600'
              }`}
            >
              <span className="text-xl leading-none mb-0.5">{it.icon}</span>
              <span className="text-[10px] leading-tight">{it.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
