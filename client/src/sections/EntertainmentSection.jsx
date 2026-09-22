import React, { useState } from 'react';
import { 
  Gamepad2, 
  Gift, 
  Moon, 
  Sparkles, 
  Coffee, 
  Trophy, 
  Zap, 
  Flame, 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  Skull,
  Disc3,
  Headphones,
  Volume2,
  Radio,
  Music,
  PartyPopper,
  Clock,
  Waves
} from 'lucide-react';
import { motion } from 'framer-motion';
import { playBassDrop, playAirhorn, playLaserSweep } from '../utils/cyberSound';
import RealisticDJDeck3D from '../components/RealisticDJDeck3D';


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
  // DJ Interactive Soundboard State
  const [activeSoundFx, setActiveSoundFx] = useState(null);
  const [bassPulsing, setBassPulsing] = useState(false);

  // Playable Reflex Speed Mini Game State
  const [gameState, setGameState] = useState('idle'); // 'idle' | 'waiting' | 'ready' | 'success' | 'too-early'
  const [reactionTime, setReactionTime] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [timerId, setTimerId] = useState(null);

  const handleTriggerSound = (type) => {
    setActiveSoundFx(type);
    if (type === 'bass') {
      playBassDrop();
      setBassPulsing(true);
      setTimeout(() => setBassPulsing(false), 950);
    } else if (type === 'airhorn') {
      playAirhorn();
      setBassPulsing(true);
      setTimeout(() => setBassPulsing(false), 850);
    } else if (type === 'laser') {
      playLaserSweep();
    }
    setTimeout(() => setActiveSoundFx(null), 1200);
  };

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
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 font-cinzel font-bold text-xs text-[#ffd700] tracking-widest uppercase mb-3 bg-[#ffd700]/10 px-4 py-1.5 rounded-full border border-[#ffd700]/30 shadow-[0_0_15px_rgba(255,215,0,0.2)]">
            <Sparkles className="w-4 h-4 text-[#ffd700] animate-pulse" />
            <span>// RECHARGE, REVEL & PARTY //</span>
          </div>
          <h2 className="font-pirate text-4xl sm:text-6xl text-white tracking-wide mb-3">
            PIRATES TAVERN <span className="text-[#ffd700] pirate-gold-title">& FUN ZONE</span>
          </h2>
          <p className="max-w-2xl mx-auto font-cinzel text-xs sm:text-sm text-gray-300 leading-relaxed">
            Voyages aren't just about nonstop coding — recharge your mind with electrifying midnight bass drops, epic board battles, instant plunder, and mass tavern vibes!
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 🔥 MASSIVE NIGHT DJ HEADLINER SHOWCASE ARENA 🔥 */}
        {/* ========================================================================= */}
        <div 
          className={`mb-12 bg-gradient-to-br from-[#160c04] via-[#091522] to-[#12071a] border-2 ${
            bassPulsing ? 'border-[#ffd700] shadow-[0_0_60px_rgba(255,215,0,0.5)] scale-[1.008]' : 'border-[#ffd700]/60 shadow-[0_0_40px_rgba(229,193,88,0.25)]'
          } rounded-3xl p-6 sm:p-10 relative overflow-hidden transition-all duration-300 hud-corner-box`}
        >
          {/* Ambient Club Stage Lighting & Laser Flares */}
          <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-80 h-80 bg-gradient-to-bl from-[#ffd700]/25 via-cyan-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 transform -translate-x-12 translate-y-12 w-80 h-80 bg-gradient-to-tr from-purple-600/25 via-pink-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

          {/* Top Badges Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10 border-b border-[#ffd700]/20 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 bg-red-600/30 border border-red-500/60 px-3 py-1 rounded-full text-[11px] font-cinzel font-black text-red-300 tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                <span>EXCLUSIVE HEADLINER NIGHT EVENT</span>
              </span>
              <span className="inline-flex items-center space-x-1.5 bg-[#ffd700]/15 border border-[#ffd700]/50 px-3 py-1 rounded-full text-[11px] font-cinzel font-bold text-[#ffd700] uppercase">
                <Clock className="w-3.5 h-3.5" />
                <span>MIDNIGHT 12:00 AM – 02:00 AM</span>
              </span>
            </div>

            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-400/40 px-3.5 py-1 rounded-full font-cinzel text-xs text-cyan-300 font-bold">
              <Flame className="w-3.5 h-3.5 text-[#ffd700] animate-bounce" />
              <span>100% FREE FOR ALL HACKATHON PIRATES</span>
            </div>
          </div>

          {/* Core DJ Arena Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Content (7 Cols): Headline, Story & Perks */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center space-x-2 text-[#ffd700] font-cinzel text-xs tracking-widest uppercase font-bold mb-2">
                <Disc3 className="w-4 h-4 animate-spin [animation-duration:3s]" />
                <span>// MIDNIGHT TAVERN STAGE TAKEOVER</span>
              </div>

              <h3 className="font-pirate text-3xl sm:text-5xl md:text-6xl text-white tracking-wide leading-tight mb-4">
                PIRATE BASS REVOLUTION: <br className="hidden sm:inline" />
                <span className="pirate-gold-title text-4xl sm:text-6xl md:text-7xl drop-shadow-[0_0_35px_rgba(255,215,0,0.8)]">
                  NIGHT DJ EXTRAVAGANZA
                </span>
              </h3>

              <p className="font-cinzel text-xs sm:text-sm text-gray-200 leading-relaxed mb-6">
                When the midnight bells chime across the dark high seas, the tavern lights flip to neon! Leave your bugs at the terminal and plunge into an explosive live DJ set. Pure bass, viral shanty remixes, synthwave, and electrifying beats to blast fatigue away and supercharge your crew for the dawn sprint!
              </p>

              {/* 4 Key Night DJ Perks Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="bg-[#07111a]/80 border border-[#ffd700]/30 rounded-xl p-3 flex items-start space-x-3 shadow-[0_0_15px_rgba(0,0,0,0.4)]">
                  <div className="w-9 h-9 rounded-lg bg-[#ffd700]/15 border border-[#ffd700]/40 flex items-center justify-center flex-shrink-0">
                    <Headphones className="w-5 h-5 text-[#ffd700]" />
                  </div>
                  <div>
                    <h4 className="font-pirate text-base text-white">Live Resident DJ</h4>
                    <p className="font-cinzel text-[11px] text-gray-300">EDM, Trap, South Indian Mass Drops & Sea Shanty Remixes</p>
                  </div>
                </div>

                <div className="bg-[#07111a]/80 border border-cyan-400/30 rounded-xl p-3 flex items-start space-x-3 shadow-[0_0_15px_rgba(0,0,0,0.4)]">
                  <div className="w-9 h-9 rounded-lg bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div>
                    <h4 className="font-pirate text-base text-white">Zero Sleep Zone</h4>
                    <p className="font-cinzel text-[11px] text-gray-300">130+ BPM high-octane bass to pulverize late-night exhaustion</p>
                  </div>
                </div>

                <div className="bg-[#07111a]/80 border border-amber-500/30 rounded-xl p-3 flex items-start space-x-3 shadow-[0_0_15px_rgba(0,0,0,0.4)]">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-400/40 flex items-center justify-center flex-shrink-0">
                    <Coffee className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <h4 className="font-pirate text-base text-white">Midnight Grog & Bites</h4>
                    <p className="font-cinzel text-[11px] text-gray-300">Hot coffee, tea, energy snacks & midnight drinks on the house</p>
                  </div>
                </div>

                <div className="bg-[#07111a]/80 border border-purple-400/30 rounded-xl p-3 flex items-start space-x-3 shadow-[0_0_15px_rgba(0,0,0,0.4)]">
                  <div className="w-9 h-9 rounded-lg bg-purple-500/15 border border-purple-400/40 flex items-center justify-center flex-shrink-0">
                    <PartyPopper className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <h4 className="font-pirate text-base text-white">Spot Dance Booty</h4>
                    <p className="font-cinzel text-[11px] text-gray-300">Hype squads & dance-off victors win instant pirate merchandise</p>
                  </div>
                </div>
              </div>

              {/* Interactive DJ Soundboard Trigger Buttons */}
              <div className="bg-[#050b12]/90 border border-[#ffd700]/30 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-cinzel text-[11px] uppercase tracking-wider text-[#ffd700] font-bold flex items-center space-x-1.5">
                    <Radio className="w-3.5 h-3.5 text-[#ffd700] animate-pulse" />
                    <span>INTERACTIVE DJ SOUNDBOARD • TEST STAGE SFX:</span>
                  </span>
                  {activeSoundFx && (
                    <span className="text-[10px] font-cinzel text-cyan-300 uppercase tracking-widest font-bold animate-pulse">
                      🔥 PLAYING: {activeSoundFx.toUpperCase()}!
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <button
                    onClick={() => handleTriggerSound('bass')}
                    className="group py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600/30 to-yellow-600/20 hover:from-amber-500/50 hover:to-yellow-500/40 border border-[#ffd700]/50 hover:border-[#ffd700] text-white font-cinzel text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,215,0,0.2)] hover:scale-105 active:scale-95 flex items-center justify-center space-x-1.5"
                  >
                    <Volume2 className="w-4 h-4 text-[#ffd700] group-hover:scale-110 transition-transform" />
                    <span className="truncate">💥 DROP BASS</span>
                  </button>

                  <button
                    onClick={() => handleTriggerSound('airhorn')}
                    className="group py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600/30 to-blue-600/20 hover:from-cyan-500/50 hover:to-blue-500/40 border border-cyan-400/50 hover:border-cyan-400 text-white font-cinzel text-xs font-bold transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)] hover:scale-105 active:scale-95 flex items-center justify-center space-x-1.5"
                  >
                    <Music className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
                    <span className="truncate">🎺 AIR HORN</span>
                  </button>

                  <button
                    onClick={() => handleTriggerSound('laser')}
                    className="group py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600/30 to-pink-600/20 hover:from-purple-500/50 hover:to-pink-500/40 border border-purple-400/50 hover:border-purple-400 text-white font-cinzel text-xs font-bold transition-all shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:scale-105 active:scale-95 flex items-center justify-center space-x-1.5"
                  >
                    <Zap className="w-4 h-4 text-purple-300 group-hover:scale-110 transition-transform" />
                    <span className="truncate">⚡ LASER DROP</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Content (5 Cols): Realistic 3D DJ Turntable & Equalizer Stage */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              <div className="relative w-full flex items-center justify-center">
                {/* Floating Music Notes */}
                <motion.div
                  animate={{ y: [-5, -25, -5], opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                  className="absolute -top-2 left-6 text-[#ffd700] text-2xl font-bold pointer-events-none z-20"
                >
                  🎵
                </motion.div>
                <motion.div
                  animate={{ y: [-5, -30, -5], opacity: [0, 1, 0] }}
                  transition={{ repeat: Infinity, duration: 2.7, delay: 0.8, ease: 'easeInOut' }}
                  className="absolute top-8 right-4 text-cyan-400 text-3xl font-bold pointer-events-none z-20"
                >
                  🎶
                </motion.div>

                {/* Hyper-Realistic 3D DJ Vinyl Deck with Event Logo */}
                <RealisticDJDeck3D
                  bassPulsing={bassPulsing}
                  activeSoundFx={activeSoundFx}
                  onTriggerSound={handleTriggerSound}
                />
              </div>


              {/* Dynamic Equalizer Visualizer Spectrum */}
              <div className="w-full max-w-sm mt-4 bg-[#08121a]/95 border border-[#ffd700]/40 rounded-2xl p-4 shadow-[0_0_25px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-between text-xs font-cinzel text-gray-300 mb-2">
                  <span className="flex items-center space-x-1 text-[#ffd700] font-bold">
                    <Waves className="w-3.5 h-3.5" />
                    <span>AUDIO SPECTRUM</span>
                  </span>
                  <span className="text-[10px] text-cyan-300 font-mono font-bold uppercase tracking-wider">
                    {bassPulsing ? '⚡ BASS PEAK 100%' : '● 132 BPM LIVE'}
                  </span>
                </div>

                {/* 22 Equalizer Bars */}
                <div className="flex items-end justify-between h-14 px-2 gap-1 overflow-hidden">
                  {Array.from({ length: 22 }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={
                        bassPulsing
                          ? { height: [15, 52, 28, 56, 36][i % 5] }
                          : { height: [8, 38, 16, 46, 12, 34][i % 6] }
                      }
                      transition={{
                        repeat: Infinity,
                        repeatType: 'reverse',
                        duration: 0.3 + (i % 5) * 0.08,
                        ease: 'easeInOut',
                      }}
                      className="w-1.5 sm:w-2 rounded-full bg-gradient-to-t from-[#ffd700] via-cyan-400 to-purple-500 shadow-[0_0_8px_rgba(255,215,0,0.4)]"
                    />
                  ))}
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-800 flex items-center justify-between text-[11px] font-cinzel">
                  <span className="text-gray-400">TAVERN VIBE LEVEL:</span>
                  <span className="text-[#ffd700] font-bold">200% MAXIMUM HYPE ⚡</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COMPANION ACTIVITIES: BOARD BATTLES, SPOT PLUNDER & MINI CHALLENGES */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {activities.map((act, index) => {
            const Icon = act.icon;
            return (
              <div
                key={index}
                className={`bg-[#08121a]/95 bg-gradient-to-b ${act.color} border ${act.borderColor} rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(229,193,88,0.25)] flex flex-col justify-between hud-corner-box`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#140e06] border border-[#ffd700]/40 flex items-center justify-center shadow-[0_0_12px_rgba(229,193,88,0.2)]">
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

        {/* ========================================================================= */}
        {/* PLAYABLE INTERACTIVE MINI CHALLENGE SIMULATOR */}
        {/* ========================================================================= */}
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

