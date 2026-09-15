import React from 'react';
import { Award, Lock, Sparkles } from 'lucide-react';
import TreasureBox from '../components/TreasureBox';
import SpotlightCard from '../components/SpotlightCard';
import DecipherText from '../components/DecipherText';

const PrizesSection = () => {
  return (
    <section id="prizes" className="relative py-24 px-4 z-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block font-mono text-xs text-[#00ff66] tracking-widest uppercase mb-2">
            // REWARDS & BOUNTIES
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-5xl text-white tracking-wide mb-4">
            SURPRISE <span className="text-[#00ff66]"><DecipherText text="PRIZES" /></span>
          </h2>
          <p className="font-mono text-sm text-[#10b981] uppercase tracking-widest">
            THE PRIZES ARE A SURPRISE — OPEN THE TREASURE BOX TO REVEAL
          </p>
        </div>

        {/* Interactive Treasure Box Component */}
        <div id="treasure">
          <TreasureBox />
        </div>

        {/* Surprise Prize Spotlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* 1st Prize */}
          <SpotlightCard borderColor="border-2 border-[#00ff66]" className="p-8 text-center shadow-[0_0_30px_rgba(0,255,102,0.3)]">
            <div className="text-5xl mb-4 animate-bounce">🥇</div>
            <h3 className="font-orbitron font-extrabold text-2xl text-white mb-2">
              <DecipherText text="1st Prize" />
            </h3>
            <div className="inline-flex items-center space-x-1 text-[#00ff66] font-mono text-xs bg-[#00ff66]/10 border border-[#00ff66]/40 px-3 py-1 rounded-full my-3">
              <Lock className="w-3.5 h-3.5" />
              <span>CLASSIFIED BOUNTY</span>
            </div>
            <p className="font-mono text-xs text-[#00ff66] font-bold mt-2">
              + Free Internship Opportunity
            </p>
            <p className="font-mono text-xs text-gray-400 mt-1">
              Wait for the Grand Opening Ceremony reveal!
            </p>
          </SpotlightCard>

          {/* 2nd Prize */}
          <SpotlightCard borderColor="border border-[#10b981]" className="p-8 text-center shadow-lg">
            <div className="text-5xl mb-4 animate-bounce" style={{ animationDelay: '0.2s' }}>🥈</div>
            <h3 className="font-orbitron font-extrabold text-2xl text-white mb-2">
              <DecipherText text="2nd Prize" />
            </h3>
            <div className="inline-flex items-center space-x-1 text-[#10b981] font-mono text-xs bg-[#10b981]/10 border border-[#10b981]/40 px-3 py-1 rounded-full my-3">
              <Lock className="w-3.5 h-3.5" />
              <span>CLASSIFIED BOUNTY</span>
            </div>
            <p className="font-mono text-xs text-[#10b981] font-bold mt-2">
              + Free Internship Opportunity
            </p>
            <p className="font-mono text-xs text-gray-400 mt-1">
              Wait for the Grand Opening Ceremony reveal!
            </p>
          </SpotlightCard>

          {/* 3rd Prize */}
          <SpotlightCard borderColor="border border-[#1b3524]" className="p-8 text-center shadow-lg">
            <div className="text-5xl mb-4 animate-bounce" style={{ animationDelay: '0.4s' }}>🥉</div>
            <h3 className="font-orbitron font-extrabold text-2xl text-white mb-2">
              <DecipherText text="3rd Prize" />
            </h3>
            <div className="inline-flex items-center space-x-1 text-gray-400 font-mono text-xs bg-gray-800/40 border border-gray-700 px-3 py-1 rounded-full my-3">
              <Lock className="w-3.5 h-3.5" />
              <span>CLASSIFIED BOUNTY</span>
            </div>
            <p className="font-mono text-xs text-gray-300 font-bold mt-2">
              + Special Goodies & Perks
            </p>
            <p className="font-mono text-xs text-gray-400 mt-1">
              Wait for the Grand Opening Ceremony reveal!
            </p>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
};

export default PrizesSection;
