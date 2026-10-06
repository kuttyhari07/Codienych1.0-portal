import React from 'react';
import { Calendar, Clock, AlertTriangle, Coins, Compass, Lock } from 'lucide-react';
import { EVENT_CONFIG } from '../utils/config';
import SpotlightCard from '../components/SpotlightCard';
import DecipherText from '../components/DecipherText';
import TeamFeeCalculator from '../components/TeamFeeCalculator';
import useRegistrationStatus from '../utils/useRegistrationStatus';

const DatesSection = () => {
  const { isClosed, isSpecialSlotOpen } = useRegistrationStatus();
  return (
    <section id="dates" className="relative py-20 px-4 z-10">
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-block font-cinzel font-bold text-xs text-[#ffd700] tracking-widest uppercase mb-2">
          // SHIP LOG & VOYAGE CHARTER
        </div>
        <h2 className="font-pirate text-4xl sm:text-6xl text-white mb-10 tracking-wide">
          CRITICAL <span className="text-[#ffd700] pirate-gold-title"><DecipherText text="DATES & BOUNTY CHARTER" /></span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Registration Deadline */}
          <SpotlightCard className="p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-[#1c1409] to-[#08121a]">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#140e06] border border-[#e5c158] flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(229,193,88,0.35)]">
                <AlertTriangle className="w-7 h-7 text-[#ffd700]" />
              </div>
              <h3 className="font-cinzel font-bold text-xs text-[#cfb07a] uppercase tracking-widest mb-2">
                <DecipherText text="CREW ENLISTMENT DEADLINE" />
              </h3>
              <div className="font-pirate text-3xl sm:text-4xl text-[#ffd700] pirate-gold-title mb-3">
                {EVENT_CONFIG.REGISTRATION_DEADLINE_DISPLAY}
              </div>
              {isClosed ? (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/70 text-red-400 text-xs font-mono font-bold mb-3 shadow-[0_0_10px_rgba(239,68,68,0.4)]">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span>REGISTRATION CLOSED</span>
                </div>
              ) : isSpecialSlotOpen ? (
                <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/80 text-emerald-300 text-xs font-mono font-bold mb-3 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>1 FINAL CREW SLOT UNLOCKED</span>
                </div>
              ) : (
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-950/90 border border-red-500/80 text-red-400 text-xs font-mono font-bold mb-3 shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>CLOSING TONIGHT AT 11:59 PM</span>
                </div>
              )}
            </div>
            <p className="font-cinzel text-xs text-gray-300">
              {isClosed
                ? 'Port manifest sealed. No late crew recruits admitted.'
                : isSpecialSlotOpen
                ? 'Special Admiralty Dispatch: 1 final fleet slot opened. Claim before it seals!'
                : 'Port manifest seals strictly tonight at 11:59:59 PM IST (October 6, 2026). Automatic portal lockdown at midnight!'}
            </p>
          </SpotlightCard>

          {/* Card 2: Hackathon Date */}
          <SpotlightCard className="p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-[#0f1d2b] to-[#08121a]">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#081724] border border-[#00e5ff] flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(0,229,255,0.35)]">
                <Calendar className="w-7 h-7 text-[#00e5ff]" />
              </div>
              <h3 className="font-cinzel font-bold text-xs text-[#00e5ff] uppercase tracking-widest mb-2">
                <DecipherText text="EXPEDITION DATES" />
              </h3>
              <div className="font-pirate text-3xl sm:text-4xl text-white mb-3">
                {EVENT_CONFIG.HACKATHON_DATES_DISPLAY}
              </div>
            </div>
            <p className="font-cinzel text-xs text-[#00e5ff]">
              24 Hours Continuous Voyage on the High Coding Seas
            </p>
          </SpotlightCard>

          {/* Card 3: Registration Fee */}
          <SpotlightCard className="p-6 sm:p-8 flex flex-col justify-between bg-gradient-to-b from-[#1c1409] to-[#08121a]">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-[#140e06] border border-[#ffd700] flex items-center justify-center mx-auto mb-5 shadow-[0_0_20px_rgba(255,215,0,0.35)]">
                <Coins className="w-7 h-7 text-[#ffd700]" />
              </div>
              <h3 className="font-cinzel font-bold text-xs text-[#cfb07a] uppercase tracking-widest mb-2">
                <DecipherText text="CREW BOUNTY FEE" />
              </h3>
              <div className="font-pirate text-3xl sm:text-4xl text-[#ffd700] pirate-gold-title mb-3">
                ₹{EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER} <span className="text-xs text-gray-400 font-cinzel">/ PIRATE</span>
              </div>
            </div>
            <p className="font-cinzel text-xs text-[#f4e6c3]">
              ₹{(3 * EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER).toLocaleString()} (3 crew) | ₹{(4 * EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER).toLocaleString()} (4 crew) | ₹{(5 * EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER).toLocaleString()} (5 crew) | ₹{(6 * EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER).toLocaleString()} (6 crew)
            </p>
          </SpotlightCard>
        </div>

        {/* Interactive Crew Fee Live Simulator */}
        <TeamFeeCalculator />
      </div>
    </section>
  );
};

export default DatesSection;
