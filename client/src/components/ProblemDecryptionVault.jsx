import React, { useState } from 'react';
import { Lock, Unlock, KeyRound, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playChirp, playVictoryFanfare, playLaserBlip } from '../utils/cyberSound';

const ProblemDecryptionVault = () => {
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState('locked'); // 'locked' | 'wrong' | 'unlocked'
  const [revealedHint, setRevealedHint] = useState('');

  const secretDirectives = {
    '2026': '🎯 TACTICAL RECON: Focus on high-impact AI/ML, Full-Stack scalable architectures, and rapid MVP delivery within the 24-hr sprint!',
    'ESEC': '🏛️ VENUE TELEMETRY: High-speed wired fiber connectivity, designated sleep pods, non-stop energy refills & midnight coffee stations active!',
    'HACK': '⚡ SQUAD HINT: Modular micro-services + automated unit testing earn up to 25% extra bonus score from the technical jury!',
  };

  const handleDigit = (digit) => {
    if (pin.length < 4 && status !== 'unlocked') {
      playLaserBlip();
      const nextPin = pin + digit;
      setPin(nextPin);
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleClear = () => {
    playChirp();
    setPin('');
    setStatus('locked');
    setRevealedHint('');
  };

  const verifyPin = (inputPin) => {
    if (secretDirectives[inputPin]) {
      playVictoryFanfare();
      setStatus('unlocked');
      setRevealedHint(secretDirectives[inputPin]);
    } else {
      playChirp();
      setStatus('wrong');
      setTimeout(() => {
        setPin('');
        setStatus('locked');
      }, 1200);
    }
  };

  return (
    <div className="mt-8 max-w-xl mx-auto">
      <div className="bg-[#030c06] border-2 border-[#10b981]/50 rounded-2xl p-5 sm:p-7 shadow-[0_0_30px_rgba(0,255,102,0.2)] text-center relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1b3524] pb-3 mb-4">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#00ff66]">
            <KeyRound className="w-4 h-4 text-[#00ff66]" />
            <span className="font-bold uppercase tracking-wider">CYBER CIPHER DECRYPTOR</span>
          </div>

          <div className="font-mono text-[11px] text-gray-400">
            TRY PIN: <span className="text-[#00ff66] font-bold">2026</span>
          </div>
        </div>

        {/* Status Screen */}
        <div className="bg-[#05140b] border border-[#00ff66]/40 rounded-xl p-4 mb-5 text-center min-h-[72px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {status === 'unlocked' ? (
              <motion.div
                key="unlocked"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-left"
              >
                <div className="flex items-center space-x-2 text-[#00ff66] font-mono text-xs font-bold mb-1">
                  <Sparkles className="w-4 h-4 text-[#00ff66] animate-pulse" />
                  <span>CIPHER DECRYPTED // CLASSIFIED INTEL:</span>
                </div>
                <p className="font-mono text-xs text-white leading-relaxed">
                  {revealedHint}
                </p>
              </motion.div>
            ) : status === 'wrong' ? (
              <motion.div
                key="wrong"
                initial={{ x: -10 }}
                animate={{ x: [0, -10, 10, -10, 10, 0] }}
                className="flex items-center space-x-2 text-red-400 font-mono text-xs font-bold"
              >
                <AlertCircle className="w-4 h-4" />
                <span>ACCESS DENIED: INVALID CIPHER PASSCODE</span>
              </motion.div>
            ) : (
              <motion.div key="locked" className="flex flex-col items-center">
                <div className="font-mono text-xs text-gray-400 mb-1">ENTER 4-DIGIT DECRYPT KEY:</div>
                <div className="flex space-x-3 text-2xl font-mono text-[#00ff66] tracking-[0.5em]">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <span
                      key={i}
                      className={`w-4 h-4 rounded-full border border-[#00ff66] flex items-center justify-center ${
                        i < pin.length ? 'bg-[#00ff66] shadow-[0_0_10px_#00ff66]' : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Numpad Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLR', '0', '✓'].map((key) => {
            const isClear = key === 'CLR';
            const isEnter = key === '✓';
            return (
              <button
                key={key}
                type="button"
                onClick={() => {
                  if (isClear) handleClear();
                  else if (isEnter) verifyPin(pin);
                  else handleDigit(key);
                }}
                className={`py-3 rounded-xl font-orbitron font-bold text-sm sm:text-base border transition-all active:scale-95 ${
                  isClear
                    ? 'bg-red-950/40 border-red-900/60 text-red-400 hover:bg-red-900/60'
                    : isEnter
                    ? 'bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66] hover:bg-[#00ff66] hover:text-black shadow-[0_0_10px_rgba(0,255,102,0.3)]'
                    : 'bg-[#06190e] border-gray-800 text-white hover:border-[#00ff66] hover:text-[#00ff66]'
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
