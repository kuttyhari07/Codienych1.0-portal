import React from 'react';
import { Anchor, Code, Compass, Flame, Skull, Swords } from 'lucide-react';
import { EVENT_CONFIG } from '../utils/config';
import SpotlightCard from '../components/SpotlightCard';
import DecipherText from '../components/DecipherText';
import LiveWarRoomTelemetry from '../components/LiveWarRoomTelemetry';

const AboutSection = () => {
  return (
    <section id="about" className="relative py-24 px-4 z-10">
      <div className="max-w-5xl mx-auto">
        <SpotlightCard className="p-8 sm:p-12 shadow-[0_0_40px_rgba(0,0,0,0.8)] backdrop-blur-sm relative overflow-hidden bg-gradient-to-b from-[#140e06] via-[#08121a] to-[#04090e] border-[#5a4422]">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#ffd700]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-block font-cinzel font-bold text-xs text-[#ffd700] tracking-widest uppercase mb-2">
            // CAPTAIN'S LOG & EXPEDITION DOSSIER
          </div>
          <h2 className="font-pirate text-4xl sm:text-6xl text-white mb-6 tracking-wide">
            ABOUT <span className="text-[#ffd700] pirate-gold-title"><DecipherText text={EVENT_CONFIG.EVENT_NAME} /></span>
          </h2>

          <p className="font-cinzel text-base sm:text-xl text-[#f4e6c3] leading-relaxed mb-10 border-l-4 border-[#ffd700] pl-6 italic">
            CODIENYCH 1.0 is a 24-hour hackathon where pirate crews collaborate, innovate, and architect cutting-edge solutions across the stormy digital seas.
          </p>

          {/* Core Pillars with Spotlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SpotlightCard className="p-6 bg-[#0c1622]/90 border-[#3a2c1a]">
              <div className="w-12 h-12 rounded-xl bg-[#1c150c] border border-[#e5c158] flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(229,193,88,0.3)]">
                <Swords className="w-6 h-6 text-[#ffd700]" />
              </div>
              <h3 className="font-pirate text-2xl text-white mb-2">
                <DecipherText text="24-HOUR BATTLE" />
              </h3>
              <p className="font-cinzel text-xs text-gray-300 leading-relaxed">
                Non-stop software development challenge testing endurance, speed, and immaculate code architecture.
              </p>
            </SpotlightCard>

            <SpotlightCard className="p-6 bg-[#0c1622]/90 border-[#3a2c1a]">
              <div className="w-12 h-12 rounded-xl bg-[#1c150c] border border-[#00e5ff] flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(0,229,255,0.3)]">
                <Compass className="w-6 h-6 text-[#00e5ff]" />
              </div>
              <h3 className="font-pirate text-2xl text-white mb-2">
                <DecipherText text="PURE INNOVATION" />
              </h3>
              <p className="font-cinzel text-xs text-gray-300 leading-relaxed">
                Brainstorm, navigate, and ship real-world tech solutions addressing complex mysterious problem statements.
              </p>
            </SpotlightCard>

            <SpotlightCard className="p-6 bg-[#0c1622]/90 border-[#3a2c1a]">
              <div className="w-12 h-12 rounded-xl bg-[#1c150c] border border-[#ffd700] flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                <Skull className="w-6 h-6 text-[#ffd700]" />
              </div>
              <h3 className="font-pirate text-2xl text-white mb-2">
                <DecipherText text="PIRATE CREW SQUAD" />
              </h3>
              <p className="font-cinzel text-xs text-gray-300 leading-relaxed">
                Form a tactical crew of 3 to 6 pirates led by a Captain to compete for glory, bounties, and eternal fame.
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
