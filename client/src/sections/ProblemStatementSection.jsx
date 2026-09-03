import React from 'react';
import { Lock, EyeOff, ShieldAlert } from 'lucide-react';

const ProblemStatementSection = () => {
  return (
    <section id="problem-statement" className="relative py-24 px-4 z-10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-[#0a140e]/95 border-2 border-[#1b3524] rounded-2xl p-8 sm:p-14 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-md relative overflow-hidden">
          {/* Cyber Lock Aesthetic */}
          <div className="mx-auto w-20 h-20 rounded-2xl bg-[#0f2416] border-2 border-[#00ff66] flex items-center justify-center mb-6 shadow-[0_0_25px_rgba(0,255,102,0.4)]">
            <Lock className="w-10 h-10 text-[#00ff66]" />
          </div>

          <div className="inline-flex items-center space-x-2 bg-[#00ff66]/10 border border-[#00ff66]/40 px-3 py-1 rounded-full text-xs font-mono text-[#00ff66] mb-4 uppercase tracking-widest">
            <EyeOff className="w-4 h-4" />
            <span>CLASSIFIED PROTOCOL</span>
          </div>

          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white mb-6 tracking-wide">
            PROBLEM STATEMENT
          </h2>

          <div className="bg-[#040e08] border border-[#10b981]/50 rounded-xl p-8 max-w-2xl mx-auto shadow-inner">
            <p className="font-orbitron font-bold text-xl sm:text-2xl text-[#00ff66] neon-glow-green leading-relaxed uppercase tracking-wider">
              “THE PROBLEM STATEMENT WILL BE REVEALED ON THE SPOT DURING THE HACKATHON.”
            </p>
          </div>

          <p className="font-mono text-xs text-gray-400 mt-6 max-w-md mx-auto">
            All teams will receive identical access to problem statements simultaneously at the grand opening ceremony.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemStatementSection;
