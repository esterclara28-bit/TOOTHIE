import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { playPop, playBoing } from '../../utils/soundEffects';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Ya, Lanjutkan',
  cancelLabel = 'Batal',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-4 border-amber-300 relative space-y-4">
        <button
          onClick={() => {
            playPop();
            onCancel();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
              isDestructive ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-900 leading-snug">
              {title}
            </h3>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">
              Konfirmasi Tindakan Keamanan
            </span>
          </div>
        </div>

        <p className="text-sm font-bold text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          {message}
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => {
              playPop();
              onCancel();
            }}
            className="px-4 py-2.5 rounded-xl font-bold text-sm text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              if (isDestructive) playBoing();
              else playPop();
              onConfirm();
            }}
            className={`px-5 py-2.5 rounded-xl font-black text-sm text-white shadow-md transition-all ${
              isDestructive
                ? 'btn-3d-rose'
                : 'btn-3d-amber'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
