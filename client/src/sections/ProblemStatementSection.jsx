import React from 'react';
import { Lock, EyeOff, Sparkles, ShieldCheck } from 'lucide-react';

const ProblemStatementSection = () => {
  return (
    <section id="problem-statement" className="relative py-24 px-4 z-10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-gradient-to-b from-[#0a180f] via-[#06140b] to-[#040e08] border-2 border-[#00ff66] rounded-3xl p-8 sm:p-14 shadow-[0_0_50px_rgba(0,255,102,0.3)] backdrop-blur-md relative overflow-hidden hud-corner-box">
          {/* Top Classification Tag */}
          <div className="inline-flex items-center space-x-2 bg-[#00ff66]/10 border border-[#00ff66]/40 px-4 py-1.5 rounded-full text-xs font-mono text-[#00ff66] mb-6 uppercase tracking-widest shadow-[0_0_15px_rgba(0,255,102,0.2)]">
            <EyeOff className="w-4 h-4 text-[#00ff66]" />
            <span>// CLASSIFIED DIRECTIVE</span>
          </div>

          {/* Cyber Lock Icon */}
          <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#0f2416] border-2 border-[#00ff66] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,255,102,0.45)]">
            <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-[#00ff66] animate-pulse" />
          </div>

          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white mb-6 tracking-wide">
            PROBLEM <span className="text-[#00ff66]">STATEMENT</span>
          </h2>

          <div className="bg-[#040e08] border-2 border-[#10b981]/60 rounded-2xl p-6 sm:p-8 max-w-2xl mx-auto shadow-inner my-4">
            <p className="font-orbitron font-black text-xl sm:text-2xl md:text-3xl text-[#00ff66] neon-glow-green leading-relaxed uppercase tracking-wider">
              “THE PROBLEM STATEMENT WILL BE REVEALED ON THE SPOT DURING THE HACKATHON.”
            </p>
          </div>

          <p className="font-mono text-xs sm:text-sm text-gray-300 mt-6 max-w-lg mx-auto leading-relaxed">
            All registered squads will receive synchronized access to the official problem statements simultaneously during the Grand Opening Ceremony.
          </p>

          <div className="mt-8 pt-6 border-t border-gray-800/80 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-gray-400">
            <span className="flex items-center space-x-1.5 text-[#00ff66]">
              <ShieldCheck className="w-4 h-4" />
              <span>Equal Evaluation Playground</span>
            </span>
            <span>•</span>
            <span className="text-gray-300">Release: Day 1 (Opening Ceremony)</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemStatementSection;
