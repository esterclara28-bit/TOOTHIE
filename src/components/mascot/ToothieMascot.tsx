import React, { useState } from 'react';
import { playSparkle, speakText } from '../../utils/soundEffects';

interface ToothieMascotProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  expression?: 'happy' | 'excited' | 'brushing' | 'thinking' | 'worried' | 'proud' | 'sparkle';
  hasCape?: boolean;
  interactive?: boolean;
  speechBubbleText?: string;
  className?: string;
  animate?: boolean;
}

export const ToothieMascot: React.FC<ToothieMascotProps> = ({
  size = 'md',
  expression = 'happy',
  hasCape = true,
  interactive = true,
  speechBubbleText,
  className = '',
  animate = true,
}) => {
  const [isWiggling, setIsWiggling] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  const sizeDimensions = {
    sm: { width: 64, height: 74 },
    md: { width: 110, height: 126 },
    lg: { width: 170, height: 195 },
    xl: { width: 230, height: 265 },
    hero: { width: 310, height: 350 },
  };

  const dim = sizeDimensions[size];

  const handleClick = () => {
    if (!interactive) return;
    setIsWiggling(true);
    setShowHeart(true);
    playSparkle();

    if (speechBubbleText) {
      speakText(speechBubbleText);
    } else {
      const cheers = [
        "Hai sahabat pintar! Gigiku bersih dan kuat!",
        "Ayo jaga senyum gigimu selalu bersinar!",
        "Jangan lupa sikat gigi dua kali sehari ya!",
        "Kapten Toothie siap melindungimu dari kuman!",
      ];
      const randomCheer = cheers[Math.floor(Math.random() * cheers.length)];
      speakText(randomCheer);
    }

    setTimeout(() => setIsWiggling(false), 800);
    setTimeout(() => setShowHeart(false), 1400);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative inline-flex flex-col items-center select-none ${
        interactive ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      {/* Interactive Speech Bubble */}
      {speechBubbleText && (
        <div className="absolute -top-12 z-20 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-lg border-2 border-sky-200 text-xs sm:text-sm font-bold text-sky-800 animate-bounce max-w-[200px] text-center">
          {speechBubbleText}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-8 border-t-white" />
        </div>
      )}

      {/* Floating Heart reaction */}
      {showHeart && (
        <div className="absolute -top-6 text-xl sm:text-2xl animate-ping pointer-events-none z-30">
          ✨💖✨
        </div>
      )}

      <div
        className={`relative transition-transform duration-300 ${
          animate && !isWiggling ? 'animate-float-gentle' : ''
        } ${isWiggling ? 'scale-110 -rotate-3 transition-transform' : 'group-hover:scale-105'}`}
        style={{ width: dim.width, height: dim.height }}
      >
        <svg
          viewBox="0 0 200 230"
          className="w-full h-full drop-shadow-xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Superhero Cape Gradient */}
            <linearGradient id="capeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="50%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            {/* Tooth Body 3D Pearlescent Gradient */}
            <radialGradient id="toothBodyGrad" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="65%" stopColor="#f0f7ff" />
              <stop offset="100%" stopColor="#dbeafe" />
            </radialGradient>

            {/* Tooth Highlights */}
            <linearGradient id="highlightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>

            {/* Rosy Cheek Gradient */}
            <radialGradient id="blushGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fda4af" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#fda4af" stopOpacity="0" />
            </radialGradient>

            {/* Gold Cape Badge */}
            <linearGradient id="goldBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#eab308" />
            </linearGradient>

            {/* 3D Drop Shadow */}
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#93c5fd" floodOpacity="0.35" />
            </filter>
          </defs>

          {/* Superhero Dental Cape (Behind Tooth) */}
          {hasCape && (
            <g className="animate-cape origin-top">
              <path
                d="M 60 70 Q 25 125 15 195 Q 65 180 100 190 Q 135 180 185 195 Q 175 125 140 70 Z"
                fill="url(#capeGrad)"
                opacity="0.95"
              />
              <path
                d="M 25 185 Q 60 175 100 185 Q 140 175 175 185 L 185 195 Q 135 180 100 190 Q 65 180 15 195 Z"
                fill="#0369a1"
                opacity="0.6"
              />
            </g>
          )}

          {/* Soft Ground Shadow */}
          <ellipse cx="100" cy="216" rx="65" ry="10" fill="#cbd5e1" opacity="0.45" />

          {/* Tooth 3D Body (2 Roots + Rounded Crown) */}
          <g filter="url(#softShadow)">
            <path
              d="M 52 42
                 C 40 42, 28 55, 28 78
                 C 28 115, 34 140, 52 185
                 C 60 205, 75 208, 82 188
                 C 90 166, 95 148, 100 148
                 C 105 148, 110 166, 118 188
                 C 125 208, 140 205, 148 185
                 C 166 140, 172 115, 172 78
                 C 172 55, 160 42, 148 42
                 C 134 42, 122 52, 100 52
                 C 78 52, 66 42, 52 42 Z"
              fill="url(#toothBodyGrad)"
              stroke="#bfdbfe"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />

            {/* Glossy 3D Highlight Curve */}
            <path
              d="M 46 62
                 C 38 72, 38 98, 42 120
                 C 44 100, 48 76, 62 66
                 C 72 58, 86 58, 96 58
                 C 82 54, 58 50, 46 62 Z"
              fill="url(#highlightGrad)"
            />

            {/* Crown Top Glossy Highlights */}
            <ellipse cx="64" cy="54" rx="12" ry="5" fill="#ffffff" opacity="0.8" />
            <ellipse cx="136" cy="54" rx="12" ry="5" fill="#ffffff" opacity="0.8" />
          </g>

          {/* Rosy Cheeks */}
          <ellipse cx="56" cy="118" rx="14" ry="9" fill="url(#blushGrad)" />
          <ellipse cx="144" cy="118" rx="14" ry="9" fill="url(#blushGrad)" />

          {/* Mascot Eyes depending on expression */}
          {expression === 'worried' ? (
            /* Worried Eyes */
            <g>
              <ellipse cx="72" cy="100" rx="9" ry="11" fill="#1e293b" />
              <ellipse cx="128" cy="100" rx="9" ry="11" fill="#1e293b" />
              <circle cx="70" cy="97" r="3.5" fill="#ffffff" />
              <circle cx="126" cy="97" r="3.5" fill="#ffffff" />
              {/* Worried Eyebrows */}
              <path d="M 62 86 Q 72 90 82 84" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 118 84 Q 128 90 138 86" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
              {/* Sweat drop */}
              <path d="M 152 92 C 150 86, 154 82, 156 82 C 158 82, 162 86, 160 92 C 159 95, 153 95, 152 92 Z" fill="#38bdf8" />
            </g>
          ) : expression === 'thinking' ? (
            /* Curious / Thinking Eyes */
            <g>
              <ellipse cx="74" cy="95" rx="8" ry="10" fill="#1e293b" />
              <ellipse cx="130" cy="95" rx="8" ry="10" fill="#1e293b" />
              <circle cx="76" cy="92" r="3.5" fill="#ffffff" />
              <circle cx="132" cy="92" r="3.5" fill="#ffffff" />
              {/* One eyebrow raised */}
              <path d="M 64 82 Q 74 80 84 84" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 120 78 Q 130 73 140 76" stroke="#1e293b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </g>
          ) : (
            /* Cheerful Happy Big Anime Eyes */
            <g>
              <ellipse cx="72" cy="98" rx="10" ry="13" fill="#0f172a" />
              <ellipse cx="128" cy="98" rx="10" ry="13" fill="#0f172a" />
              {/* Shiny catchlights */}
              <circle cx="69" cy="94" r="4.5" fill="#ffffff" />
              <circle cx="125" cy="94" r="4.5" fill="#ffffff" />
              <circle cx="75" cy="104" r="2.2" fill="#ffffff" />
              <circle cx="131" cy="104" r="2.2" fill="#ffffff" />
              {/* Friendly Eyebrows */}
              <path d="M 63 80 Q 73 75 83 80" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 117 80 Q 127 75 137 80" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* Mascot Mouth */}
          {expression === 'worried' ? (
            /* Wavy / Nervous mouth */
            <path
              d="M 85 125 Q 92 121 100 125 Q 108 128 115 124"
              stroke="#e11d48"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          ) : expression === 'thinking' ? (
            /* Small curious 'O' or half smile */
            <path
              d="M 94 122 Q 102 126 110 120"
              stroke="#0f172a"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
          ) : expression === 'excited' || expression === 'sparkle' || expression === 'proud' ? (
            /* Big Joyful Open Mouth with pink tongue */
            <g>
              <path
                d="M 78 114 Q 100 114 122 114 C 122 136 78 136 78 114 Z"
                fill="#e11d48"
                stroke="#9f1239"
                strokeWidth="2.5"
              />
              <path
                d="M 88 126 Q 100 120 112 126 C 110 134 90 134 88 126 Z"
                fill="#fb7185"
              />
              {/* Tooth top teeth peek */}
              <path
                d="M 88 114 Q 100 117 112 114 Z"
                fill="#ffffff"
              />
            </g>
          ) : (
            /* Gentle warm smile */
            <path
              d="M 82 116 Q 100 132 118 116"
              stroke="#0f172a"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Superhero Collar Clasp & Star Badge */}
          {hasCape && (
            <g>
              <ellipse cx="100" cy="144" rx="11" ry="11" fill="url(#goldBadgeGrad)" stroke="#ca8a04" strokeWidth="2" />
              {/* Mini Star inside badge */}
              <polygon
                points="100,137 102,142 107,143 103,147 104,152 100,149 96,152 97,147 93,143 98,142"
                fill="#ffffff"
              />
            </g>
          )}

          {/* Sparkles around Toothie */}
          {(expression === 'sparkle' || expression === 'proud' || size === 'hero' || size === 'xl') && (
            <g className="animate-sparkle-spin origin-[165px_45px]">
              {/* Top Right Big Sparkle */}
              <path
                d="M 165 30 Q 165 45 150 45 Q 165 45 165 60 Q 165 45 180 45 Q 165 45 165 30 Z"
                fill="#38bdf8"
              />
              <circle cx="165" cy="45" r="3" fill="#ffffff" />
            </g>
          )}

          {/* Small Top Left Sparkle */}
          <g className="animate-pulse">
            <path
              d="M 35 32 Q 35 40 27 40 Q 35 40 35 48 Q 35 40 43 40 Q 35 40 35 32 Z"
              fill="#fbbf24"
            />
          </g>
        </svg>
      </div>

      {interactive && (
        <span className="mt-1 text-[11px] font-bold text-sky-600 opacity-80 group-hover:opacity-100 transition-opacity">
          Klik aku! 👆
        </span>
      )}
    </div>
  );
};
