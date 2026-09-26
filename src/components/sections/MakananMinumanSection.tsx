import React, { useState } from 'react';
import { FOOD_ITEMS } from '../../data/dentalData';
import { FoodItem } from '../../types';
import { ToothieMascot } from '../mascot/ToothieMascot';
import { Sparkles, Heart, AlertTriangle, CheckCircle2, Volume2, Shield } from 'lucide-react';
import { playPop, playSuccess, playBoing, speakText } from '../../utils/soundEffects';

interface MakananProps {
  onUnlockBadge?: (badgeId: string) => void;
}

export const MakananMinumanSection: React.FC<MakananProps> = ({ onUnlockBadge }) => {
  const [activeFilter, setActiveFilter] = useState<'semua' | 'sehat' | 'manis'>('semua');
  const [selectedFood, setSelectedFood] = useState<FoodItem>(FOOD_ITEMS[0]);
  const [toothieExpression, setToothieExpression] = useState<'happy' | 'worried' | 'sparkle'>('happy');
  const [reactionMessage, setReactionMessage] = useState<string>(
    'Pilih makanan di bawah untuk melihat reaksinya terhadap gigi!'
  );
  const [healthyPoints, setHealthyPoints] = useState(10);

  const filteredFoods = FOOD_ITEMS.filter((f) => {
    if (activeFilter === 'sehat') return f.category === 'sehat';
    if (activeFilter === 'manis') return f.category === 'manis';
    return true;
  });

  const handleFeedFood = (food: FoodItem) => {
    setSelectedFood(food);

    if (food.category === 'sehat') {
      playSuccess();
      setToothieExpression('sparkle');
      setHealthyPoints((prev) => Math.min(prev + 5, 50));
      const msg = `Nyam! ${food.name} sangat menyehatkan gigiku! ${food.effectDescription}`;
      setReactionMessage(msg);
      speakText(msg);
      if (onUnlockBadge) {
        onUnlockBadge('musuh-plak');
      }
    } else {
      playBoing();
      setToothieExpression('worried');
      const msg = `Wah! ${food.name} manis dan lengket! Jangan lupa berkumur air putih dan sikat gigi ya!`;
      setReactionMessage(msg);
      speakText(msg);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-white">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black">
            <Sparkles className="w-4 h-4 text-yellow-200" />
            <span>Materi 3 • Nutrisi Sahabat Gigi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Makanan & Minuman Sehat 🍎
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-amber-950 font-bold max-w-xl">
            Apa yang kamu makan memengaruhi kekuatan gigimu! Kenali mana makanan yang bikin gigi kuat dan mana yang disukai kuman.
          </p>
        </div>

        <div className="flex-shrink-0">
          <ToothieMascot
            size="lg"
            expression={toothieExpression}
            speechBubbleText={selectedFood.category === 'sehat' ? 'Gigiku Senang! ✨' : 'Aduh Manis! 🍬'}
          />
        </div>
      </div>

      {/* Two Groups Comparison Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Healthy Group */}
        <div className="bg-emerald-50 rounded-3xl p-6 border-2 border-emerald-200 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white text-2xl font-black flex items-center justify-center shadow-md">
              🥦
            </div>
            <div>
              <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">
                Kelompok Juara
              </span>
              <h3 className="text-xl font-black text-emerald-950">
                Pilih Makanan Penyehat Gigi
              </h3>
            </div>
          </div>
          <p className="text-sm font-bold text-emerald-900 leading-relaxed">
            Buah berserat, sayur renyah, susu, keju, dan air putih. Makanan ini kaya kalsium, merangsang air liur pembersih gigi alami, dan membuat email gigi tebal!
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-black text-emerald-800">
            <span className="bg-white px-3 py-1 rounded-full border border-emerald-200">🍎 Apel Segar</span>
            <span className="bg-white px-3 py-1 rounded-full border border-emerald-200">🥛 Susu Kalsium</span>
            <span className="bg-white px-3 py-1 rounded-full border border-emerald-200">🥕 Wortel Renyah</span>
            <span className="bg-white px-3 py-1 rounded-full border border-emerald-200">💧 Air Putih</span>
          </div>
        </div>

        {/* Sugary Group */}
        <div className="bg-rose-50 rounded-3xl p-6 border-2 border-rose-200 space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 text-white text-2xl font-black flex items-center justify-center shadow-md">
              🍭
            </div>
            <div>
              <span className="text-xs font-black text-rose-700 uppercase tracking-wider">
                Perlu Dibatasi
              </span>
              <h3 className="text-xl font-black text-rose-950">
                Batasi Makanan & Minuman Manis
              </h3>
            </div>
          </div>
          <p className="text-sm font-bold text-rose-900 leading-relaxed">
            Permen, cokelat, boba, soda, dan kue donat. Gula yang lengket akan diubah kuman menjadi zat asam perusak lapisan email gigi dalam 20 menit!
          </p>
          <div className="flex flex-wrap gap-2 text-xs font-black text-rose-800">
            <span className="bg-white px-3 py-1 rounded-full border border-rose-200">🍬 Permen Lengket</span>
            <span className="bg-white px-3 py-1 rounded-full border border-rose-200">🧋 Boba Manis</span>
            <span className="bg-white px-3 py-1 rounded-full border border-rose-200">🥤 Minuman Bersoda</span>
            <span className="bg-white px-3 py-1 rounded-full border border-rose-200">🍩 Kue Donat</span>
          </div>
        </div>
      </div>

      {/* Interactive Food Tester & Feeding Game */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-sky-100 shadow-xl space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4">
          <div>
            <span className="text-xs font-black text-sky-600 uppercase tracking-wider">
              Mini Game Interaktif
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
              Beri Makan Toothie & Lihat Efeknya!
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
            <button
              onClick={() => {
                playPop();
                setActiveFilter('semua');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeFilter === 'semua' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => {
                playPop();
                setActiveFilter('sehat');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeFilter === 'sehat' ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              🥦 Makanan Sehat
            </button>
            <button
              onClick={() => {
                playPop();
                setActiveFilter('manis');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeFilter === 'manis' ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-600'
              }`}
            >
              🍭 Batasi Manis
            </button>
          </div>
        </div>

        {/* Reaction Message Card */}
        <div
          className={`p-4 sm:p-6 rounded-3xl border-2 flex items-center gap-4 transition-all ${
            selectedFood.category === 'sehat'
              ? 'bg-emerald-50/80 border-emerald-200'
              : 'bg-rose-50/80 border-rose-200'
          }`}
        >
          <div className="text-4xl sm:text-5xl flex-shrink-0 animate-bounce">
            {selectedFood.emoji}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black text-slate-900">
                {selectedFood.name}
              </span>
              <span
                className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                  selectedFood.category === 'sehat'
                    ? 'bg-emerald-200 text-emerald-800'
                    : 'bg-rose-200 text-rose-800'
                }`}
              >
                {selectedFood.category === 'sehat' ? '✓ Sahabat Gigi' : '⚠️ Batasi Manis'}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1">
              {reactionMessage}
            </p>
          </div>
        </div>

        {/* 3D Food Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {filteredFoods.map((food) => {
            const isSelected = selectedFood.id === food.id;
            return (
              <button
                key={food.id}
                onClick={() => handleFeedFood(food)}
                className={`card-3d p-4 flex flex-col items-center justify-between text-center transition-all border-2 ${
                  isSelected
                    ? food.category === 'sehat'
                      ? 'border-emerald-500 bg-emerald-50/40 ring-4 ring-emerald-200'
                      : 'border-rose-500 bg-rose-50/40 ring-4 ring-rose-200'
                    : 'border-slate-100 hover:border-sky-300'
                }`}
              >
                <span className="text-4xl sm:text-5xl mb-2 hover:scale-125 transition-transform">
                  {food.emoji}
                </span>
                <span className="text-xs sm:text-sm font-black text-slate-800 line-clamp-1">
                  {food.name}
                </span>
                <span
                  className={`text-[10px] font-black mt-2 px-2 py-0.5 rounded-full ${
                    food.category === 'sehat'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {food.category === 'sehat' ? '+10 Poin' : 'Batasi!'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
