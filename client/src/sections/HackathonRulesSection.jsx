import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Check, Skull, Scroll } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DecipherText from '../components/DecipherText';
import { playLaserBlip } from '../utils/cyberSound';

const rulesCategories = [
  {
    id: 'guidelines',
    title: 'Registration & Manifest Verification Guidelines',
    content: [
      'After completing registration, all pirate crews must track their approval/rejection status via the Voyage Status Tracker using their Registration ID.',
      'Port admirals will review payment proof and individual student ID cards before approving the registration.',
      'Approved / Confirmed crews must immediately join the Official Hackathon WhatsApp Fleet using the link provided in the Status Tracker.',
      'Important event updates, schedule alerts, and mentor announcements will be shared in the WhatsApp community.',
    ],
  },
  {
    id: 'eligibility',
    title: 'Eligibility & Crew Enlistment Rules',
    content: [
      'Open strictly to Undergraduate (UG) students from other recognized engineering colleges/universities.',
      'This hackathon is strictly for Other College Students (Not for ESEC Students).',
      'Valid official college physical ID card is mandatory for every crew participant.',
    ],
  },
  {
    id: 'formation',
    title: 'Crew Formation & Size Rules',
    content: [
      'Crews must consist of exactly 4, 5, or 6 pirate members.',
      'Cross-college or cross-department crews are not permitted on the same ship.',
      'One pirate cannot belong to multiple crews.',
    ],
  },
  {
    id: 'development',
    title: 'Voyage Code Development Rules',
    content: [
      'All code, design, and solution building must occur strictly within the 24-hour hackathon window.',
      'Pre-built projects or pre-existing complete applications are strictly prohibited by pirate law.',
      'Open-source libraries, frameworks, and public APIs are permitted.',
    ],
  },
  {
    id: 'submission',
    title: 'Submission & Plagiarism Rules',
    content: [
      'Final code repository link (e.g., GitHub) and demonstration video/slides must be submitted before the deadline.',
      'Zero-tolerance plagiarism policy: Copied code or fraudulent submissions will lead to immediate disqualification.',
      'Detailed evaluation guidelines to be briefed before hacking begins.',
    ],
  },
  {
    id: 'judging',
    title: 'Judging Criteria & Code of Conduct',
    content: [
      'Evaluation based on Innovation, Technical Complexity, Real-World Impact, UI/UX, and Final Presentation.',
      'All participants must maintain professional conduct, mutual respect, and sportsmanship throughout the event.',
      'Placeholders for detailed score distribution matrix to be finalized.',
    ],
  },
];

const HackathonRulesSection = () => {
  const [isScrollOpen, setIsScrollOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState('guidelines');

  const handleToggleScroll = () => {
    playLaserBlip();
    setIsScrollOpen(prev => !prev);
  };

  const toggleCategory = (id) => {
    playLaserBlip();
    setOpenCategory(openCategory === id ? null : id);
  };

  return (
    <section id="rules" className="relative py-16 sm:py-24 px-4 z-10">
      <div className="max-w-4xl mx-auto">
        {/* Interactive Pirate Scroll Header / Banner (Click to toggle open/close) */}
        <div
          role="button"
          tabIndex={0}
          aria-expanded={isScrollOpen}
          onClick={handleToggleScroll}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggleScroll();
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
              <span>PIRATE SCROLL // VOYAGE RULES</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-12 sm:w-20 h-1.5 rounded-full bg-gradient-to-l from-[#ffd700] to-transparent" />
              <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-bl from-[#ffd700] to-[#8c6d23] shadow-[0_0_8px_#ffd700]" />
            </div>
          </div>

          <div className="inline-block font-cinzel font-bold text-xs text-[#ffd700] tracking-widest uppercase mb-2">
            // THE CARIBBEAN CODE OF CONDUCT
          </div>
          <h2 className="font-pirate text-3xl sm:text-5xl md:text-6xl text-white tracking-wide">
            PIRATE CODE <span className="text-[#ffd700] pirate-gold-title"><DecipherText text="& VOYAGE RULES" /></span>
          </h2>

          <p className="font-cinzel text-xs sm:text-sm text-gray-300 mt-2 max-w-xl mx-auto">
            Official 24-hour voyage guidelines, eligibility terms, and maritime bylaws.
          </p>

          {/* Interactive Click Indicator Pill */}
          <div className="mt-5 inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#1c150c] border border-[#ffd700]/70 group-hover:border-[#ffd700] group-hover:bg-[#281e10] shadow-[0_0_15px_rgba(255,215,0,0.25)] transition-all">
            <Scroll className="w-4 h-4 text-[#ffd700]" />
            <span className="font-cinzel font-bold text-xs sm:text-sm text-[#ffd700] tracking-wider uppercase">
              {isScrollOpen ? 'Click to Roll Up Scroll' : 'Click to Unroll Voyage Rules (6 Categories)'}
            </span>
            {isScrollOpen ? (
              <ChevronUp className="w-4 h-4 text-[#ffd700] transition-transform group-hover:-translate-y-0.5" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#ffd700] transition-transform group-hover:translate-y-0.5 animate-bounce" />
            )}
          </div>
        </div>

        {/* Parchment Scroll Unrolling Body (From closed to open, and open to closed) */}
        <AnimatePresence>
          {isScrollOpen && (
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

                <div className="space-y-4 relative z-10">
                  {rulesCategories.map((cat) => {
                    const isOpen = openCategory === cat.id;
                    return (
                      <div
                        key={cat.id}
                        className="bg-[#0b1622]/95 border border-[#4a381e] hover:border-[#ffd700]/60 rounded-2xl overflow-hidden transition-all shadow-md"
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCategory(cat.id);
                          }}
                          className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#161208] transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <Scroll className="w-5 h-5 text-[#ffd700]" />
                            <span className="font-cinzel font-bold text-base sm:text-lg text-white">
                              {cat.title}
                            </span>
                          </div>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 text-[#ffd700]" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-[#cfb07a]" />
                          )}
                        </button>

                        {isOpen && (
                          <div className="px-6 pb-6 pt-2 border-t border-[#3a2c1a] bg-[#04080e] space-y-3">
                            {cat.content.map((item, idx) => (
                              <div key={idx} className="flex items-start space-x-3">
                                <Check className="w-4 h-4 text-[#ffd700] flex-shrink-0 mt-1" />
                                <p className="font-cinzel text-gray-300 text-sm leading-relaxed">
                                  {item}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Roll Up Button */}
                <div className="mt-8 text-center pt-4 border-t border-[#3a2c1a] relative z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleScroll();
                    }}
                    className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-full bg-[#1c150c] hover:bg-[#281e10] border border-[#ffd700]/60 hover:border-[#ffd700] text-xs font-cinzel font-bold text-[#ffd700] tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(255,215,0,0.2)]"
                  >
                    <ChevronUp className="w-4 h-4 text-[#ffd700]" />
                    <span>Roll Up Voyage Rules Scroll</span>
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

export default HackathonRulesSection;
