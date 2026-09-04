import React from 'react';
import { Mail, Phone, MapPin, User, Globe, Share2 } from 'lucide-react';
import { EVENT_CONFIG } from '../utils/config';

const ContactSection = () => {
  return (
    <section id="contact" className="relative py-24 px-4 z-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block font-mono text-xs text-[#00ff66] tracking-widest uppercase mb-2">
            // COMMS FEED
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white tracking-wide">
            CONTACT <span className="text-[#00ff66]">COMMAND</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Official Channels */}
          <div className="bg-[#0a140e]/90 border border-[#1b3524] rounded-2xl p-8 shadow-lg space-y-6">
            <h3 className="font-orbitron font-bold text-xl text-[#00ff66] mb-4 border-b border-[#1b3524] pb-3">
              OFFICIAL CONTACT CHANNELS
            </h3>

            <div className="flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-[#00ff66] flex-shrink-0 mt-1" />
              <div>
                <span className="font-mono text-xs text-gray-400 block uppercase">VENUE & INSTITUTION</span>
                <p className="font-sans font-medium text-gray-200">{EVENT_CONFIG.COLLEGE_NAME}</p>
                <p className="font-mono text-xs text-gray-400">{EVENT_CONFIG.DEPARTMENT}</p>
                <p className="font-mono text-xs text-gray-400">{EVENT_CONFIG.VENUE}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Mail className="w-6 h-6 text-[#00ff66] flex-shrink-0 mt-1" />
              <div>
                <span className="font-mono text-xs text-gray-400 block uppercase">EMAIL DISPATCH</span>
                <p className="font-mono text-sm text-[#00ff66]">{EVENT_CONFIG.ORGANIZER_EMAIL}</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <Phone className="w-6 h-6 text-[#00ff66] flex-shrink-0 mt-1" />
              <div>
                <span className="font-mono text-xs text-gray-400 block uppercase">HOTLINE PHONE</span>
                <a href={`tel:${EVENT_CONFIG.PHONE_NUMBER.replace(/\s+/g, '')}`} className="font-mono text-sm text-gray-200 hover:text-[#00ff66] transition-colors">
                  {EVENT_CONFIG.PHONE_NUMBER}
                </a>
              </div>
            </div>
          </div>

          {/* Coordinators & Social Placeholders */}
          <div className="bg-[#0a140e]/90 border border-[#1b3524] rounded-2xl p-8 shadow-lg space-y-6">
            <h3 className="font-orbitron font-bold text-xl text-white mb-4 border-b border-[#1b3524] pb-3">
              COORDINATORS & NETWORK
            </h3>

            <div className="space-y-4">
              {/* Association Coordinator */}
              <div className="bg-[#0f2416] p-4 rounded-xl border border-[#10b981]/40 space-y-2">
                <span className="font-mono text-xs text-[#00ff66] block uppercase font-bold">
                  ASSOCIATION COORDINATOR
                </span>
                <div className="flex items-center justify-between">
                  <span className="font-sans text-gray-200 text-sm font-medium">Mr. M. Dhanapal, AP/IT</span>
                  <a href="tel:9994036446" className="font-mono text-xs text-[#00ff66] hover:underline">
                    +91 99940 36446
                  </a>
                </div>
              </div>

              {/* Staff / Faculty Coordinators */}
              <div className="bg-[#0f2416] p-4 rounded-xl border border-[#10b981]/40 space-y-3">
                <span className="font-mono text-xs text-[#00ff66] block uppercase font-bold">
                  STAFF / FACULTY COORDINATORS
                </span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-gray-200 text-sm font-medium">Mr. S. Prabakaran, AP/IT</span>
                    <a href="tel:7904640937" className="font-mono text-xs text-[#00ff66] hover:underline">
                      +91 79046 40937
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-gray-200 text-sm font-medium">Mr. M. Sujith Kumar, AP/IT</span>
                    <a href="tel:9361636487" className="font-mono text-xs text-[#00ff66] hover:underline">
                      +91 93616 36487
                    </a>
                  </div>
                </div>
              </div>

              {/* Student Coordinators */}
              <div className="bg-[#0f2416] p-4 rounded-xl border border-[#10b981]/40 space-y-3">
                <span className="font-mono text-xs text-[#00ff66] block uppercase font-bold">
                  STUDENT COORDINATORS
                </span>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-gray-200 text-sm font-medium">RK Nandha Kumar</span>
                    <a href="tel:9342809449" className="font-mono text-xs text-[#00ff66] hover:underline">
                      +91 93428 09449
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-sans text-gray-200 text-sm font-medium">R Sastha Babu</span>
                    <a href="tel:9080713459" className="font-mono text-xs text-[#00ff66] hover:underline">
                      +91 90807 13459
                    </a>
                  </div>
                </div>
              </div>

              {/* Overall Coordinators */}
              <div className="bg-[#0f2416] p-4 rounded-xl border border-[#10b981]/40 space-y-1">
                <span className="font-mono text-xs text-[#00ff66] block uppercase font-bold">
                  OVERALL COORDINATORS
                </span>
                <p className="font-sans text-gray-200 text-sm font-medium">
                  Association Members And IE Members
                </p>
              </div>

              <div className="pt-2">
                <span className="font-mono text-xs text-gray-400 block uppercase mb-3">
                  SOCIAL CHANNELS
                </span>
                <div className="flex items-center space-x-3">
                  {['INSTAGRAM', 'LINKEDIN', 'TWITTER', 'DISCORD'].map((net) => (
                    <span
                      key={net}
                      className="px-3 py-1.5 rounded bg-[#0f1e14] border border-[#1b3524] font-mono text-[10px] text-gray-300"
                    >
                      [{net}]
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
