import React, { useState, useEffect } from 'react';
import { Clock, Zap } from 'lucide-react';
import { EVENT_CONFIG } from '../utils/config';

const CountdownSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLive: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(EVENT_CONFIG.HACKATHON_START_DATE).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isLive: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isLive: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="countdown" className="relative py-20 px-4 z-10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block font-mono text-xs text-[#00ff66] tracking-widest uppercase mb-2">
          // CHRONOMETER
        </div>
        <h2 className="font-orbitron font-extrabold text-2xl sm:text-3xl md:text-4xl text-white mb-6 sm:mb-8 tracking-wide">
          COUNTDOWN TO <span className="text-[#00ff66]">MISSION START</span>
        </h2>

        {timeLeft.isLive ? (
          <div className="bg-[#0f2e1a] border-4 border-[#00ff66] rounded-2xl p-6 sm:p-10 max-w-xl mx-auto shadow-[0_0_50px_#00ff66] animate-pulse">
            <Zap className="w-12 h-12 sm:w-16 sm:h-16 text-[#00ff66] mx-auto mb-4 animate-bounce" />
            <h3 className="font-orbitron font-black text-2xl sm:text-4xl md:text-5xl text-[#00ff66] neon-glow-green uppercase">
              HACKATHON IS LIVE!
            </h3>
            <p className="font-mono text-xs sm:text-sm text-gray-300 mt-4">
              The 24-hour innovation countdown has officially commenced!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 max-w-3xl mx-auto px-2">
            {/* Days */}
            <div className="bg-[#0a140e]/90 border border-[#1b3524] rounded-xl p-3 sm:p-5 md:p-6 shadow-lg">
              <div className="font-orbitron font-black text-2xl sm:text-4xl md:text-6xl text-[#00ff66] neon-glow-green mb-1">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div className="font-mono text-[9px] sm:text-xs text-gray-400 uppercase tracking-wider sm:tracking-widest">
                DAYS
              </div>
            </div>

            {/* Hours */}
            <div className="bg-[#0a140e]/90 border border-[#1b3524] rounded-xl p-3 sm:p-5 md:p-6 shadow-lg">
              <div className="font-orbitron font-black text-2xl sm:text-4xl md:text-6xl text-[#00ff66] neon-glow-green mb-1">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="font-mono text-[9px] sm:text-xs text-gray-400 uppercase tracking-wider sm:tracking-widest">
                HOURS
              </div>
            </div>

            {/* Minutes */}
            <div className="bg-[#0a140e]/90 border border-[#1b3524] rounded-xl p-3 sm:p-5 md:p-6 shadow-lg">
              <div className="font-orbitron font-black text-2xl sm:text-4xl md:text-6xl text-[#00ff66] neon-glow-green mb-1">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="font-mono text-[9px] sm:text-xs text-gray-400 uppercase tracking-wider sm:tracking-widest">
                MINUTES
              </div>
            </div>

            {/* Seconds */}
            <div className="bg-[#0a140e]/90 border border-[#1b3524] rounded-xl p-3 sm:p-5 md:p-6 shadow-lg border-b-2 border-b-[#00ff66]">
              <div className="font-orbitron font-black text-2xl sm:text-4xl md:text-6xl text-white mb-1">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="font-mono text-[9px] sm:text-xs text-[#10b981] uppercase tracking-wider sm:tracking-widest">
                SECONDS
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CountdownSection;
