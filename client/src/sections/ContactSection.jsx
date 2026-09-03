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
                <p className="font-mono text-xs text-gray-400">[DEPARTMENT PLACEHOLDER]</p>
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
                <p className="font-mono text-sm text-gray-200">{EVENT_CONFIG.PHONE_NUMBER}</p>
              </div>
            </div>
          </div>

          {/* Coordinators & Social Placeholders */}
          <div className="bg-[#0a140e]/90 border border-[#1b3524] rounded-2xl p-8 shadow-lg space-y-6">
            <h3 className="font-orbitron font-bold text-xl text-white mb-4 border-b border-[#1b3524] pb-3">
              COORDINATORS & NETWORK
            </h3>

            <div className="space-y-4">
              <div className="bg-[#0f2416] p-4 rounded-xl border border-[#10b981]/40">
                <span className="font-mono text-xs text-[#00ff66] block uppercase font-bold">
                  FACULTY COORDINATOR
                </span>
                <p className="font-sans text-gray-300 text-sm mt-1">
                  [FACULTY COORDINATOR NAME PLACEHOLDER]
                </p>
              </div>

              <div className="bg-[#0f2416] p-4 rounded-xl border border-[#10b981]/40">
                <span className="font-mono text-xs text-[#00ff66] block uppercase font-bold">
                  STUDENT COORDINATORS
                </span>
                <p className="font-sans text-gray-300 text-sm mt-1">
                  [STUDENT COORDINATOR DETAILS PLACEHOLDER]
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
