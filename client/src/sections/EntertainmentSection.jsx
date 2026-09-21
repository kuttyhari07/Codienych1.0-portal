import React, { useState } from 'react';
import { Gamepad2, Gift, Moon, Sparkles, Coffee, Trophy, Zap, Flame, Play, RotateCcw, CheckCircle2, Skull } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const activities = [
  {
    icon: Moon,
    title: 'Midnight Grog & Board Battles',
    tag: 'ANTI-SLEEP TAVERN',
    description:
      'Feeling sleepy or hitting a brain block during the midnight voyage? Take a quick break and challenge fellow pirates to intense Chess & Carrom board duels in the ship lounge!',
    badge: 'Chess & Carrom Lounge',
    color: 'from-amber-900/20 to-yellow-900/5',
    borderColor: 'border-[#ffd700]/40',
  },
  {
    icon: Gift,
    title: 'Surprise Spot Gifts & Pirate Swag',
    tag: 'INSTANT PLUNDER',
    description:
      'Take part in quick mini-games, fun captain trivia, and mini tournaments. Winners of each activity get instant surprise gifts and cool pirate goodies!',
    badge: 'Instant Rewards',
    color: 'from-yellow-600/20 to-amber-700/5',
    borderColor: 'border-[#e5c158]/40',
  },
  {
    icon: Gamepad2,
    title: 'Sea Shanty Games & Mini Challenges',
    tag: 'HIGH ENERGY',
    description:
      'Short 5-minute lightning games, tech quizzes, typing speed duels, and fun crew-bonding challenges to keep the adrenaline high throughout the 24 hours!',
    badge: 'Mini Challenges',
    color: 'from-cyan-600/20 to-blue-700/5',
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
          <div className="inline-flex items-center space-x-2 font-cinzel font-bold text-xs text-[#ffd700] tracking-widest uppercase mb-3 bg-[#ffd700]/10 px-3.5 py-1 rounded-full border border-[#ffd700]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#ffd700] animate-pulse" />
            <span>// RECHARGE, REVEL & PLAY</span>
          </div>
          <h2 className="font-pirate text-4xl sm:text-6xl text-white tracking-wide mb-4">
            PIRATES TAVERN <span className="text-[#ffd700] pirate-gold-title">& FUN ZONE</span>
          </h2>
          <p className="max-w-2xl mx-auto font-cinzel text-xs sm:text-sm text-gray-300 leading-relaxed">
            Voyages aren't just about nonstop coding — recharge your mind with fun mini-games, board battles, and win instant surprise plunder!
          </p>
        </div>

        {/* Highlight Banner: Midnight Chill Note */}
        <div className="mb-10 bg-gradient-to-r from-[#1c150c] via-[#0f1b26] to-[#1c150c] border border-[#ffd700]/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_25px_rgba(229,193,88,0.15)] relative overflow-hidden hud-corner-box">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-40 h-40 bg-[#ffd700]/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#140e06] border border-[#ffd700] flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(229,193,88,0.3)]">
                <Coffee className="w-6 h-6 sm:w-7 sm:h-7 text-[#ffd700]" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-cinzel text-[11px] uppercase tracking-wider text-[#ffd700] font-bold">
                    🌙 Midnight Anti-Boredom Protocol
                  </span>
                  <span className="bg-[#ffd700]/20 text-[#ffd700] text-[10px] font-cinzel px-2.5 py-0.5 rounded-full border border-[#ffd700]/40 font-bold whitespace-nowrap">
                    24-HR VIBES
                  </span>
                </div>
                <h3 className="font-pirate text-xl sm:text-2xl text-white mb-1.5">
                  Feeling Sleepy or Need a Brain Break at Night?
                </h3>
                <p className="font-cinzel text-xs sm:text-sm text-gray-300">
                  Grab a warm cup of coffee, head over to the tavern arena, and play <strong className="text-[#ffd700]">Chess ♟️</strong> or <strong className="text-[#ffd700]">Carrom 🎯</strong> with friends and fellow pirate builders to reboot your mind!
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 flex items-center space-x-2 bg-[#08121a] border border-[#ffd700]/50 px-4 py-2.5 rounded-xl font-cinzel text-xs text-[#ffd700] font-bold">
              <Flame className="w-4 h-4 text-[#ffd700] animate-bounce" />
              <span>100% Free & Open To All Pirates</span>
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
                className={`bg-[#08121a]/95 bg-gradient-to-b ${act.color} border ${act.borderColor} rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(229,193,88,0.25)] flex flex-col justify-between hud-corner-box`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#140e06] border border-[#ffd700]/40 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#ffd700]" />
                    </div>
                    <span className="font-cinzel text-[10px] uppercase tracking-wider text-gray-300 bg-[#08121a]/80 border border-gray-700/50 px-2.5 py-1 rounded-full font-bold">
                      {act.tag}
                    </span>
                  </div>

                  <h3 className="font-pirate text-2xl text-white mb-2.5">
                    {act.title}
                  </h3>

                  <p className="font-cinzel text-xs text-gray-300 leading-relaxed mb-6">
                    {act.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#3a2c1a] flex items-center justify-between text-xs font-cinzel">
                  <span className="text-gray-400">Bounty Reward:</span>
                  <span className="text-[#ffd700] font-bold flex items-center space-x-1">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>{act.badge}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* PLAYABLE INTERACTIVE MINI CHALLENGE SIMULATOR */}
        <div className="bg-gradient-to-b from-[#1c150c] via-[#0d1a24] to-[#04080e] border-2 border-[#ffd700]/70 rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(229,193,88,0.2)] text-center relative overflow-hidden hud-corner-box">
          <div className="inline-flex items-center space-x-2 bg-[#ffd700]/15 border border-[#ffd700]/40 px-3.5 py-1 rounded-full text-xs font-cinzel text-[#ffd700] mb-4 uppercase tracking-widest font-bold">
            <Gamepad2 className="w-4 h-4 text-[#ffd700]" />
            <span>PIRATE SPEED CHALLENGE: QUICK DRAW REFLEX</span>
          </div>

          <h3 className="font-pirate text-2xl sm:text-4xl text-white mb-2">
            Try a 5-Second Captain's Reflex Duel!
          </h3>
          <p className="font-cinzel text-xs sm:text-sm text-gray-300 max-w-lg mx-auto mb-6">
            Test your quick reflexes right now! Tap Start, wait for the signal to turn GOLD, then tap instantly!
          </p>

          <div className="max-w-md mx-auto">
            {gameState === 'idle' && (
              <button
                onClick={startGame}
                data-cursor-text="PLAY"
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#ffd700] to-[#e5c158] hover:from-[#fff2a3] hover:to-[#ffd700] text-black font-pirate text-xl sm:text-2xl uppercase tracking-wider shadow-[0_0_25px_#ffd700] hover:scale-105 transition-all flex items-center justify-center space-x-2 font-bold"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>START PIRATE REFLEX DUEL</span>
              </button>
            )}

            {gameState === 'waiting' && (
              <div
                onClick={handleClickTarget}
                className="w-full py-8 rounded-2xl bg-[#1f1608] border-2 border-amber-500/60 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.3)] animate-pulse"
              >
                <span className="font-cinzel font-bold text-base sm:text-lg text-amber-400 block mb-1">
                  ⏳ WAIT FOR GOLD SIGNAL...
                </span>
                <span className="font-cinzel text-xs text-gray-400">Do not click yet!</span>
              </div>
            )}

            {gameState === 'ready' && (
              <div
                onClick={handleClickTarget}
                className="w-full py-8 rounded-2xl bg-[#ffd700] border-4 border-white cursor-pointer shadow-[0_0_50px_#ffd700] scale-105 animate-bounce"
              >
                <span className="font-pirate text-3xl sm:text-4xl text-black block font-black">
                  ⚔️ TAP NOW! ⚔️
                </span>
              </div>
            )}

            {gameState === 'success' && (
              <div className="p-6 rounded-2xl bg-[#140e06] border-2 border-[#ffd700] shadow-[0_0_30px_rgba(229,193,88,0.4)]">
                <div className="flex items-center justify-center space-x-2 text-[#ffd700] font-bold text-lg font-pirate mb-1 text-2xl">
                  <CheckCircle2 className="w-6 h-6" />
                  <span>REFLEX TIME: {reactionTime} ms!</span>
                </div>
                <p className="font-cinzel text-xs text-gray-200 mb-4">
                  🔥 Insane pirate speed! Visit the Hackathon Chill Zone to win instant physical spot gifts and goodies!
                </p>
                <button
                  onClick={startGame}
                  className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-[#ffd700] text-black font-cinzel text-xs font-bold uppercase hover:bg-[#fff2a3] transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Duel Again</span>
                </button>
              </div>
            )}

            {gameState === 'too-early' && (
              <div className="p-6 rounded-2xl bg-[#1c0a0a] border-2 border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                <span className="font-cinzel font-bold text-red-400 block mb-1">
                  ⚠️ Too Early, Matey!
                </span>
                <p className="font-cinzel text-xs text-gray-400 mb-4">
                  Wait until the signal turns radiant gold before tapping.
                </p>
                <button
                  onClick={startGame}
                  className="px-5 py-2 rounded-xl bg-red-500 text-white font-cinzel text-xs font-bold uppercase hover:bg-red-600 transition-all"
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
