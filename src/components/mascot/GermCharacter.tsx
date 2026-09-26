import React, { useState } from 'react';
import { playBoing, playPop } from '../../utils/soundEffects';

interface GermProps {
  type?: 'mimi' | 'dodo' | 'plak';
  size?: 'sm' | 'md' | 'lg';
  defeated?: boolean;
  onTap?: () => void;
  className?: string;
}

export const GermCharacter: React.FC<GermProps> = ({
  type = 'mimi',
  size = 'md',
  defeated = false,
  onTap,
  className = '',
}) => {
  const [bounced, setBounced] = useState(false);

  const dimMap = {
    sm: { width: 44, height: 44 },
    md: { width: 72, height: 72 },
    lg: { width: 110, height: 110 },
  };

  const dim = dimMap[size];

  const handleClick = () => {
    setBounced(true);
    playBoing();
    playPop(260);
    if (onTap) onTap();
    setTimeout(() => setBounced(false), 500);
  };

  // Mimi is a cute round purple blob; Dodo is a funny green triangle with antenna
  const isPurple = type === 'mimi' || type === 'plak';

  return (
    <div
      onClick={handleClick}
      style={{ width: dim.width, height: dim.height }}
      className={`relative inline-block cursor-pointer select-none transition-all duration-300 ${
        bounced ? 'scale-125 rotate-12' : 'hover:scale-110'
      } ${defeated ? 'opacity-0 scale-50 transition-all duration-500 pointer-events-none' : ''} ${className}`}
      title={isPurple ? "Mimi si Kuman Plak (Klik untuk menyikat!)" : "Dodo si Bakteri Manis"}
    >
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full drop-shadow-md animate-float-slow"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="purpleGermGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#d8b4fe" />
            <stop offset="60%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7e22ce" />
          </radialGradient>
          <radialGradient id="greenGermGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#a7f3d0" />
            <stop offset="60%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#047857" />
          </radialGradient>
        </defs>

        {isPurple ? (
          /* Mimi the Plak Blob */
          <g>
            {/* Antennas */}
            <path d="M 38 28 Q 32 15 26 18" stroke="#7e22ce" strokeWidth="4" strokeLinecap="round" />
            <circle cx="26" cy="18" r="4.5" fill="#f43f5e" />
            <path d="M 62 28 Q 68 15 74 18" stroke="#7e22ce" strokeWidth="4" strokeLinecap="round" />
            <circle cx="74" cy="18" r="4.5" fill="#f43f5e" />

            {/* Blobby Body */}
            <path
              d="M 50 20
                 C 72 18, 88 32, 88 52
                 C 88 74, 76 88, 50 88
                 C 24 88, 12 74, 12 52
                 C 12 32, 28 22, 50 20 Z"
              fill="url(#purpleGermGrad)"
            />

            {/* Spots on blob */}
            <circle cx="32" cy="40" r="4" fill="#7e22ce" opacity="0.4" />
            <circle cx="70" cy="42" r="5" fill="#7e22ce" opacity="0.4" />
            <circle cx="52" cy="74" r="4.5" fill="#7e22ce" opacity="0.4" />

            {/* Big cute cartoon eyes */}
            <circle cx="38" cy="52" r="9" fill="#ffffff" />
            <circle cx="62" cy="52" r="9" fill="#ffffff" />
            <circle cx="39" cy="52" r="4.5" fill="#0f172a" />
            <circle cx="63" cy="52" r="4.5" fill="#0f172a" />
            <circle cx="37" cy="50" r="1.5" fill="#ffffff" />
            <circle cx="61" cy="50" r="1.5" fill="#ffffff" />

            {/* Funny cute toothy smile */}
            <path d="M 42 66 Q 50 72 58 66" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Tiny single fang */}
            <polygon points="48,67 52,67 50,72" fill="#ffffff" />
          </g>
        ) : (
          /* Dodo the Green Germ */
          <g>
            {/* Single top curly antenna */}
            <path d="M 50 26 Q 50 12 60 10 Q 70 8 68 18" stroke="#047857" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <circle cx="68" cy="18" r="4" fill="#fbbf24" />

            {/* Spiky rounded triangle body */}
            <path
              d="M 50 22
                 C 68 22, 85 45, 82 68
                 C 80 84, 66 86, 50 86
                 C 34 86, 20 84, 18 68
                 C 15 45, 32 22, 50 22 Z"
              fill="url(#greenGermGrad)"
            />

            {/* Yellow spots */}
            <circle cx="30" cy="42" r="3.5" fill="#fbbf24" opacity="0.6" />
            <circle cx="72" cy="46" r="4" fill="#fbbf24" opacity="0.6" />

            {/* Goofy cross-eyed or silly eyes */}
            <circle cx="40" cy="52" r="8" fill="#ffffff" />
            <circle cx="60" cy="50" r="10" fill="#ffffff" />
            <circle cx="43" cy="53" r="4" fill="#0f172a" />
            <circle cx="58" cy="50" r="4" fill="#0f172a" />

            {/* Open silly mouth */}
            <ellipse cx="50" cy="68" rx="6" ry="4" fill="#0f172a" />
            <path d="M 47 69 Q 50 72 53 69" fill="#f43f5e" />
          </g>
        )}
      </svg>
    </div>
  );
};
