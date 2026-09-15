import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Radio, Sparkles, Terminal, Volume2, Search } from 'lucide-react';
import { EVENT_CONFIG } from '../utils/config';
import { playLaserBlip } from '../utils/cyberSound';

const quickChips = [
  {
    chip: 'Registration Fee & Pricing',
    answer: `Entry fee is strictly ₹${EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER} per participant (₹2,100 for 4 members, ₹2,625 for 5 members, ₹3,150 for 6 members). UPI Payment ID: ${EVENT_CONFIG.UPI_ID}.`,
  },
  {
    chip: 'Team Size & Gender Rule',
    answer: 'Squads must consist of exactly 4, 5, or 6 members. There is no gender restriction — any team combination is welcome to participate.',
  },
  {
    chip: 'Who Is Eligible?',
    answer: 'Undergraduate (UG) engineering and tech students from all recognized institutions (except host college ESEC students) are fully eligible.',
  },
  {
    chip: 'Free Internship & Perks',
    answer: 'Along with surprise cash prize bounties and trophies, top-performing teams receive direct Free Internship Opportunities for hands-on industry projects.',
  },
  {
    chip: 'Late Night Chill & Games',
    answer: 'A dedicated 24-HR Fun & Chill Zone is available with hot coffee, Chess boards, Carrom battles, and mini challenges with instant spot gifts for winners.',
  },
];

