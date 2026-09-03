import React from 'react';
import { ArrowDown, CheckCircle, Flag, Code2, Award, Presentation } from 'lucide-react';

const timelineSteps = [
  { step: '01', title: 'REGISTRATION', subtitle: 'Online team registration & payment proof submission' },
  { step: '02', title: 'CHECK-IN / REPORTING', subtitle: 'On-site reporting & ID card verification' },
  { step: '03', title: 'HACKATHON BEGINS', subtitle: '24-hour hackathon launch & briefing' },
  { step: '04', title: 'PROBLEM STATEMENT REVEAL', subtitle: 'Official problem statements unveiled on the spot' },
  { step: '05', title: 'DEVELOPMENT / HACKING', subtitle: '24 hours of non-stop coding & innovation' },
  { step: '06', title: 'PROJECT SUBMISSION', subtitle: 'Code repository & final deck submission' },
  { step: '07', title: 'EVALUATION', subtitle: 'Initial judging panel code & architecture review' },
  { step: '08', title: 'FINAL PRESENTATION', subtitle: 'Shortlisted teams pitch live on stage' },
  { step: '09', title: 'FINAL RESULTS', subtitle: 'Grand closing ceremony & winner prize distribution' },
];

const TimelineSection = () => {
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
        </div>

        <div className="relative border-l-2 border-[#10b981]/40 ml-4 sm:ml-32 space-y-8">
          {timelineSteps.map((item, idx) => (
            <div key={item.step} className="relative pl-8 sm:pl-10 group">
              {/* Timeline Dot */}
              <div className="absolute -left-[17px] top-1.5 w-8 h-8 rounded-full bg-[#050b07] border-2 border-[#00ff66] flex items-center justify-center shadow-[0_0_10px_#00ff66] group-hover:scale-125 transition-transform">
                <span className="font-mono text-[10px] text-[#00ff66] font-bold">
                  {item.step}
                </span>
              </div>

              {/* Card content */}
              <div className="bg-[#0a140e]/90 border border-[#1b3524] group-hover:border-[#00ff66] rounded-xl p-5 sm:p-6 transition-all shadow-md">
                <h3 className="font-orbitron font-bold text-lg sm:text-xl text-white mb-1">
                  {item.title}
                </h3>
                <p className="font-mono text-xs text-gray-400">
                  {item.subtitle}
                </p>
              </div>

              {/* Down Arrow connector except last */}
              {idx < timelineSteps.length - 1 && (
                <div className="hidden sm:block absolute -left-4 top-full mt-1">
                  <ArrowDown className="w-4 h-4 text-[#10b981] opacity-40" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
