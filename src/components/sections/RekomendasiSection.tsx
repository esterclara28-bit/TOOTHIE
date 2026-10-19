import React from 'react';
import { NavSection, UserProfile, LearningRecommendation } from '../../types';
import { ToothieMascot } from '../mascot/ToothieMascot';
import { Sparkles, ArrowRight, BookOpen, AlertCircle, CheckCircle2, UserCheck, HeartHandshake, ShieldCheck } from 'lucide-react';
import { playPop, playSuccess } from '../../utils/soundEffects';

interface RekomendasiSectionProps {
  userProfile: UserProfile | null;
  onNavigate: (section: NavSection) => void;
}

export const RekomendasiSection: React.FC<RekomendasiSectionProps> = ({
  userProfile,
  onNavigate,
}) => {
  const preScore = userProfile?.preTestScore ?? 0;
  const postScore = userProfile?.postTestScore ?? 0;
  const hasPostTest = userProfile?.postTestCompleted;
  const completedModules = userProfile?.completedModules ?? [];

  // Generate dynamic, personalized recommendations based on results
  const recommendations: LearningRecommendation[] = [];

  if (!hasPostTest) {
    recommendations.push({
      id: 'rec-post-test',
      title: 'Selesaikan Post-Test',
      category: 'perlu_pengulangan',
      message: 'Kamu belum menyelesaikan Post-Test akhir untuk melihat seberapa besar peningkatan ilmumu.',
      actionLabel: 'Ikuti Post-Test',
      targetSection: 'post-test',
      urgency: 'tinggi',
      suggestedAction: 'Buka menu Post-Test dan jawab 5 soal singkat untuk mencetak Sertifikat Pahlawan Gigi.',
    });
  } else if (postScore < 70) {
    recommendations.push({
      id: 'rec-low-score',
      title: 'Pendampingan Kader Posyandu & Edukasi Ulang',
      category: 'pendampingan_kader',
      message: `Nilai Post-Test saat ini (${postScore}/100) menunjukkan beberapa konsep pencegahan karies perlu dipelajari kembali dengan bimbingan.`,
      actionLabel: 'Hubungi Kader Pendamping',
      targetSection: 'kader-records',
      urgency: 'tinggi',
      suggestedAction: 'Disarankan berdiskusi dengan Kader Posyandu / Guru UKS untuk pendampingan praktik sikat gigi langsung.',
    });

    recommendations.push({
      id: 'rec-brush-repeat',
      title: 'Ulangi Praktik Sikat Gigi 2 Menit',
      category: 'perlu_pengulangan',
      message: 'Perkuat kebiasaan teknik sikat gigi memutar dan membersihkan permukaan kunyah.',
      actionLabel: 'Buka Simulator Sikat',
      targetSection: 'cara-sikat',
      urgency: 'sedang',
      suggestedAction: 'Jalankan timer interaktif 2 menit pagi dan malam.',
    });
  } else if (postScore >= 70 && postScore < 90) {
    recommendations.push({
      id: 'rec-medium-score',
      title: 'Mantapkan Materi Plak & Karang Gigi',
      category: 'pengayaan',
      message: `Pemahamanmu sudah sangat baik (${postScore}/100)! Pertajam pemahaman tentang bagaimana plak mengeras menjadi karang gigi.`,
      actionLabel: 'Pelajari Plak & Karang',
      targetSection: 'plak-karang',
      urgency: 'sedang',
      suggestedAction: 'Tinjau kembali alur 4 tahap pembentukan karang gigi dan cara menghilangkannya.',
    });
  } else {
    recommendations.push({
      id: 'rec-high-score',
      title: 'Duta Sahabat Gigi Cilik!',
      category: 'kebiasaan_sehat',
      message: `Skor luar biasa (${postScore}/100)! Kamu telah menguasai seluruh materi dan siap menjadi teladan bagi teman-teman dan keluarga.`,
      actionLabel: 'Cetak Sertifikat Duta',
      targetSection: 'post-test',
      urgency: 'rendah',
      suggestedAction: 'Ajak minimal 3 teman atau anggota keluargamu untuk sikat gigi bersama sebelum tidur malam.',
    });
  }

  // Check individual modules
  if (!completedModules.includes('cara-sikat')) {
    recommendations.push({
      id: 'rec-step-sikat',
      title: 'Materi Wajib: 7 Langkah Sikat Gigi',
      category: 'perlu_pengulangan',
      message: 'Kamu belum menyelesaikan modul tutorial 7 langkah sikat gigi yang benar.',
      actionLabel: 'Buka Modul Sikat',
      targetSection: 'cara-sikat',
      urgency: 'tinggi',
      suggestedAction: 'Pelajari sudut 45 derajat dan gerakan melingkar lembut.',
    });
  }

  if (!completedModules.includes('makanan')) {
    recommendations.push({
      id: 'rec-step-makanan',
      title: 'Materi Nutrisi: Makanan Ramah Gigi',
      category: 'pengayaan',
      message: 'Ketahui camilan apa saja yang mengandung asam perusak email gigi.',
      actionLabel: 'Pilah Makanan',
      targetSection: 'makanan',
      urgency: 'sedang',
      suggestedAction: 'Bermain game pemilah buah berserat vs permen lengket.',
    });
  }

  // Knowledge increase metric (N-Gain)
  const knowledgeGain = hasPostTest && preScore < 100
    ? Math.max(0, Math.round(((postScore - preScore) / (100 - preScore)) * 100))
    : null;

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-500 via-sky-500 to-indigo-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-white">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Rekomendasi Belajar Cerdas</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Rekomendasi Personalisasi 💡
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-sky-100 font-bold max-w-xl">
            Saran langkah belajar yang dirancang khusus berdasarkan hasil evaluasi dan aktivitas belajarmu!
          </p>
        </div>

        <div className="flex-shrink-0">
          <ToothieMascot
            size="lg"
            expression={postScore >= 80 ? 'sparkle' : 'thinking'}
            speechBubbleText="Ayo tingkatkan ilmumu!"
          />
        </div>
      </div>

      {/* Score Summary & N-Gain Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border-2 border-sky-100 shadow-md text-center space-y-2">
          <span className="text-xs font-black text-sky-600 uppercase tracking-wide">
            Skor Pre-Test Awal
          </span>
          <div className="text-4xl font-black text-slate-800">
            {preScore} <span className="text-sm text-slate-400 font-bold">/ 100</span>
          </div>
          <p className="text-xs font-bold text-slate-500">
            Pengetahuan sebelum materi
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border-2 border-emerald-100 shadow-md text-center space-y-2">
          <span className="text-xs font-black text-emerald-600 uppercase tracking-wide">
            Skor Post-Test Akhir
          </span>
          <div className="text-4xl font-black text-emerald-700">
            {hasPostTest ? postScore : '-'}{' '}
            <span className="text-sm text-slate-400 font-bold">/ 100</span>
          </div>
          <p className="text-xs font-bold text-slate-500">
            {hasPostTest ? 'Telah menyelesaikan evaluasi' : 'Belum mengikuti post-test'}
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border-2 border-purple-100 shadow-md text-center space-y-2">
          <span className="text-xs font-black text-purple-600 uppercase tracking-wide">
            Peningkatan (N-Gain)
          </span>
          <div className="text-4xl font-black text-purple-700">
            {knowledgeGain !== null ? `+${knowledgeGain}%` : '-'}
          </div>
          <p className="text-xs font-bold text-slate-500">
            {knowledgeGain !== null && knowledgeGain >= 50
              ? 'Peningkatan Tinggi 🎉'
              : knowledgeGain !== null
              ? 'Peningkatan Cukup 👍'
              : 'Perlu selesaikan kedua tes'}
          </p>
        </div>
      </div>

      {/* Recommendations Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-800">
            Daftar Rekomendasi Untukmu
          </h2>
          <span className="text-xs font-bold text-slate-500">
            {recommendations.length} Saran Aktif
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec) => {
            const isHighUrgency = rec.urgency === 'tinggi';
            return (
              <div
                key={rec.id}
                className={`card-3d p-6 border-2 flex flex-col justify-between ${
                  isHighUrgency
                    ? 'border-amber-300 bg-amber-50/40'
                    : 'border-sky-200 bg-white'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                        isHighUrgency
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-sky-100 text-sky-800 border border-sky-300'
                      }`}
                    >
                      {isHighUrgency ? '⚠️ Prioritas Tinggi' : '✨ Rekomendasi'}
                    </span>
                    <span className="text-xs font-black text-slate-500">
                      {rec.category === 'pendampingan_kader'
                        ? 'Dampingan Kader'
                        : rec.category === 'perlu_pengulangan'
                        ? 'Pengulangan'
                        : 'Pengayaan'}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900">
                    {rec.title}
                  </h3>

                  <p className="text-sm font-bold text-slate-700 leading-relaxed">
                    {rec.message}
                  </p>

                  <div className="p-3 bg-white rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{rec.suggestedAction}</span>
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => {
                      playSuccess();
                      onNavigate(rec.targetSection);
                    }}
                    className="w-full btn-3d-cyan py-3 px-4 rounded-xl font-black text-sm text-white flex items-center justify-center gap-2"
                  >
                    <span>{rec.actionLabel}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
