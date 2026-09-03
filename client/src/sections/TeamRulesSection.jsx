import React from 'react';
import { Users, UserCheck, ShieldCheck, CheckCircle2 } from 'lucide-react';

const teamRulesList = [
  'Each team must have 4 to 6 members.',
  'Exactly one Team Leader per team.',
  'Only Team Leader registers.',
  'Team members do not register separately.',
  'One registration represents the complete team.',
  'One team receives one Registration ID.',
  'College/University ID cards of all team members must be presented at the event.',
  'All team members must be present at the event venue during the hackathon.',
  'Team must have one female member to be eligible for the event.',
];

const TeamRulesSection = () => {
  return (
    <section id="team-rules" className="relative py-24 px-4 z-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block font-mono text-xs text-[#00ff66] tracking-widest uppercase mb-2">
            // PROTOCOL DISPATCH
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white tracking-wide">
            TEAM <span className="text-[#00ff66]">RULES</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {teamRulesList.map((rule, idx) => (
            <div
              key={idx}
              className="bg-[#0a140e]/90 border border-[#1b3524] hover:border-[#10b981] rounded-xl p-6 flex items-start space-x-4 transition-all shadow-md"
            >
              <div className="w-8 h-8 rounded-lg bg-[#0f2416] border border-[#00ff66] flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5 text-[#00ff66]" />
              </div>
              <div>
                <span className="font-mono text-xs text-[#10b981] block mb-1">
                  RULE 0{idx + 1}
                </span>
                <p className="font-sans font-semibold text-gray-200 text-base">
                  {rule}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamRulesSection;
