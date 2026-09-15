import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { EVENT_CONFIG } from '../utils/config';

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

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-24 px-4 z-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block font-mono text-xs text-[#00ff66] tracking-widest uppercase mb-2">
            // INTEL DISPATCH
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white tracking-wide">
            FREQUENTLY ASKED <span className="text-[#00ff66]">QUESTIONS</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
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
                  <span className="font-orbitron font-semibold text-base text-gray-200 pr-4">
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
          })}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
