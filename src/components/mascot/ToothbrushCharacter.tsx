import React from 'react';
import { playBrushSound } from '../../utils/soundEffects';

interface ToothbrushProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
  hasPaste?: boolean;
}

export const ToothbrushCharacter: React.FC<ToothbrushProps> = ({
  size = 'md',
  animated = false,
  className = '',
  hasPaste = true,
}) => {
  const dimensions = {
    sm: { width: 50, height: 110 },
    md: { width: 75, height: 160 },
    lg: { width: 110, height: 230 },
  };

  const dim = dimensions[size];

  return (
    <div
      onClick={() => playBrushSound()}
      className={`relative inline-block cursor-pointer select-none group transition-transform ${
        animated ? 'animate-brush' : 'hover:scale-105'
      } ${className}`}
      style={{ width: dim.width, height: dim.height }}
      title="Sikat Sparkle - Sahabat Terbaik Gigi!"
    >
      <svg
        viewBox="0 0 100 220"
        className="w-full h-full drop-shadow-lg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="60%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <linearGradient id="gripGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="pasteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="70%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>

        {/* Brush Bristle Head Base */}
        <rect x="25" y="40" width="50" height="28" rx="8" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />

        {/* White & Blue Bristles */}
        <path d="M 28 40 L 28 16 Q 34 14 38 16 L 38 40" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.5" />
        <path d="M 38 40 L 38 14 Q 45 12 50 14 L 50 40" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />
        <path d="M 50 40 L 50 14 Q 56 12 62 14 L 62 40" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.5" />
        <path d="M 62 40 L 62 16 Q 68 14 72 16 L 72 40" fill="#38bdf8" stroke="#0284c7" strokeWidth="1.5" />

        {/* Pea-sized Toothpaste Swirl */}
        {hasPaste && (
          <g>
            <path
              d="M 32 15 C 32 8, 48 4, 60 7 C 72 10, 75 14, 66 18 C 55 22, 38 21, 32 15 Z"
              fill="url(#pasteGrad)"
              stroke="#0284c7"
              strokeWidth="1.5"
            />
            {/* Sparkle on paste */}
            <circle cx="45" cy="11" r="2" fill="#ffffff" />
          </g>
        )}

        {/* Handle Neck */}
        <path
          d="M 40 68 L 40 95 Q 40 102 42 110 L 42 195 Q 42 208 50 212 Q 58 208 58 195 L 58 110 Q 60 102 60 68 Z"
          fill="url(#handleGrad)"
          stroke="#047857"
          strokeWidth="2.5"
        />

        {/* Soft grip rubber ribs */}
        <rect x="44" y="130" width="12" height="3" rx="1.5" fill="url(#gripGrad)" />
        <rect x="44" y="138" width="12" height="3" rx="1.5" fill="url(#gripGrad)" />
        <rect x="44" y="146" width="12" height="3" rx="1.5" fill="url(#gripGrad)" />

        {/* Cute Face on Handle */}
        <g>
          {/* Eyes */}
          <circle cx="46" cy="85" r="2.8" fill="#0f172a" />
          <circle cx="54" cy="85" r="2.8" fill="#0f172a" />
          <circle cx="45" cy="84" r="1" fill="#ffffff" />
          <circle cx="53" cy="84" r="1" fill="#ffffff" />
          {/* Cheeks */}
          <ellipse cx="43" cy="89" rx="2" ry="1.2" fill="#fca5a5" />
          <ellipse cx="57" cy="89" rx="2" ry="1.2" fill="#fca5a5" />
          {/* Smile */}
          <path d="M 48 89 Q 50 93 52 89" stroke="#0f172a" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </g>
      </svg>
    </div>
  );
};
