import React, { useEffect, useState } from 'react';

const LoadingScreen = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Total duration ~5 seconds (5000ms / 100 steps = 50ms per 1% increment)
    const startTime = Date.now();
    const duration = 5000; // 5 seconds

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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050b07] text-white transition-opacity duration-700 ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background storm pulse */}
      <div className="absolute inset-0 bg-radial from-[#0f2b19]/30 to-transparent blur-3xl" />

      <div className="relative z-10 text-center px-4 max-w-md">
        {/* Hackathon Logo with Circular Cyber Glow Animation */}
        <div className="mx-auto w-32 h-32 sm:w-36 sm:h-36 mb-6 relative flex items-center justify-center">
          {/* Animated Glowing Rings & Radar Effect */}
          <div className="absolute inset-0 rounded-full border border-[#00ff66]/30 animate-ping" />
          <div className="absolute -inset-2 rounded-full border border-[#00ff66]/20 animate-pulse" />
          <div className="absolute -inset-4 rounded-full border border-dashed border-[#00ff66]/40 animate-[spin_8s_linear_infinite]" />
          
          {/* Circular Logo Frame */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#0a1b10]/95 border-2 border-[#00ff66] p-3 flex items-center justify-center shadow-[0_0_35px_rgba(0,255,102,0.6)] backdrop-blur-md overflow-hidden">
            <img
              src="/favicon.png"
              alt="CODIENYCH 1.0 Logo"
              className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(0,255,102,0.8)] animate-pulse"
            />
          </div>
        </div>

        <h1 className="font-orbitron font-black text-3xl sm:text-4xl tracking-wider text-white mb-2 neon-glow-green">
          CODIENYCH 1.0
        </h1>
        <p className="text-[#10b981] font-mono text-xs sm:text-sm tracking-widest uppercase mb-8">
          INITIALIZING MISSION CONTROL...
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-[#0a140e] border border-[#1b3524] rounded-full h-3 p-0.5 overflow-hidden shadow-inner">
          <div
            className="bg-gradient-to-r from-[#059669] via-[#10b981] to-[#00ff66] h-full rounded-full transition-all duration-150 ease-out shadow-[0_0_10px_#00ff66]"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-xs font-mono text-gray-400 mt-2">
          <span>SYSTEM READY</span>
          <span>{Math.min(progress, 100)}%</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
