import React from 'react';
import { Lock, EyeOff, Sparkles, ShieldCheck, Scroll, Compass } from 'lucide-react';

const ProblemStatementSection = () => {
  return (
    <section id="problem-statement" className="relative py-24 px-4 z-10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-b from-[#1c1409] via-[#0f1a26] to-[#04080e] border-2 border-[#e5c158] rounded-3xl p-8 sm:p-14 shadow-[0_0_50px_rgba(229,193,88,0.3)] backdrop-blur-md relative overflow-hidden hud-corner-box">
          {/* Top Classification Tag */}
          <div className="inline-flex items-center space-x-2 bg-[#ffd700]/10 border border-[#ffd700]/40 px-4 py-1.5 rounded-full text-xs font-cinzel text-[#ffd700] mb-6 uppercase tracking-widest shadow-[0_0_15px_rgba(229,193,88,0.2)] font-bold">
            <Scroll className="w-4 h-4 text-[#ffd700]" />
            <span>// SEALED CAPTAIN'S ORDERS</span>
          </div>

          {/* Pirate Skull Lock Icon */}
          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#140e06] border-2 border-[#ffd700] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,215,0,0.45)]">
            <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-[#ffd700] animate-pulse" />
          </div>

          <h2 className="font-pirate text-4xl sm:text-6xl text-white mb-6 tracking-wide">
            SECRET PIRATE <span className="text-[#ffd700] pirate-gold-title">QUEST & RIDDLE</span>
          </h2>

          <div className="bg-[#08121a] border-2 border-[#e5c158] rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-inner my-4">
            <p className="font-pirate text-2xl sm:text-3xl md:text-4xl text-[#ffd700] pirate-gold-title leading-relaxed uppercase tracking-wider">
              “THE PROBLEM STATEMENT WILL BE REVEALED ON THE SPOT AT EMBARKATION.”
            </p>
          </div>

          <p className="font-cinzel text-xs sm:text-sm text-gray-300 mt-6 max-w-lg mx-auto leading-relaxed">
            All registered crews will receive synchronized access to the official problem statements simultaneously during the Grand Opening Ceremony.
          </p>

          <div className="mt-8 pt-6 border-t border-[#3a2c1a] flex flex-wrap items-center justify-center gap-4 text-xs font-cinzel text-[#cfb07a]">
            <span className="flex items-center space-x-1.5 text-[#ffd700]">
              <ShieldCheck className="w-4 h-4" />
              <span>Equal Evaluation Playground</span>
            </span>
            <span>•</span>
            <span className="text-gray-300">Unsealed: Day 1 (Opening Ceremony)</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemStatementSection;
