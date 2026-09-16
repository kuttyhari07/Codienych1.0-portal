import React, { useState } from 'react';
import { Shield, Sparkles, Award, Star, Terminal, Zap, CheckCircle, ExternalLink, Flame, Bookmark, Crown, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EVENT_CONFIG } from '../utils/config';
import { playLaserBlip } from '../utils/cyberSound';
import SpotlightCard from './SpotlightCard';

const SquadHonorBadgeShowcase = () => {
  const [selectedBadge, setSelectedBadge] = useState('first');

  const badges = [
    {
      id: 'first',
      name: 'CHAMPION OF CODIENYCH',
      tier: 'GRAND CHAMPION // 1ST PLACE',
      color: '#ffd700',
      icon: '👑',
      bounty: 'CLASSIFIED CASH BOUNTY + FREE INTERNSHIP',
      traits: ['Full-Stack Excellence', 'Clean Architecture', 'Flawless Live Demo', 'Production-Ready'],
      quote: 'Awarded to the crew that demonstrates world-class software innovation & precision.',
    },
    {
      id: 'second',
      name: 'CORSAIR TITAN RUNNER-UP',
      tier: 'ELITE CREW // 2ND PLACE',
      color: '#e5c158',
      icon: '🥈',
      bounty: 'CLASSIFIED CASH BOUNTY + FREE INTERNSHIP',
      traits: ['High Scalability', 'Advanced Problem Solving', 'Creative UI/UX', 'Robust APIs'],
      quote: 'Awarded for extraordinary algorithmic capability and engineering prowess.',
    },
    {
      id: 'third',
      name: 'VANGUARD CODE MASTER',
      tier: 'HONOR PODIUM // 3RD PLACE',
      color: '#cd7f32',
      icon: '🥉',
      bounty: 'CLASSIFIED CASH BOUNTY + EXCLUSIVE SWAG',
      traits: ['Rapid Prototyping', 'Intuitive Interface', 'Zero Bug Execution', 'Strong Presentation'],
      quote: 'Awarded for exceptional speed and user-centric problem resolution.',
    },
    {
      id: 'reflex',
      name: 'CARIBBEAN CHILL CHAMPION',
      tier: 'SPOT PRIZE WINNERS',
      color: '#00e5ff',
      icon: '⚡',
      bounty: 'INSTANT PHYSICAL GOODIES & TECH PERKS',
      traits: ['Sub-300ms Reflexes', 'Midnight Lounge Champions', 'Active Participation'],
      quote: 'Awarded to live mini-game and midnight tavern challenge champions!',
    },
  ];

  const current = badges.find((b) => b.id === selectedBadge) || badges[0];

  return (
    <div className="mt-14 max-w-5xl mx-auto px-4 select-none">
      <SpotlightCard className="p-6 sm:p-10 bg-gradient-to-b from-[#081522] via-[#050f18] to-[#02060b] border-2 border-[#ffd700]/70 rounded-3xl shadow-[0_0_50px_rgba(255,215,0,0.25)] text-left relative overflow-hidden pirate-corner-box">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ffd700]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3a2e1d] pb-5 mb-6">
          <div>
            <div className="inline-flex items-center space-x-2 font-cinzel text-xs text-[#ffd700] uppercase tracking-wider mb-1">
              <Star className="w-4 h-4 text-[#ffd700]" />
              <span>TREASURE TROPHY & REPUTATION SYSTEM</span>
            </div>
            <h3 className="font-pirate font-black text-2xl sm:text-4xl text-white tracking-wide">
              CREW HONOR <span className="text-[#ffd700] pirate-gold-glow">BADGES OF GLORY</span>
            </h3>
          </div>

          <div className="font-cinzel text-xs text-[#ffd700] bg-[#04090f] border border-[#ffd700]/40 px-3.5 py-1.5 rounded-xl">
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
                className={`p-4 rounded-2xl border text-center transition-all duration-300 flex flex-col items-center justify-center relative cursor-pointer ${
                  isSelected
                    ? 'bg-[#0f2334] border-[#ffd700] text-white shadow-[0_0_25px_rgba(255,215,0,0.4)] scale-105'
                    : 'bg-[#04090f] border-[#3a2e1d] text-gray-400 hover:border-[#ffd700] hover:text-white'
                }`}
              >
                <span className="text-3xl sm:text-4xl mb-2 filter drop-shadow-[0_0_10px_rgba(255,215,0,0.4)]">
                  {b.icon}
                </span>
                <span className="font-cinzel font-bold text-xs sm:text-sm truncate w-full text-center">
                  {b.name.split(' ')[0]}
                </span>
                <span className="font-mono text-[9px] text-[#e5c158] tracking-wider uppercase mt-1">
                  {b.tier.split('//')[0]}
                </span>
                {isSelected && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#ffd700] text-black text-[10px] font-bold flex items-center justify-center">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Badge Stage Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#04090f]/90 border-2 border-[#ffd700]/50 rounded-2xl p-6 sm:p-8 items-center relative overflow-hidden shadow-inner"
          >
            {/* Left Hologram Badge Icon */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 bg-gradient-to-b from-[#0c1e2d] to-[#04090f] border border-[#ffd700]/40 rounded-2xl shadow-[0_0_30px_rgba(255,215,0,0.2)]">
              <div className="text-6xl sm:text-7xl mb-3 animate-bounce">
                {current.icon}
              </div>
              <div className="font-pirate font-black text-xl text-[#ffd700] uppercase pirate-gold-glow">
                {current.name}
              </div>
              <div className="font-cinzel text-[10px] text-[#e5c158] mt-1 uppercase tracking-wider">
                {current.tier}
              </div>
            </div>

            {/* Right Rewards & Criteria */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <span className="font-cinzel text-[10px] text-[#ffd700] uppercase tracking-wider block mb-1">
                  BOUNTY PACKAGE:
                </span>
                <div className="font-cinzel font-extrabold text-base sm:text-xl text-white">
                  {current.bounty}
                </div>
              </div>

              <p className="font-medieval text-xs sm:text-sm text-[#f4e6c3] leading-relaxed italic border-l-2 border-[#ffd700] pl-3">
                “{current.quote}”
              </p>

              <div>
                <span className="font-cinzel text-[10px] text-gray-400 uppercase tracking-wider block mb-2">
                  EVALUATION CRITERIA:
                </span>
                <div className="flex flex-wrap gap-2">
                  {current.traits.map((trait, idx) => (
                    <span
                      key={idx}
                      className="bg-[#0c1e2d] border border-[#ffd700]/40 px-3 py-1 rounded-lg text-xs font-cinzel text-[#ffd700] flex items-center space-x-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-[#ffd700]" />
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
