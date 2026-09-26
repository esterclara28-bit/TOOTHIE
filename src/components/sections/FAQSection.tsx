import React, { useState } from 'react';
import { FAQ_LIST } from '../../data/dentalData';
import { ToothieMascot } from '../mascot/ToothieMascot';
import { ChevronDown, HelpCircle, Sparkles, Volume2 } from 'lucide-react';
import { playPop, speakText } from '../../utils/soundEffects';

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    playPop();
    if (openIdx === idx) {
      setOpenIdx(null);
    } else {
      setOpenIdx(idx);
      speakText(`${FAQ_LIST[idx].q}. ${FAQ_LIST[idx].a}`);
    }
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-sky-400 via-teal-400 to-cyan-400 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border-4 border-white">
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black">
            <HelpCircle className="w-4 h-4 text-yellow-300" />
            <span>Tanya Jawab Seputar Gigi</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            Pertanyaan Sering Ditanyakan (FAQ) ❓
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-sky-950 font-bold max-w-xl">
            Punya rasa ingin tahu tentang gigimu? Temukan jawaban mudah dan ramah anak di sini!
          </p>
        </div>

        <div className="flex-shrink-0">
          <ToothieMascot
            size="lg"
            expression="thinking"
            speechBubbleText="Ada pertanyaan? Klik di bawah!"
          />
        </div>
      </div>

      {/* Accordion List */}
      <div className="max-w-3xl mx-auto space-y-4">
        {FAQ_LIST.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className={`bg-white rounded-3xl border-2 transition-all overflow-hidden ${
                isOpen
                  ? 'border-sky-400 shadow-lg shadow-sky-100/60 ring-2 ring-sky-200'
                  : 'border-slate-200 hover:border-sky-300 shadow-sm'
              }`}
            >
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-black text-slate-800 focus:outline-none"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-lg flex-shrink-0 border border-sky-100">
                    🦷
                  </div>
                  <span className="text-base sm:text-lg leading-snug">{item.q}</span>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <ChevronDown
                    className={`w-5 h-5 text-sky-600 transition-transform duration-300 ${
                      isOpen ? 'transform rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="px-5 sm:px-6 pb-6 pt-1 text-slate-600 font-bold text-sm sm:text-base leading-relaxed border-t border-slate-100 flex items-start justify-between gap-4">
                  <p className="flex-1">{item.a}</p>
                  <button
                    onClick={() => speakText(`${item.q}. ${item.a}`)}
                    className="p-2 text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-xl flex-shrink-0"
                    title="Dengarkan Suara"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
