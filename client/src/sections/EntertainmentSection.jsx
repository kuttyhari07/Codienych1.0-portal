import React, { useState } from 'react';
import { Gamepad2, Gift, Moon, Sparkles, Coffee, Trophy, Zap, Flame, Play, RotateCcw, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const activities = [
  {
    icon: Moon,
    title: 'Late Night Chill & Board Games',
    tag: 'ANTI-SLEEP ARENA',
    description:
      'Feeling sleepy or hitting a brain block during the midnight coding grind? Take a quick break and challenge fellow devs to intense Chess & Carrom board battles!',
    badge: 'Chess & Carrom Lounge',
    color: 'from-emerald-500/20 to-green-500/5',
    borderColor: 'border-[#00ff66]/40',
  },
  {
    icon: Gift,
    title: 'Surprise Spot Gifts & Swag',
    tag: 'WIN ON THE SPOT',
    description:
      'Take part in quick mini-games, fun stage trivia, and mini tournaments. Winners of each activity get instant surprise gifts and cool goodies!',
    badge: 'Instant Rewards',
    color: 'from-yellow-500/20 to-amber-500/5',
    borderColor: 'border-yellow-400/40',
  },
  {
    icon: Gamepad2,
    title: 'Small Fun Activities & Mini Challenges',
    tag: 'HIGH ENERGY',
    description:
      'Short 5-minute lightning games, tech quizzes, typing speed duels, and fun team-bonding games to keep the excitement and dopamine high throughout the 24 hours!',
    badge: 'Mini Challenges',
    color: 'from-cyan-500/20 to-blue-500/5',
    borderColor: 'border-cyan-400/40',
  },
];

const EntertainmentSection = () => {
  // Playable Reflex Speed Mini Game State
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'waiting' | 'ready' | 'success' | 'too-early'
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [timerId, setTimerId] = useState(null);

  const startGame = () => {
    setGameState('waiting');
    setReactionTime(null);
    const delay = Math.floor(Math.random() * 2000) + 1500;
    const id = setTimeout(() => {
      setGameState('ready');
      setStartTime(Date.now());
    }, delay);
    setTimerId(id);
  };

  const handleClickTarget = () => {
    if (gameState === 'waiting') {
      clearTimeout(timerId);
      setGameState('too-early');
    } else if (gameState === 'ready') {
      const elapsed = Date.now() - startTime;
      setReactionTime(elapsed);
      setGameState('success');
    }
  };

  return (
    <section id="entertainment" className="relative py-20 px-4 z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center space-x-2 font-mono text-xs text-[#00ff66] tracking-widest uppercase mb-3 bg-[#00ff66]/10 px-3.5 py-1 rounded-full border border-[#00ff66]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#00ff66] animate-pulse" />
            <span>// CHILL, RECHARGE & PLAY</span>
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-5xl text-white tracking-wide mb-4">
            ENTERTAINMENT <span className="text-[#00ff66]">& FUN ZONE</span>
          </h2>
          <p className="max-w-2xl mx-auto font-mono text-xs sm:text-sm text-gray-300 leading-relaxed">
            Hackathons aren't just about nonstop coding — recharge your brain with fun mini-games, board battles, and win instant surprise prizes!
          </p>
        </div>

        {/* Highlight Banner: Midnight Chill Note */}
        <div className="mb-10 bg-gradient-to-r from-[#0f1e14] via-[#0a180f] to-[#0f1e14] border border-[#00ff66]/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_25px_rgba(0,255,102,0.15)] relative overflow-hidden hud-corner-box">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-[#00ff66]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#00ff66]/15 border border-[#00ff66] flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(0,255,102,0.3)]">
                <Coffee className="w-6 h-6 sm:w-7 sm:h-7 text-[#00ff66]" />
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#00ff66] font-bold">
                    🌙 Midnight Anti-Boredom Protocol
                  </span>
                  <span className="bg-[#00ff66]/20 text-[#00ff66] text-[10px] font-mono px-2 py-0.5 rounded-full border border-[#00ff66]/40">
                    24-HR VIBES
                  </span>
                </div>
                <h3 className="font-orbitron text-lg sm:text-xl font-bold text-white mb-1.5">
                  Feeling Sleepy or Need a Brain Break at Night?
                </h3>
                <p className="font-mono text-xs sm:text-sm text-gray-300">
                  Grab a fresh cup of coffee, head over to the gaming arena, and play <strong className="text-[#00ff66]">Chess ♟️</strong> or <strong className="text-[#00ff66]">Carrom 🎯</strong> with friends and fellow builders to reboot your mind!
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 flex items-center space-x-2 bg-[#050b07] border border-[#10b981]/50 px-4 py-2.5 rounded-xl font-mono text-xs text-[#00ff66]">
              <Flame className="w-4 h-4 text-[#00ff66] animate-bounce" />
              <span>100% Free & Open To All Participants</span>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {activities.map((act, index) => {
            const Icon = act.icon;
            return (
              <div
                key={index}
                className={`bg-[#0a140e]/90 bg-gradient-to-b ${act.color} border ${act.borderColor} rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(0,255,102,0.25)] flex flex-col justify-between hud-corner-box`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#050b07] border border-gray-700/60 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#00ff66]" />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-gray-300 bg-[#050b07]/80 border border-gray-700/50 px-2.5 py-1 rounded-full">
                      {act.tag}
                    </span>
                  </div>

                  <h3 className="font-orbitron font-bold text-lg text-white mb-2.5">
                    {act.title}
                  </h3>

                  <p className="font-mono text-xs text-gray-300 leading-relaxed mb-6">
                    {act.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-gray-400">Reward:</span>
                  <span className="text-[#00ff66] font-bold flex items-center space-x-1">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{act.badge}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* PLAYABLE INTERACTIVE MINI CHALLENGE SIMULATOR */}
        <div className="bg-gradient-to-b from-[#092113] via-[#05140b] to-[#040e08] border-2 border-[#00ff66]/70 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,255,102,0.2)] text-center relative overflow-hidden hud-corner-box">
          <div className="inline-flex items-center space-x-2 bg-[#00ff66]/15 border border-[#00ff66]/40 px-3.5 py-1 rounded-full text-xs font-mono text-[#00ff66] mb-4 uppercase tracking-widest font-bold">
            <Gamepad2 className="w-4 h-4 text-[#00ff66]" />
            <span>INTERACTIVE TEST ARENA: REFLEX OVERCLOCK</span>
          </div>

          <h3 className="font-orbitron font-extrabold text-xl sm:text-2xl text-white mb-2">
            Try a 5-Second Reaction Challenge!
          </h3>
          <p className="font-mono text-xs sm:text-sm text-gray-300 max-w-lg mx-auto mb-6">
            Test your quick reflexes right now! Tap Start, wait for the screen to turn GREEN, then tap instantly!
          </p>

          <div className="max-w-md mx-auto">
            {gameState === 'idle' && (
              <button
                onClick={startGame}
                data-cursor-text="PLAY"
                className="w-full py-4 rounded-2xl bg-[#00ff66] hover:bg-[#10b981] text-black font-orbitron font-black text-sm uppercase tracking-wider shadow-[0_0_25px_#00ff66] hover:scale-105 transition-all flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>INITIALIZE MINI CHALLENGE</span>
              </button>
            )}

            {gameState === 'waiting' && (
              <div
                onClick={handleClickTarget}
                className="w-full py-8 rounded-2xl bg-[#1f1608] border-2 border-amber-500/60 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse"
              >
                <span className="font-orbitron font-bold text-base sm:text-lg text-amber-400 block mb-1">
                  ⏳ WAIT FOR GREEN...
                </span>
                <span className="font-mono text-xs text-gray-400">Do not click yet!</span>
              </div>
            )}

            {gameState === 'ready' && (
              <div
                onClick={handleClickTarget}
                className="w-full py-8 rounded-2xl bg-[#00ff66] border-4 border-white cursor-pointer shadow-[0_0_50px_#00ff66] scale-105 animate-bounce"
              >
                <span className="font-orbitron font-black text-2xl sm:text-3xl text-black block">
                  ⚡ TAP NOW! ⚡
                </span>
              </div>
            )}

            {gameState === 'success' && (
              <div className="p-6 rounded-2xl bg-[#05180c] border-2 border-[#00ff66] shadow-[0_0_30px_rgba(0,255,102,0.4)]">
                <div className="flex items-center justify-center space-x-2 text-[#00ff66] font-bold text-lg font-orbitron mb-1">
                  <CheckCircle2 className="w-6 h-6" />
                  <span>REFLEX TIME: {reactionTime} ms!</span>
                </div>
                <p className="font-mono text-xs text-gray-300 mb-4">
                  🔥 Insane speed! Come to the Hackathon Chill Zone to win instant physical spot gifts and goodies!
                </p>
                <button
                  onClick={startGame}
                  className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-[#00ff66] text-black font-mono text-xs font-bold uppercase hover:bg-[#10b981] transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Play Again</span>
                </button>
              </div>
            )}

            {gameState === 'too-early' && (
              <div className="p-6 rounded-2xl bg-[#1c0a0a] border-2 border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                <span className="font-orbitron font-bold text-red-400 block mb-1">
                  ⚠️ Too Early!
                </span>
                <p className="font-mono text-xs text-gray-400 mb-4">
                  Wait until the box turns bright green before tapping.
                </p>
                <button
                  onClick={startGame}
                  className="px-5 py-2 rounded-xl bg-red-500 text-white font-mono text-xs font-bold uppercase hover:bg-red-600 transition-all"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EntertainmentSection;
