import React from 'react';
import { Users, UserCheck, ShieldCheck, CheckCircle2, Skull } from 'lucide-react';
import SpotlightCard from '../components/SpotlightCard';
import DecipherText from '../components/DecipherText';

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
  return (
    <section id="team-rules" className="relative py-24 px-4 z-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block font-cinzel font-bold text-xs text-[#ffd700] tracking-widest uppercase mb-2">
            // PIRATE CODE // CREW ARTICLES
          </div>
          <h2 className="font-pirate text-4xl sm:text-6xl text-white tracking-wide">
            CREW FORMATION <span className="text-[#ffd700] pirate-gold-title"><DecipherText text="ARTICLES" /></span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {teamRulesList.map((rule, idx) => (
            <SpotlightCard
              key={idx}
              className="p-6 flex items-start space-x-4 bg-[#08121a]/95 border-[#4a381e]"
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
      </div>
    </section>
  );
};

export default TeamRulesSection;
