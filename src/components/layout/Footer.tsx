import React from 'react';
import { NavSection } from '../../types';
import { ToothieMascot } from '../mascot/ToothieMascot';
import { Heart, Sparkles, BookOpen } from 'lucide-react';
import { playPop } from '../../utils/soundEffects';

interface FooterProps {
  onNavigate: (section: NavSection) => void;
  onOpenAboutModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAboutModal }) => {
  return (
    <footer className="bg-white border-t-2 border-sky-100 pt-12 pb-24 xl:pb-12 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            <ToothieMascot size="sm" expression="sparkle" interactive={false} />
            <div>
              <h4 className="text-xl font-black bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent">
                Toothie
              </h4>
              <p className="text-xs font-bold text-sky-700">
                “Let’s Learn, Play & Smile!”
              </p>
            </div>
          </div>

          {/* Inspirational Tagline */}
          <div className="text-center">
            <span className="text-lg sm:text-xl font-black text-slate-800 flex items-center justify-center gap-1.5">
              <span>Yuk, rawat gigimu setiap hari!</span> 🦷✨
            </span>
            <p className="text-xs font-bold text-slate-500 mt-0.5">
              Senyum sehat anak Indonesia, masa depan cerah dunia!
            </p>
          </div>

          {/* About / References Button */}
          <div>
            <button
              onClick={() => {
                playPop();
                onOpenAboutModal();
              }}
              className="px-4 py-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span>Tentang Media & Daftar Pustaka</span>
            </button>
          </div>
        </div>

        {/* Quick Nav Links */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-black border-t border-slate-100 pt-6">
          <button
            onClick={() => {
              playPop();
              onNavigate('beranda');
            }}
            className="hover:text-sky-600 transition-colors"
          >
            🏠 Beranda
          </button>
          <button
            onClick={() => {
              playPop();
              onNavigate('kenali-gigi');
            }}
            className="hover:text-sky-600 transition-colors"
          >
            🦷 Kenali Gigi
          </button>
          <button
            onClick={() => {
              playPop();
              onNavigate('cara-sikat');
            }}
            className="hover:text-sky-600 transition-colors"
          >
            🪥 Cara Menyikat
          </button>
          <button
            onClick={() => {
              playPop();
              onNavigate('makanan');
            }}
            className="hover:text-sky-600 transition-colors"
          >
            🍎 Makanan Sehat
          </button>
          <button
            onClick={() => {
              playPop();
              onNavigate('plak-karang');
            }}
            className="hover:text-sky-600 transition-colors"
          >
            🦠 Plak & Karang
          </button>
          <button
            onClick={() => {
              playPop();
              onNavigate('quiz-games');
            }}
            className="hover:text-sky-600 transition-colors"
          >
            🎮 Games & Kuis
          </button>
          <button
            onClick={() => {
              playPop();
              onNavigate('faq');
            }}
            className="hover:text-sky-600 transition-colors"
          >
            ❓ FAQ
          </button>
        </div>

        <div className="text-center text-[11px] font-semibold text-slate-400">
          © {new Date().getFullYear()} Toothie Media Edukasi Kesehatan Gigi & Mulut Anak • Didesain dengan penuh kasih sayang ❤️
        </div>
      </div>
    </footer>
  );
};
