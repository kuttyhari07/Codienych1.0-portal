import React from 'react';
import { Calendar, Clock, AlertTriangle } from 'lucide-react';
import { EVENT_CONFIG } from '../utils/config';

const DatesSection = () => {
  return (
    <section id="dates" className="relative py-20 px-4 z-10">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block font-mono text-xs text-[#00ff66] tracking-widest uppercase mb-2">
          // TIMEFRAME DISPATCH
        </div>
        <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white mb-12 tracking-wide">
          IMPORTANT <span className="text-[#00ff66]">DATES</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Registration Deadline */}
          <div className="bg-[#0a140e]/90 border-2 border-[#1b3524] hover:border-[#10b981] rounded-2xl p-8 transition-all shadow-[0_0_20px_rgba(0,0,0,0.6)] relative overflow-hidden group">
            <div className="w-16 h-16 rounded-xl bg-[#0f2416] border border-[#10b981] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-8 h-8 text-[#00ff66]" />
            </div>
            <h3 className="font-orbitron font-bold text-sm text-gray-400 uppercase tracking-widest mb-2">
              REGISTRATION DEADLINE
            </h3>
            <div className="font-orbitron font-black text-3xl sm:text-4xl text-[#00ff66] neon-glow-green mb-4">
              {EVENT_CONFIG.REGISTRATION_DEADLINE_DISPLAY}
            </div>
            <p className="font-mono text-xs text-gray-400">
              Registration closes at 11:59 PM. No late entries permitted.
            </p>
          </div>

          {/* Card 2: Hackathon Date */}
          <div className="bg-[#0a140e]/90 border-2 border-[#1b3524] hover:border-[#00ff66] rounded-2xl p-8 transition-all shadow-[0_0_20px_rgba(0,0,0,0.6)] relative overflow-hidden group">
            <div className="w-16 h-16 rounded-xl bg-[#0f2416] border border-[#00ff66] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(0,255,102,0.3)]">
              <Calendar className="w-8 h-8 text-[#00ff66]" />
            </div>
            <h3 className="font-orbitron font-bold text-sm text-gray-400 uppercase tracking-widest mb-2">
              HACKATHON DATE
            </h3>
            <div className="font-orbitron font-black text-3xl sm:text-4xl text-white mb-4">
              {EVENT_CONFIG.HACKATHON_DATES_DISPLAY}
            </div>
            <p className="font-mono text-xs text-[#10b981]">
              24 Hours Continuous Live Hackathon Challenge
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DatesSection;
