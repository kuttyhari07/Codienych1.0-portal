import React from 'react';
import { Calendar, Clock, AlertTriangle, CreditCard } from 'lucide-react';
import { EVENT_CONFIG } from '../utils/config';
import SpotlightCard from '../components/SpotlightCard';
import DecipherText from '../components/DecipherText';
import TeamFeeCalculator from '../components/TeamFeeCalculator';

const DatesSection = () => {
  return (
    <section id="dates" className="relative py-20 px-4 z-10">
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-block font-mono text-xs text-[#00ff66] tracking-widest uppercase mb-2">
          // TIMEFRAME & ENTRY DETAILS
        </div>
        <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white mb-12 tracking-wide">
          IMPORTANT <span className="text-[#00ff66]"><DecipherText text="DETAILS & DATES" /></span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Registration Deadline */}
          <SpotlightCard className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-xl bg-[#0f2416] border border-[#10b981] flex items-center justify-center mx-auto mb-5 shadow-[0_0_15px_rgba(0,255,102,0.3)]">
                <AlertTriangle className="w-7 h-7 text-[#00ff66]" />
              </div>
              <h3 className="font-orbitron font-bold text-xs text-gray-400 uppercase tracking-widest mb-2">
                <DecipherText text="REGISTRATION DEADLINE" />
              </h3>
              <div className="font-orbitron font-black text-2xl sm:text-3xl text-[#00ff66] neon-glow-green mb-3">
                {EVENT_CONFIG.REGISTRATION_DEADLINE_DISPLAY}
              </div>
            </div>
            <p className="font-mono text-xs text-gray-400">
              Registration closes at 11:59 PM. No late entries permitted.
            </p>
          </SpotlightCard>

          {/* Card 2: Hackathon Date */}
          <SpotlightCard className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-xl bg-[#0f2416] border border-[#00ff66] flex items-center justify-center mx-auto mb-5 shadow-[0_0_15px_rgba(0,255,102,0.3)]">
                <Calendar className="w-7 h-7 text-[#00ff66]" />
              </div>
              <h3 className="font-orbitron font-bold text-xs text-gray-400 uppercase tracking-widest mb-2">
                <DecipherText text="HACKATHON DATES" />
              </h3>
              <div className="font-orbitron font-black text-2xl sm:text-3xl text-white mb-3">
                {EVENT_CONFIG.HACKATHON_DATES_DISPLAY}
              </div>
            </div>
            <p className="font-mono text-xs text-[#10b981]">
              24 Hours Continuous Live Hackathon Challenge
            </p>
          </SpotlightCard>

          {/* Card 3: Registration Fee */}
          <SpotlightCard className="p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-xl bg-[#0f2416] border border-[#00ff66] flex items-center justify-center mx-auto mb-5 shadow-[0_0_15px_rgba(0,255,102,0.3)]">
                <CreditCard className="w-7 h-7 text-[#00ff66]" />
              </div>
              <h3 className="font-orbitron font-bold text-xs text-gray-400 uppercase tracking-widest mb-2">
                <DecipherText text="REGISTRATION FEE" />
              </h3>
              <div className="font-orbitron font-black text-2xl sm:text-3xl text-[#00ff66] neon-glow-green mb-3">
                ₹{EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER} <span className="text-xs text-gray-400 font-mono">/ HEAD</span>
              </div>
            </div>
            <p className="font-mono text-xs text-gray-300">
              ₹2,100 (4 mem) | ₹2,625 (5 mem) | ₹3,150 (6 mem)
            </p>
          </SpotlightCard>
        </div>

        {/* Interactive Squad Fee Live Simulator */}
        <TeamFeeCalculator />
      </div>
    </section>
  );
};

export default DatesSection;
