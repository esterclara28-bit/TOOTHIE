import React from 'react';
import { BADGES_LIST } from '../../data/dentalData';
import { ToothieMascot } from '../mascot/ToothieMascot';
import { X, Award, CheckCircle2, Lock } from 'lucide-react';
import { playPop } from '../../utils/soundEffects';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedBadgeIds: string[];
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  unlockedBadgeIds,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border-4 border-yellow-300 relative space-y-6">
        {/* Close Button */}
        <button
          onClick={() => {
            playPop();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl shadow-inner">
            🏅
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">
              Koleksi Piala & Lencana
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-500">
              Buka semua piala dengan menyelesaikan modul & game!
            </p>
          </div>
        </div>

        {/* Badges List */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {BADGES_LIST.map((badge) => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-2xl border-2 flex items-center gap-4 transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-r from-amber-50 to-yellow-50/50 border-amber-300 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm ${
                    isUnlocked ? 'bg-amber-400 text-white' : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {isUnlocked ? badge.icon : <Lock className="w-5 h-5 text-slate-500" />}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-slate-800">
                      {badge.title}
                    </h4>
                    {isUnlocked && (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Terbuka
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-slate-600 mt-0.5">
                    {badge.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-2 text-center">
          <button
            onClick={() => {
              playPop();
              onClose();
            }}
            className="btn-3d-amber w-full py-3 rounded-2xl text-white font-black text-sm"
          >
            Lanjutkan Petualangan! 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
