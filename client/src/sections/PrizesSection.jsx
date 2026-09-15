import React from 'react';
import { Award, Lock, Sparkles, Briefcase, GraduationCap, CheckCircle2, Gift } from 'lucide-react';
import TreasureBox from '../components/TreasureBox';

const PrizesSection = () => {
  return (
    <section id="prizes" className="relative py-24 px-4 z-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block font-mono text-xs text-[#00ff66] tracking-widest uppercase mb-2">
            // REWARDS & BOUNTIES
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-5xl text-white tracking-wide mb-4">
            SURPRISE <span className="text-[#00ff66]">PRIZES</span>
          </h2>
          <p className="font-mono text-sm text-[#10b981] uppercase tracking-widest">
            THE PRIZES ARE A SURPRISE — WAIT FOR THE REVEAL
          </p>
        </div>

        {/* Free Internship Announcement Banner */}
        <div className="mb-12 bg-gradient-to-r from-[#00ff66]/15 via-[#10b981]/10 to-[#00ff66]/15 border-2 border-[#00ff66] rounded-2xl p-6 sm:p-8 shadow-[0_0_35px_rgba(0,255,102,0.25)] relative overflow-hidden transform hover:-translate-y-0.5 transition-all">
          <div className="absolute top-0 right-0 bg-[#00ff66] text-black font-orbitron font-extrabold text-[10px] sm:text-xs px-4 py-1 rounded-bl-xl uppercase tracking-wider shadow-lg">
            🔥 Exclusive Career Perk
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-5">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#050b07] border-2 border-[#00ff66] flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(0,255,102,0.4)]">
                <Briefcase className="w-7 h-7 sm:w-8 sm:h-8 text-[#00ff66]" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs text-[#00ff66] font-bold uppercase tracking-wider">
                    CAREER ACCELERATOR
                  </span>
                  <Sparkles className="w-4 h-4 text-[#00ff66] animate-pulse" />
                </div>
                <h3 className="font-orbitron font-extrabold text-xl sm:text-2xl text-white mt-1 mb-1.5">
                  FREE INTERNSHIP <span className="text-[#00ff66]">OFFER</span>
                </h3>
                <p className="font-mono text-xs sm:text-sm text-gray-300">
                  Along with the surprise cash bounties, top performers and winning teams will be provided with <strong className="text-[#00ff66]">Free Internship Opportunities</strong> to gain direct real-world industry experience!
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 sm:gap-3 flex-shrink-0">
              <div className="bg-[#050b07]/80 border border-[#00ff66]/40 px-3 py-2 rounded-xl flex items-center space-x-2 font-mono text-xs text-gray-200">
                <GraduationCap className="w-4 h-4 text-[#00ff66]" />
                <span>Industry Exposure</span>
              </div>
              <div className="bg-[#050b07]/80 border border-[#00ff66]/40 px-3 py-2 rounded-xl flex items-center space-x-2 font-mono text-xs text-[#00ff66]">
                <CheckCircle2 className="w-4 h-4 text-[#00ff66]" />
                <span>Direct Offer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Treasure Box Component */}
        <div id="treasure">
          <TreasureBox />
        </div>

        {/* Surprise Prize Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {/* 1st Prize */}
          <div className="bg-[#0a140e]/90 border-2 border-[#00ff66] rounded-2xl p-8 text-center shadow-[0_0_30px_rgba(0,255,102,0.3)] relative overflow-hidden transform hover:-translate-y-1 transition-all">
            <div className="text-5xl mb-4">🥇</div>
            <h3 className="font-orbitron font-extrabold text-2xl text-white mb-2">
              1st Prize
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
          </div>

          {/* 2nd Prize */}
          <div className="bg-[#0a140e]/90 border border-[#10b981] rounded-2xl p-8 text-center shadow-lg relative overflow-hidden transform hover:-translate-y-1 transition-all">
            <div className="text-5xl mb-4">🥈</div>
            <h3 className="font-orbitron font-extrabold text-2xl text-white mb-2">
              2nd Prize
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
          </div>

          {/* 3rd Prize */}
          <div className="bg-[#0a140e]/90 border border-[#1b3524] rounded-2xl p-8 text-center shadow-lg relative overflow-hidden transform hover:-translate-y-1 transition-all">
            <div className="text-5xl mb-4">🥉</div>
            <h3 className="font-orbitron font-extrabold text-2xl text-white mb-2">
              3rd Prize
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrizesSection;
