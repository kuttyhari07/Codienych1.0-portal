import React, { useState } from 'react';
import { Users, Calculator, Sparkles, Check, ArrowRight, ShieldCheck, Coins, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { EVENT_CONFIG } from '../utils/config';
import { playChirp } from '../utils/cyberSound';
import SpotlightCard from './SpotlightCard';
import useRegistrationStatus from '../utils/useRegistrationStatus';

const TeamFeeCalculator = () => {
  const { isClosed } = useRegistrationStatus();
  const [membersCount, setMembersCount] = useState(4);

  const teamSizes = [
    { count: 3, fee: 3 * EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER, label: 'Tactical Privateer Trio', icon: '3' },
    { count: 4, fee: 4 * EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER, label: 'Standard Corsair Squad', icon: '4' },
    { count: 5, fee: 5 * EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER, label: 'Expanded Raiding Crew', icon: '5' },
    { count: 6, fee: 6 * EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER, label: 'Full Flagship Armada Unit', icon: '6' },
  ];

  const currentConfig = teamSizes.find((t) => t.count === membersCount) || teamSizes[0];

  const handleSelect = (count) => {
    setMembersCount(count);
    playChirp();
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <SpotlightCard className="p-6 sm:p-8 bg-[#08121a]/95 border-2 border-[#ffd700]/70 rounded-2xl shadow-[0_0_35px_rgba(255,215,0,0.2)] text-left relative overflow-hidden pirate-corner-box">
        {/* Glow corner ambient */}
        <div className="absolute top-0 right-0 w-60 h-60 bg-[#ffd700]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#3a2e1d] pb-5 mb-6">
          <div>
            <div className="inline-flex items-center space-x-2 font-cinzel text-xs text-[#ffd700] uppercase tracking-wider mb-1">
              <Calculator className="w-4 h-4 text-[#ffd700]" />
              <span>CREW BOUNTY TRIBUTE CALCULATOR</span>
            </div>
            <h3 className="font-pirate font-extrabold text-2xl sm:text-3xl text-white pirate-gold-glow">
              CALCULATE CREW REGISTRATION TRIBUTE
            </h3>
          </div>

          <div className="bg-[#04090f] border border-[#ffd700]/50 px-3.5 py-1.5 rounded-xl font-cinzel text-xs text-[#ffd700]">
            FIXED RATE: <span className="font-bold">₹{EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER}</span> / PIRATE
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Selector buttons */}
          <div className="md:col-span-7 space-y-3">
            <div className="font-cinzel text-xs text-gray-400 mb-2">
              SELECT NUMBER OF PIRATES IN YOUR CREW (3 TO 6):
            </div>
            <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
              {teamSizes.map((item) => {
                const isSelected = membersCount === item.count;
                return (
                  <button
                    key={item.count}
                    type="button"
                    onClick={() => handleSelect(item.count)}
                    className={`py-3.5 px-3 rounded-xl border font-cinzel text-center transition-all duration-300 relative cursor-pointer ${
                      isSelected
                        ? 'bg-[#0f2334] border-[#ffd700] text-white shadow-[0_0_20px_rgba(255,215,0,0.4)] scale-105'
                        : 'bg-[#04090f] border-[#3a2e1d] text-gray-400 hover:border-[#ffd700] hover:text-white'
                    }`}
                  >
                    <div className="font-pirate font-black text-2xl sm:text-3xl text-[#ffd700]">
                      {item.count}
                    </div>
                    <div className="text-[10px] tracking-wider uppercase text-gray-300 mt-0.5">
                      PIRATES
                    </div>
                    {isSelected && (
                      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#ffd700] text-black flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="bg-[#04090f] border border-[#3a2e1d] p-3 rounded-xl flex items-center space-x-3 text-xs font-cinzel text-gray-300">
              <ShieldCheck className="w-4 h-4 text-[#ffd700] flex-shrink-0" />
              <span>{currentConfig.label} • All 24hr Meals, Midnight Tavern Coffee & Swag Included</span>
            </div>
          </div>

          {/* Computed Amount Display Box */}
          <div className="md:col-span-5 bg-gradient-to-b from-[#0c1e2d] to-[#04090f] border-2 border-[#ffd700] rounded-2xl p-5 text-center shadow-[0_0_25px_rgba(255,215,0,0.3)] relative">
            <div className="font-cinzel text-[11px] text-gray-400 uppercase tracking-wider mb-1">
              TOTAL CREW TRIBUTE
            </div>

            <div className="font-pirate font-black text-4xl sm:text-5xl text-[#ffd700] pirate-gold-glow my-2">
              ₹{currentConfig.fee.toLocaleString()}
            </div>

            <div className="font-mono text-[11px] text-[#e5c158] mb-4">
              (₹{EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER} × {currentConfig.count} pirates)
            </div>

            <Link
              to="/register"
              className={`inline-flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl font-cinzel font-bold text-xs uppercase ${
                isClosed
                  ? 'bg-[#220a0a] border border-red-500/50 text-red-400 hover:bg-[#300e0e] shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                  : 'bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#b8860b] text-black hover:from-[#ffe043] hover:to-[#d4af37] shadow-[0_0_15px_rgba(255,215,0,0.5)]'
              } transition-all active:scale-95`}
            >
              {isClosed ? <Lock className="w-3.5 h-3.5 text-red-400" /> : null}
              <span>{isClosed ? 'REGISTRATION CLOSED' : 'REGISTER CREW'}</span>
              {!isClosed && <ArrowRight className="w-3.5 h-3.5" />}
            </Link>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
};

export default TeamFeeCalculator;
