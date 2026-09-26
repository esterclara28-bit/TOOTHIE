import React from 'react';
import { X, BookOpen, Heart, Users, Target, ShieldCheck } from 'lucide-react';
import { playPop } from '../../utils/soundEffects';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border-4 border-sky-300 relative space-y-6 max-h-[85vh] overflow-y-auto">
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
        <div className="flex items-center gap-3 border-b pb-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-2xl flex-shrink-0">
            📖
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-800">
              Tentang Media & Referensi
            </h3>
            <p className="text-xs sm:text-sm font-bold text-slate-500">
              Toothie • Media Edukasi Kesehatan Gigi dan Mulut Anak
            </p>
          </div>
        </div>

        {/* 1. Tujuan Media */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sky-700 font-black text-sm">
            <Target className="w-4 h-4" />
            <span>Tujuan Media Edukasi</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-600 leading-relaxed bg-sky-50/70 p-3.5 rounded-2xl border border-sky-100">
            Aplikasi <strong>Toothie</strong> dirancang untuk membangun kesadaran sejak dini mengenai pentingnya menjaga kebersihan gigi dan mulut anak usia 6–12 tahun melalui pendekatan visual 3D yang menyenangkan, interaktif, bebas rasa takut, dan berbasis kebiasaan positif (positive reinforcement).
          </p>
        </div>

        {/* 2. Sasaran Pengguna & Manfaat */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
            <div className="flex items-center gap-2 text-emerald-800 font-black text-xs uppercase">
              <Users className="w-4 h-4" />
              <span>Sasaran Pengguna</span>
            </div>
            <ul className="text-xs font-bold text-slate-700 list-disc list-inside space-y-1">
              <li>Anak usia sekolah dasar (6–12 tahun)</li>
              <li>Orang tua sebagai pendamping di rumah</li>
              <li>Guru UKS / Pendidik Sekolah Dasar</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
            <div className="flex items-center gap-2 text-amber-800 font-black text-xs uppercase">
              <Heart className="w-4 h-4" />
              <span>Manfaat Media</span>
            </div>
            <ul className="text-xs font-bold text-slate-700 list-disc list-inside space-y-1">
              <li>Mencegah karies / gigi berlubang sejak dini</li>
              <li>Membiasakan sikat gigi teratur 2x sehari</li>
              <li>Menghilangkan rasa takut ke dokter gigi</li>
            </ul>
          </div>
        </div>

        {/* 3. Daftar Pustaka / Referensi Ilmiah */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-indigo-700 font-black text-sm">
            <BookOpen className="w-4 h-4" />
            <span>Daftar Pustaka & Referensi Materi</span>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-[11px] sm:text-xs font-semibold text-slate-600 space-y-2 leading-relaxed">
            <p>
              1. <strong>Kementerian Kesehatan Republik Indonesia (Kemenkes RI)</strong>. (2021). <em>Buku Panduan Pelatihan Dokter Kecil dan Usaha Kesehatan Gigi Sekolah (UKGS)</em>. Jakarta: Ditjen Kesmas.
            </p>
            <p>
              2. <strong>Persatuan Dokter Gigi Indonesia (PDGI)</strong>. (2022). <em>Pedoman Pemeliharaan Kesehatan Gigi dan Mulut Anak</em>. Jakarta: Pengurus Besar PDGI.
            </p>
            <p>
              3. <strong>World Health Organization (WHO)</strong>. (2020). <em>Ending Childhood Dental Caries: WHO Implementation Manual</em>. Geneva: World Health Organization.
            </p>
            <p>
              4. <strong>American Academy of Pediatric Dentistry (AAPD)</strong>. (2022). <em>Guideline on Periodicity of Examination, Preventive Dental Services, and Anticipatory Guidance for Pediatric Dental Patients</em>. Reference Manual.
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              playPop();
              onClose();
            }}
            className="btn-3d-cyan w-full py-3 rounded-2xl text-white font-black text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
