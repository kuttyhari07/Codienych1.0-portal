import React, { useState } from 'react';
import { Sparkles, Trophy, Briefcase, GraduationCap, RotateCcw, Gem, Key, Shield, Star, Coins, Skull, Swords } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playVictoryFanfare, playLaserBlip, playChirp } from '../utils/cyberSound';
import RealisticTreasureChest3DCanvas from './RealisticTreasureChest3DCanvas';

const TreasureBox = ({ isOpen: propIsOpen, onOpenChange }) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = propIsOpen !== undefined ? propIsOpen : internalIsOpen;
  const [isHovered, setIsHovered] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);
    playLaserBlip();

    setTimeout(() => {
      setIsOpening(false);
      if (onOpenChange) {
        onOpenChange(true);
      } else {
        setInternalIsOpen(true);
      }
      playVictoryFanfare();
    }, 900);
  };

  const handleReset = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    playChirp();
    if (onOpenChange) {
      onOpenChange(false);
    } else {
      setInternalIsOpen(false);
    }
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
            className={`relative group cursor-pointer bg-gradient-to-b from-[#1c1409] via-[#0f1b26] to-[#04080d] border-2 border-[#e5c158]/80 hover:border-[#ffd700] rounded-3xl p-6 sm:p-12 shadow-[0_0_40px_rgba(229,193,88,0.25)] hover:shadow-[0_0_70px_rgba(255,215,0,0.6)] transition-all duration-500 overflow-hidden select-none hud-corner-box ${
              isOpening ? 'scale-95 animate-pulse' : ''
            }`}
          >
            {/* Ambient gold treasure glow behind the box */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ffd700]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#ffd700]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Realistic 3D Interactive Pirate Treasure Chest Canvas */}
            <div className="relative mx-auto w-full max-w-md mb-4 sm:mb-6 flex items-center justify-center">
              <RealisticTreasureChest3DCanvas
                isOpen={false}
                isOpening={isOpening}
                isHovered={isHovered}
                onClick={handleOpen}
              />
            </div>

            <h3 className="relative z-10 font-pirate text-3xl sm:text-5xl text-white mb-2 tracking-wider drop-shadow-md">
              DAVY JONES' <span className="text-[#ffd700] pirate-gold-title">CURSED TREASURE CHEST</span>
            </h3>
            <p className="relative z-10 font-cinzel text-xs sm:text-sm text-[#cfb07a] mb-6 uppercase tracking-widest font-semibold">
              TAP THE 3D CHEST TO UNSEAL GRAND CASH PRIZES & FREE INTERNSHIPS
            </p>

            <button
              type="button"
              className="relative z-10 px-8 py-3.5 sm:px-10 sm:py-4 rounded-2xl font-pirate text-xl sm:text-2xl text-black bg-gradient-to-r from-[#ffd700] via-[#e5c158] to-[#b8860b] hover:from-[#fff2a3] hover:to-[#ffd700] transition-all duration-300 shadow-[0_0_25px_#ffd700] hover:shadow-[0_0_45px_#ffd700] uppercase tracking-wider active:scale-95 flex items-center space-x-2 mx-auto font-bold"
            >
              <Key className="w-5 h-5" />
              <span>{isOpening ? 'UNLOCKING PIRATE VAULT...' : 'TAP TO UNLOCK 3D CHEST'}</span>
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
            {/* 3D Open Chest Canvas in Revealed State */}
            <div className="relative mx-auto w-full max-w-xs -mt-4 mb-2">
              <RealisticTreasureChest3DCanvas
                isOpen={true}
                isOpening={false}
                isHovered={true}
                onClick={handleReset}
              />
            </div>
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
                CASH PRIZE <span className="text-[#ffd700] pirate-gold-title">UPTO ₹50,000+</span>
              </h3>
              <p className="font-cinzel text-xs sm:text-sm text-[#e5c158] uppercase tracking-widest mt-2 font-bold flex items-center justify-center flex-wrap gap-1.5">
                <span>+ EXCLUSIVE FREE INTERNSHIP OPPORTUNITIES BY</span>
                <span className="text-[#00e5ff] font-extrabold tracking-wider">amasQIS.ai</span>
                <span>FOR TOP CREWS!</span>
              </p>
            </motion.div>

            {/* FREE INTERNSHIP INSIDE THE TREASURE BOX */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-gradient-to-r from-[#ffd700]/20 via-[#102324] to-[#00e5ff]/25 border-2 border-[#ffd700] rounded-2xl p-5 sm:p-6 shadow-[0_0_35px_rgba(0,229,255,0.25)] relative overflow-hidden mb-6"
            >
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                <div className="flex items-start sm:items-center space-x-4">
                  <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-[#08121a] border-2 border-[#00e5ff]/60 hover:border-[#00e5ff] p-2 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(0,229,255,0.35)] transition-all">
                    <img 
                      src="/amasqis-icon.png" 
                      alt="amasQIS.ai" 
                      className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" 
                    />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-cinzel text-[10px] sm:text-xs text-[#ffd700] font-bold uppercase tracking-wider">
                        👑 EXCLUSIVE PIRATE VAULT PERK
                      </span>
                      <span className="text-gray-500 text-xs hidden sm:inline">•</span>
                      <span className="bg-[#00e5ff]/15 border border-[#00e5ff]/40 text-[#00e5ff] text-[10px] font-cinzel font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        OFFERED BY amasQIS.ai
                      </span>
                    </div>
                    <h4 className="font-pirate text-2xl sm:text-3xl text-white">
                      FREE INTERNSHIP <span className="text-[#ffd700]">OPPORTUNITY</span>
                    </h4>
                    <p className="font-cinzel text-xs text-gray-200 mt-1 max-w-xl">
                      Winning pirate crews & top performers receive direct Free Internship offers from <span className="text-[#00e5ff] font-bold">amasQIS.ai</span> (Official Jury Partner) for real-world hands-on project experience!
                    </p>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2.5 flex-shrink-0 w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-[#ffd700]/20">
                  <div className="bg-[#08121a]/95 border border-[#00e5ff]/50 hover:border-[#00e5ff] px-3.5 py-2 rounded-xl flex items-center space-x-2.5 shadow-[0_0_25px_rgba(0,229,255,0.25)] transition-all">
                    <div className="text-right">
                      <span className="block font-cinzel text-[9px] text-[#00e5ff] font-bold uppercase tracking-widest leading-none">JURY PARTNER</span>
                      <span className="block font-cinzel text-[10px] text-gray-300 tracking-wider">amasQIS.ai</span>
                    </div>
                    <img
                      src="/amasqis-logo.png"
                      alt="amasQIS.ai Logo"
                      className="h-7 sm:h-8 w-auto object-contain rounded"
                    />
                  </div>
                  <div className="bg-[#08121a] border border-[#ffd700]/50 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 font-cinzel text-[11px] text-[#ffd700]">
                    <GraduationCap className="w-3.5 h-3.5 text-[#ffd700]" />
                    <span>Real-World Projects</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="text-center font-cinzel text-xs text-gray-300">
              Prize pool of Upto ₹50,000+ with individual 1st, 2nd & 3rd prize breakdowns will be proclaimed during the Grand Opening Ceremony!
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TreasureBox;
