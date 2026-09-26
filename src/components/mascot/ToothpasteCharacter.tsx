import React from 'react';
import { playSparkle } from '../../utils/soundEffects';

interface ToothpasteProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ToothpasteCharacter: React.FC<ToothpasteProps> = ({
  size = 'md',
  className = '',
}) => {
  const dimMap = {
    sm: { width: 50, height: 75 },
    md: { width: 75, height: 110 },
    lg: { width: 105, height: 155 },
  };

  const dim = dimMap[size];

  return (
    <div
      onClick={() => playSparkle()}
      style={{ width: dim.width, height: dim.height }}
      className={`relative inline-block cursor-pointer select-none transition-transform hover:scale-105 ${className}`}
      title="Pasta Minty - Dengan Fluoride Pelindung Gigi!"
    >
      <svg
        viewBox="0 0 100 140"
        className="w-full h-full drop-shadow-md animate-float-gentle"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="tubeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
          <linearGradient id="capGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </linearGradient>
        </defs>

        {/* Screw Cap */}
        <rect x="36" y="8" width="28" height="16" rx="4" fill="url(#capGrad)" stroke="#94a3b8" strokeWidth="2" />
        <line x1="42" y1="12" x2="42" y2="20" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="50" y1="12" x2="50" y2="20" stroke="#94a3b8" strokeWidth="1.5" />
        <line x1="58" y1="12" x2="58" y2="20" stroke="#94a3b8" strokeWidth="1.5" />

        {/* Tube Body */}
        <path
          d="M 38 24
             L 62 24
             L 76 80
             C 78 110, 72 130, 68 132
             L 32 132
             C 28 130, 22 110, 24 80
             Z"
          fill="url(#tubeGrad)"
          stroke="#0369a1"
          strokeWidth="2.5"
        />

        {/* Tube End Seal line */}
        <rect x="28" y="128" width="44" height="6" rx="2" fill="#0284c7" stroke="#0369a1" strokeWidth="1.5" />

        {/* Mint Leaf Emblem */}
        <path
          d="M 50 48 C 62 48, 64 62, 50 68 C 36 62, 38 48, 50 48 Z"
          fill="#34d399"
          stroke="#059669"
          strokeWidth="1.5"
        />
        <line x1="50" y1="50" x2="50" y2="66" stroke="#059669" strokeWidth="1" />

        {/* Cute Face on Tube */}
        <circle cx="42" cy="85" r="3.5" fill="#0f172a" />
        <circle cx="58" cy="85" r="3.5" fill="#0f172a" />
        <circle cx="41" cy="83" r="1.2" fill="#ffffff" />
        <circle cx="57" cy="83" r="1.2" fill="#ffffff" />
        <ellipse cx="38" cy="89" rx="2.5" ry="1.5" fill="#fca5a5" />
        <ellipse cx="62" cy="89" rx="2.5" ry="1.5" fill="#fca5a5" />
        <path d="M 46 91 Q 50 96 54 91" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Foam bubbles floating next to tube */}
        <circle cx="78" cy="30" r="7" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.5" opacity="0.8" />
        <circle cx="86" cy="18" r="4.5" fill="#ffffff" stroke="#93c5fd" strokeWidth="1.2" opacity="0.7" />
      </svg>
    </div>
  );
};
