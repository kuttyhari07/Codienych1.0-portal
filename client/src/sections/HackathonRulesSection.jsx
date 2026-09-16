import React, { useState } from 'react';
import { Scroll, Check, Compass, Shield, Skull, Anchor, ChevronRight } from 'lucide-react';
import AncientParchmentScroll from '../components/AncientParchmentScroll';
import { playLaserBlip } from '../utils/cyberSound';

const rulesCategories = [
  {
    id: 'guidelines',
    numeral: 'I',
    title: 'Registration & Manifest Verification',
    content: [
      'After completing registration, all pirate crews must track their approval/rejection status via the Voyage Status Tracker using their Registration ID.',
      'Port admirals will review payment proof and individual student ID cards before approving the registration.',
      'Approved / Confirmed crews must immediately join the Official Hackathon WhatsApp Fleet using the link provided in the Status Tracker.',
      'Important event updates, schedule alerts, and mentor announcements will be shared in the WhatsApp community.',
    ],
  },
  {
    id: 'eligibility',
    numeral: 'II',
    title: 'Eligibility & Crew Enlistment Rules',
    content: [
      'Open strictly to Undergraduate (UG) students from other recognized engineering colleges/universities.',
      'This hackathon is strictly for Other College Students (Not for ESEC Students).',
      'Valid official college physical ID card is mandatory for every crew participant.',
    ],
  },
  {
    id: 'formation',
    numeral: 'III',
    title: 'Crew Formation & Size Rules',
    content: [
      'Crews must consist of exactly 4, 5, or 6 pirate members.',
      'Cross-college or cross-department crews are not permitted on the same ship.',
      'One pirate cannot belong to multiple crews.',
    ],
  },
  {
    id: 'development',
    numeral: 'IV',
    title: 'Voyage Code Development Rules',
    content: [
      'All code, design, and solution building must occur strictly within the 24-hour hackathon window.',
      'Pre-built projects or pre-existing complete applications are strictly prohibited by pirate law.',
      'Open-source libraries, frameworks, and public APIs are permitted.',
    ],
  },
  {
    id: 'submission',
    numeral: 'V',
    title: 'Submission & Plagiarism Rules',
    content: [
      'Final code repository link (e.g., GitHub) and demonstration video/slides must be submitted before the deadline.',
      'Zero-tolerance plagiarism policy: Copied code or fraudulent submissions will lead to immediate disqualification.',
      'Detailed evaluation guidelines to be briefed before hacking begins.',
    ],
  },
  {
    id: 'judging',
    numeral: 'VI',
    title: 'Judging Criteria & Code of Conduct',
    content: [
      'Evaluation based on Innovation, Technical Complexity, Real-World Impact, UI/UX, and Final Presentation.',
      'All participants must maintain professional conduct, mutual respect, and sportsmanship throughout the event.',
      'Placeholders for detailed score distribution matrix to be finalized.',
    ],
  },
];

const HackathonRulesSection = () => {
  const [activeCategory, setActiveCategory] = useState('guidelines');

  const handleCategorySelect = (id) => {
    playLaserBlip();
    setActiveCategory(id);
  };

  const selectedCategory = rulesCategories.find((c) => c.id === activeCategory) || rulesCategories[0];

  return (
    <section id="rules" className="relative z-10">
      <AncientParchmentScroll
        id="hackathon-rules-scroll"
        subtitle="// THE CARIBBEAN CODE OF CONDUCT"
        title="PIRATE CODE"
        goldTitle="& VOYAGE RULES"
        description="Official 24-hour voyage guidelines, eligibility terms, and maritime bylaws."
        badge="6 CATEGORIES"
        defaultOpen={false}
      >
        {/* Direct Text on Ancient Scroll Map */}
        <div className="space-y-4 sm:space-y-6">
          <div className="text-center mb-4 sm:mb-6">
            <h3 className="font-pirate text-lg sm:text-2xl md:text-3xl text-[#3b1f09] tracking-wider drop-shadow-sm uppercase leading-tight px-1">
              The Caribbean Code & Voyage Decrees
            </h3>
            <p className="font-cinzel text-[10px] sm:text-xs text-[#5c3514] font-semibold mt-1">
              Select an edict below to reveal its clauses on the charter map
            </p>
            <div className="w-16 sm:w-24 h-0.5 bg-[#6b421a]/30 mx-auto mt-2" />
          </div>

          {/* Interactive Edict Bookmark Tabs on Parchment */}
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {rulesCategories.map((cat) => {
              const isActive = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg font-cinzel text-[11px] sm:text-xs font-bold transition-all flex items-center space-x-1 sm:space-x-1.5 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#6e1e1e] to-[#450d0d] text-[#ffe57f] border-2 border-[#d4af37] shadow-md scale-105'
                      : 'bg-[#3b200b]/10 hover:bg-[#3b200b]/20 text-[#3a1f0a] border border-[#5c3514]/30'
                  }`}
                >
                  <span className="font-extrabold">{cat.numeral}.</span>
                  <span>{cat.title.split(' ')[0]}</span>
                </button>
              );
            })}
          </div>

          {/* Active Edict Display Inscribed Directly on Parchment */}
          <div className="p-3.5 sm:p-6 rounded-xl sm:rounded-2xl bg-[#2e190b]/[0.06] border border-[#5c3514]/30 shadow-inner">
            <div className="flex items-center space-x-2.5 sm:space-x-3 mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-[#5c3514]/25">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#8a1c1c] via-[#5c0e0e] to-[#360505] border border-[#d4af37] flex items-center justify-center text-[#ffe57f] font-cinzel font-bold text-xs sm:text-sm shadow-md flex-shrink-0">
                {selectedCategory.numeral}
              </div>
              <div className="min-w-0">
                <span className="font-cinzel text-[9px] sm:text-[11px] font-extrabold text-[#703d16] uppercase tracking-wider block">
                  VOYAGE EDICT {selectedCategory.numeral}
                </span>
                <h4 className="font-pirate text-base sm:text-2xl text-[#2b1709] tracking-wide leading-tight truncate">
                  {selectedCategory.title}
                </h4>
              </div>
            </div>

            {/* Clauses List printed directly on the parchment */}
            <div className="space-y-2 sm:space-y-3">
              {selectedCategory.content.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start space-x-2.5 sm:space-x-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-white/30 border border-[#5c3514]/15 hover:bg-white/50 transition-colors"
                >
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#4a280e]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#5e220a]" />
                  </div>
                  <p className="font-cinzel text-xs sm:text-sm font-semibold text-[#241205] leading-relaxed drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Brethren Court Seal of Authenticity */}
          <div className="pt-3 border-t border-[#6b421a]/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] font-cinzel text-[#4e2b10] font-bold px-1 text-center sm:text-left">
            <div className="flex items-center space-x-1.5">
              <Compass className="w-3.5 h-3.5 text-[#75441b] flex-shrink-0" />
              <span>MARITIME LAWS ENFORCED ACROSS ALL 24 HOURS</span>
            </div>
            <div className="flex items-center space-x-1.5 text-[#8a1c1c] flex-shrink-0">
              <Skull className="w-3.5 h-3.5" />
              <span>DISQUALIFICATION APPLIES TO INFRACTIONS</span>
            </div>
          </div>
        </div>
      </AncientParchmentScroll>
    </section>
  );
};

export default HackathonRulesSection;
