import React, { useState } from 'react';
import { Lock, Unlock, Sparkles, Trophy, Briefcase, GraduationCap, CheckCircle2, RotateCcw } from 'lucide-react';

const TreasureBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpen = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);
    setTimeout(() => {
      setIsOpening(false);
      setIsOpen(true);
    }, 800);
  };

  const handleReset = (e) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-8 text-center px-4">
      {!isOpen ? (
        <div
          onClick={handleOpen}
          className={`relative group cursor-pointer bg-gradient-to-b from-[#0a1b11] to-[#040e08] border-2 border-[#10b981] rounded-2xl p-8 sm:p-12 shadow-[0_0_30px_rgba(0,255,102,0.2)] hover:shadow-[0_0_50px_rgba(0,255,102,0.5)] hover:border-[#00ff66] transition-all duration-500 overflow-hidden transform hover:-translate-y-1 ${
            isOpening ? 'scale-95 opacity-80 animate-pulse' : ''
          }`}
        >
          {/* Neon energy lines */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00ff66] to-transparent animate-pulse" />
          <div className="absolute inset-0 bg-radial from-[#00ff66]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Locked Box Icon */}
          <div className="relative z-10 mx-auto w-24 h-24 sm:w-28 sm:h-28 mb-6 bg-[#0f2818] border-2 border-[#00ff66] rounded-2xl flex items-center justify-center shadow-[0_0_20px_#00ff66] group-hover:scale-110 transition-transform duration-300">
            {isOpening ? (
              <Unlock className="w-12 h-12 text-[#00ff66] animate-bounce" />
            ) : (
              <Lock className="w-12 h-12 text-[#00ff66]" />
            )}
          </div>

          <h3 className="relative z-10 font-orbitron font-extrabold text-2xl sm:text-3xl text-white mb-2 tracking-wider">
            TREASURE BOX
          </h3>
          <p className="relative z-10 font-mono text-sm text-[#10b981] mb-6 uppercase tracking-widest">
            WHAT'S INSIDE?
          </p>

          <button
            type="button"
            className="relative z-10 px-8 py-3 rounded-full font-orbitron font-bold text-sm text-black bg-[#00ff66] hover:bg-[#10b981] hover:text-white transition-all shadow-[0_0_20px_#00ff66] group-hover:shadow-[0_0_30px_#00ff66] uppercase tracking-wider"
          >
            {isOpening ? 'UNLOCKING VAULT...' : 'TAP TO OPEN'}
          </button>
        </div>
      ) : (
        /* Revealed Reward Inside Treasure Box */
        <div className="relative bg-gradient-to-b from-[#0f2e1a] via-[#081b10] to-[#040e08] border-2 border-[#00ff66] rounded-3xl p-6 sm:p-10 shadow-[0_0_60px_rgba(0,255,102,0.5)] animate-fadeIn transform transition-all text-left">
          
          {/* Top Vault Header */}
          <div className="flex items-center justify-between border-b border-[#00ff66]/30 pb-4 mb-6">
            <div className="inline-flex items-center space-x-2 bg-[#00ff66]/15 border border-[#00ff66] px-3.5 py-1 rounded-full text-xs font-mono text-[#00ff66] uppercase tracking-widest">
              <Sparkles className="w-4 h-4 text-[#00ff66] animate-pulse" />
              <span>TREASURE VAULT UNLOCKED</span>
            </div>

            <button
              onClick={handleReset}
              className="flex items-center space-x-1 font-mono text-xs text-gray-400 hover:text-[#00ff66] transition-colors bg-[#050b07] border border-gray-800 px-3 py-1 rounded-lg"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Re-lock</span>
            </button>
          </div>

          {/* Main Prize Reveal Content */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-4 bg-[#00ff66] rounded-2xl flex items-center justify-center shadow-[0_0_30px_#00ff66] text-black">
              <Trophy className="w-9 h-9 sm:w-11 sm:h-11 animate-bounce" />
            </div>
            <h3 className="font-orbitron font-black text-2xl sm:text-4xl text-white tracking-wide">
              SURPRISE <span className="text-[#00ff66] neon-glow-green">CASH PRIZES & BOUNTIES</span>
            </h3>
            <p className="font-mono text-xs sm:text-sm text-[#10b981] uppercase tracking-widest mt-2">
              GRAND PRIZE POOL TO BE REVEALED AT OPENING CEREMONY!
            </p>
          </div>

          {/* FREE INTERNSHIP INSIDE THE TREASURE BOX */}
          <div className="bg-gradient-to-r from-[#00ff66]/20 via-[#0a2315] to-[#00ff66]/15 border-2 border-[#00ff66] rounded-2xl p-5 sm:p-6 shadow-[0_0_30px_rgba(0,255,102,0.3)] relative overflow-hidden mb-6">
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
                <div className="bg-[#050b07] border border-[#00ff66]/40 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 font-mono text-[11px] text-gray-200">
                  <GraduationCap className="w-3.5 h-3.5 text-[#00ff66]" />
                  <span>Real-World Projects</span>
                </div>
                <div className="bg-[#050b07] border border-[#00ff66]/40 px-3 py-1.5 rounded-lg flex items-center space-x-1.5 font-mono text-[11px] text-[#00ff66]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff66]" />
                  <span>Direct Placement</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center font-mono text-xs text-gray-400">
            Individual 1st, 2nd & 3rd prize breakdowns will be announced during the Grand Opening!
          </div>
        </div>
      )}
    </div>
  );
};

export default TreasureBox;
