import React from 'react';
import { Mail, Phone, MapPin, User, Globe, Share2, Compass, Anchor, Skull } from 'lucide-react';
import { EVENT_CONFIG } from '../utils/config';

const ContactSection = () => {
  return (
    <section id="contact" className="relative py-24 px-4 z-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block font-cinzel font-bold text-xs text-[#ffd700] tracking-widest uppercase mb-2">
            // ADMIRALTY & HIGH SEAS DISPATCH
          </div>
          <h2 className="font-pirate text-4xl sm:text-6xl text-white tracking-wide">
            PORT ADMIRALTY <span className="text-[#ffd700] pirate-gold-title">COMMAND</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Official Channels */}
          <div className="bg-[#08121a]/95 border border-[#4a381e] rounded-3xl p-8 shadow-xl space-y-6 hud-corner-box">
            <h3 className="font-pirate text-2xl text-[#ffd700] mb-4 border-b border-[#3b2b19] pb-3">
              OFFICIAL HARBOR CHANNELS
            </h3>

            <div className="flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-[#ffd700] flex-shrink-0 mt-1" />
              <div>
                <span className="font-cinzel text-xs text-[#cfb07a] block uppercase font-bold">PORT VENUE & INSTITUTION</span>
                <p className="font-cinzel font-bold text-gray-200">{EVENT_CONFIG.COLLEGE_NAME}</p>
                <p className="font-cinzel text-xs text-gray-300">{EVENT_CONFIG.DEPARTMENT}</p>
                <p className="font-cinzel text-xs text-gray-400">{EVENT_CONFIG.VENUE}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Mail className="w-6 h-6 text-[#ffd700] flex-shrink-0 mt-1" />
              <div>
                <span className="font-cinzel text-xs text-[#cfb07a] block uppercase font-bold">CARRIER PIGEON / EMAIL DISPATCH</span>
                <p className="font-mono text-sm text-[#ffd700]">{EVENT_CONFIG.ORGANIZER_EMAIL}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Phone className="w-6 h-6 text-[#ffd700] flex-shrink-0 mt-1" />
              <div>
                <span className="font-cinzel text-xs text-[#cfb07a] block uppercase font-bold">HARBOR MASTER TELEPHONE</span>
                <a href={`tel:${EVENT_CONFIG.PHONE_NUMBER.replace(/\s+/g, '')}`} className="font-mono text-sm text-gray-200 hover:text-[#ffd700] transition-colors">
                  {EVENT_CONFIG.PHONE_NUMBER}
                </a>
              </div>
            </div>
          </div>

          {/* Coordinators & Fleet Admiralty */}
          <div className="bg-[#08121a]/95 border border-[#4a381e] rounded-3xl p-8 shadow-xl space-y-6 hud-corner-box">
            <h3 className="font-pirate text-2xl text-white mb-4 border-b border-[#3b2b19] pb-3">
              FLEET ADMIRALS & CAPTAINS
            </h3>

            <div className="space-y-4">
              {/* Association Coordinator */}
              <div className="bg-[#140e06] p-4 rounded-2xl border border-[#ffd700]/40 space-y-2">
                <span className="font-cinzel text-xs text-[#ffd700] block uppercase font-bold">
                  ASSOCIATION COORDINATOR
                </span>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-['Rajdhani',sans-serif] text-gray-100 text-sm sm:text-base font-semibold tracking-wide">
                    Mr. M. Dhanapal, <span className="text-gray-400 font-normal text-xs sm:text-sm">AP/IT</span>
                  </span>
                  <a
                    href="tel:9994036446"
                    className="font-mono text-xs text-[#ffd700] hover:text-white hover:underline font-bold whitespace-nowrap shrink-0 px-2.5 py-1 rounded-md bg-[#ffd700]/10 border border-[#ffd700]/30 transition-colors"
                  >
                    +91 99940 36446
                  </a>
                </div>
              </div>

              {/* Staff / Faculty Coordinators */}
              <div className="bg-[#140e06] p-4 rounded-2xl border border-[#ffd700]/40 space-y-3">
                <span className="font-cinzel text-xs text-[#ffd700] block uppercase font-bold">
                  FACULTY CAPTAINS / COORDINATORS
                </span>
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-['Rajdhani',sans-serif] text-gray-100 text-sm sm:text-base font-semibold tracking-wide">
                      Mr. S. Prabakaran, <span className="text-gray-400 font-normal text-xs sm:text-sm">AP/IT</span>
                    </span>
                    <a
                      href="tel:7904640937"
                      className="font-mono text-xs text-[#ffd700] hover:text-white hover:underline font-bold whitespace-nowrap shrink-0 px-2.5 py-1 rounded-md bg-[#ffd700]/10 border border-[#ffd700]/30 transition-colors"
                    >
                      +91 79046 40937
                    </a>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-['Rajdhani',sans-serif] text-gray-100 text-sm sm:text-base font-semibold tracking-wide">
                      Mr. M. Sujith Kumar, <span className="text-gray-400 font-normal text-xs sm:text-sm">AP/IT</span>
                    </span>
                    <a
                      href="tel:9361636487"
                      className="font-mono text-xs text-[#ffd700] hover:text-white hover:underline font-bold whitespace-nowrap shrink-0 px-2.5 py-1 rounded-md bg-[#ffd700]/10 border border-[#ffd700]/30 transition-colors"
                    >
                      +91 93616 36487
                    </a>
                  </div>
                </div>
              </div>

              {/* Student Coordinators */}
              <div className="bg-[#140e06] p-4 rounded-2xl border border-[#ffd700]/40 space-y-3">
                <span className="font-cinzel text-xs text-[#ffd700] block uppercase font-bold">
                  STUDENT PIRATE CAPTAINS
                </span>
                <div className="space-y-2.5">
                  {EVENT_CONFIG.STUDENT_COORDINATORS.map((sc, index) => (
                    <div key={index} className="flex items-center justify-between gap-3">
                      <span className="font-['Rajdhani',sans-serif] text-gray-100 text-sm sm:text-base font-semibold tracking-wide">{sc.name}</span>
                      <a
                        href={`tel:${sc.phone.replace(/[^0-9+]/g, '')}`}
                        className="font-mono text-xs text-[#ffd700] hover:text-white hover:underline font-bold whitespace-nowrap shrink-0 px-2.5 py-1 rounded-md bg-[#ffd700]/10 border border-[#ffd700]/30 transition-colors"
                      >
                        {sc.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Overall Coordinators */}
              <div className="bg-[#140e06] p-4 rounded-2xl border border-[#ffd700]/40 space-y-1">
                <span className="font-cinzel text-xs text-[#ffd700] block uppercase font-bold">
                  OVERALL FLEET COORDINATORS
                </span>
                <p className="font-cinzel text-gray-200 text-sm font-medium">
                  IE Members And Association Members (Information Technology)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
