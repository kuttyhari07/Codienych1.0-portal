import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Sparkles, X, Gift, Zap, Volume2, VolumeX, ShieldAlert, Radio } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleSound, isSoundEnabled, playLaserBlip, playChirp, playVictoryFanfare } from '../utils/cyberSound';

const secretHacks = [
  '⚡ Pro-Tip 01: Pre-configure your GitHub repos with CI/CD actions for instant judging point bonuses!',
  '☕ Pro-Tip 02: Midnight coffee and board games in the Chill Arena refresh brain cognition by 40%!',
  '🏆 Pro-Tip 03: Judges love clean UI/UX and a working live demo more than slides!',
  '🎁 Pro-Tip 04: Spot prize winners in mini-games receive exclusive physical goodie kits on the spot!',
  '🚀 Pro-Tip 05: The Treasure Vault holds Free Internship offers for top performer squads!',
];

const MatrixRainCanvas = ({ onClose }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = 'CODIENYCH010101010101ABCDEF0123456789';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array(columns).fill(1);

    let animationId;
    const draw = () => {
      ctx.fillStyle = 'rgba(5, 11, 7, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff66';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationId = requestAnimationFrame(draw);
    };

    draw();

    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 4500);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 pointer-events-none bg-black/60">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute top-8 left-1/2 -translate-x-1/2 font-orbitron font-black text-lg sm:text-2xl text-[#00ff66] bg-[#050b07]/90 px-6 py-2.5 rounded-full border border-[#00ff66] shadow-[0_0_40px_#00ff66] animate-pulse">
        ⚡ CODIENYCH MATRIX STREAM ENGAGED ⚡
      </div>
    </div>
  );
};

const CyberEasterEggHud = ({ onOpenCli }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeHack, setActiveHack] = useState(0);
  const [showMatrix, setShowMatrix] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) playLaserBlip();
  };

  const triggerMatrix = () => {
    setShowMatrix(true);
    playVictoryFanfare();
  };

  return (
    <>
      {/* Matrix Digital Rain Animation Screen */}
      {showMatrix && <MatrixRainCanvas onClose={() => setShowMatrix(false)} />}

      {/* Floating HUD Controller Button Bottom Left */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center space-x-2 select-none">
        {/* Interactive CLI Terminal Launcher */}
        <button
          onClick={() => {
            playLaserBlip();
            if (onOpenCli) onOpenCli();
          }}
          data-cursor-text="CLI"
          title="Open Tactical Terminal CLI (`)"
          className="group flex items-center space-x-1.5 bg-[#0a1b10]/95 border border-[#00ff66]/70 hover:border-[#00ff66] px-3 py-2.5 rounded-xl text-xs font-mono text-[#00ff66] shadow-[0_0_20px_rgba(0,255,102,0.3)] hover:shadow-[0_0_35px_rgba(0,255,102,0.7)] transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-md active:scale-95"
        >
          <Terminal className="w-4 h-4 text-[#00ff66] animate-pulse" />
          <span className="font-bold tracking-wider">[ &gt;_ CLI ]</span>
        </button>

        {/* Decrypt Hacks Modal Trigger */}
        <button
          onClick={() => {
            playChirp();
            setIsOpen(true);
          }}
          data-cursor-text="DECRYPT"
          className="group flex items-center space-x-2 bg-[#0a1b10]/95 border border-gray-800 hover:border-[#00ff66] px-3 py-2.5 rounded-xl text-xs font-mono text-gray-300 hover:text-[#00ff66] transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-md active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#00ff66]" />
          <span className="font-bold tracking-wider">[ INTEL ]</span>
        </button>

        {/* Matrix Rain Button */}
        <button
          onClick={triggerMatrix}
          title="Matrix Rain Stream"
          data-cursor-text="MATRIX"
          className="p-2.5 rounded-xl bg-[#0a1b10]/95 border border-gray-800 hover:border-[#00ff66] text-gray-400 hover:text-[#00ff66] transition-all shadow-md backdrop-blur-md active:scale-95"
        >
          <Zap className="w-4 h-4" />
        </button>

        {/* SFX Audio Synthesizer Toggle */}
        <button
          onClick={handleToggleSound}
          title={soundOn ? 'Mute SFX Audio' : 'Unmute SFX Audio'}
          className={`p-2.5 rounded-xl border backdrop-blur-md transition-all active:scale-95 ${
            soundOn
              ? 'bg-[#0a1b10]/95 border-[#00ff66]/40 text-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.3)]'
              : 'bg-[#050b07]/95 border-gray-800 text-gray-500'
          }`}
        >
          {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
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
                  className="p-1.5 rounded-lg bg-[#050b07] border border-gray-800 text-gray-400 hover:text-[#00ff66]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-6 bg-[#050b07] border border-[#00ff66]/40 p-4 rounded-xl font-mono text-xs text-gray-200 shadow-inner">
                <div className="flex items-center space-x-2 text-[#00ff66] mb-2 font-bold">
                  <Sparkles className="w-4 h-4 text-[#00ff66] animate-pulse" />
                  <span>DECRYPTED TRANSMISSION #{activeHack + 1}:</span>
                </div>
                <p className="text-sm leading-relaxed text-white font-sans">
                  {secretHacks[activeHack]}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  onClick={() => {
                    playChirp();
                    setActiveHack((prev) => (prev + 1) % secretHacks.length);
                  }}
                  className="flex-1 py-2.5 rounded-xl font-mono text-xs uppercase bg-[#00ff66]/20 border border-[#00ff66] text-[#00ff66] hover:bg-[#00ff66] hover:text-black transition-all font-bold tracking-wider text-center"
                >
                  NEXT CLASSIFIED INTEL →
                </button>

                <button
                  onClick={() => {
                    triggerMatrix();
                    setIsOpen(false);
                  }}
                  className="px-5 py-2.5 rounded-xl font-mono text-xs uppercase bg-[#00ff66] text-black hover:bg-[#10b981] hover:text-white transition-all font-bold tracking-wider shadow-[0_0_15px_#00ff66]"
                >
                  MATRIX RAIN
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
