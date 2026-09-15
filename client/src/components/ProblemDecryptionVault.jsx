import React, { useState } from 'react';
import { Lock, ShieldAlert, KeyRound, AlertOctagon, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playChirp, playLaserBlip } from '../utils/cyberSound';

const ProblemDecryptionVault = () => {
  const [pin, setPin] = useState('');
  const [attemptCount, setAttemptCount] = useState(0);
  const [denied, setDenied] = useState(false);

  const handleDigit = (digit) => {
    if (pin.length < 4 && !denied) {
      playLaserBlip();
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        triggerAccessDenied();
      }
    }
  };

  const handleClear = () => {
    playChirp();
    setPin('');
    setDenied(false);
  };

  const triggerAccessDenied = () => {
    playChirp();
    setDenied(true);
    setAttemptCount((prev) => prev + 1);

    setTimeout(() => {
      setPin('');
      setDenied(false);
    }, 1800);
  };

  return (
    <div className="mt-8 max-w-xl mx-auto px-2">
      <div className="bg-[#030c06]/95 border-2 border-red-500/40 hover:border-red-500/80 rounded-2xl p-4 sm:p-7 shadow-[0_0_35px_rgba(239,68,68,0.2)] text-center relative overflow-hidden transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-red-950/60 pb-3 mb-4 text-xs font-mono">
          <div className="flex items-center space-x-2 text-red-400">
            <Lock className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="font-bold uppercase tracking-wider">TOP-SECRET HARDENED CIPHER VAULT</span>
          </div>

          <div className="font-mono text-[10px] sm:text-[11px] text-gray-400">
            ATTEMPTS: <span className="text-red-400 font-bold">{attemptCount}</span>
          </div>
        </div>

        {/* Status Screen */}
        <div className="bg-[#080203] border border-red-500/40 rounded-xl p-4 mb-5 text-center min-h-[76px] flex items-center justify-center shadow-inner">
          <AnimatePresence mode="wait">
            {denied ? (
              <motion.div
                key="denied"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: [1, 1.05, 1], opacity: 1, x: [0, -8, 8, -8, 8, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center justify-center text-red-400"
              >
                <div className="flex items-center space-x-2 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-red-400">
                  <AlertOctagon className="w-5 h-5 text-red-500 animate-bounce" />
                  <span>ACCESS DENIED // CLASSIFIED</span>
                </div>
                <p className="font-mono text-[10px] sm:text-xs text-gray-400 mt-1">
                  Problem statements are encrypted until Day 1 Opening Ceremony!
                </p>
              </motion.div>
            ) : (
              <motion.div key="locked" className="flex flex-col items-center">
                <div className="font-mono text-[11px] sm:text-xs text-gray-400 mb-1.5 uppercase tracking-wider">
                  ENTER 4-DIGIT BYPASS KEY:
                </div>
                <div className="flex space-x-3 text-2xl font-mono text-red-400 tracking-[0.5em]">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <span
                      key={i}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-red-500/60 flex items-center justify-center ${
                        i < pin.length ? 'bg-red-500 shadow-[0_0_12px_#ef4444]' : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Numpad Keypad */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5 max-w-xs mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLR', '0', 'KEY'].map((key) => {
            const isClear = key === 'CLR';
            const isEnter = key === 'KEY';
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  if (isClear) handleClear();
                  else if (isEnter) {
                    if (pin.length > 0) triggerAccessDenied();
                  } else handleDigit(key);
                }}
                className={`py-2.5 sm:py-3 rounded-xl font-orbitron font-bold text-xs sm:text-sm border transition-all active:scale-95 ${
                  isClear
                    ? 'bg-red-950/40 border-red-900/60 text-red-400 hover:bg-red-900/60'
                    : isEnter
                    ? 'bg-red-900/30 border-red-500/60 text-red-400 hover:bg-red-500 hover:text-white shadow-[0_0_12px_rgba(239,68,68,0.3)]'
                    : 'bg-[#0b140e] border-gray-800 text-gray-200 hover:border-red-500/60 hover:text-red-400'
                }`}
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProblemDecryptionVault;
