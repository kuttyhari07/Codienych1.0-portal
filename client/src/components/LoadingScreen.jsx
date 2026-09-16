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
        {/* Pirates of the Caribbean Banner Scroll */}
        <div className="mx-auto w-64 sm:w-80 mb-6 relative flex items-center justify-center">
          <img
            src="/pirates-banner.png"
            alt="Pirates of the Caribbean"
            className="w-full h-auto drop-shadow-[0_0_30px_rgba(229,193,88,0.7)] animate-pulse"
          />
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
