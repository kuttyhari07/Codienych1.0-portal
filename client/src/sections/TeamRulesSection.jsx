import React from 'react';
import { Skull, Anchor, ShieldAlert, CheckCircle2 } from 'lucide-react';
import AncientParchmentScroll from '../components/AncientParchmentScroll';

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

const ROMAN_NUMERALS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

const TeamRulesSection = () => {
  return (
    <section id="team-rules" className="relative z-10">
      <AncientParchmentScroll
        id="crew-articles-scroll"
        subtitle="// PIRATE CODE // CREW ARTICLES"
        title="CREW FORMATION"
        goldTitle="ARTICLES"
        description="Mandatory pirate maritime bylaws binding every crew docking at the hackathon fleet."
        badge="9 ARTICLES"
        defaultOpen={false}
      >
        {/* Direct Text on Ancient Scroll Map */}
        <div className="space-y-4">
          <div className="text-center mb-4 sm:mb-6">
            <h3 className="font-pirate text-lg sm:text-2xl md:text-3xl text-[#3b1f09] tracking-wider drop-shadow-sm uppercase leading-tight px-1">
              The 9 Enlistment Decrees of the Brethren Court
            </h3>
            <p className="font-cinzel text-[10px] sm:text-xs text-[#5c3514] font-semibold mt-1">
              Signed by the Port Admiralty & Fleet Marshals
            </p>
            <div className="w-16 sm:w-24 h-0.5 bg-[#6b421a]/30 mx-auto mt-2" />
          </div>

          {/* 9 Articles Grid printed directly on the ancient parchment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3.5">
            {teamRulesList.map((rule, idx) => (
              <div
                key={idx}
                className="group/item flex items-start space-x-2.5 sm:space-x-3 p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl bg-[#2e190b]/[0.06] hover:bg-[#2e190b]/[0.12] border border-[#5c3614]/20 hover:border-[#6b421a]/45 transition-all shadow-[0_2px_4px_rgba(0,0,0,0.04)]"
              >
                {/* Vintage Wax Seal / Article Numeral */}
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-[#8a1c1c] via-[#5c0e0e] to-[#360505] border border-[#d4af37]/70 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <span className="font-cinzel text-[9px] sm:text-[10px] font-bold text-[#ffe57f]">
                    {ROMAN_NUMERALS[idx]}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <span className="font-cinzel font-extrabold text-[10px] sm:text-[11px] text-[#63330f] tracking-wider block uppercase mb-0.5">
                    ARTICLE {idx + 1}
                  </span>
                  <p className="font-cinzel text-xs sm:text-[13.5px] font-semibold text-[#2b1709] leading-snug drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]">
                    {rule}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Brethren Court Seal of Authenticity */}
          <div className="mt-5 sm:mt-8 pt-3 sm:pt-4 border-t border-[#6b421a]/30 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-[11px] font-cinzel text-[#4e2b10] font-bold px-1 text-center sm:text-left">
            <div className="flex items-center space-x-1.5">
              <Anchor className="w-3.5 h-3.5 text-[#75441b] flex-shrink-0" />
              <span>BRETHREN COURT JURISDICTION // STRICT COMPLIANCE</span>
            </div>
            <div className="flex items-center space-x-1.5 text-[#8a1c1c] flex-shrink-0">
              <Skull className="w-3.5 h-3.5" />
              <span>OFFICIAL 24-HR VOYAGE SEAL</span>
            </div>
          </div>
        </div>
      </AncientParchmentScroll>
    </section>
  );
};

export default TeamRulesSection;
