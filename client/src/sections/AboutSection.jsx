import React from 'react';
import { Cpu, Code, Lightbulb, Flame, Zap } from 'lucide-react';
import { EVENT_CONFIG } from '../utils/config';
import SpotlightCard from '../components/SpotlightCard';
import DecipherText from '../components/DecipherText';
import LiveWarRoomTelemetry from '../components/LiveWarRoomTelemetry';

const AboutSection = () => {
  return (
    <section id="about" className="relative py-24 px-4 z-10">
      <div className="max-w-5xl mx-auto">
        <SpotlightCard className="p-8 sm:p-12 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#00ff66]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-block font-mono text-xs text-[#00ff66] tracking-widest uppercase mb-2">
            // BRIEFING DISPATCH
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white mb-6 tracking-wide">
            ABOUT <span className="text-[#00ff66]"><DecipherText text={EVENT_CONFIG.EVENT_NAME} /></span>
          </h2>

          <p className="font-sans text-lg sm:text-xl text-gray-300 leading-relaxed mb-10 border-l-4 border-[#00ff66] pl-6">
            CODIENYCH 1.0 is a 24-hour hackathon where participants collaborate, innovate and build solutions within a limited time.
          </p>

          {/* Core Pillars with Spotlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SpotlightCard className="p-6">
              <div className="w-12 h-12 rounded-xl bg-[#05140b] border border-[#10b981] flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(0,255,102,0.3)]">
                <Code className="w-6 h-6 text-[#00ff66]" />
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white mb-2">
                <DecipherText text="24 HOURS HACK" />
              </h3>
              <p className="font-mono text-xs text-gray-300 leading-relaxed">
                Non-stop software development challenge testing endurance, speed, and clean code architecture.
              </p>
            </SpotlightCard>

            <SpotlightCard className="p-6">
              <div className="w-12 h-12 rounded-xl bg-[#05140b] border border-[#10b981] flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(0,255,102,0.3)]">
                <Lightbulb className="w-6 h-6 text-[#00ff66]" />
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white mb-2">
                <DecipherText text="PURE INNOVATION" />
              </h3>
              <p className="font-mono text-xs text-gray-300 leading-relaxed">
                Brainstorm, architect, and ship real-world tech solutions addressing complex problem statements.
              </p>
            </SpotlightCard>

            <SpotlightCard className="p-6">
              <div className="w-12 h-12 rounded-xl bg-[#05140b] border border-[#10b981] flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(0,255,102,0.3)]">
                <Flame className="w-6 h-6 text-[#00ff66]" />
              </div>
              <h3 className="font-orbitron font-bold text-lg text-white mb-2">
                <DecipherText text="TEAM SQUAD" />
              </h3>
              <p className="font-mono text-xs text-gray-300 leading-relaxed">
                Form a tactical squad of 4 to 6 members led by a Team Leader to compete for glory and cash prizes.
              </p>
            </SpotlightCard>
          </div>

          {/* Interactive Live Mission War Room Telemetry */}
          <LiveWarRoomTelemetry />
        </SpotlightCard>
      </div>
    </section>
  );
};

export default AboutSection;