const faqs = [
  {
    q: 'What is CODIENYCH 1.0?',
    a: 'CODIENYCH 1.0 is a 24-hour hackathon where participants collaborate, innovate and build solutions within a limited time.',
  },
  {
    q: 'How long is the hackathon?',
    a: 'The hackathon runs continuously for 24 hours non-stop.',
  },
  {
    q: 'What is the team size?',
    a: 'Teams must have exactly 4, 5, or 6 members.',
  },
  {
    q: 'Who can participate?',
    a: 'Only Undergraduate (UG) students from other recognized colleges and universities are eligible. This hackathon is strictly for Other College Students (Not for ESEC Students).',
  },
  {
    q: 'What is the registration fee?',
    a: `₹${EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER} per participant (₹2,100 for 4 members, ₹2,625 for 5 members, ₹3,150 for 6 members).`,
  },
  {
    q: 'How can I register?',
    a: 'Click "REGISTER NOW" on the portal navigation and complete the 8-step team registration form.',
  },
  {
    q: 'How do I know if my team registration is approved?',
    a: 'Use the "CHECK STATUS" page and enter your Registration ID. Once your payment and ID cards are verified by Admin, your status turns to "REGISTRATION CONFIRMED" and a direct "JOIN TO WHATSAPP GROUP" button will appear for approved teams.',
  },
  {
    q: 'Who should register the team?',
    a: 'Only the designated Team Leader registers the team. Team members do not register separately.',
  },
  {
    q: 'Is an ID card required?',
    a: 'Yes, every participant must upload a clear photo of their official student ID card.',
  },
  {
    q: 'Does every member need to upload an ID card?',
    a: 'Yes! Every member (Leader and all Team Members) must upload their own individual student ID card.',
  },
  {
    q: 'How does UPI payment work?',
    a: `Scan the official event UPI QR code or send payment to UPI ID: ${EVENT_CONFIG.UPI_ID} for the exact team total amount.`,
  },
  {
    q: 'Where should I enter the transaction ID?',
    a: 'Enter the 12-digit UPI UTR / Transaction ID in Step 7 of the online registration form.',
  },
  {
    q: 'Why do I need a payment screenshot?',
    a: 'Payment screenshot proof is required for manual admin verification before confirming registration.',
  },
  {
    q: 'When will the problem statement be revealed?',
    a: 'The problem statement will be revealed on the spot during the opening ceremony.',
  },
  {
    q: 'Where will the hackathon take place?',
    a: `${EVENT_CONFIG.VENUE} at ${EVENT_CONFIG.COLLEGE_NAME}. [PLACEHOLDER - Detailed campus directions to be announced].`,
  },
  {
    q: 'What should participants bring?',
    a: 'Laptops, chargers, valid college physical ID cards, extension cords, and personal gear. [PLACEHOLDER].',
  },
  {
    q: 'What are the perks and rewards besides the prize pool?',
    a: 'Along with surprise cash bounties and trophies, top winning teams will receive Free Internship Opportunities to work on real-world projects and build industry credentials!',
  },
  {
    q: 'Are there entertainment activities during the 24-hour hackathon?',
    a: 'Yes! We have an interactive Fun & Entertainment Zone featuring late-night Chess and Carrom board games to fight sleep/boredom, along with quick mini-games and trivia that reward winners with instant surprise gifts and goodies!',
  },
  {
    q: 'How will projects be evaluated?',
    a: 'Based on Innovation, Technical Complexity, Working Demo, Code Quality, UI/UX, and Pitch Presentation.',
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeChip, setActiveChip] = useState(quickChips[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFaq = (index) => {
    playLaserBlip();
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="faq" className="relative py-24 px-4 z-10">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 font-mono text-xs text-[#00ff66] tracking-widest uppercase mb-3 bg-[#00ff66]/10 px-3.5 py-1 rounded-full border border-[#00ff66]/30">
            <Radio className="w-3.5 h-3.5 text-[#00ff66] animate-pulse" />
            <span>// DECLASSIFIED INTEL DISPATCH</span>
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-5xl text-white tracking-wide mb-4">
            ASK <span className="text-[#00ff66]">CODIENYCH INTEL</span>
          </h2>
          <p className="max-w-2xl mx-auto font-mono text-xs sm:text-sm text-gray-300">
            Tap any tactical query chip below to initialize telemetry streams, or search intel archives.
          </p>
        </div>

        {/* Interactive Query Matrix & Audio Waveform Box */}
        <div className="bg-gradient-to-b from-[#0f2e1a] via-[#081a0e] to-[#040e08] border-2 border-[#00ff66] rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,255,102,0.3)] mb-12 relative overflow-hidden hud-corner-box">
          <div className="flex items-center justify-between border-b border-[#00ff66]/30 pb-3 mb-6">
            <div className="flex items-center space-x-2 font-mono text-xs text-[#00ff66]">
              <Volume2 className="w-4 h-4 text-[#00ff66]" />
              <span className="font-bold uppercase tracking-wider">INTEL AUDIO STREAM // ACTIVE</span>
            </div>

            {/* Live Audio Waveform Bars */}
            <div className="flex items-center space-x-1 h-5">
              {[12, 24, 16, 28, 8, 20, 32, 14, 22, 10, 26, 18].map((h, i) => (
                <div
                  key={i}
                  style={{
                    height: `${(h * 0.7)}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                  className="w-1 bg-[#00ff66] rounded-full wave-bar"
                />
              ))}
            </div>
          </div>

          {/* Quick Query Chips */}
          <div className="flex flex-wrap gap-2.5 mb-6">
            {quickChips.map((qc, i) => {
              const isSelected = activeChip.chip === qc.chip;
              return (
                <button
                  key={i}
                  onClick={() => {
                    playLaserBlip();
                    setActiveChip(qc);
                  }}
                  className={`px-3.5 py-2 rounded-xl font-mono text-xs transition-all duration-200 flex items-center space-x-2 ${
                    isSelected
                      ? 'bg-[#00ff66] text-black font-bold shadow-[0_0_15px_#00ff66] scale-105'
                      : 'bg-[#050b07] text-gray-300 border border-gray-800 hover:border-[#10b981] hover:text-white'
                  }`}
                >
                  <span>{qc.chip}</span>
                </button>
              );
            })}
          </div>

          {/* Telemetry Output Screen */}
          <div className="bg-[#050b07] border border-[#10b981]/50 rounded-xl p-5 font-mono text-xs sm:text-sm text-gray-200 leading-relaxed shadow-inner">
            <div className="flex items-center space-x-2 text-[#00ff66] text-[11px] mb-2">
              <Terminal className="w-3.5 h-3.5" />
              <span className="font-bold tracking-wider">STREAMED TRANSMISSION:</span>
            </div>
            <p className="text-white font-sans text-sm sm:text-base">
              {activeChip.answer}
            </p>
          </div>
        </div>

        {/* Live Search Intel Filter Bar */}
        <div className="mb-6 max-w-xl mx-auto relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search intel keywords (e.g. fees, team, ID card, rules)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a140e]/95 border-2 border-[#1b3524] focus:border-[#00ff66] rounded-2xl pl-11 pr-4 py-3 font-mono text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00ff66] shadow-lg transition-all"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Full FAQ Accordion Archive */}
        <div className="space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center font-mono text-sm text-gray-400 bg-[#0a140e]/80 border border-gray-800 rounded-xl">
              No matching intel found for "{searchQuery}". Try a different keyword.
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#0a140e]/90 border border-[#1b3524] hover:border-[#10b981] rounded-xl overflow-hidden transition-all shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#0f2416] transition-colors"
                  >
                    <span className="font-orbitron font-semibold text-sm sm:text-base text-gray-200 pr-4">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#00ff66] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 border-t border-[#1b3524]/60 bg-[#040e08]">
                      <p className="font-sans text-gray-300 text-sm leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
