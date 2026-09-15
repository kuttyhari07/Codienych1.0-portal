import React, { useState } from 'react';
import { Shield, QrCode, Sparkles, Check, Copy, Share2, Cpu, UserCheck } from 'lucide-react';
import { EVENT_CONFIG } from '../utils/config';

const roles = [
  'Full Stack Architect',
  'AI / ML Engineer',
  'Cybersecurity Specialist',
  'Cloud / DevOps Ninja',
  'UI/UX & Product Designer',
  'Mobile App Developer',
];

const MissionIdBadgeGenerator = () => {
  const [name, setName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [role, setRole] = useState(roles[0]);
  const [copied, setCopied] = useState(false);

  const displayId = `COD-26-${(name.trim() ? name.slice(0, 3).toUpperCase() : 'REC')}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  const handleCopy = () => {
    const text = `🚀 I'm participating in ${EVENT_CONFIG.EVENT_NAME} (24-Hour Hackathon) at ${EVENT_CONFIG.COLLEGE_NAME}! Role: ${role} | Team: ${teamName || 'Squad Vanguard'}. Registration Open now!`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="badge-gen" className="relative py-24 px-4 z-10">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 font-mono text-xs text-[#00ff66] tracking-widest uppercase mb-3 bg-[#00ff66]/10 px-3.5 py-1 rounded-full border border-[#00ff66]/30">
            <Sparkles className="w-3.5 h-3.5 text-[#00ff66] animate-pulse" />
            <span>// CYBERNETIC CREDENTIAL MATRIX</span>
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-5xl text-white tracking-wide mb-4">
            MISSION <span className="text-[#00ff66]">ID PASS</span>
          </h2>
          <p className="max-w-2xl mx-auto font-mono text-xs sm:text-sm text-gray-300">
            Preview your official holographic participant credential pass. Customize your callsign & squad role!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls Form */}
          <div className="lg:col-span-5 bg-[#0a140e]/95 border-2 border-[#1b3524] hover:border-[#00ff66]/50 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden hud-corner-box">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-6">
              <span className="font-mono text-xs text-[#00ff66] uppercase tracking-wider font-bold">
                [ CONFIG PROFILE ]
              </span>
              <span className="font-mono text-[10px] text-gray-400">SECTOR_INPUT</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-mono text-xs text-gray-300 mb-1.5 uppercase">
                  Participant Name / Callsign
                </label>
                <input
                  type="text"
                  placeholder="e.g. Alex Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={24}
                  className="w-full bg-[#050b07] border border-[#1b3524] focus:border-[#00ff66] rounded-xl px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00ff66]"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-gray-300 mb-1.5 uppercase">
                  Squad / Team Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. CyberVanguard"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  maxLength={24}
                  className="w-full bg-[#050b07] border border-[#1b3524] focus:border-[#00ff66] rounded-xl px-4 py-2.5 font-mono text-sm text-white focus:outline-none focus:ring-1 focus:ring-[#00ff66]"
                />
              </div>

              <div>
                <label className="block font-mono text-xs text-gray-300 mb-1.5 uppercase">
                  Specialization / Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#050b07] border border-[#1b3524] focus:border-[#00ff66] rounded-xl px-4 py-2.5 font-mono text-sm text-[#00ff66] focus:outline-none focus:ring-1 focus:ring-[#00ff66]"
                >
                  {roles.map((r) => (
                    <option key={r} value={r} className="bg-[#050b07] text-white">
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="w-full py-3 rounded-xl font-orbitron font-bold text-xs uppercase tracking-wider text-black bg-[#00ff66] hover:bg-[#10b981] hover:text-white transition-all shadow-[0_0_15px_rgba(0,255,102,0.4)] flex items-center justify-center space-x-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>COPIED SHARE TEXT!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" />
                      <span>SHARE CALLSIGN PASS</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Holographic Badge Card Preview */}
          <div className="lg:col-span-7 flex justify-center">
            <div className="w-full max-w-md bg-gradient-to-b from-[#0f2e1a] via-[#091e12] to-[#040e08] border-2 border-[#00ff66] rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,255,102,0.35)] relative overflow-hidden hud-corner-box transform hover:scale-[1.02] transition-transform duration-300">
              
              {/* Top Cyber Hologram Header */}
              <div className="flex items-center justify-between border-b border-[#00ff66]/30 pb-3 mb-5">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-[#00ff66] text-black flex items-center justify-center font-bold">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-orbitron font-extrabold text-xs text-white block">
                      CODIENYCH 1.0
                    </span>
                    <span className="font-mono text-[9px] text-[#10b981] block">
                      24-HR HACKATHON PASS
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-[9px] text-[#00ff66] block bg-[#00ff66]/10 px-2 py-0.5 rounded border border-[#00ff66]/40 uppercase font-bold">
                    ACCESS GRANTED
                  </span>
                  <span className="font-mono text-[8px] text-gray-400 block mt-0.5">
                    ESEC CONVENTION
                  </span>
                </div>
              </div>

              {/* Main Participant Profile Layout */}
              <div className="flex items-start space-x-4 mb-5">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#05140b] border-2 border-[#00ff66] flex flex-col items-center justify-center text-[#00ff66] relative overflow-hidden shadow-[0_0_15px_rgba(0,255,102,0.3)] flex-shrink-0">
                  <UserCheck className="w-8 h-8 sm:w-10 sm:h-10" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00ff66]/20 to-transparent animate-pulse pointer-events-none" />
                </div>

                <div className="flex-1 min-w-0">
                  <span className="font-mono text-[10px] text-[#10b981] uppercase tracking-wider block">
                    OPERATIVE NAME
                  </span>
                  <h3 className="font-orbitron font-black text-xl sm:text-2xl text-white truncate mb-1">
                    {name.trim() || 'HACKER SQUAD'}
                  </h3>

                  <span className="inline-block bg-[#00ff66]/15 border border-[#00ff66]/40 px-2.5 py-0.5 rounded text-[11px] font-mono text-[#00ff66] font-bold">
                    {role}
                  </span>
                </div>
              </div>

              {/* Squad & Security Telemetry Grid */}
              <div className="grid grid-cols-2 gap-3 bg-[#050b07]/80 border border-gray-800 rounded-xl p-3.5 font-mono text-xs mb-5">
                <div>
                  <span className="text-gray-500 text-[10px] block uppercase">SQUAD NAME</span>
                  <span className="text-white font-bold truncate block">
                    {teamName.trim() || 'TEAM VANGUARD'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] block uppercase">CLEARANCE</span>
                  <span className="text-[#00ff66] font-bold block">LEVEL 4 // HACKER</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] block uppercase">ENTRY FEE STATUS</span>
                  <span className="text-emerald-400 font-bold block">₹525 / MEMBER</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[10px] block uppercase">PASS SERIAL</span>
                  <span className="text-gray-300 font-mono text-[11px] block">{displayId}</span>
                </div>
              </div>

              {/* Holographic Barcode Stripe */}
              <div className="flex items-center justify-between border-t border-gray-800 pt-3">
                <div className="space-y-1">
                  <div className="h-5 flex space-x-1 items-end">
                    {[16, 24, 12, 28, 20, 10, 24, 18, 30, 14, 22, 26, 12, 20, 28, 16].map((h, i) => (
                      <div
                        key={i}
                        style={{ height: `${h}px` }}
                        className="w-1 bg-[#00ff66]/70 rounded-xs"
                      />
                    ))}
                  </div>
                  <span className="font-mono text-[8px] text-gray-500 tracking-widest block">
                    {displayId}
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-mono text-[8px] text-gray-400 block uppercase">
                    SECURITY CODE: ESEC-IT-2026
                  </span>
                  <span className="font-mono text-[9px] text-[#00ff66] font-bold block">
                    OCTOBER 8 - 9, 2026
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionIdBadgeGenerator;
