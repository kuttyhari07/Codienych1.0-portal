import React from 'react';
import { Award, Lock, Sparkles, Trophy, Crown, Gift } from 'lucide-react';
import TreasureBox from '../components/TreasureBox';
import SpotlightCard from '../components/SpotlightCard';
import DecipherText from '../components/DecipherText';

const PrizesSection = () => {
  return (
    <section id="prizes" className="relative py-24 px-4 z-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block font-cinzel font-bold text-xs text-[#ffd700] tracking-widest uppercase mb-2">
            // CARIBBEAN BOUNTIES & PLUNDER
          </div>
          <h2 className="font-pirate text-4xl sm:text-6xl text-white tracking-wide mb-3">
            SURPRISE <span className="text-[#ffd700] pirate-gold-title"><DecipherText text="CASH BOUNTIES" /></span>
          </h2>
          <p className="font-cinzel text-xs sm:text-sm text-[#e5c158] uppercase tracking-widest font-semibold">
            THE TREASURE IS CLASSIFIED — OPEN DAVY JONES' CHEST TO REVEAL
          </p>
        </div>

        {/* Interactive Treasure Box Component */}
        <div id="treasure">
          <TreasureBox />
        </div>

        {/* Surprise Prize Spotlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* 1st Prize */}
          <SpotlightCard
            borderColor="border-2 border-[#ffd700]"
            spotlightColor="rgba(255, 215, 0, 0.25)"
            className="p-8 text-center shadow-[0_0_35px_rgba(229,193,88,0.3)] bg-gradient-to-b from-[#1c150c] to-[#08121a]"
          >
            <div className="text-5xl mb-4 animate-bounce">👑</div>
            <h3 className="font-pirate text-3xl text-[#ffd700] mb-1">
              <DecipherText text="1st Bounty" />
            </h3>
            <div className="inline-flex items-center space-x-1 text-[#ffd700] font-cinzel text-xs bg-[#ffd700]/10 border border-[#ffd700]/40 px-3 py-1 rounded-full my-3 font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>CLASSIFIED BOUNTY</span>
            </div>
            <p className="font-cinzel text-xs text-[#ffd700] font-bold mt-2">
              + Free Internship Opportunity
            </p>
            <p className="font-cinzel text-xs text-gray-300 mt-1">
              Unveiled at the Grand Opening Ceremony!
            </p>
          </SpotlightCard>

          {/* 2nd Prize */}
          <SpotlightCard
            borderColor="border border-[#e5c158]"
            spotlightColor="rgba(0, 229, 255, 0.2)"
            className="p-8 text-center shadow-lg bg-gradient-to-b from-[#141d26] to-[#08121a]"
          >
            <div className="text-5xl mb-4 animate-bounce" style={{ animationDelay: '0.2s' }}>🥈</div>
            <h3 className="font-pirate text-3xl text-white mb-1">
              <DecipherText text="2nd Bounty" />
            </h3>
            <div className="inline-flex items-center space-x-1 text-[#00e5ff] font-cinzel text-xs bg-[#00e5ff]/10 border border-[#00e5ff]/40 px-3 py-1 rounded-full my-3 font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>CLASSIFIED BOUNTY</span>
            </div>
            <p className="font-cinzel text-xs text-[#00e5ff] font-bold mt-2">
              + Free Internship Opportunity
            </p>
            <p className="font-cinzel text-xs text-gray-300 mt-1">
              Unveiled at the Grand Opening Ceremony!
            </p>
          </SpotlightCard>

          {/* 3rd Prize */}
          <SpotlightCard
            borderColor="border border-[#8a6d1b]"
            spotlightColor="rgba(229, 193, 88, 0.15)"
            className="p-8 text-center shadow-lg bg-gradient-to-b from-[#14120e] to-[#08121a]"
          >
            <div className="text-5xl mb-4 animate-bounce" style={{ animationDelay: '0.4s' }}>🥉</div>
            <h3 className="font-pirate text-3xl text-white mb-1">
              <DecipherText text="3rd Bounty" />
            </h3>
            <div className="inline-flex items-center space-x-1 text-[#e5c158] font-cinzel text-xs bg-[#e5c158]/10 border border-[#e5c158]/40 px-3 py-1 rounded-full my-3 font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>CLASSIFIED BOUNTY</span>
            </div>
            <p className="font-cinzel text-xs text-gray-200 font-bold mt-2">
              + Special Goodies & Perks
            </p>
            <p className="font-cinzel text-xs text-gray-400 mt-1">
              Unveiled at the Grand Opening Ceremony!
            </p>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
};

export default PrizesSection;
