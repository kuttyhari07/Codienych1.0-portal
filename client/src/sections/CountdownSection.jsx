import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, Zap, Anchor } from 'lucide-react';
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
        <div className="inline-flex items-center space-x-2 font-cinzel font-bold text-xs text-[#ffd700] tracking-widest uppercase mb-2 bg-[#ffd700]/10 px-3 py-1 rounded-full border border-[#ffd700]/30">
          <Compass className="w-3.5 h-3.5 text-[#ffd700]" />
          <span>// NAUTICAL SHIP CHRONOMETER</span>
        </div>
        <h2 className="font-pirate text-3xl sm:text-5xl md:text-6xl text-white mb-6 sm:mb-8 tracking-wide">
          COUNTDOWN TO <span className="text-[#ffd700] pirate-gold-title">EXPEDITION EMBARKATION</span>
        </h2>

        {timeLeft.isLive ? (
          <div className="bg-[#1c150c] border-4 border-[#ffd700] rounded-3xl p-6 sm:p-10 max-w-xl mx-auto shadow-[0_0_50px_#ffd700] animate-pulse">
            <Anchor className="w-12 h-12 sm:w-16 sm:h-16 text-[#ffd700] mx-auto mb-4 animate-bounce" />
            <h3 className="font-pirate text-3xl sm:text-5xl text-[#ffd700] uppercase">
              THE VOYAGE IS LIVE!
            </h3>
            <p className="font-cinzel text-xs sm:text-sm text-[#f4e6c3] mt-4">
              The 24-hour high seas coding expedition has officially commenced!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 max-w-3xl mx-auto px-2">
            <AnimatedDigit value={String(timeLeft.days).padStart(2, '0')} label="DAYS" />
            <AnimatedDigit value={String(timeLeft.hours).padStart(2, '0')} label="HOURS" />
            <AnimatedDigit value={String(timeLeft.minutes).padStart(2, '0')} label="MINUTES" />
            <AnimatedDigit value={String(timeLeft.seconds).padStart(2, '0')} label="SECONDS" isSeconds />
          </div>
        )}

        {/* Real-time Waveform Canvas */}
        <CyberEnergyMatrixCanvas />
      </div>
    </section>
  );
};

export default CountdownSection;
