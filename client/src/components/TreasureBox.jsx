import React, { useState, useEffect } from 'react';
import { Sparkles, Trophy, Briefcase, GraduationCap, RotateCcw, Gem, Key, Shield, Star, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playVictoryFanfare, playLaserBlip, playChirp } from '../utils/cyberSound';

const TreasureBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);
    playLaserBlip();

    setTimeout(() => {
      setIsOpening(false);
      setIsOpen(true);
      playVictoryFanfare();
    }, 900);
  };

  const handleReset = (e) => {
    e.stopPropagation();
    playChirp();
    setIsOpen(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-10 text-center px-4">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="closed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            onClick={handleOpen}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -6 }}
            whileTap={{ scale: 0.97 }}
            className={`relative group cursor-pointer bg-gradient-to-b from-[#091f13] via-[#05140b] to-[#020905] border-2 border-[#00ff66]/70 hover:border-[#00ff66] rounded-3xl p-8 sm:p-14 shadow-[0_0_40px_rgba(0,255,102,0.25)] hover:shadow-[0_0_70px_rgba(0,255,102,0.6)] transition-all duration-500 overflow-hidden select-none hud-corner-box ${
              isOpening ? 'scale-95 animate-pulse' : ''
            }`}
          >
            {/* Ambient gold-green treasure glow behind the box */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff66]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#00ff66]/15 rounded-full blur-3xl pointer-events-none" />

            {/* 3D Isometric Cyber Treasure Chest Representation */}
            <div className="relative mx-auto w-56 h-44 sm:w-64 sm:h-52 mb-6 flex items-center justify-center">
              
              {/* Floating Ray Particles */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="absolute top-2 left-6 text-yellow-400 text-sm animate-ping">✨</span>
                <span className="absolute top-6 right-8 text-[#00ff66] text-xs animate-pulse">💎</span>
                <span className="absolute bottom-4 left-10 text-emerald-300 text-xs animate-bounce">⚡</span>
              </div>

              {/* 3D Perspective Vector Chest Box */}
              <motion.div
                animate={
                  isOpening
                    ? {
                        rotateX: [0, -20, 10, -30, 0],
                        scale: [1, 1.08, 0.95, 1.12, 1],
                        filter: ['drop-shadow(0 0 20px #00ff66)', 'drop-shadow(0 0 60px #00ff66)'],
                      }
                    : {
                        y: [0, -8, 0],
                        rotateY: isHovered ? [0, 8, -8, 0] : [0, 4, -4, 0],
                      }
                }
                transition={{
                  duration: isOpening ? 0.8 : 4,
                  repeat: isOpening ? 1 : Infinity,
                  ease: 'easeInOut',
                }}
                className="w-full h-full relative"
                style={{ perspective: 1000 }}
              >
                <svg viewBox="0 0 300 240" className="w-full h-full drop-shadow-[0_15px_30px_rgba(0,255,102,0.4)]">
                  <defs>
                    <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#082b17" />
                      <stop offset="50%" stopColor="#051a0e" />
                      <stop offset="100%" stopColor="#020d07" />
                    </linearGradient>

                    <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#fef08a" />
                      <stop offset="40%" stopColor="#00ff66" />
                      <stop offset="80%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#fef08a" />
                    </linearGradient>

                    <radialGradient id="lockGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="50%" stopColor="#00ff66" />
                      <stop offset="100%" stopColor="#05140b" />
                    </radialGradient>
                  </defs>

                  {/* Chest Bottom Base */}
                  <path d="M40 120 L260 120 L240 210 L60 210 Z" fill="url(#woodGrad)" stroke="#00ff66" strokeWidth="3" />

                  {/* Corner Metal Reinforced Brackets */}
                  <path d="M40 120 L65 120 L60 210 L40 210 Z" fill="url(#goldTrim)" />
                  <path d="M235 120 L260 120 L260 210 L240 210 Z" fill="url(#goldTrim)" />
                  <path d="M135 120 L165 120 L165 210 L135 210 Z" fill="url(#goldTrim)" />

                  {/* Decorative Rivets */}
                  <circle cx="52" cy="135" r="3" fill="#ffffff" />
                  <circle cx="50" cy="195" r="3" fill="#ffffff" />
                  <circle cx="248" cy="135" r="3" fill="#ffffff" />
                  <circle cx="250" cy="195" r="3" fill="#ffffff" />
                  <circle cx="150" cy="135" r="3" fill="#ffffff" />
                  <circle cx="150" cy="195" r="3" fill="#ffffff" />

                  {/* Chest 3D Curved Lid (Top) */}
                  <path
                    d="M35 120 Q150 40 265 120 L250 85 Q150 20 50 85 Z"
                    fill="url(#woodGrad)"
                    stroke="#00ff66"
                    strokeWidth="3.5"
                  />
                  {/* Top Lid Gold Trim Straps */}
                  <path d="M35 120 Q150 40 265 120 L260 108 Q150 32 40 108 Z" fill="url(#goldTrim)" />
                  <path d="M135 110 Q150 35 165 110 Z" fill="url(#goldTrim)" />

                  {/* Heavy Cyber Central Keyhole Lock */}
                  <rect x="130" y="105" width="40" height="48" rx="8" fill="#020905" stroke="url(#goldTrim)" strokeWidth="3" />
                  <circle cx="150" cy="122" r="7" fill="url(#lockGlow)" className="animate-pulse" />
                  <polygon points="146,122 154,122 152,142 148,142" fill="#00ff66" />
                </svg>
              </motion.div>
            </div>

            <h3 className="relative z-10 font-orbitron font-extrabold text-2xl sm:text-4xl text-white mb-2 tracking-wider drop-shadow-md">
              MYSTERY <span className="text-[#00ff66] neon-glow-green">TREASURE VAULT</span>
            </h3>
            <p className="relative z-10 font-mono text-xs sm:text-sm text-[#10b981] mb-6 uppercase tracking-widest">
              TAP THE CHEST TO UNLOCK CASH BOUNTIES & INTERNSHIPS
            </p>

            <button
              type="button"
              className="relative z-10 px-8 py-3.5 sm:px-10 sm:py-4 rounded-2xl font-orbitron font-black text-sm text-black bg-[#00ff66] hover:bg-[#10b981] hover:text-white transition-all duration-300 shadow-[0_0_25px_#00ff66] hover:shadow-[0_0_45px_#00ff66] uppercase tracking-wider active:scale-95 flex items-center space-x-2 mx-auto"
            >
              <Key className="w-4 h-4" />
              <span>{isOpening ? 'UNLOCKING CIPHER VAULT...' : 'TAP TO UNLOCK CHEST'}</span>
            </button>
          </motion.div>
        ) : (
          /* Revealed State Inside Chest */
          <motion.div
            key="open"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-gradient-to-b from-[#0f2e1a] via-[#081b10] to-[#040e08] border-2 border-[#00ff66] rounded-3xl p-6 sm:p-10 shadow-[0_0_70px_rgba(0,255,102,0.6)] text-left hud-corner-box overflow-hidden"
          >
            {/* Top Vault Header */}
            <div className="flex items-center justify-between border-b border-[#00ff66]/30 pb-4 mb-6">
              <div className="inline-flex items-center space-x-2 bg-[#00ff66]/15 border border-[#00ff66] px-4 py-1.5 rounded-full text-xs font-mono text-[#00ff66] uppercase tracking-widest shadow-[0_0_15px_rgba(0,255,102,0.4)]">
                <Sparkles className="w-4 h-4 text-[#00ff66] animate-pulse" />
                <span>TREASURE VAULT OPENED • BOUNTIES REVEALED</span>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center space-x-1.5 font-mono text-xs text-gray-300 hover:text-[#00ff66] transition-colors bg-[#050b07] border border-gray-800 hover:border-[#00ff66] px-3.5 py-1.5 rounded-xl active:scale-95 shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-lock Chest</span>
              </button>
            </div>

            {/* Main Prize Reveal Content */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="text-center mb-8"
            >
              <div className="mx-auto w-20 h-20 mb-4 bg-gradient-to-tr from-[#00ff66] to-yellow-300 rounded-2xl flex items-center justify-center shadow-[0_0_35px_#00ff66] text-black">
                <Trophy className="w-11 h-11 animate-bounce" />
              </div>
              <h3 className="font-orbitron font-black text-2xl sm:text-4xl text-white tracking-wide">
                SURPRISE <span className="text-[#00ff66] neon-glow-green">CASH PRIZES & BOUNTIES</span>
              </h3>
              <p className="font-mono text-xs sm:text-sm text-[#10b981] uppercase tracking-widest mt-2">
                GRAND PRIZE POOL TO BE REVEALED AT OPENING CEREMONY!
              </p>
            </motion.div>

            {/* FREE INTERNSHIP INSIDE THE TREASURE BOX */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-gradient-to-r from-[#00ff66]/20 via-[#0a2315] to-[#00ff66]/15 border-2 border-[#00ff66] rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(0,255,102,0.3)] relative overflow-hidden mb-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#050b07] border border-[#00ff66] flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(0,255,102,0.4)]">
                    <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-[#00ff66]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] sm:text-xs text-[#00ff66] font-bold uppercase tracking-wider">
                        🔥 EXCLUSIVE VAULT PERK
                      </span>
                    </div>
                    <h4 className="font-orbitron font-extrabold text-lg sm:text-xl text-white">
                      FREE INTERNSHIP <span className="text-[#00ff66]">OPPORTUNITY</span>
                    </h4>
                    <p className="font-mono text-xs text-gray-300 mt-0.5">
                      Winning teams & top performers receive direct Free Internship offers for hands-on industry experience!
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
                  <div className="bg-[#050b07] border border-[#00ff66]/40 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 font-mono text-[11px] text-[#00ff66]">
                    <GraduationCap className="w-3.5 h-3.5 text-[#00ff66]" />
                    <span>Real-World Projects</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="text-center font-mono text-xs text-gray-400">
              Individual 1st, 2nd & 3rd prize breakdowns will be announced during the Grand Opening!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TreasureBox;
