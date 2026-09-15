import React, { useState } from 'react';
import { Terminal, Sparkles, X, Gift, Zap, Volume2, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const secretHacks = [
  '⚡ Pro-Tip 01: Pre-configure your GitHub repos with CI/CD actions for instant judging point bonuses!',
  '☕ Pro-Tip 02: Midnight coffee and board games in the Chill Arena refresh brain cognition by 40%!',
  '🏆 Pro-Tip 03: Judges love clean UI/UX and a working live demo more than slides!',
  '🎁 Pro-Tip 04: Spot prize winners in mini-games receive exclusive physical goodie kits on the spot!',
];

const CyberEasterEggHud = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHack, setActiveHack] = useState(0);
  const [matrixEffect, setMatrixEffect] = useState(false);

  const triggerMatrix = () => {
    setMatrixEffect(true);
    setTimeout(() => setMatrixEffect(false), 3000);
  };

  return (
    <>
      {/* Matrix Stream Screen Flash Effect */}
      {matrixEffect && (
        <div className="fixed inset-0 pointer-events-none z-50 bg-[#00ff66]/10 backdrop-blur-[1px] animate-pulse flex items-center justify-center">
          <div className="font-mono text-sm sm:text-base text-[#00ff66] bg-[#050b07]/90 p-4 rounded-xl border border-[#00ff66] shadow-[0_0_40px_#00ff66] text-center">
            <span className="block animate-bounce">⚡ CYBERNETIC OVERCLOCK ENGAGED ⚡</span>
            <span className="text-xs text-gray-300">TELEMETRY_SYNC: 100% // CODIENYCH 1.0</span>
          </div>
        </div>
      )}

      {/* Floating HUD Controller Button Bottom Left */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center space-x-2">
        <button
          onClick={() => setIsOpen(true)}
          data-cursor-text="DECRYPT"
          className="group flex items-center space-x-2 bg-[#0a1b10]/90 border border-[#00ff66]/60 hover:border-[#00ff66] px-3.5 py-2 rounded-xl text-xs font-mono text-[#00ff66] shadow-[0_0_20px_rgba(0,255,102,0.25)] hover:shadow-[0_0_30px_rgba(0,255,102,0.5)] transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-md"
        >
          <Terminal className="w-4 h-4 text-[#00ff66] animate-pulse" />
          <span className="font-bold tracking-wider">[ DECRYPT HACKS ]</span>
          <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-ping" />
        </button>

        <button
          onClick={triggerMatrix}
          title="Overclock UI Stream"
          className="p-2 rounded-xl bg-[#0a1b10]/90 border border-gray-800 hover:border-[#00ff66] text-gray-400 hover:text-[#00ff66] transition-all shadow-md backdrop-blur-md"
        >
          <Zap className="w-4 h-4" />
        </button>
      </div>

      {/* Secret Decryptor Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg bg-gradient-to-b from-[#0f2e1a] via-[#091b10] to-[#040e08] border-2 border-[#00ff66] rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(0,255,102,0.6)] relative overflow-hidden hud-corner-box text-left"
            >
              <div className="flex items-center justify-between border-b border-[#00ff66]/30 pb-3 mb-5">
                <div className="flex items-center space-x-2">
                  <Terminal className="w-5 h-5 text-[#00ff66]" />
                  <span className="font-orbitron font-extrabold text-sm text-white">
                    CLASSIFIED HACKER INTEL
                  </span>
                </div>

                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg bg-[#050b07] border border-gray-800 text-gray-400 hover:text-[#00ff66]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6 bg-[#050b07] border border-[#00ff66]/40 p-4 rounded-xl font-mono text-xs text-gray-200">
                <div className="flex items-center space-x-2 text-[#00ff66] mb-2 font-bold">
                  <Sparkles className="w-4 h-4" />
                  <span>DECRYPTED TRANSMISSION #{activeHack + 1}:</span>
                </div>
                <p className="text-sm leading-relaxed text-white font-sans">
                  {secretHacks[activeHack]}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => setActiveHack((prev) => (prev + 1) % secretHacks.length)}
                  className="flex-1 py-2.5 rounded-xl font-mono text-xs uppercase bg-[#00ff66]/20 border border-[#00ff66] text-[#00ff66] hover:bg-[#00ff66] hover:text-black transition-all font-bold tracking-wider text-center"
                >
                  NEXT CLASSIFIED INTEL →
                </button>

                <button
                  onClick={() => {
                    triggerMatrix();
                    setIsOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl font-mono text-xs uppercase bg-[#00ff66] text-black hover:bg-[#10b981] hover:text-white transition-all font-bold tracking-wider"
                >
                  OVERCLOCK
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CyberEasterEggHud;
