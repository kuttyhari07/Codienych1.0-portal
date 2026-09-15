import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronRight,
  Sparkles,
  Zap,
  Clock
} from 'lucide-react';
import { playLaserBlip, playChirp } from '../utils/cyberSound';
import SpotlightCard from '../components/SpotlightCard';
import DecipherText from '../components/DecipherText';

const timelineSteps = [
  {
    step: '01',
    title: 'REGISTRATION',
    subtitle: 'Online team registration & payment proof submission',
    time: 'Phase 01',
    icon: ClipboardCheck,
    phase: 'PRE-MISSION',
    tag: 'REGISTRATION ACTIVE',
  },
  {
    step: '02',
    title: 'CHECK-IN / REPORTING',
    subtitle: 'On-site reporting & ID card verification',
    time: 'Day 1 • 08:30 AM',
    icon: UserCheck,
    phase: 'CHECKPOINT',
    tag: 'ESEC CONVENTION',
  },
  {
    step: '03',
    title: 'HACKATHON BEGINS',
    subtitle: '24-hour hackathon launch & briefing',
    time: 'Day 1 • 09:30 AM',
    icon: Rocket,
    phase: 'LIFTOFF',
    tag: 'COUNTDOWN COMMENCES',
  },
  {
    step: '04',
    title: 'PROBLEM STATEMENT REVEAL',
    subtitle: 'Official problem statements unveiled on the spot',
    time: 'Day 1 • 10:00 AM',
    icon: EyeOff,
    phase: 'DIRECTIVE',
    tag: 'CONFIDENTIAL RELEASE',
  },
  {
    step: '05',
    title: 'DEVELOPMENT / HACKING',
    subtitle: '24 hours of non-stop coding & innovation',
    time: 'Day 1 to Day 2',
    icon: Code2,
    phase: 'CORE SPRINT',
    tag: '24-HOUR NON-STOP HACK',
  },
  {
    step: '06',
    title: 'PROJECT SUBMISSION',
    subtitle: 'Code repository & final deck submission',
    time: 'Day 2 • 09:00 AM',
    icon: Send,
    phase: 'DEADLINE',
    tag: 'CODE FREEZE',
  },
  {
    step: '07',
    title: 'EVALUATION',
    subtitle: 'Initial judging panel code & architecture review',
    time: 'Day 2 • 10:00 AM',
    icon: Award,
    phase: 'JURY REVIEW',
    tag: 'MULTI-CRITERIA SCORE',
  },
  {
    step: '08',
    title: 'FINAL PRESENTATION',
    subtitle: 'Shortlisted teams pitch live on stage',
    time: 'Day 2 • 11:30 AM',
    icon: Presentation,
    phase: 'STAGE PITCH',
    tag: 'GRAND AUDITORIUM',
  },
  {
    step: '09',
    title: 'FINAL RESULTS',
    subtitle: 'Grand closing ceremony & winner prize distribution',
    time: 'Day 2 • 02:00 PM',
    icon: Trophy,
    phase: 'VICTORY',
    tag: 'BOUNTY PODIUM',
  },
];

