import React, { useState } from 'react';
import { Lock, Unlock, Sparkles, Trophy } from 'lucide-react';

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

  return (
    <div className="w-full max-w-2xl mx-auto my-12 text-center px-4">
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
        /* Revealed Reward State */
        <div className="relative bg-gradient-to-b from-[#0f2e1a] to-[#06140b] border-2 border-[#00ff66] rounded-2xl p-8 sm:p-12 shadow-[0_0_60px_rgba(0,255,102,0.6)] animate-fadeIn transform transition-all">
          <div className="mx-auto w-20 h-20 mb-6 bg-[#00ff66] rounded-full flex items-center justify-center shadow-[0_0_30px_#00ff66] text-black">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>

          <div className="inline-flex items-center space-x-2 bg-[#00ff66]/20 border border-[#00ff66] px-4 py-1.5 rounded-full text-xs font-mono text-[#00ff66] mb-4 uppercase tracking-widest">
            <Sparkles className="w-4 h-4" />
            <span>SECRET VAULT UNLOCKED</span>
          </div>

          <h3 className="font-orbitron font-extrabold text-xl sm:text-2xl text-gray-200 mb-2">
            PRIZE POOL REVEALED
          </h3>

          <div className="font-orbitron font-black text-3xl sm:text-5xl text-[#00ff66] neon-glow-green my-4 tracking-wider">
            CASH PRIZES UP TO ₹1 LAKH
          </div>

          <p className="font-mono text-xs sm:text-sm text-gray-400 max-w-md mx-auto mt-4">
            Individual 1st, 2nd & 3rd prize breakdowns will be announced at the grand opening!
          </p>
        </div>
      )}
    </div>
  );
};

export default TreasureBox;
