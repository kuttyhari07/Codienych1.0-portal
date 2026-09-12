import React from 'react';
import { Cpu, Code, Lightbulb, Flame } from 'lucide-react';
import { EVENT_CONFIG } from '../utils/config';

const AboutSection = () => {
  return (
    <section id="about" className="relative py-24 px-4 z-10">
      <div className="max-w-5xl mx-auto">
        <div className="bg-[#0a140e]/90 border border-[#1b3524] rounded-2xl p-8 sm:p-12 shadow-[0_0_30px_rgba(0,0,0,0.8)] backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#00ff66]/10 rounded-full blur-3xl" />

          <div className="inline-block font-mono text-xs text-[#00ff66] tracking-widest uppercase mb-2">
            // BRIEFING DISPATCH
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white mb-6 tracking-wide">
            ABOUT <span className="text-[#00ff66]">{EVENT_CONFIG.EVENT_NAME}</span>
          </h2>

          <p className="font-sans text-lg sm:text-xl text-gray-300 leading-relaxed mb-10 border-l-4 border-[#00ff66] pl-6">
            CODIENYCH 1.0 is a 24-hour hackathon where participants collaborate, innovate and build solutions within a limited time.
          </p>

          {/* Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0f1e14] border border-[#1b3524] rounded-xl p-6 hover:border-[#10b981] transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#05140b] border border-[#10b981] flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-[#00ff66]" />
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white mb-2">24 HOURS HACK</h3>
              <p className="font-mono text-xs text-gray-400">
                Non-stop software development challenge testing endurance, speed, and clean code architecture.
              </p>
            </div>

            <div className="bg-[#0f1e14] border border-[#1b3524] rounded-xl p-6 hover:border-[#10b981] transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#05140b] border border-[#10b981] flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-[#00ff66]" />
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white mb-2">PURE INNOVATION</h3>
              <p className="font-mono text-xs text-gray-400">
                Brainstorm, architect, and ship real-world tech solutions addressing complex problem statements.
              </p>
            </div>

            <div className="bg-[#0f1e14] border border-[#1b3524] rounded-xl p-6 hover:border-[#10b981] transition-all">
              <div className="w-12 h-12 rounded-lg bg-[#05140b] border border-[#10b981] flex items-center justify-center mb-4">
                <Flame className="w-6 h-6 text-[#00ff66]" />
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white mb-2">TEAM SQUAD</h3>
              <p className="font-mono text-xs text-gray-400">
                Form a tactical squad of 4 to 6 members led by a Team Leader to compete for glory and cash prizes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
