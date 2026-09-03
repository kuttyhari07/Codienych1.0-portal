import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, FileText, Check } from 'lucide-react';

const rulesCategories = [
  {
    id: 'eligibility',
    title: 'Eligibility Rules',
    content: [
      'Open to undergraduate students from recognized colleges/universities.',
      'Valid student ID card is mandatory for every team participant.',
      'Placeholders for institutional guidelines to be finalized.',
    ],
  },
  {
    id: 'formation',
    title: 'Team Formation & Size Rules',
    content: [
      'Teams must consist of exactly 4, 5, or 6 members.',
      'Cross-college or cross-department teams are allowed unless specified otherwise.',
      'One participant cannot belong to multiple teams.',
    ],
  },
  {
    id: 'development',
    title: 'Project Development Rules',
    content: [
      'All code, design, and solution building must occur strictly within the 24-hour hackathon window.',
      'Pre-built projects or pre-existing complete applications are strictly prohibited.',
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
          <div className="inline-block font-mono text-xs text-[#00ff66] tracking-widest uppercase mb-2">
            // OPERATIONAL DIRECTIVES
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white tracking-wide">
            HACKATHON <span className="text-[#00ff66]">RULES & GUIDELINES</span>
          </h2>
        </div>

        <div className="space-y-4">
          {rulesCategories.map((cat) => {
            const isOpen = openCategory === cat.id;
            return (
              <div
                key={cat.id}
                className="bg-[#0a140e]/90 border border-[#1b3524] rounded-xl overflow-hidden transition-all shadow-md"
              >
                <button
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-[#0f2416] transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-[#00ff66]" />
                    <span className="font-orbitron font-bold text-lg text-white">
                      {cat.title}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#00ff66]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-[#1b3524]/60 bg-[#040e08] space-y-3">
                    {cat.content.map((item, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <Check className="w-4 h-4 text-[#10b981] flex-shrink-0 mt-1" />
                        <p className="font-sans text-gray-300 text-sm leading-relaxed">
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
