import React, { useState } from 'react';
import { POST_TEST_QUESTIONS } from '../../data/dentalData';
import { QuizQuestion } from '../../types';
import { ToothieMascot } from '../mascot/ToothieMascot';
import { Award, CheckCircle2, Star, Sparkles, Printer, ArrowRight, RotateCcw, Heart } from 'lucide-react';
import { playPop, playSuccess, playFanfare, speakText } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';

interface PostTestProps {
  onUnlockBadge?: (badgeId: string) => void;
  childName: string;
  onUpdateChildName: (name: string) => void;
}

export const PostTestSection: React.FC<PostTestProps> = ({
  onUnlockBadge,
  childName,
  onUpdateChildName,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [tempName, setTempName] = useState(childName || 'Pahlawan Cilik');

  const question: QuizQuestion = POST_TEST_QUESTIONS[currentIdx];

  const handleSelectAnswer = (optIdx: number) => {
    playPop();
    const newAnswers = [...answers];
    newAnswers[currentIdx] = optIdx;
    setAnswers(newAnswers);

    if (currentIdx < POST_TEST_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Finished all post test questions
      setIsCompleted(true);
      playFanfare();
      confetti({
        particleCount: 130,
        spread: 100,
        origin: { y: 0.6 },
      });
      if (onUnlockBadge) {
        onUnlockBadge('sahabat-toothie');
        onUnlockBadge('ahli-gigi-sehat');
      }
      speakText('Hebat! Kamu sudah belajar banyak tentang kesehatan gigi!');
    }
  };

  const calculateScore = () => {
    let correct = 0;
    POST_TEST_QUESTIONS.forEach((q, idx) => {
      const selected = answers[idx];
      if (selected !== undefined && q.options[selected]?.isCorrect) {
        correct++;
      }
    });
    return Math.round((correct / POST_TEST_QUESTIONS.length) * 100);
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    playPop();
    onUpdateChildName(tempName);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-white">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black">
            <Award className="w-4 h-4 text-yellow-300" />
            <span>Tahap Evaluasi Akhir</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Post-Test Kesehatan Gigi 🏆
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-purple-100 font-bold max-w-xl">
            Seberapa jago kamu menjaga kesehatan gigi? Jawab 5 pertanyaan santai dan dapatkan Sertifikat Resmi Pahlawan Gigi!
          </p>
        </div>

        <div className="flex-shrink-0">
          <ToothieMascot
            size="lg"
            expression={isCompleted ? 'sparkle' : 'thinking'}
            speechBubbleText={isCompleted ? 'Selamat ya!' : 'Kamu pasti bisa!'}
          />
        </div>
      </div>

      {!isCompleted ? (
        /* Test Taking Mode */
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border-2 border-sky-100 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <span className="text-xs font-black px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
              Pertanyaan {currentIdx + 1} dari {POST_TEST_QUESTIONS.length}
            </span>

            {/* Step progress bar */}
            <div className="flex gap-1.5">
              {POST_TEST_QUESTIONS.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-6 h-2 rounded-full transition-all ${
                    idx === currentIdx
                      ? 'bg-purple-600 scale-110'
                      : idx < currentIdx
                      ? 'bg-emerald-400'
                      : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-800 leading-snug">
            {question.question}
          </h2>

          <div className="space-y-3 pt-2">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectAnswer(idx)}
                className="w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 text-slate-800 text-left font-bold text-sm sm:text-base transition-all flex items-center gap-3 group"
              >
                <span className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-purple-600 group-hover:text-white border flex items-center justify-center font-black text-xs text-slate-700 transition-colors">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="group-hover:text-purple-950">{opt.text}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Certificate & Reward View */
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Result Greeting */}
          <div className="bg-emerald-50 rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 text-center space-y-3 shadow-md">
            <div className="text-5xl animate-bounce">🎉🦷✨</div>
            <h2 className="text-2xl sm:text-3xl font-black text-emerald-950">
              Hebat! Kamu Sudah Belajar Banyak Tentang Kesehatan Gigi!
            </h2>
            <p className="text-sm sm:text-base font-bold text-emerald-800 max-w-xl mx-auto">
              Skor pemahamanmu: <strong>{calculateScore()} / 100</strong>. Kamu telah resmi menjadi <span className="underline">Sahabat Terbaik Kapten Toothie</span>!
            </p>

            {/* Name Input for certificate personalization */}
            <form onSubmit={handleSaveName} className="flex flex-wrap items-center justify-center gap-2 pt-2 max-w-md mx-auto">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Ketik namamu di sini..."
                className="px-4 py-2.5 rounded-xl border-2 border-emerald-300 font-bold text-sm text-slate-800 bg-white focus:outline-none focus:border-emerald-500 flex-1"
              />
              <button
                type="submit"
                className="btn-3d-emerald px-4 py-2.5 rounded-xl text-white font-black text-xs"
              >
                Perbarui Nama
              </button>
            </form>
          </div>

          {/* Printable Official Certificate */}
          <div
            id="certificate-print"
            className="bg-gradient-to-b from-white via-sky-50/50 to-white rounded-3xl p-8 sm:p-14 border-8 border-double border-yellow-400 shadow-2xl relative overflow-hidden text-center space-y-6"
          >
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-4 left-4 text-3xl opacity-40">⭐</div>
            <div className="absolute top-4 right-4 text-3xl opacity-40">⭐</div>
            <div className="absolute bottom-4 left-4 text-3xl opacity-40">🦷</div>
            <div className="absolute bottom-4 right-4 text-3xl opacity-40">🪥</div>

            {/* Certificate Header */}
            <div className="space-y-1">
              <span className="text-xs font-black tracking-widest text-sky-600 uppercase">
                Sertifikat Penghargaan Edukasi
              </span>
              <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                PAHLAWAN GIGI SEHAT TOOTHIE
              </h3>
              <p className="text-xs sm:text-sm font-bold text-slate-500">
                Diberikan dengan bangga kepada sahabat pahlawan cilik:
              </p>
            </div>

            {/* Recipient Name */}
            <div className="py-2 border-b-2 border-dashed border-sky-300 max-w-md mx-auto">
              <h2 className="text-3xl sm:text-4xl font-black text-sky-700 font-serif italic">
                {tempName}
              </h2>
            </div>

            {/* Citation */}
            <p className="text-xs sm:text-sm font-bold text-slate-600 max-w-xl mx-auto leading-relaxed">
              Telah berhasil menyelesaikan seluruh modul pembelajaran, praktik menyikat gigi 2 menit, serta memahami cara merawat senyum bersih, kuat, dan bebas kuman karies!
            </p>

            {/* Signatures & Seal */}
            <div className="flex items-center justify-around pt-6 border-t border-sky-100">
              <div className="text-center">
                <ToothieMascot size="sm" expression="proud" interactive={false} />
                <span className="text-xs font-black text-slate-800 block mt-1">
                  Kapten Toothie
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  Maskot Edukasi Gigi
                </span>
              </div>

              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-300 border-4 border-white shadow-lg flex items-center justify-center text-2xl sm:text-3xl">
                🏅
              </div>

              <div className="text-center">
                <span className="text-xs font-black text-slate-800 block mt-8">
                  Kemenkes & PDGI
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  Pedoman Kesehatan Gigi Anak
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handlePrintCertificate}
              className="btn-3d-cyan text-white font-black px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg"
            >
              <Printer className="w-5 h-5" />
              <span>Cetak / Simpan Sertifikat (PDF)</span>
            </button>

            <button
              onClick={() => {
                setIsCompleted(false);
                setCurrentIdx(0);
                setAnswers([]);
              }}
              className="btn-3d-white text-slate-700 font-black px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Ulangi Post-Test</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
