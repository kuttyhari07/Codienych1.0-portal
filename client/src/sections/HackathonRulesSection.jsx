import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, FileText, Check, Skull, Scroll } from 'lucide-react';

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
  const [openCategory, setOpenCategory] = useState('eligibility');

  const toggleCategory = (id) => {
    setOpenCategory(openCategory === id ? null : id);
  };

  return (
    <section id="rules" className="relative py-24 px-4 z-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block font-cinzel font-bold text-xs text-[#ffd700] tracking-widest uppercase mb-2">
            // THE CARIBBEAN CODE OF CONDUCT
          </div>
          <h2 className="font-pirate text-4xl sm:text-6xl text-white tracking-wide">
            PIRATE CODE <span className="text-[#ffd700] pirate-gold-title">& VOYAGE RULES</span>
          </h2>
        </div>

        <div className="space-y-4">
          {rulesCategories.map((cat) => {
            const isOpen = openCategory === cat.id;
            return (
              <div
                key={cat.id}
                className="bg-[#08121a]/95 border border-[#4a381e] rounded-2xl overflow-hidden transition-all shadow-md"
              >
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
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
      </div>
    </section>
  );
};

export default HackathonRulesSection;
