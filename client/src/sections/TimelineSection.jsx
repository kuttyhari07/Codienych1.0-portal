import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  UserCheck, 
  Rocket, 
  EyeOff, 
  Code2, 
  Send, 
  Award, 
  Presentation, 
  Trophy, 
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Activity,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playLaserBlip } from '../utils/cyberSound';
import SpotlightCard from '../components/SpotlightCard';
import DecipherText from '../components/DecipherText';

const timelineSteps = [
  {
    step: '01',
    title: 'ONLINE REGISTRATION',
    subtitle: 'Online team registration & payment proof submission via official portal',
    time: 'Phase 01',
    icon: ClipboardCheck,
    phase: 'PRE-MISSION ENLISTMENT',
    tag: 'REGISTRATION LIVE',
    bgGradient: 'from-[#041a0d] via-[#05140b] to-[#020703]',
    accentGlow: 'rgba(0, 255, 102, 0.4)',
    bgSvg: (
      <svg className="w-full h-full opacity-30" viewBox="0 0 400 400">
        <circle cx="200" cy="200" r="140" stroke="#00ff66" strokeWidth="2" strokeDasharray="8 8" fill="none" />
        <circle cx="200" cy="200" r="90" stroke="#10b981" strokeWidth="1" fill="none" />
        <path d="M100 200 L300 200 M200 100 L200 300" stroke="#00ff66" strokeWidth="1" opacity="0.4" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'CHECK-IN / REPORTING',
    subtitle: 'On-site reporting, ID card verification & delegate kit distribution',
    time: 'Day 1 • 08:30 AM',
    icon: UserCheck,
    phase: 'SECURITY CLEARANCE',
    tag: 'ESEC CONVENTION',
    bgGradient: 'from-[#031c17] via-[#041410] to-[#020807]',
    accentGlow: 'rgba(20, 184, 166, 0.4)',
    bgSvg: (
      <svg className="w-full h-full opacity-30" viewBox="0 0 400 400">
        <rect x="80" y="80" width="240" height="240" rx="30" stroke="#14b8a6" strokeWidth="2" strokeDasharray="12 6" fill="none" />
        <circle cx="200" cy="200" r="60" stroke="#00ff66" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'HACKATHON BEGINS',
    subtitle: '24-hour hackathon launch briefing & mentor introduction ceremony',
    time: 'Day 1 • 09:30 AM',
    icon: Rocket,
    phase: 'TACTICAL LIFTOFF',
    tag: 'COUNTDOWN COMMENCES',
    bgGradient: 'from-[#082414] via-[#05170d] to-[#020905]',
    accentGlow: 'rgba(16, 185, 129, 0.4)',
    bgSvg: (
      <svg className="w-full h-full opacity-35" viewBox="0 0 400 400">
        <path d="M200 40 L340 340 L200 280 L60 340 Z" stroke="#00ff66" strokeWidth="2" fill="none" />
        <circle cx="200" cy="180" r="40" stroke="#10b981" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    step: '04',
    title: 'PROBLEM STATEMENT REVEAL',
    subtitle: 'Official problem statements unveiled on the spot simultaneously',
    time: 'Day 1 • 10:00 AM',
    icon: EyeOff,
    phase: 'CLASSIFIED DIRECTIVE',
    tag: 'SYNCHRONIZED RELEASE',
    bgGradient: 'from-[#190e1b] via-[#0d0711] to-[#040205]',
    accentGlow: 'rgba(236, 72, 153, 0.4)',
    bgSvg: (
      <svg className="w-full h-full opacity-35" viewBox="0 0 400 400">
        <polygon points="200,60 320,150 280,310 120,310 80,150" stroke="#ec4899" strokeWidth="2" fill="none" />
        <circle cx="200" cy="190" r="50" stroke="#00ff66" strokeWidth="2" strokeDasharray="6 6" fill="none" />
      </svg>
    ),
  },
  {
    step: '05',
    title: 'DEVELOPMENT / HACKING',
    subtitle: '24 hours of non-stop coding, architecture build, and mentorship reviews',
    time: 'Day 1 to Day 2',
    icon: Code2,
    phase: 'WAR ROOM SPRINT',
    tag: '24-HR NON-STOP HACK',
    bgGradient: 'from-[#062415] via-[#03140b] to-[#010905]',
    accentGlow: 'rgba(0, 255, 102, 0.5)',
    bgSvg: (
      <svg className="w-full h-full opacity-40" viewBox="0 0 400 400">
        <line x1="40" y1="200" x2="360" y2="200" stroke="#00ff66" strokeWidth="2" />
        <line x1="200" y1="40" x2="200" y2="360" stroke="#00ff66" strokeWidth="2" />
        <circle cx="200" cy="200" r="110" stroke="#00ff66" strokeWidth="3" fill="none" />
        <circle cx="200" cy="200" r="160" stroke="#10b981" strokeWidth="1.5" strokeDasharray="10 10" fill="none" />
      </svg>
    ),
  },
  {
    step: '06',
    title: 'PROJECT SUBMISSION',
    subtitle: 'Final code repository link, demo deck & video submission freeze',
    time: 'Day 2 • 09:00 AM',
    icon: Send,
    phase: 'CODE FREEZE DEADLINE',
    tag: 'GIT REPO PUSH',
    bgGradient: 'from-[#1c1404] via-[#0e0a02] to-[#050301]',
    accentGlow: 'rgba(234, 179, 8, 0.4)',
    bgSvg: (
      <svg className="w-full h-full opacity-35" viewBox="0 0 400 400">
        <rect x="100" y="100" width="200" height="200" rx="20" stroke="#eab308" strokeWidth="2" fill="none" />
        <path d="M100 100 L300 300 M300 100 L100 300" stroke="#eab308" strokeWidth="1" strokeDasharray="8 8" />
      </svg>
    ),
  },
  {
    step: '07',
    title: 'INITIAL EVALUATION',
    subtitle: 'Judging panel architectural review, code inspection & shortlisting',
    time: 'Day 2 • 10:00 AM',
    icon: Award,
    phase: 'TECHNICAL SCRUTINY',
    tag: 'MULTI-BENCHMARK JURY',
    bgGradient: 'from-[#091b22] via-[#040e13] to-[#010609]',
    accentGlow: 'rgba(6, 182, 212, 0.4)',
    bgSvg: (
      <svg className="w-full h-full opacity-35" viewBox="0 0 400 400">
        <circle cx="200" cy="200" r="120" stroke="#06b6d4" strokeWidth="2" strokeDasharray="20 10" fill="none" />
        <polygon points="200,80 290,240 110,240" stroke="#00ff66" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    step: '08',
    title: 'FINAL PRESENTATION',
    subtitle: 'Top shortlisted squads pitch live on the main auditorium stage',
    time: 'Day 2 • 11:30 AM',
    icon: Presentation,
    phase: 'GRAND STAGE PITCH',
    tag: 'AUDITORIUM SHOWCASE',
    bgGradient: 'from-[#170e24] via-[#0c0714] to-[#040207]',
    accentGlow: 'rgba(168, 85, 247, 0.4)',
    bgSvg: (
      <svg className="w-full h-full opacity-35" viewBox="0 0 400 400">
        <path d="M60 300 L200 80 L340 300 Z" stroke="#a855f7" strokeWidth="3" fill="none" />
        <circle cx="200" cy="190" r="45" stroke="#00ff66" strokeWidth="2" fill="none" />
      </svg>
    ),
  },
  {
    step: '09',
    title: 'FINAL RESULTS & VALEDICTION',
    subtitle: 'Grand closing ceremony, cash prize distribution & awards gala',
    time: 'Day 2 • 02:00 PM',
    icon: Trophy,
    phase: 'VICTORY PODIUM',
    tag: 'BOUNTY & INTERNSHIPS',
    bgGradient: 'from-[#1a1705] via-[#0d0c03] to-[#040301]',
    accentGlow: 'rgba(250, 204, 21, 0.5)',
    bgSvg: (
      <svg className="w-full h-full opacity-40" viewBox="0 0 400 400">
        <polygon points="200,40 340,320 60,320" stroke="#facc15" strokeWidth="3" fill="none" />
        <circle cx="200" cy="200" r="70" stroke="#00ff66" strokeWidth="2" strokeDasharray="10 5" fill="none" />
      </svg>
    ),
  },
];

const TimelineSection = () => {
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  const current = timelineSteps[activePhaseIndex];
  const CurrentIcon = current.icon;

  const handleManualSelect = (idx) => {
    playLaserBlip();
    setActivePhaseIndex(idx);
  };

  const handleNext = () => {
    if (activePhaseIndex < timelineSteps.length - 1) {
      handleManualSelect(activePhaseIndex + 1);
    }
  };

  const handlePrev = () => {
    if (activePhaseIndex > 0) {
      handleManualSelect(activePhaseIndex - 1);
    }
  };

  return (
    <section id="timeline" className="relative py-20 px-4 z-10 select-none overflow-hidden">
      {/* Dynamic Background Atmosphere */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${current.bgGradient} transition-colors duration-700 ease-out`}
      />

      {/* Ambient 3D Neon Radial Light Flare */}
      <div
        className="absolute inset-0 transition-all duration-700 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${current.accentGlow} 0%, rgba(5, 11, 7, 0.95) 75%)`,
        }}
      />

      {/* Floating Hologram Cyber Backdrop SVG */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-700">
        <div className="w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] transition-all duration-700 transform scale-110">
          {current.bgSvg}
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-20">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center space-x-2 font-mono text-xs text-[#00ff66] tracking-widest uppercase mb-1">
            <Activity className="w-3.5 h-3.5 text-[#00ff66] animate-pulse" />
            <span>// 3D DYNAMIC MISSION FLIGHTPATH</span>
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-5xl text-white tracking-wide">
            EVENT <span className="text-[#00ff66] neon-glow-green">TIMELINE</span>
          </h2>
          <p className="font-mono text-xs sm:text-sm text-gray-300 mt-2">
            Click across phases or use arrows to travel through the 24-hour hackathon journey.
          </p>
        </div>

        {/* Top Horizontal Phase Stepper Rail */}
        <div className="w-full max-w-4xl mx-auto mb-10">
          {/* Progress Bar Line */}
          <div className="h-1.5 w-full bg-[#081a0e] rounded-full overflow-hidden mb-3 border border-[#1b3524]">
            <div
              className="h-full bg-gradient-to-r from-[#00ff66] via-[#10b981] to-[#00ff66] transition-all duration-300 shadow-[0_0_12px_#00ff66]"
              style={{
                width: `${((activePhaseIndex + 1) / timelineSteps.length) * 100}%`,
              }}
            />
          </div>

          {/* Stepper Buttons (All 9 phases) */}
          <div className="grid grid-cols-9 gap-1.5 sm:gap-2.5">
            {timelineSteps.map((item, idx) => {
              const isActive = activePhaseIndex === idx;
              const isPassed = activePhaseIndex > idx;

              return (
                <button
                  key={item.step}
                  type="button"
                  onClick={() => handleManualSelect(idx)}
                  className={`py-2.5 rounded-xl font-mono text-[10px] sm:text-xs font-bold transition-all flex flex-col items-center justify-center border ${
                    isActive
                      ? 'bg-[#00ff66] text-black border-white shadow-[0_0_20px_#00ff66] scale-105 sm:scale-110'
                      : isPassed
                      ? 'bg-[#062010] text-[#00ff66] border-[#00ff66]/50'
                      : 'bg-[#030d06]/80 text-gray-400 border-gray-800 hover:border-[#10b981] hover:text-white'
                  }`}
                >
                  <span className="font-orbitron">{item.step}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center 3D Holographic Stage Card */}
        <div className="w-full max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.step}
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.04, y: -20 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="p-6 sm:p-10 border-2 border-[#00ff66] bg-[#040e08]/95 backdrop-blur-xl rounded-3xl shadow-[0_0_60px_rgba(0,255,102,0.4)] relative overflow-hidden hud-corner-box">
                {/* Watermark */}
                <div className="absolute top-2 right-6 font-orbitron font-black text-6xl sm:text-9xl text-white/5 select-none pointer-events-none">
                  {current.step}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
                  {/* Left 3D Milestone Avatar */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#092212] to-[#030d06] border-2 border-[#00ff66]/70 rounded-3xl shadow-[0_0_35px_rgba(0,255,102,0.3)] text-center relative group">
                    <motion.div
                      animate={{
                        rotateY: [0, 15, -15, 0],
                        y: [0, -6, 0],
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-tr from-[#00ff66] to-[#10b981] text-black flex items-center justify-center shadow-[0_0_40px_#00ff66] mb-3"
                    >
                      <CurrentIcon className="w-10 h-10 sm:w-12 sm:h-12" />
                    </motion.div>

                    <span className="font-orbitron font-black text-2xl text-white">
                      PHASE {current.step}
                    </span>
                    <span className="font-mono text-[10px] text-[#00ff66] tracking-widest uppercase mt-0.5">
                      {current.phase}
                    </span>
                  </div>

                  {/* Right Milestone Details */}
                  <div className="md:col-span-8 space-y-3.5 text-left">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="inline-flex items-center space-x-1.5 font-mono text-xs text-black bg-[#00ff66] px-3.5 py-1 rounded-full font-bold shadow-[0_0_15px_#00ff66]">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{current.time}</span>
                      </span>

                      <span className="font-mono text-xs text-[#10b981] bg-[#00ff66]/10 border border-[#00ff66]/40 px-3 py-1 rounded-full uppercase tracking-wider">
                        {current.tag}
                      </span>
                    </div>

                    <h3 className="font-orbitron font-black text-2xl sm:text-4xl text-white tracking-wide">
                      <DecipherText text={current.title} />
                    </h3>

                    <p className="font-mono text-xs sm:text-sm text-gray-200 leading-relaxed border-l-4 border-[#00ff66] pl-4 py-1">
                      {current.subtitle}
                    </p>

                    <div className="pt-3 border-t border-[#1b3524] flex items-center justify-between font-mono text-xs text-gray-400">
                      <span className="flex items-center space-x-1.5 text-[#00ff66]">
                        <Sparkles className="w-3.5 h-3.5 text-[#00ff66]" />
                        <span>Milestone {activePhaseIndex + 1} of {timelineSteps.length}</span>
                      </span>

                      {/* Previous & Next Control Buttons */}
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          disabled={activePhaseIndex === 0}
                          onClick={handlePrev}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all flex items-center space-x-1 ${
                            activePhaseIndex === 0
                              ? 'opacity-30 cursor-not-allowed border-gray-800 text-gray-600'
                              : 'bg-[#05140b] border-[#10b981] text-[#00ff66] hover:bg-[#00ff66] hover:text-black active:scale-95'
                          }`}
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>PREV</span>
                        </button>

                        <button
                          type="button"
                          disabled={activePhaseIndex === timelineSteps.length - 1}
                          onClick={handleNext}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all flex items-center space-x-1 ${
                            activePhaseIndex === timelineSteps.length - 1
                              ? 'opacity-30 cursor-not-allowed border-gray-800 text-gray-600'
                              : 'bg-[#05140b] border-[#10b981] text-[#00ff66] hover:bg-[#00ff66] hover:text-black active:scale-95'
                          }`}
                        >
                          <span>NEXT</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
