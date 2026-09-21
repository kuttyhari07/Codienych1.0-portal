import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { playLaserBlip } from '../utils/cyberSound';

const dialogues = [
  "🏴‍☠️ AHOY! Plunder Upto ₹50K+ Cash Prize!",
  "☕ Midnight coffee & lounge waiting on deck!",
  "💎 Free Internship in the treasure vault!",
  "🔥 24 Hours of high-seas coding power!",
  "🧭 Tip: Click on me to spin Jack's compass!",
  "⚔️ Top pirate crews qualify for grand booty!",
  "🎮 Check out the duel in Pirates Tavern!",
];

const CyberBotAssistant = () => {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isSparking, setIsSparking] = useState(false);

  // Periodic speech bubble popup (less frequent & shorter on phone to avoid disturbance)
  useEffect(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const intervalTime = isMobile ? 30000 : 16000;

    const interval = setInterval(() => {
      setDialogueIndex((prev) => (prev + 1) % dialogues.length);
      setIsOpen(true);
      const timer = setTimeout(() => setIsOpen(false), isMobile ? 3200 : 5000);
      return () => clearTimeout(timer);
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  const handleBotClick = () => {
    playLaserBlip();
    setIsSparking(true);
    setDialogueIndex((prev) => (prev + 1) % dialogues.length);
    setIsOpen(true);

    setTimeout(() => setIsSparking(false), 600);
  };

  return (
    <div className="fixed bottom-14 right-2.5 sm:bottom-8 sm:right-8 z-40 flex flex-col items-end select-none pointer-events-auto">
      {/* Speech Bubble Speech Cloud */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.85 }}
            transition={{ duration: 0.25 }}
            className="mb-2 max-w-[170px] sm:max-w-xs bg-[#08121a]/98 border sm:border-2 border-[#ffd700] p-2 sm:p-3 rounded-xl sm:rounded-2xl rounded-br-none text-xs font-cinzel text-white shadow-[0_0_20px_rgba(229,193,88,0.4)] backdrop-blur-md relative hud-corner-box"
          >
            <div className="flex items-center justify-between text-[#ffd700] font-bold text-[9px] sm:text-[10px] uppercase mb-1">
              <div className="flex items-center space-x-1 sm:space-x-1.5 truncate">
                <img
                  src="/pirate-skeleton-face.png"
                  alt="Skeleton"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-[#ffd700] object-cover flex-shrink-0"
                />
                <span className="truncate">CAPTAIN JACK</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
                className="text-gray-400 hover:text-[#ffd700] p-0.5 ml-1 transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <p className="font-cinzel text-[10px] sm:text-xs text-[#f4e6c3] leading-snug">
              {dialogues[dialogueIndex]}
            </p>
            {/* Triangular Speech Pointer */}
            <div className="absolute -bottom-2 right-3 sm:right-4 w-0 h-0 border-l-[6px] sm:border-l-[8px] border-l-transparent border-t-[6px] sm:border-t-[8px] border-t-[#ffd700] border-r-[6px] sm:border-r-[8px] border-r-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Pirate Mascot */}
      <motion.div
        animate={{
          y: [0, -5, 0],
          rotate: isSparking ? [0, -8, 8, -4, 4, 0] : [0, 1.5, -1.5, 0],
        }}
        transition={{
          y: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: isSparking ? 0.5 : 4, repeat: isSparking ? 1 : Infinity },
        }}
        onClick={handleBotClick}
        data-cursor-text="TAP JACK"
        className="relative cursor-pointer group"
      >
        {/* Hover Energy Aura */}
        <div className="absolute -inset-1 sm:-inset-2 bg-[#ffd700]/20 rounded-full blur-lg group-hover:bg-[#ffd700]/40 transition-all duration-300 pointer-events-none" />

        {/* Animated Pirate Mascot with Original Codienych Skeleton */}
        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#1c1409] via-[#0b121a] to-[#04080e] border border-[#ffd700]/80 sm:border-2 sm:border-[#ffd700] p-0.5 sm:p-1 flex items-center justify-center shadow-[0_0_15px_rgba(229,193,88,0.45)] group-hover:shadow-[0_0_25px_#ffd700] group-hover:scale-105 active:scale-95 transition-all overflow-hidden relative hud-corner-box">
          <img
            src="/pirate-skeleton-face.png"
            alt="Captain Jack Pirate Skeleton"
            className="w-full h-full object-cover rounded-lg sm:rounded-xl filter drop-shadow-[0_0_8px_rgba(255,215,0,0.4)] transition-transform duration-300 group-hover:scale-110"
          />
          {/* Subtle Ambient Golden Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#ffd700]/15 via-transparent to-transparent pointer-events-none rounded-lg sm:rounded-xl" />
        </div>

        {/* Status Indicator Badge with Ping */}
        <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 flex h-2.5 w-2.5 sm:h-3.5 sm:w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffd700] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 bg-[#ffd700] border sm:border-2 border-[#020508] shadow-[0_0_6px_#ffd700]" />
        </span>
      </motion.div>
    </div>
  );
};

export default CyberBotAssistant;