const TimelineSection = () => {
  const [selectedStep, setSelectedStep] = useState(0);

  const handleStepClick = (index) => {
    playLaserBlip();
    setSelectedStep(index);
  };

  const current = timelineSteps[selectedStep];
  const CurrentIcon = current.icon;

  return (
    <section id="timeline" className="relative py-24 px-4 z-10 select-none">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block font-mono text-xs text-[#00ff66] tracking-widest uppercase mb-2">
            // 3D MISSION FLIGHTPATH & ROADMAP
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-5xl text-white tracking-wide">
            EVENT <span className="text-[#00ff66] neon-glow-green">TIMELINE</span>
          </h2>
          <p className="font-mono text-xs sm:text-sm text-gray-400 mt-2">
            Click across the interactive 3D phase nodes to inspect operational milestones.
          </p>
        </div>

        {/* 3D Interactive Horizontal Flightpath Rail */}
        <div className="relative mb-12 overflow-x-auto pb-4 scrollbar-none">
          <div className="min-w-[850px] relative px-6 py-6">
            
            {/* Glowing Neon Cyber Rail Track */}
            <div className="absolute top-1/2 left-8 right-8 h-1 bg-gradient-to-r from-[#10b981]/40 via-[#00ff66] to-[#10b981]/40 -translate-y-1/2 shadow-[0_0_15px_#00ff66]" />

            {/* Dynamic Step Nodes */}
            <div className="relative flex justify-between items-center z-10">
              {timelineSteps.map((step, idx) => {
                const isSelected = selectedStep === idx;
                const Icon = step.icon;

                return (
                  <button
                    key={step.step}
                    type="button"
                    onClick={() => handleStepClick(idx)}
                    className="group relative flex flex-col items-center focus:outline-none transition-transform duration-300"
                  >
                    {/* Pulsing 3D Node Orb */}
                    <motion.div
                      animate={
                        isSelected
                          ? { scale: [1, 1.15, 1], rotateZ: [0, 5, -5, 0] }
                          : {}
                      }
                      transition={{ duration: 1.5, repeat: isSelected ? Infinity : 0 }}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
                        isSelected
                          ? 'bg-[#00ff66] border-white text-black shadow-[0_0_30px_#00ff66] scale-110'
                          : 'bg-[#05140b] border-[#10b981]/60 text-[#00ff66] hover:border-[#00ff66] hover:shadow-[0_0_15px_#00ff66]'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </motion.div>

                    {/* Step Number Tag */}
                    <span
                      className={`font-mono text-[10px] mt-2 font-bold tracking-wider transition-colors ${
                        isSelected ? 'text-[#00ff66]' : 'text-gray-400 group-hover:text-white'
                      }`}
                    >
                      PHASE {step.step}
                    </span>

                    {/* Bottom Indicator Arrow */}
                    {isSelected && (
                      <motion.div
                        layoutId="activeArrow"
                        className="w-2 h-2 bg-[#00ff66] rotate-45 mt-1 shadow-[0_0_8px_#00ff66]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3D Holographic Stage Card for Selected Step */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.step}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto"
          >
            <SpotlightCard className="p-8 sm:p-12 border-2 border-[#00ff66] bg-gradient-to-b from-[#0a2615] via-[#05170d] to-[#020a05] rounded-3xl shadow-[0_0_50px_rgba(0,255,102,0.4)] relative overflow-hidden hud-corner-box">
              
              {/* Background ambient lighting */}
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#00ff66]/15 rounded-full blur-3xl pointer-events-none" />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Left 3D Milestone Icon Box */}
                <div className="md:col-span-4 flex flex-col items-center justify-center p-6 sm:p-8 bg-[#030d06] border-2 border-[#00ff66]/60 rounded-3xl shadow-[0_0_35px_rgba(0,255,102,0.3)] text-center relative group">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-[#00ff66] to-[#10b981] text-black flex items-center justify-center shadow-[0_0_40px_#00ff66] mb-4">
                    <CurrentIcon className="w-12 h-12 sm:w-14 sm:h-14 animate-pulse" />
                  </div>

                  <span className="font-orbitron font-black text-2xl text-white">
                    STEP {current.step}
                  </span>
                  <span className="font-mono text-xs text-[#00ff66] tracking-widest uppercase mt-1">
                    {current.phase}
                  </span>
                </div>

                {/* Right Milestone Content */}
                <div className="md:col-span-8 space-y-4 text-left">
                  <div className="flex flex-wrap items-center gap-3">
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

                  <p className="font-mono text-sm sm:text-base text-gray-200 leading-relaxed border-l-4 border-[#00ff66] pl-4">
                    {current.subtitle}
                  </p>

                  <div className="pt-4 border-t border-[#1b3524] flex items-center justify-between font-mono text-xs text-gray-400">
                    <span className="flex items-center space-x-2 text-[#00ff66]">
                      <Sparkles className="w-4 h-4 text-[#00ff66]" />
                      <span>24-Hour Continuous Challenge Phase</span>
                    </span>

                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        disabled={selectedStep === 0}
                        onClick={() => handleStepClick(selectedStep - 1)}
                        className={`px-3 py-1 rounded-lg border text-xs font-mono transition-all ${
                          selectedStep === 0
                            ? 'opacity-30 cursor-not-allowed border-gray-800 text-gray-600'
                            : 'bg-[#05140b] border-[#10b981] text-[#00ff66] hover:bg-[#00ff66] hover:text-black'
                        }`}
                      >
                        ← PREV
                      </button>

                      <button
                        type="button"
                        disabled={selectedStep === timelineSteps.length - 1}
                        onClick={() => handleStepClick(selectedStep + 1)}
                        className={`px-3 py-1 rounded-lg border text-xs font-mono transition-all ${
                          selectedStep === timelineSteps.length - 1
                            ? 'opacity-30 cursor-not-allowed border-gray-800 text-gray-600'
                            : 'bg-[#05140b] border-[#10b981] text-[#00ff66] hover:bg-[#00ff66] hover:text-black'
                        }`}
                      >
                        NEXT →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default TimelineSection;
