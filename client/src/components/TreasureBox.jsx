import React, { useState } from 'react';
import { Sparkles, Trophy, Briefcase, GraduationCap, RotateCcw, Gem, Key, Shield, Star, Coins, Skull, Swords } from 'lucide-react';
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
            className={`relative group cursor-pointer bg-gradient-to-b from-[#1c1409] via-[#0f1b26] to-[#04080d] border-2 border-[#e5c158]/80 hover:border-[#ffd700] rounded-3xl p-8 sm:p-14 shadow-[0_0_40px_rgba(229,193,88,0.25)] hover:shadow-[0_0_70px_rgba(255,215,0,0.6)] transition-all duration-500 overflow-hidden select-none hud-corner-box ${
              isOpening ? 'scale-95 animate-pulse' : ''
            }`}
          >
            {/* Ambient gold treasure glow behind the box */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ffd700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#ffd700]/20 rounded-full blur-3xl pointer-events-none" />

            {/* 3D Isometric Pirate Treasure Chest Representation */}
            <div className="relative mx-auto w-56 h-44 sm:w-64 sm:h-52 mb-6 flex items-center justify-center">
              
              {/* Floating Ray Particles */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="absolute top-2 left-6 text-yellow-300 text-base animate-ping">✨</span>
                <span className="absolute top-6 right-8 text-[#00e5ff] text-sm animate-pulse">💎</span>
                <span className="absolute bottom-4 left-10 text-amber-400 text-base animate-bounce">🪙</span>
              </div>

              {/* 3D Perspective Pirate Chest Box */}
              <motion.div
                animate={
                  isOpening
                    ? {
                        rotateX: [0, -20, 10, -30, 0],
                        scale: [1, 1.08, 0.95, 1.12, 1],
                        filter: ['drop-shadow(0 0 20px #ffd700)', 'drop-shadow(0 0 60px #ffd700)'],
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
                <svg viewBox="0 0 300 240" className="w-full h-full drop-shadow-[0_15px_30px_rgba(229,193,88,0.4)]">
                  <defs>
                    <linearGradient id="pirateWoodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4a3014" />
                      <stop offset="50%" stopColor="#2c1a08" />
                      <stop offset="100%" stopColor="#140a02" />
                    </linearGradient>

                    <linearGradient id="pirateGoldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#fff2a3" />
                      <stop offset="35%" stopColor="#ffd700" />
                      <stop offset="70%" stopColor="#b8860b" />
                      <stop offset="100%" stopColor="#fff2a3" />
                    </linearGradient>

                    <radialGradient id="skullGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffffff" />
                      <stop offset="50%" stopColor="#ffd700" />
                      <stop offset="100%" stopColor="#2c1a08" />
                    </radialGradient>
                  </defs>

                  {/* Chest Bottom Base (Aged Mahogany Wood) */}
                  <path d="M40 120 L260 120 L240 210 L60 210 Z" fill="url(#pirateWoodGrad)" stroke="#e5c158" strokeWidth="3" />

                  {/* Corner Metal Reinforced Brackets */}
                  <path d="M40 120 L65 120 L60 210 L40 210 Z" fill="url(#pirateGoldTrim)" />
                  <path d="M235 120 L260 120 L260 210 L240 210 Z" fill="url(#pirateGoldTrim)" />
                  <path d="M135 120 L165 120 L165 210 L135 210 Z" fill="url(#pirateGoldTrim)" />

                  {/* Decorative Pirate Gold Rivets */}
                  <circle cx="52" cy="135" r="3" fill="#ffffff" />
                  <circle cx="50" cy="195" r="3" fill="#ffffff" />
                  <circle cx="248" cy="135" r="3" fill="#ffffff" />
                  <circle cx="250" cy="195" r="3" fill="#ffffff" />
                  <circle cx="150" cy="135" r="3" fill="#ffffff" />
                  <circle cx="150" cy="195" r="3" fill="#ffffff" />

                  {/* Chest 3D Curved Lid (Top) */}
                  <path
                    d="M35 120 Q150 40 265 120 L250 85 Q150 20 50 85 Z"
                    fill="url(#pirateWoodGrad)"
                    stroke="#e5c158"
                    strokeWidth="3.5"
                  />
                  {/* Top Lid Gold Straps */}
                  <path d="M35 120 Q150 40 265 120 L260 108 Q150 32 40 108 Z" fill="url(#pirateGoldTrim)" />
                  <path d="M135 110 Q150 35 165 110 Z" fill="url(#pirateGoldTrim)" />

                  {/* Heavy Skull Keyhole Lock */}
                  <rect x="130" y="105" width="40" height="48" rx="8" fill="#0d0803" stroke="url(#pirateGoldTrim)" strokeWidth="3" />
                  <circle cx="150" cy="122" r="7" fill="url(#skullGlow)" className="animate-pulse" />
                  <polygon points="146,122 154,122 152,142 148,142" fill="#ffd700" />
                </svg>
              </motion.div>
            </div>

            <h3 className="relative z-10 font-pirate text-3xl sm:text-5xl text-white mb-2 tracking-wider drop-shadow-md">
              DAVY JONES' <span className="text-[#ffd700] pirate-gold-title">CURSED TREASURE CHEST</span>
            </h3>
            <p className="relative z-10 font-cinzel text-xs sm:text-sm text-[#cfb07a] mb-6 uppercase tracking-widest font-semibold">
              TAP THE CHEST TO UNLOCK CASH BOUNTIES & INTERNSHIPS
            </p>

            <button
              type="button"
              className="relative z-10 px-8 py-3.5 sm:px-10 sm:py-4 rounded-2xl font-pirate text-xl sm:text-2xl text-black bg-gradient-to-r from-[#ffd700] via-[#e5c158] to-[#b8860b] hover:from-[#fff2a3] hover:to-[#ffd700] transition-all duration-300 shadow-[0_0_25px_#ffd700] hover:shadow-[0_0_45px_#ffd700] uppercase tracking-wider active:scale-95 flex items-center space-x-2 mx-auto font-bold"
            >
              <Key className="w-5 h-5" />
              <span>{isOpening ? 'UNLOCKING PIRATE VAULT...' : 'TAP TO UNLOCK CHEST'}</span>
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
            className="relative bg-gradient-to-b from-[#241a0e] via-[#122330] to-[#04090e] border-2 border-[#ffd700] rounded-3xl p-6 sm:p-10 shadow-[0_0_70px_rgba(229,193,88,0.6)] text-left hud-corner-box overflow-hidden"
          >
            {/* Top Vault Header */}
            <div className="flex items-center justify-between border-b border-[#e5c158]/40 pb-4 mb-6">
              <div className="inline-flex items-center space-x-2 bg-[#ffd700]/15 border border-[#ffd700] px-4 py-1.5 rounded-full text-xs font-cinzel text-[#ffd700] uppercase tracking-widest shadow-[0_0_15px_rgba(229,193,88,0.4)] font-bold">
                <Sparkles className="w-4 h-4 text-[#ffd700] animate-pulse" />
                <span>PIRATE VAULT UNSEALED • BOUNTIES REVEALED</span>
              </div>

              <button
                onClick={handleReset}
                className="flex items-center space-x-1.5 font-cinzel text-xs text-gray-300 hover:text-[#ffd700] transition-colors bg-[#08121a] border border-[#3b2b19] hover:border-[#ffd700] px-3.5 py-1.5 rounded-xl active:scale-95 shadow-md"
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
              <div className="mx-auto w-20 h-20 mb-4 bg-gradient-to-tr from-[#ffd700] to-amber-500 rounded-2xl flex items-center justify-center shadow-[0_0_35px_#ffd700] text-black">
                <Trophy className="w-11 h-11 animate-bounce" />
              </div>
              <h3 className="font-pirate text-3xl sm:text-5xl text-white tracking-wide">
                SURPRISE <span className="text-[#ffd700] pirate-gold-title">CASH BOUNTIES & PLUNDER</span>
              </h3>
              <p className="font-cinzel text-xs sm:text-sm text-[#e5c158] uppercase tracking-widest mt-2 font-bold">
                GRAND BOUNTY POOL TO BE UNVEILED AT OPENING CEREMONY!
              </p>
            </motion.div>

            {/* FREE INTERNSHIP INSIDE THE TREASURE BOX */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-gradient-to-r from-[#ffd700]/20 via-[#1e2a18] to-[#00e5ff]/20 border-2 border-[#ffd700] rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(229,193,88,0.3)] relative overflow-hidden mb-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#08121a] border border-[#ffd700] flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(229,193,88,0.4)]">
                    <Briefcase className="w-6 h-6 sm:w-7 sm:h-7 text-[#ffd700]" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-cinzel text-[10px] sm:text-xs text-[#ffd700] font-bold uppercase tracking-wider">
                        👑 EXCLUSIVE PIRATE VAULT PERK
                      </span>
                    </div>
                    <h4 className="font-pirate text-2xl sm:text-3xl text-white">
                      FREE INTERNSHIP <span className="text-[#ffd700]">OPPORTUNITY</span>
                    </h4>
                    <p className="font-cinzel text-xs text-gray-200 mt-0.5">
                      Winning pirate crews & top performers receive direct Free Internship offers for real-world hands-on project experience!
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
                  <div className="bg-[#08121a] border border-[#ffd700]/50 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 font-cinzel text-[11px] text-[#ffd700]">
                    <GraduationCap className="w-3.5 h-3.5 text-[#ffd700]" />
                    <span>Real-World Projects</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="text-center font-cinzel text-xs text-gray-300">
              Individual 1st, 2nd & 3rd prize breakdowns will be proclaimed during the Grand Opening Ceremony!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TreasureBox;
