import React, { useState } from 'react';
import { Users, Calculator, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { EVENT_CONFIG } from '../utils/config';
import { playChirp, playVictoryFanfare } from '../utils/cyberSound';
import SpotlightCard from './SpotlightCard';

const TeamFeeCalculator = () => {
  const [membersCount, setMembersCount] = useState(4);

  const teamSizes = [
    { count: 4, fee: 2100, label: 'Standard Tactical Squad', icon: '4' },
    { count: 5, fee: 2625, label: 'Expanded Strike Team', icon: '5' },
    { count: 6, fee: 3150, label: 'Maximum Combat Unit', icon: '6' },
  ];

  const currentConfig = teamSizes.find((t) => t.count === membersCount) || teamSizes[0];

  const handleSelect = (count) => {
    setMembersCount(count);
    playChirp();
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <SpotlightCard className="p-6 sm:p-8 bg-[#07170e]/90 border border-[#10b981]/50 rounded-2xl shadow-[0_0_35px_rgba(0,255,102,0.15)] text-left relative overflow-hidden">
        {/* Glow corner ambient */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-[#00ff66]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#1b3524] pb-5 mb-6">
          <div>
            <div className="inline-flex items-center space-x-2 font-mono text-xs text-[#00ff66] uppercase tracking-wider mb-1">
              <Calculator className="w-4 h-4 text-[#00ff66]" />
              <span>LIVE TEAM SQUAD CALCULATOR</span>
            </div>
            <h3 className="font-orbitron font-extrabold text-xl sm:text-2xl text-white">
              SIMULATE SQUAD REGISTRATION FEE
            </h3>
          </div>

          <div className="bg-[#050b07] border border-[#00ff66]/40 px-3.5 py-1.5 rounded-xl font-mono text-xs text-[#00ff66]">
            FIXED RATE: <span className="font-bold">₹{EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER}</span> / MEMBER
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Selector buttons */}
          <div className="md:col-span-7 space-y-3">
            <div className="font-mono text-xs text-gray-400 mb-2">
              SELECT NUMBER OF MEMBERS IN YOUR SQUAD (4 TO 6):
            </div>
            <div className="grid grid-cols-3 gap-3">
              {teamSizes.map((item) => {
                const isSelected = membersCount === item.count;
                return (
                  <button
                    key={item.count}
                    type="button"
                    onClick={() => handleSelect(item.count)}
                    className={`py-3.5 px-3 rounded-xl border font-mono text-center transition-all duration-300 relative ${
                      isSelected
                        ? 'bg-[#00ff66]/20 border-[#00ff66] text-white shadow-[0_0_20px_rgba(0,255,102,0.4)] scale-105'
                        : 'bg-[#050b07] border-gray-800 text-gray-400 hover:border-[#10b981] hover:text-white'
                    }`}
                  >
                    <div className="font-orbitron font-black text-xl sm:text-2xl text-[#00ff66]">
                      {item.count}
                    </div>
                    <div className="text-[10px] tracking-wider uppercase text-gray-300 mt-0.5">
                      MEMBERS
                    </div>
                    {isSelected && (
                      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#00ff66] text-black flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="bg-[#040e08] border border-[#1b3524] p-3 rounded-xl flex items-center space-x-3 text-xs font-mono text-gray-300">
              <ShieldCheck className="w-4 h-4 text-[#00ff66] flex-shrink-0" />
              <span>{currentConfig.label} • All 24hr Meals & Goodies Included</span>
            </div>
          </div>

          {/* Computed Amount Display Box */}
          <div className="md:col-span-5 bg-gradient-to-b from-[#092213] to-[#040f08] border-2 border-[#00ff66] rounded-2xl p-5 text-center shadow-[0_0_25px_rgba(0,255,102,0.3)] relative">
            <div className="font-mono text-[11px] text-gray-400 uppercase tracking-wider mb-1">
              TOTAL SQUAD INVESTMENT
            </div>

            <div className="font-orbitron font-black text-3xl sm:text-4xl text-[#00ff66] neon-glow-green my-2">
              ₹{currentConfig.fee.toLocaleString()}
            </div>

            <div className="font-mono text-[11px] text-gray-300 mb-4">
              (₹525 × {currentConfig.count} participants)
            </div>

            <Link
              to="/register"
              className="inline-flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl font-orbitron font-bold text-xs uppercase bg-[#00ff66] text-black hover:bg-[#10b981] hover:text-white transition-all shadow-[0_0_15px_#00ff66] active:scale-95"
            >
              <span>REGISTER SQUAD</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
};

export default TeamFeeCalculator;
