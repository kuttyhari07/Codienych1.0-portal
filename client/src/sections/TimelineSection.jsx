import React, { useState } from 'react';
import { ArrowDown, CheckCircle, Flag, Code2, Award, Presentation, Clock, Sparkles } from 'lucide-react';
import SpotlightCard from '../components/SpotlightCard';
import DecipherText from '../components/DecipherText';

const timelineSteps = [
  { step: '01', title: 'REGISTRATION', subtitle: 'Online team registration & payment proof submission', time: 'Phase 01' },
  { step: '02', title: 'CHECK-IN / REPORTING', subtitle: 'On-site reporting & ID card verification', time: 'Day 1 • 08:30 AM' },
  { step: '03', title: 'HACKATHON BEGINS', subtitle: '24-hour hackathon launch & briefing', time: 'Day 1 • 09:30 AM' },
  { step: '04', title: 'PROBLEM STATEMENT REVEAL', subtitle: 'Official problem statements unveiled on the spot', time: 'Day 1 • 10:00 AM' },
  { step: '05', title: 'DEVELOPMENT / HACKING', subtitle: '24 hours of non-stop coding & innovation', time: 'Day 1 to Day 2' },
  { step: '06', title: 'PROJECT SUBMISSION', subtitle: 'Code repository & final deck submission', time: 'Day 2 • 09:00 AM' },
  { step: '07', title: 'EVALUATION', subtitle: 'Initial judging panel code & architecture review', time: 'Day 2 • 10:00 AM' },
  { step: '08', title: 'FINAL PRESENTATION', subtitle: 'Shortlisted teams pitch live on stage', time: 'Day 2 • 11:30 AM' },
  { step: '09', title: 'FINAL RESULTS', subtitle: 'Grand closing ceremony & winner prize distribution', time: 'Day 2 • 02:00 PM' },
];

const TimelineSection = () => {
  const [activeStep, setActiveStep] = useState(null);

  return (
    <section id="timeline" className="relative py-24 px-4 z-10">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block font-mono text-xs text-[#00ff66] tracking-widest uppercase mb-2">
            // MISSION ROADMAP
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-4xl text-white tracking-wide">
            EVENT <span className="text-[#00ff66]">TIMELINE</span>
          </h2>
          <p className="font-mono text-xs sm:text-sm text-gray-400 mt-2">
            Hover over any milestone phase to inspect operational telemetry.
          </p>
        </div>

        <div className="relative border-l-2 border-[#10b981]/50 ml-4 sm:ml-28 space-y-7">
          {timelineSteps.map((item, idx) => {
            const isHovered = activeStep === idx;
            return (
              <div
                key={item.step}
                onMouseEnter={() => setActiveStep(idx)}
                onMouseLeave={() => setActiveStep(null)}
                className="relative pl-7 sm:pl-10 group"
              >
                {/* Timeline Pulsing Node */}
                <div
                  className={`absolute -left-[17px] top-3 w-8 h-8 rounded-full bg-[#050b07] border-2 transition-all duration-300 flex items-center justify-center ${
                    isHovered
                      ? 'border-[#00ff66] shadow-[0_0_20px_#00ff66] scale-125 bg-[#00ff66]/20'
                      : 'border-[#10b981] shadow-[0_0_10px_rgba(0,255,102,0.3)]'
                  }`}
                >
                  <span className="font-mono text-[10px] text-[#00ff66] font-bold">
                    {item.step}
                  </span>
                </div>

                {/* Spotlight Interactive Card */}
                <SpotlightCard className="p-5 sm:p-6 cursor-pointer">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                    <h3 className="font-orbitron font-bold text-lg sm:text-xl text-white">
                      <DecipherText text={item.title} />
                    </h3>
                    <span className="font-mono text-[11px] text-[#00ff66] bg-[#00ff66]/10 border border-[#00ff66]/30 px-2.5 py-0.5 rounded-full self-start sm:self-auto font-semibold">
                      {item.time}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-gray-300 leading-relaxed">
                    {item.subtitle}
                  </p>
                </SpotlightCard>

                {/* Connector Arrow */}
                {idx < timelineSteps.length - 1 && (
                  <div className="hidden sm:block absolute -left-4 top-full mt-1">
                    <ArrowDown className="w-4 h-4 text-[#10b981] opacity-40 group-hover:opacity-100 group-hover:text-[#00ff66] transition-all" />
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

export default TimelineSection;
