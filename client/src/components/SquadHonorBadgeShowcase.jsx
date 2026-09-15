import React, { useState } from 'react';
import { Shield, Sparkles, Award, Star, Terminal, Zap, CheckCircle, ExternalLink, Flame, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EVENT_CONFIG } from '../utils/config';
import { playVictoryFanfare, playLaserBlip } from '../utils/cyberSound';
import SpotlightCard from './SpotlightCard';

const SquadHonorBadgeShowcase = () => {
  const [selectedBadge, setSelectedBadge] = useState('first');

  const badges = [
    {
      id: 'first',
      name: 'CHAMPION OF CODIENYCH',
      tier: 'GRAND CHAMPION // 1ST PLACE',
      color: '#00ff66',
      icon: '👑',
      bounty: 'CLASSIFIED CASH BOUNTY + FREE INTERNSHIP',
      traits: ['Full-Stack Excellence', 'Clean Architecture', 'Flawless Live Demo', 'Production-Ready'],
      quote: 'Awarded to the squad that demonstrates world-class software innovation & precision.',
    },
    {
      id: 'second',
      name: 'CYBER TITAN RUNNER-UP',
      tier: 'ELITE SQUAD // 2ND PLACE',
      color: '#10b981',
      icon: '🥈',
      bounty: 'CLASSIFIED CASH BOUNTY + FREE INTERNSHIP',
      traits: ['High Scalability', 'Advanced Problem Solving', 'Creative UI/UX', 'Robust APIs'],
      quote: 'Awarded for extraordinary algorithmic capability and engineering prowess.',
    },
    {
      id: 'third',
      name: 'VANGUARD CODE MASTER',
      tier: 'HONOR PODIUM // 3RD PLACE',
      color: '#34d399',
      icon: '🥉',
      bounty: 'CLASSIFIED CASH BOUNTY + EXCLUSIVE GOODIES',
      traits: ['Rapid Prototyping', 'Intuitive Interface', 'Zero Bug Execution', 'Strong Presentation'],
      quote: 'Awarded for exceptional speed and user-centric problem resolution.',
    },
    {
      id: 'reflex',
      name: 'NEO CHILL CHALLENGER',
      tier: 'SPOT PRIZE WINNERS',
      color: '#facc15',
      icon: '⚡',
      bounty: 'INSTANT PHYSICAL GOODIES & TECH PERKS',
      traits: ['Sub-300ms Reflexes', 'Midnight Lounge Champions', 'Active Participation'],
      quote: 'Awarded to live mini-game and midnight lounge challenge champions!',
    },
  ];

  const current = badges.find((b) => b.id === selectedBadge) || badges[0];

  return (
    <div className="mt-14 max-w-5xl mx-auto px-4 select-none">
      <SpotlightCard className="p-6 sm:p-10 bg-gradient-to-b from-[#0a1e12] via-[#05140b] to-[#020804] border-2 border-[#00ff66]/60 rounded-3xl shadow-[0_0_50px_rgba(0,255,102,0.3)] text-left relative overflow-hidden hud-corner-box">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00ff66]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1b3524] pb-5 mb-6">
          <div>
            <div className="inline-flex items-center space-x-2 font-mono text-xs text-[#00ff66] uppercase tracking-wider mb-1">
              <Star className="w-4 h-4 text-[#00ff66]" />
              <span>DIGITAL TROPHY & REPUTATION SYSTEM</span>
            </div>
            <h3 className="font-orbitron font-black text-xl sm:text-3xl text-white tracking-wide">
              SQUAD HONOR <span className="text-[#00ff66] neon-glow-green">BADGES OF GLORY</span>
            </h3>
          </div>

          <div className="font-mono text-xs text-gray-400 bg-[#040e08] border border-[#00ff66]/30 px-3.5 py-1.5 rounded-xl">
            🏆 IMMORTALIZED ON STAGE
          </div>
        </div>

        {/* 4 Interactive Badge Selectors */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {badges.map((b) => {
            const isSelected = selectedBadge === b.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  playLaserBlip();
                  setSelectedBadge(b.id);
                }}
                className={`p-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center relative ${
                  isSelected
                    ? 'bg-[#00ff66]/20 border-[#00ff66] text-white shadow-[0_0_25px_rgba(0,255,102,0.5)] scale-105'
                    : 'bg-[#040e08] border-gray-800 text-gray-400 hover:border-[#10b981] hover:text-white'
                }`}
              >
                <span className="text-3xl sm:text-4xl mb-2 filter drop-shadow-[0_0_10px_rgba(0,255,102,0.4)]">
                  {b.icon}
                </span>
                <span className="font-orbitron font-bold text-xs sm:text-sm truncate w-full text-center">
                  {b.name.split(' ')[0]}
                </span>
                <span className="font-mono text-[9px] text-gray-400 tracking-wider uppercase mt-1">
                  {b.tier.split('//')[0]}
                </span>
                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#00ff66] text-black text-[10px] font-bold flex items-center justify-center">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Badge 3D Hologram Stage Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#040e08] border-2 border-[#10b981]/50 rounded-2xl p-6 sm:p-8 items-center relative overflow-hidden shadow-inner"
          >
            {/* Left Hologram Badge Icon */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 bg-gradient-to-b from-[#0a2315] to-[#020905] border border-[#00ff66]/40 rounded-2xl shadow-[0_0_30px_rgba(0,255,102,0.2)]">
              <div className="text-6xl sm:text-7xl mb-3 animate-bounce">
                {current.icon}
              </div>
              <div className="font-orbitron font-black text-lg text-[#00ff66] uppercase">
                {current.name}
              </div>
              <div className="font-mono text-[10px] text-gray-300 mt-1 uppercase tracking-wider">
                {current.tier}
              </div>
            </div>

            {/* Right Rewards & Criteria */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <span className="font-mono text-[10px] text-[#00ff66] uppercase tracking-wider block mb-1">
                  PRIZE PACKAGE & BOUNTY:
                </span>
                <div className="font-orbitron font-extrabold text-base sm:text-xl text-white">
                  {current.bounty}
                </div>
              </div>

              <p className="font-mono text-xs text-gray-300 leading-relaxed italic border-l-2 border-[#00ff66] pl-3">
                “{current.quote}”
              </p>

              <div>
                <span className="font-mono text-[10px] text-gray-400 uppercase tracking-wider block mb-2">
                  EVALUATION BENCHMARKS:
                </span>
                <div className="flex flex-wrap gap-2">
                  {current.traits.map((trait, idx) => (
                    <span
                      key={idx}
                      className="bg-[#082012] border border-[#00ff66]/40 px-3 py-1 rounded-lg text-xs font-mono text-[#00ff66] flex items-center space-x-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-[#00ff66]" />
                      <span>{trait}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </SpotlightCard>
    </div>
  );
};

export default SquadHonorBadgeShowcase;
