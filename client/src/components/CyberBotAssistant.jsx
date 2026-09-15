import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, MessageSquare, Terminal, Heart, Trophy, Flame } from 'lucide-react';
import { playLaserBlip, playChirp, playVictoryFanfare } from '../utils/cyberSound';

const dialogues = [
  "⚡ HEY HACKER! Ready to claim the ₹₹ Cash Bounty?",
  "☕ Midnight coffee & Chill lounge waiting for you!",
  "🚀 Don't forget: Free Internship up for grabs!",
  "🔥 24 Hours of non-stop code power incoming!",
  "💡 Tip: Click on me to charge up my laser battery!",
  "🏆 Top performers qualify for spot goodie kits!",
  "🎮 Check out the 5-Sec reflex mini-game in Fun Zone!",
];

const CyberBotAssistant = () => {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [energyLevel, setEnergyLevel] = useState(100);
  const [isSparking, setIsSparking] = useState(false);
  const [botMood, setBotMood] = useState('happy'); // 'happy' | 'super' | 'chill'

  // Periodic speech bubble popup
  useEffect(() => {
    const interval = setInterval(() => {
      setDialogueIndex((prev) => (prev + 1) % dialogues.length);
      setIsOpen(true);
      const timer = setTimeout(() => setIsOpen(false), 5000);
      return () => clearTimeout(timer);
    }, 14000);

    return () => clearInterval(interval);
  }, []);

  const handleBotClick = () => {
    playLaserBlip();
    setIsSparking(true);
    setDialogueIndex((prev) => (prev + 1) % dialogues.length);
    setIsOpen(true);
    setEnergyLevel((prev) => Math.min(prev + 15, 150));

    if (energyLevel > 130) {
      playVictoryFanfare();
      setBotMood('super');
    }

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
            className="mb-3 max-w-[220px] sm:max-w-xs bg-[#06180e]/95 border-2 border-[#00ff66] p-3 sm:p-3.5 rounded-2xl rounded-br-none text-xs font-mono text-white shadow-[0_0_25px_rgba(0,255,102,0.4)] backdrop-blur-md relative hud-corner-box"
          >
            <div className="flex items-center space-x-1.5 text-[#00ff66] font-bold text-[10px] uppercase mb-1">
              <Sparkles className="w-3 h-3 text-[#00ff66] animate-pulse" />
              <span>N.E.O. // AI COMPANION</span>
            </div>
            <p className="font-sans text-xs text-gray-200 leading-snug">
              {dialogues[dialogueIndex]}
            </p>
            {/* Triangular Speech Pointer */}
            <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-[8px] border-l-transparent border-t-[8px] border-t-[#00ff66] border-r-[8px] border-r-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Cartoon Robot Character Body */}
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
        data-cursor-text="TAP BOT"
        className="relative cursor-pointer group"
      >
        {/* Hover Energy Aura */}
        <div className="absolute -inset-2 bg-[#00ff66]/20 rounded-full blur-xl group-hover:bg-[#00ff66]/40 transition-all duration-300 pointer-events-none" />

        {/* Animated Cyber Mascot SVG */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-[#0e331b] via-[#092212] to-[#040f08] border-2 border-[#00ff66] p-2 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,102,0.5)] group-hover:shadow-[0_0_35px_#00ff66] group-hover:scale-110 active:scale-95 transition-all">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Robot Head Antenna */}
            <line x1="50" y1="20" x2="50" y2="8" stroke="#00ff66" strokeWidth="3" strokeLinecap="round" />
            <circle cx="50" cy="7" r="4" fill="#00ff66" className="animate-ping" />
            <circle cx="50" cy="7" r="3" fill="#ffffff" />

            {/* Head Helmet */}
            <rect x="20" y="20" width="60" height="50" rx="16" fill="#061f10" stroke="#00ff66" strokeWidth="3" />

            {/* Visor Screen */}
            <rect x="28" y="32" width="44" height="24" rx="8" fill="#020a05" stroke="#10b981" strokeWidth="1.5" />

            {/* Animated Cyber Expressive Eyes */}
            {botMood === 'super' ? (
              <>
                <path d="M35 44 L43 40 L35 48 Z" fill="#00ff66" />
                <path d="M65 44 L57 40 L65 48 Z" fill="#00ff66" />
              </>
            ) : isSparking ? (
              <>
                <path d="M34 44 L44 44" stroke="#00ff66" strokeWidth="3" strokeLinecap="round" />
                <path d="M56 44 L66 44" stroke="#00ff66" strokeWidth="3" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="38" cy="44" r="4.5" fill="#00ff66" className="animate-pulse" />
                <circle cx="62" cy="44" r="4.5" fill="#00ff66" className="animate-pulse" />
                <circle cx="39.5" cy="42.5" r="1.5" fill="#ffffff" />
                <circle cx="63.5" cy="42.5" r="1.5" fill="#ffffff" />
              </>
            )}

            {/* Cute Mouth */}
            <path d="M44 60 Q50 64 56 60" stroke="#00ff66" strokeWidth="2" strokeLinecap="round" fill="none" />

            {/* Ear audio receptors */}
            <rect x="14" y="38" width="6" height="14" rx="3" fill="#00ff66" />
            <rect x="80" y="38" width="6" height="14" rx="3" fill="#00ff66" />

            {/* Body base */}
            <path d="M30 70 L25 88 L75 88 L70 70 Z" fill="#082915" stroke="#00ff66" strokeWidth="2.5" />
            <circle cx="50" cy="79" r="3" fill="#00ff66" />
          </svg>
        </div>

        {/* Small Status Badge */}
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#00ff66] border-2 border-[#050b07] shadow-[0_0_8px_#00ff66]" />
      </motion.div>
    </div>
  );
};

export default CyberBotAssistant;
