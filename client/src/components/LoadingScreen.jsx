import React, { useEffect, useState } from 'react';

const LoadingScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Total duration ~4.5 seconds
    const startTime = Date.now();
    const duration = 4500;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(Math.floor((elapsed / duration) * 100), 100);

      setProgress(calculatedProgress);

      if (calculatedProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            if (onFinish) onFinish();
          }, 600);
        }, 300);
      }
    }, 40);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020508] text-white transition-opacity duration-700 select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background storm pulse */}
      <div className="absolute inset-0 bg-radial from-[#1c150c]/40 via-[#0a1824]/20 to-transparent blur-3xl" />

      <div className="relative z-10 text-center px-4 max-w-lg">
        {/* Ornate Glowing Pirate Skull & Cutlasses Emblem */}
        <div className="mx-auto w-24 h-24 sm:w-28 sm:h-28 mb-6 relative flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-[#ffd700]/30 animate-ping" />
          <div className="absolute -inset-2 rounded-full border border-[#e5c158]/20 animate-pulse" />
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#140e06] border-2 border-[#ffd700] p-3 flex items-center justify-center shadow-[0_0_35px_rgba(255,215,0,0.6)] backdrop-blur-md overflow-hidden">
            <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_0_8px_#ffd700]">
              <path d="M20 75 L80 25 M80 75 L20 25" stroke="#ffd700" strokeWidth="4" strokeLinecap="round" />
              <circle cx="50" cy="45" r="24" fill="#f4e6c3" stroke="#ffd700" strokeWidth="2" />
              <circle cx="42" cy="42" r="5" fill="#03070b" />
              <circle cx="58" cy="42" r="5" fill="#03070b" />
              <polygon points="50,48 46,55 54,55" fill="#03070b" />
              <rect x="42" y="60" width="16" height="6" rx="2" fill="#ffd700" />
              <line x1="46" y1="60" x2="46" y2="66" stroke="#03070b" strokeWidth="1.5" />
              <line x1="50" y1="60" x2="50" y2="66" stroke="#03070b" strokeWidth="1.5" />
              <line x1="54" y1="60" x2="54" y2="66" stroke="#03070b" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        <h1 className="font-pirate text-4xl sm:text-6xl tracking-wider text-[#ffd700] mb-2 pirate-gold-title">
          CODIENYCH 1.0
        </h1>
        <p className="text-[#00e5ff] font-cinzel font-bold text-xs sm:text-sm tracking-widest uppercase mb-8">
          HOISTING THE BLACK PEARL SAILS...
        </p>

        {/* Progress Bar in Antique Brass & Gold */}
        <div className="w-full bg-[#08121a] border border-[#5a4422] rounded-full h-3.5 p-0.5 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-[#8a6d1b] via-[#ffd700] to-[#00e5ff] h-full rounded-full transition-all duration-150 ease-out shadow-[0_0_15px_#ffd700]"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-xs font-cinzel font-semibold text-[#cfb07a] mt-2">
          <span>HIGH SEAS CALIBRATED</span>
          <span className="text-[#ffd700] font-bold">{Math.min(progress, 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
