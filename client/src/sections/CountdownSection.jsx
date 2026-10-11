import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Zap, Anchor, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EVENT_CONFIG } from '../utils/config';
import CyberEnergyMatrixCanvas from '../components/CyberEnergyMatrixCanvas';

const AnimatedDigit = ({ value, label, isSeconds }) => {
  return (
    <div
      className={`bg-[#08121a]/92 border border-[#4a381e] hover:border-[#ffd700] rounded-2xl p-3 sm:p-5 md:p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 ${
        isSeconds ? 'border-b-2 border-b-[#ffd700]' : ''
      }`}
    >
      <div className="font-pirate text-3xl sm:text-5xl md:text-7xl text-[#ffd700] pirate-gold-title mb-1 h-10 sm:h-14 md:h-20 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ y: -14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 14, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className={isSeconds ? 'text-[#00e5ff]' : 'text-[#ffd700]'}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <div
        className={`font-cinzel font-bold text-[9px] sm:text-xs uppercase tracking-wider sm:tracking-widest ${
          isSeconds ? 'text-[#00e5ff]' : 'text-[#cfb07a]'
        }`}
      >
        {label}
      </div>
    </div>
  );
};

const CountdownSection = () => {
  const [timerState, setTimerState] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isHackingLive: false,
    isConcluded: false,
    progressPercent: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const startMs = new Date(EVENT_CONFIG.HACKATHON_START_DATE).getTime();
      const endMs = new Date(EVENT_CONFIG.HACKATHON_END_DATE).getTime();
      const now = new Date().getTime();

      // 1. Before 11:30 AM Today: Countdown to start
      if (now < startMs) {
        const diff = startMs - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimerState({
          days,
          hours,
          minutes,
          seconds,
          isHackingLive: false,
          isConcluded: false,
          progressPercent: 0,
        });
        return;
      }

      // 2. Between Today 11:30 AM and Tomorrow 11:30 AM: Active 24-Hour Countdown
      if (now >= startMs && now <= endMs) {
        const diff = endMs - now;
        const totalDuration = endMs - startMs;
        const elapsed = now - startMs;
        const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        setTimerState({
          days,
          hours,
          minutes,
          seconds,
          isHackingLive: true,
          isConcluded: false,
          progressPercent: progress,
        });
        return;
      }

      // 3. After Tomorrow 11:30 AM: Hackathon concluded
      setTimerState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isHackingLive: false,
        isConcluded: true,
        progressPercent: 100,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="countdown" className="relative py-20 px-4 z-10">
      <div className="max-w-4xl mx-auto text-center">
        {/* Telemetry Badge */}
        <div className="inline-flex items-center space-x-2 font-cinzel font-bold text-xs text-[#ffd700] tracking-widest uppercase mb-3 bg-[#ffd700]/10 px-4 py-1.5 rounded-full border border-[#ffd700]/30 shadow-sm">
          {timerState.isHackingLive ? (
            <>
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-red-400 font-mono">// 24-HOUR BATTLEFIELD ACTIVE</span>
            </>
          ) : (
            <>
              <Compass className="w-3.5 h-3.5 text-[#ffd700]" />
              <span>// 24-HOUR SHIP CHRONOMETER</span>
            </>
          )}
        </div>

        {/* Section Heading */}
        <h2 className="font-pirate text-3xl sm:text-5xl md:text-6xl text-white mb-3 sm:mb-4 tracking-wide">
          {timerState.isHackingLive ? (
            <>
              24-HOUR EXPEDITION IS <span className="text-red-500 pirate-gold-title">LIVE!</span>
            </>
          ) : timerState.isConcluded ? (
            <>
              EXPEDITION <span className="text-[#ffd700] pirate-gold-title">CONCLUDED</span>
            </>
          ) : (
            <>
              COUNTDOWN TO <span className="text-[#ffd700] pirate-gold-title">EXPEDITION EMBARKATION</span>
            </>
          )}
        </h2>

        {/* Subtitle Window Display */}
        <p className="font-cinzel text-xs sm:text-sm text-[#e5c158] max-w-2xl mx-auto mb-8 sm:mb-10 font-semibold">
          {timerState.isHackingLive ? (
            <span>
              ⚡ Coding continuously until tomorrow at <strong className="text-white">11:30 AM IST (October 9, 2026)</strong>. Keep your fleet sails steady!
            </span>
          ) : timerState.isConcluded ? (
            <span>
              The 24-hour high seas voyage has arrived at the treasure port. All codes frozen!
            </span>
          ) : (
            <span>
              Voyage embarks today at <strong className="text-[#ffd700]">11:30 AM IST</strong> and runs 24 hours continuously until <strong className="text-[#ffd700]">tomorrow 11:30 AM IST</strong>.
            </span>
          )}
        </p>

        {/* The Digital Clock */}
        {timerState.isConcluded ? (
          <div className="bg-[#1c150c] border-4 border-[#ffd700] rounded-3xl p-6 sm:p-10 max-w-xl mx-auto shadow-[0_0_50px_#ffd700]">
            <Anchor className="w-12 h-12 sm:w-16 sm:h-16 text-[#ffd700] mx-auto mb-4 animate-bounce" />
            <h3 className="font-pirate text-3xl sm:text-5xl text-[#ffd700] uppercase">
              THE VOYAGE HAS CONCLUDED!
            </h3>
            <p className="font-cinzel text-xs sm:text-sm text-[#f4e6c3] mt-4">
              All 24 hours completed. Final jury deliberations and prize distribution underway!
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 px-2 mb-6">
              <AnimatedDigit value={String(timerState.days).padStart(2, '0')} label="DAYS" />
              <AnimatedDigit value={String(timerState.hours).padStart(2, '0')} label="HOURS" />
              <AnimatedDigit value={String(timerState.minutes).padStart(2, '0')} label="MINUTES" />
              <AnimatedDigit value={String(timerState.seconds).padStart(2, '0')} label="SECONDS" isSeconds />
            </div>

            {/* 24-Hour Progress Bar when Live */}
            {timerState.isHackingLive && (
              <div className="bg-[#061019]/90 border border-[#ffd700]/40 rounded-2xl p-4 sm:p-5 shadow-xl mb-6 text-left">
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-gray-400">TODAY 11:30 AM</span>
                  <span className="text-[#ffd700] font-bold">{Math.round(timerState.progressPercent)}% OF 24 HOURS ELAPSED</span>
                  <span className="text-[#00e5ff] font-bold">TOMORROW 11:30 AM</span>
                </div>
                <div className="h-3 w-full bg-[#03070b] border border-[#ffd700]/30 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#ff4500] transition-all duration-1000 shadow-[0_0_12px_#ffd700]"
                    style={{ width: `${timerState.progressPercent}%` }}
                  />
                </div>
              </div>
            )}

          </div>
        )}

        {/* Real-time Waveform Canvas */}
        <div className="mt-8">
          <CyberEnergyMatrixCanvas />
        </div>
      </div>
    </section>
  );
};

export default CountdownSection;
