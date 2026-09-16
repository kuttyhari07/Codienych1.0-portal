import React, { useState } from 'react';
import { CheckCircle2, Skull, Scroll, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SpotlightCard from '../components/SpotlightCard';
import DecipherText from '../components/DecipherText';
import { playLaserBlip } from '../utils/cyberSound';

const teamRulesList = [
  'Each crew must consist of 4 to 6 pirate members.',
  'Exactly one Captain (Team Leader) per crew.',
  'Only the Captain registers the entire crew.',
  'Crew members do not register separately.',
  'One registration represents the entire pirate crew.',
  'One crew receives one unique Registration ID.',
  'College/University ID cards of all crew members must be presented at port.',
  'All crew members must be physically present at the event venue during the voyage.',
  'This hackathon is only for other college students (Not for ESEC students).',
];

const TeamRulesSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    playLaserBlip();
    setIsOpen(prev => !prev);
  };

  return (
    <section id="team-rules" className="relative py-16 sm:py-24 px-4 z-10">
      <div className="max-w-4xl mx-auto">
        {/* Interactive Pirate Scroll Header / Banner (Click to toggle open/close) */}
        <div
          role="button"
          tabIndex={0}
          aria-expanded={isOpen}
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle();
            }
          }}
          className="group relative cursor-pointer select-none rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-[#141e28]/95 via-[#0b141d]/95 to-[#08121a]/95 border-2 border-[#544023] hover:border-[#ffd700] transition-all duration-300 shadow-[0_10px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_0_35px_rgba(255,215,0,0.25)] text-center"
        >
          {/* Top Vintage Scroll Rod / Finial Ornaments */}
          <div className="flex items-center justify-between mb-4 px-2 opacity-80 group-hover:opacity-100 transition-opacity">
            <div className="flex items-center space-x-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-[#ffd700] to-[#8c6d23] shadow-[0_0_8px_#ffd700]" />
              <div className="w-12 sm:w-20 h-1.5 rounded-full bg-gradient-to-r from-[#ffd700] to-transparent" />
            </div>
            <div className="flex items-center space-x-2 text-[11px] sm:text-xs font-cinzel tracking-widest text-[#ffd700] uppercase font-bold">
              <Scroll className="w-4 h-4 text-[#ffd700]" />
              <span>PIRATE SCROLL // CREW ARTICLES</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-12 sm:w-20 h-1.5 rounded-full bg-gradient-to-l from-[#ffd700] to-transparent" />
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-bl from-[#ffd700] to-[#8c6d23] shadow-[0_0_8px_#ffd700]" />
            </div>
          </div>

          <div className="inline-block font-cinzel font-bold text-xs text-[#ffd700] tracking-widest uppercase mb-2">
            // PIRATE CODE // CREW ARTICLES
          </div>
          <h2 className="font-pirate text-3xl sm:text-5xl md:text-6xl text-white tracking-wide">
            CREW FORMATION <span className="text-[#ffd700] pirate-gold-title"><DecipherText text="ARTICLES" /></span>
          </h2>

          <p className="font-cinzel text-xs sm:text-sm text-gray-300 mt-2 max-w-xl mx-auto">
            Mandatory pirate laws binding every crew docking at the hackathon fleet.
          </p>

          {/* Interactive Click Indicator Pill */}
          <div className="mt-5 inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#1c150c] border border-[#ffd700]/70 group-hover:border-[#ffd700] group-hover:bg-[#281e10] shadow-[0_0_15px_rgba(255,215,0,0.25)] transition-all">
            <Scroll className="w-4 h-4 text-[#ffd700]" />
            <span className="font-cinzel font-bold text-xs sm:text-sm text-[#ffd700] tracking-wider uppercase">
              {isOpen ? 'Click to Roll Up Scroll' : 'Click to Unroll Crew Articles (9 Articles)'}
            </span>
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-[#ffd700] transition-transform group-hover:-translate-y-0.5" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#ffd700] transition-transform group-hover:translate-y-0.5 animate-bounce" />
            )}
          </div>
        </div>

        {/* Parchment Scroll Unrolling Body (From closed to open, and open to closed) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, scaleY: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scaleY: 1 }}
              exit={{ opacity: 0, height: 0, scaleY: 0.95 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'top center' }}
              className="overflow-hidden"
            >
              <div className="mt-6 p-4 sm:p-8 rounded-2xl bg-[#08121a]/95 border-2 border-[#d4af37]/40 shadow-[0_20px_50px_rgba(0,0,0,0.7)] backdrop-blur-md relative">
                {/* Scroll Watermark */}
                <div className="absolute top-4 right-4 pointer-events-none opacity-10">
                  <Skull className="w-32 h-32 text-[#ffd700]" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 relative z-10">
                  {teamRulesList.map((rule, idx) => (
                    <SpotlightCard
                      key={idx}
                      className="p-6 flex items-start space-x-4 bg-[#0a1520]/95 border-[#4a381e] hover:border-[#ffd700]/70 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#1c150c] border border-[#ffd700] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-[0_0_10px_rgba(255,215,0,0.3)]">
                        <CheckCircle2 className="w-5 h-5 text-[#ffd700]" />
                      </div>
                      <div>
                        <span className="font-cinzel font-bold text-xs text-[#e5c158] block mb-1">
                          ARTICLE 0{idx + 1}
                        </span>
                        <p className="font-cinzel text-gray-200 text-sm sm:text-base leading-snug">
                          {rule}
                        </p>
                      </div>
                    </SpotlightCard>
                  ))}
                </div>

                {/* Bottom Roll Up Button */}
                <div className="mt-8 text-center pt-4 border-t border-[#3a2c1a] relative z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggle();
                    }}
                    className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-[#1c150c] hover:bg-[#281e10] border border-[#ffd700]/60 hover:border-[#ffd700] text-xs font-cinzel font-bold text-[#ffd700] tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(255,215,0,0.2)]"
                  >
                    <ChevronUp className="w-4 h-4 text-[#ffd700]" />
                    <span>Roll Up Crew Articles Scroll</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TeamRulesSection;
