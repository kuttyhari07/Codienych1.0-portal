import React, { useEffect, useState, useRef } from 'react';

const LoadingScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2500;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const calculatedProgress = Math.min(Math.floor((elapsed / duration) * 100), 100);

      setProgress(calculatedProgress);

      if (calculatedProgress >= 100) {
        clearInterval(timer);
        setTimeout(() => {
          setIsFading(true);
          setTimeout(() => {
            if (onFinishRef.current) onFinishRef.current();
          }, 500);
        }, 200);
      }
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#020508] text-white transition-opacity duration-700 select-none ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background storm pulse */}
      <div className="absolute inset-0 bg-radial from-[#1c150c]/40 via-[#0a1824]/20 to-transparent blur-3xl" />

      <div className="relative z-10 text-center px-4 max-w-lg">
        {/* Official Codienych 1.0 Round Pirate Medallion */}
        <div className="mx-auto w-36 h-36 sm:w-44 sm:h-44 mb-6 relative flex items-center justify-center">
          {/* Subtle slow rotating antique compass/astrolabe ring */}
          <div className="absolute -inset-4 rounded-full border border-[#ffd700]/30 border-dashed animate-[spin_20s_linear_infinite]" />
          <div className="absolute -inset-2 rounded-full border border-[#00e5ff]/25 animate-pulse" />
          <div className="absolute inset-0 rounded-full bg-radial from-[#ffd700]/30 via-transparent to-transparent blur-xl" />
          
          {/* High-res Round Logo Medallion */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full p-1 flex items-center justify-center filter drop-shadow-[0_0_30px_rgba(255,215,0,0.6)]">
            <img
              src="/codienych-logo-round.png"
              alt="CODIENYCH 1.0"
              className="w-full h-full object-contain rounded-full select-none pointer-events-none"
            />
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
