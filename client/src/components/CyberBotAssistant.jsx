import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, MessageSquare, Terminal, Heart, Trophy, Flame, Skull, Compass } from 'lucide-react';
import { playLaserBlip, playVictoryFanfare } from '../utils/cyberSound';

const dialogues = [
  "🏴‍☠️ AHOY MATEY! Ready to plunder the Upto ₹50,000+ Cash Prize?",
  "☕ Midnight grog & tavern lounge waiting on deck!",
  "💎 Shiver me timbers! Free Internship in the treasure vault!",
  "🔥 24 Hours of high-seas coding power incoming!",
  "🧭 Tip: Click on me to spin Jack's magical compass!",
  "🏆 Top pirate crews qualify for grand booty & awards!",
  "🎮 Check out the quick reflex duel in the Pirates Tavern!",
];

const CyberBotAssistant = () => {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isSparking, setIsSparking] = useState(false);

  // Periodic speech bubble popup
  useEffect(() => {
    const interval = setInterval(() => {
      setDialogueIndex((prev) => (prev + 1) % dialogues.length);
      setIsOpen(true);
      const timer = setTimeout(() => setIsOpen(false), 5500);
      return () => clearTimeout(timer);
    }, 14000);

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
    <div className="fixed bottom-20 right-4 sm:bottom-8 sm:right-8 z-40 flex flex-col items-end select-none">
      {/* Speech Bubble Speech Cloud */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.85 }}
            transition={{ duration: 0.3 }}
            className="mb-3 max-w-[220px] sm:max-w-xs bg-[#08121a]/98 border-2 border-[#ffd700] p-3 sm:p-3.5 rounded-2xl rounded-br-none text-xs font-cinzel text-white shadow-[0_0_25px_rgba(229,193,88,0.5)] backdrop-blur-md relative hud-corner-box"
          >
            <div className="flex items-center space-x-2 text-[#ffd700] font-bold text-[10px] uppercase mb-1">
              <img
                src="/pirate-skeleton-face.png"
                alt="Skeleton"
                className="w-4 h-4 rounded-full border border-[#ffd700] object-cover shadow-[0_0_6px_#ffd700]"
              />
              <span>CAPTAIN JACK // COMPANION</span>
            </div>
            <p className="font-cinzel text-xs text-[#f4e6c3] leading-snug">
              {dialogues[dialogueIndex]}
            </p>
            {/* Triangular Speech Pointer */}
            <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-[#ffd700] border-r-[8px] border-r-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Pirate Mascot */}
      <motion.div
        animate={{
          y: [0, -8, 0],
          rotate: isSparking ? [0, -10, 10, -5, 5, 0] : [0, 2, -2, 0],
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
        <div className="absolute -inset-2 bg-[#ffd700]/20 rounded-full blur-xl group-hover:bg-[#ffd700]/40 transition-all duration-300 pointer-events-none" />

        {/* Animated Pirate Mascot with Original Codienych Skeleton */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-[#1c1409] via-[#0b121a] to-[#04080e] border-2 border-[#ffd700] p-1 flex items-center justify-center shadow-[0_0_20px_rgba(229,193,88,0.55)] group-hover:shadow-[0_0_35px_#ffd700] group-hover:scale-110 active:scale-95 transition-all overflow-hidden relative hud-corner-box">
          <img
            src="/pirate-skeleton-face.png"
            alt="Captain Jack Pirate Skeleton"
            className="w-full h-full object-cover rounded-xl filter drop-shadow-[0_0_10px_rgba(255,215,0,0.4)] transition-transform duration-300 group-hover:scale-110"
          />
          {/* Subtle Ambient Golden Shimmer */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#ffd700]/15 via-transparent to-transparent pointer-events-none rounded-xl" />
        </div>

        {/* Status Indicator Badge with Ping */}
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffd700] opacity-75" />
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#ffd700] border-2 border-[#020508] shadow-[0_0_8px_#ffd700]" />
        </span>
      </motion.div>
    </div>
  );
};

export default CyberBotAssistant;
