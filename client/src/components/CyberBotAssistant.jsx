import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, MessageSquare, Terminal, Heart, Trophy, Flame, Skull, Compass } from 'lucide-react';
import { playLaserBlip, playVictoryFanfare } from '../utils/cyberSound';

const dialogues = [
  "🏴‍☠️ AHOY MATEY! Ready to plunder the ₹₹ Cash Bounty?",
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
            <div className="flex items-center space-x-1.5 text-[#ffd700] font-bold text-[10px] uppercase mb-1">
              <Skull className="w-3.5 h-3.5 text-[#ffd700] animate-pulse" />
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

        {/* Animated Pirate Mascot SVG */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-[#241a0e] via-[#140e06] to-[#04080e] border-2 border-[#ffd700] p-2 flex items-center justify-center shadow-[0_0_20px_rgba(229,193,88,0.5)] group-hover:shadow-[0_0_35px_#ffd700] group-hover:scale-110 active:scale-95 transition-all">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Pirate Tricorn Hat */}
            <path d="M15 35 Q50 15 85 35 Q50 25 15 35 Z" fill="#140e06" stroke="#ffd700" strokeWidth="2" />
            <polygon points="50,15 20,35 80,35" fill="#1c150c" stroke="#ffd700" strokeWidth="2" />
            <circle cx="50" cy="27" r="4" fill="#ffd700" />

            {/* Pirate Skull Head */}
            <circle cx="50" cy="50" r="18" fill="#f4e6c3" stroke="#8a6d1b" strokeWidth="2" />
            {/* Eye Patch on Left Eye */}
            <circle cx="43" cy="48" r="5" fill="#04080e" stroke="#000" strokeWidth="1" />
            <line x1="30" y1="38" x2="56" y2="58" stroke="#04080e" strokeWidth="1.5" />
            {/* Right Glowing Eye */}
            <circle cx="57" cy="48" r="4" fill="#00e5ff" className="animate-pulse" />
            <circle cx="57" cy="48" r="2" fill="#ffffff" />
            
            {/* Crimson Pirate Bandana */}
            <path d="M32 40 Q50 36 68 40 L68 44 Q50 40 32 44 Z" fill="#dc2626" />

            {/* Pirate Smirk */}
            <path d="M44 58 Q50 62 56 57" stroke="#3b2b19" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Gold Tooth */}
            <rect x="49" y="58" width="3" height="3" fill="#ffd700" />

            {/* Crossed Cutlasses Base */}
            <line x1="25" y1="75" x2="75" y2="85" stroke="#ffd700" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="75" y1="75" x2="25" y2="85" stroke="#ffd700" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Small Status Badge */}
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#ffd700] border-2 border-[#020508] shadow-[0_0_8px_#ffd700]" />
      </motion.div>
    </div>
  );
};

export default CyberBotAssistant;
