import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Radio, Sparkles, Volume2, VolumeX, Play, Square, Search, Scroll, Compass } from 'lucide-react';
import { EVENT_CONFIG } from '../utils/config';
import { playLaserBlip, speakIntelTransmission, stopIntelSpeech } from '../utils/cyberSound';

const quickChips = [
  {
    chip: 'Crew Fee & Bounty Pricing',
    answer: `Entry fee is strictly ₹${EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER} per pirate participant (₹${(4 * EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER).toLocaleString()} for 4 members, ₹${(5 * EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER).toLocaleString()} for 5 members, ₹${(6 * EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER).toLocaleString()} for 6 members). UPI Payment ID: ${EVENT_CONFIG.UPI_ID}.`,
  },
  {
    chip: 'Crew Size & Gender Rule',
    answer: 'Crews must consist of exactly 4, 5, or 6 pirate members. There is no gender restriction — any team combination is welcome aboard.',
  },
  {
    chip: 'Who Is Eligible?',
    answer: 'Undergraduate (UG) engineering and tech students from all recognized institutions are fully eligible. ESEC students can also participate (Limited slots only for ESEC Students).',
  },
  {
    chip: 'Free Internship & Perks',
    answer: 'Along with cash prize bounties upto ₹50,000+ and trophies, top-performing pirate crews receive direct Free Internship Opportunities for hands-on industry projects.',
  },
  {
    chip: 'Midnight Tavern & Games',
    answer: 'A dedicated 24-HR Tavern & Chill Zone is open with hot coffee, Chess boards, Carrom battles, and mini challenges with instant spot gifts for victors.',
  },
];

const faqs = [
  {
    q: 'What is CODIENYCH 1.0?',
    a: 'CODIENYCH 1.0 is a 24-hour hackathon where pirate crews collaborate, innovate and build solutions within a limited time.',
  },
  {
    q: 'How long is the hackathon voyage?',
    a: 'The hackathon runs continuously for 24 hours non-stop across the digital seas.',
  },
  {
    q: 'What is the required crew size?',
    a: 'Crews must have exactly 4, 5, or 6 pirate members.',
  },
  {
    q: 'Who can participate in this voyage?',
    a: 'Undergraduate (UG) students from recognized colleges and universities are eligible. ESEC students can also participate (Limited slots only for ESEC Students).',
  },
  {
    q: 'What is the crew enlistment fee?',
    a: `₹${EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER} per participant (₹${(4 * EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER).toLocaleString()} for 4 members, ₹${(5 * EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER).toLocaleString()} for 5 members, ₹${(6 * EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER).toLocaleString()} for 6 members).`,
  },
  {
    q: 'How can our crew register?',
    a: 'Click "JOIN THE CREW" on the portal navigation and complete the 8-step team registration form.',
  },
  {
    q: 'How do I know if our crew manifest is approved?',
    a: 'Use the "VOYAGE STATUS" page and enter your Registration ID. Once your payment and ID cards are verified by Admiralty, your status turns to "REGISTRATION CONFIRMED" and a direct "JOIN FLEET WHATSAPP" button will appear.',
  },
  {
    q: 'Who should register the team?',
    a: 'Only the designated Captain (Team Leader) registers the team. Crew members do not register separately.',
  },
  {
    q: 'Is a student ID card required?',
    a: 'Yes, every participant must upload a clear photo of their official college student ID card.',
  },
  {
    q: 'Does every member need to upload an ID card?',
    a: 'Yes! Every member (Captain and all Crew Members) must upload their own individual student ID card.',
  },
  {
    q: 'How does UPI payment work?',
    a: `Scan the official event UPI QR code or send payment to UPI ID: ${EVENT_CONFIG.UPI_ID} for the exact crew total amount.`,
  },
  {
    q: 'Where should I enter the transaction ID?',
    a: 'Enter the 12-digit UPI UTR / Transaction ID in Step 7 of the online registration form.',
  },
  {
    q: 'Why do I need a payment screenshot?',
    a: 'Payment screenshot proof is required for manual admiralty verification before confirming registration.',
  },
  {
    q: 'When will the secret problem statement be revealed?',
    a: 'The problem statement will be revealed on the spot during the opening ceremony.',
  },
  {
    q: 'Where will the hackathon take place?',
    a: `${EVENT_CONFIG.VENUE} at ${EVENT_CONFIG.COLLEGE_NAME}.`,
  },
  {
    q: 'What should participants bring aboard?',
    a: 'Laptops, chargers, valid college physical ID cards, extension cords, and personal gear.',
  },
  {
    q: 'What are the perks and rewards besides the prize pool?',
    a: 'Along with cash prize bounties upto ₹50,000+ and trophies, top winning teams will receive Free Internship Opportunities to work on real-world projects and build industry credentials!',
  },
  {
    q: 'Are there entertainment activities during the 24-hour hackathon?',
    a: 'Yes! We have an interactive Pirates Tavern featuring late-night Chess and Carrom board games, along with quick reflex mini-games and trivia that reward winners with instant surprise gifts and goodies!',
  },
  {
    q: 'How will projects be evaluated?',
    a: 'Based on Innovation, Technical Complexity, Working Demo, Code Quality, UI/UX, and Pitch Presentation.',
  },
];

const FaqSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [activeChip, setActiveChip] = useState(quickChips[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handlePlayVoice = (text) => {
    if (isPlayingAudio) {
      stopIntelSpeech();
      setIsPlayingAudio(false);
    } else {
      playLaserBlip();
      speakIntelTransmission(
        text || activeChip.answer,
        () => setIsPlayingAudio(true),
        () => setIsPlayingAudio(false)
      );
    }
  };

  const handleSelectChip = (qc) => {
    playLaserBlip();
    setActiveChip(qc);
    speakIntelTransmission(
      qc.answer,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  };

  useEffect(() => {
    return () => {
      stopIntelSpeech();
    };
  }, []);

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
          <div className="inline-flex items-center space-x-2 font-cinzel font-bold text-xs text-[#ffd700] tracking-widest uppercase mb-3 bg-[#ffd700]/10 px-3.5 py-1 rounded-full border border-[#ffd700]/30">
            <Scroll className="w-3.5 h-3.5 text-[#ffd700] animate-pulse" />
            <span>// PARCHMENT OF FREQUENT INQUIRIES</span>
          </div>
          <h2 className="font-pirate text-4xl sm:text-6xl text-white tracking-wide mb-4">
            ASK <span className="text-[#ffd700] pirate-gold-title">CAPTAIN'S INTEL</span>
          </h2>
          <p className="max-w-2xl mx-auto font-cinzel text-xs sm:text-sm text-gray-300">
            Tap any query scroll below to stream live captain voice intel, or search the pirate archives.
          </p>
        </div>

        {/* Interactive Query Matrix & Audio Waveform Box */}
        <div className="bg-gradient-to-b from-[#1c150c] via-[#0f1b26] to-[#04080e] border-2 border-[#ffd700] rounded-3xl p-6 sm:p-8 shadow-[0_0_40px_rgba(229,193,88,0.25)] mb-12 relative overflow-hidden hud-corner-box">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5c158]/30 pb-3 mb-6">
            <div className="flex items-center space-x-2 font-cinzel text-xs text-[#ffd700] font-bold">
              <Volume2 className={`w-4 h-4 text-[#ffd700] ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              <span className="uppercase tracking-wider">
                {isPlayingAudio ? 'CAPTAIN VOICE // TRANSMITTING' : 'CAPTAIN AUDIO STREAM // READY'}
              </span>
            </div>

            {/* Live Audio Waveform Bars + Play/Stop Button */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => handlePlayVoice(activeChip.answer)}
                className={`flex items-center space-x-1.5 px-3.5 py-1 rounded-full font-cinzel text-xs font-bold transition-all cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-red-500/20 text-red-400 border border-red-500 animate-pulse'
                    : 'bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700] hover:bg-[#ffd700] hover:text-black'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <Square className="w-3 h-3 fill-current" />
                    <span>STOP AUDIO</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>HEAR TRANSMISSION</span>
                  </>
                )}
              </button>

              <div className="flex items-center space-x-1 h-5">
                {[12, 24, 16, 28, 8, 20, 32, 14, 22, 10, 26, 18].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      height: isPlayingAudio ? `${(h * 0.7)}px` : '4px',
                      animationDelay: `${i * 0.08}s`,
                    }}
                    className={`w-1 rounded-full transition-all duration-200 ${
                      isPlayingAudio ? 'bg-[#ffd700] wave-bar' : 'bg-[#ffd700]/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Query Chips */}
          <div className="flex flex-wrap gap-2.5 mb-6">
            {quickChips.map((qc, i) => {
              const isSelected = activeChip.chip === qc.chip;
              return (
                <button
                  key={i}
                  onClick={() => handleSelectChip(qc)}
                  className={`px-3.5 py-2 rounded-xl font-cinzel text-xs transition-all duration-200 flex items-center space-x-2 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#ffd700] to-[#e5c158] text-black font-bold shadow-[0_0_15px_#ffd700] scale-105'
                      : 'bg-[#08121a] text-[#f4e6c3] border border-[#3b2b19] hover:border-[#ffd700] hover:text-[#ffd700]'
                  }`}
                >
                  <span>{qc.chip}</span>
                </button>
              );
            })}
          </div>

          {/* Output Screen */}
          <div className="bg-[#04080e] border border-[#ffd700]/40 rounded-xl p-5 font-cinzel text-xs sm:text-sm text-[#f4e6c3] leading-relaxed shadow-inner">
            <div className="flex items-center justify-between text-[#ffd700] text-[11px] mb-2">
              <div className="flex items-center space-x-2">
                <Scroll className="w-3.5 h-3.5" />
                <span className="font-bold tracking-wider uppercase">DECODED SHIP TRANSMISSION:</span>
              </div>
              {isPlayingAudio && (
                <span className="text-[10px] text-[#ffd700] animate-pulse font-bold">
                  ● AUDIO TRANSMITTING
                </span>
              )}
            </div>
            <p className="text-white text-sm sm:text-base leading-relaxed">
              {activeChip.answer}
            </p>
          </div>
        </div>

        {/* Live Search Intel Filter Bar */}
        <div className="mb-6 max-w-xl mx-auto relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search pirate intel keywords (e.g. bounty, crew, ID card, rules)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#08121a]/95 border-2 border-[#3b2b19] focus:border-[#ffd700] rounded-2xl pl-11 pr-4 py-3 font-cinzel text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#ffd700] shadow-lg transition-all"
            />
            <Search className="w-5 h-5 text-[#ffd700]/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Full FAQ Accordion Archive */}
        <div className="space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 text-center font-cinzel text-sm text-gray-400 bg-[#08121a]/80 border border-gray-800 rounded-xl">
              No matching scroll records found for "{searchQuery}". Try a different inquiry.
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="bg-[#08121a]/95 border border-[#3b2b19] hover:border-[#ffd700] rounded-xl overflow-hidden transition-all shadow-md"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#161208] transition-colors"
                  >
                    <span className="font-cinzel font-bold text-sm sm:text-base text-gray-200 pr-4">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#ffd700] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#cfb07a] flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 border-t border-[#3b2b19] bg-[#04080e]">
                      <p className="font-cinzel text-gray-300 text-sm leading-relaxed">
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
