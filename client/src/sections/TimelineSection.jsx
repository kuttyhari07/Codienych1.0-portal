import React from 'react';
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
  Compass,
  Anchor,
  Skull,
  Swords
} from 'lucide-react';
import { motion } from 'framer-motion';
import DecipherText from '../components/DecipherText';

const timelineSteps = [
  {
    step: '01',
    title: 'ONLINE CREW ENLISTMENT',
    subtitle: 'Online team registration & payment proof submission via official portal',
    time: 'Phase 01 • Pre-Voyage',
    icon: ClipboardCheck,
    phase: 'PORT RECRUITMENT',
    tag: 'REGISTRATION LIVE',
    tagColor: 'text-[#ffd700] bg-[#ffd700]/10 border-[#ffd700]/40',
  },
  {
    step: '02',
    title: 'PORT CHECK-IN & REPORTING',
    subtitle: 'On-site reporting, ID card verification & delegate kit distribution',
    time: 'Day 1 • 08:30 AM',
    icon: UserCheck,
    phase: 'HARBOR CLEARANCE',
    tag: 'ESEC CONVENTION',
    tagColor: 'text-teal-400 bg-teal-500/10 border-teal-500/40',
  },
  {
    step: '03',
    title: 'EXPEDITION EMBARKATION',
    subtitle: '24-hour hackathon launch briefing & mentor introduction ceremony',
    time: 'Day 1 • 09:30 AM',
    icon: Anchor,
    phase: 'SAILS HOISTED',
    tag: 'COUNTDOWN COMMENCES',
    tagColor: 'text-[#00e5ff] bg-[#00e5ff]/10 border-[#00e5ff]/40',
  },
  {
    step: '04',
    title: 'SECRET RIDDLE UNSEALED',
    subtitle: 'Official problem statements unveiled on the spot simultaneously',
    time: 'Day 1 • 10:00 AM',
    icon: EyeOff,
    phase: 'CLASSIFIED DIRECTIVE',
    tag: 'SYNCHRONIZED RELEASE',
    tagColor: 'text-pink-400 bg-pink-500/10 border-pink-500/40',
  },
  {
    step: '05',
    title: '24-HR HIGH SEAS HACKING',
    subtitle: '24 hours of non-stop coding, architecture build, and mentorship reviews',
    time: 'Day 1 to Day 2 • 24 Hours',
    icon: Swords,
    phase: 'CODE STORM SPRINT',
    tag: '24-HR NON-STOP HACK',
    tagColor: 'text-[#ffd700] bg-[#ffd700]/10 border-[#ffd700]/40',
  },
  {
    step: '06',
    title: 'CODE REPO FREEZE & SUBMISSION',
    subtitle: 'Final code repository link, demo deck & video submission freeze',
    time: 'Day 2 • 09:00 AM',
    icon: Send,
    phase: 'ANCHORS DROPPED',
    tag: 'GIT REPO PUSH',
    tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/40',
  },
  {
    step: '07',
    title: 'INITIAL JURY EVALUATION',
    subtitle: 'Judging panel architectural review, code inspection & shortlisting',
    time: 'Day 2 • 10:00 AM',
    icon: Award,
    phase: 'TECHNICAL SCRUTINY',
    tag: 'MULTI-BENCHMARK JURY',
    tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-400/40',
  },
  {
    step: '08',
    title: 'MAIN STAGE SHOWCASE PITCH',
    subtitle: 'Top shortlisted squads pitch live on the main auditorium stage',
    time: 'Day 2 • 11:30 AM',
    icon: Presentation,
    phase: 'GRAND STAGE SHOWDOWN',
    tag: 'AUDITORIUM SHOWCASE',
    tagColor: 'text-purple-400 bg-purple-500/10 border-purple-500/40',
  },
  {
    step: '09',
    title: 'GRAND VALEDICTION & BOUNTIES',
    subtitle: 'Grand closing ceremony, cash prize distribution & awards gala',
    time: 'Day 2 • 02:00 PM',
    icon: Trophy,
    phase: 'VICTORY PLUNDER PODIUM',
    tag: 'BOUNTY & INTERNSHIPS',
    tagColor: 'text-[#ffd700] bg-[#ffd700]/10 border-[#ffd700]/40',
  },
];

const TimelineSection = () => {
  return (
    <section id="timeline" className="relative py-24 px-4 z-10 select-none overflow-hidden">
      {/* Background Dark Overlay */}
      <div className="absolute inset-0 bg-[#03070b]/85 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-20">
        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="inline-flex items-center space-x-2 font-cinzel font-bold text-xs text-[#ffd700] tracking-widest uppercase mb-2 bg-[#ffd700]/10 px-3 py-1 rounded-full border border-[#ffd700]/30">
            <Compass className="w-3.5 h-3.5 text-[#ffd700] animate-spin" style={{ animationDuration: '20s' }} />
            <span>// 24-HOUR EXPEDITION SEA CHART</span>
          </div>
          <h2 className="font-pirate text-4xl sm:text-6xl text-white tracking-wide">
            SEA VOYAGE <span className="text-[#ffd700] pirate-gold-title">TIMELINE</span>
          </h2>
          <p className="font-cinzel text-xs sm:text-sm text-gray-300 max-w-xl mx-auto mt-3">
            Follow the 9 legendary milestones of the CODIENYCH 1.0 high seas hackathon expedition.
          </p>
        </div>

        {/* Continuous Vertical Timeline Rail */}
        <div className="relative">
          {/* Vertical Glowing Gold Line */}
          <div className="absolute left-6 sm:left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-gradient-to-b from-[#ffd700]/20 via-[#ffd700] to-[#00e5ff]/30 shadow-[0_0_15px_rgba(229,193,88,0.6)]" />

          {/* Timeline Milestones */}
          <div className="space-y-12 sm:space-y-16">
            {timelineSteps.map((item, idx) => {
              const Icon = item.icon;
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                  className={`relative flex flex-col sm:flex-row items-start sm:items-center ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Center Node Badge on the Vertical Line */}
                  <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl bg-[#140e06] border-2 border-[#ffd700] flex items-center justify-center shadow-[0_0_20px_rgba(229,193,88,0.5)] z-20 group hover:scale-110 transition-transform">
                    <span className="font-pirate text-sm sm:text-base text-[#ffd700]">
                      {item.step}
                    </span>
                  </div>

                  {/* Spacer for 2-column alternating desktop grid */}
                  <div className="hidden sm:block sm:w-1/2" />

                  {/* Milestone Card */}
                  <div
                    className={`w-full sm:w-1/2 pl-14 sm:pl-0 ${
                      isEven ? 'sm:pr-12' : 'sm:pl-12'
                    }`}
                  >
                    <div className="p-6 sm:p-7 border border-[#4a381e] hover:border-[#ffd700] bg-[#08121a]/95 backdrop-blur-xl rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.8)] hover:shadow-[0_0_40px_rgba(229,193,88,0.25)] transition-all duration-300 relative group overflow-hidden">
                      {/* Top Corner Watermark Step */}
                      <div className="absolute top-2 right-4 font-pirate text-5xl sm:text-6xl text-white/5 select-none pointer-events-none group-hover:text-[#ffd700]/10 transition-colors">
                        {item.step}
                      </div>

                      {/* Header Row: Time & Phase Tag */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="inline-flex items-center space-x-1 font-cinzel text-[11px] text-black bg-[#ffd700] px-3 py-0.5 rounded-full font-bold shadow-[0_0_12px_rgba(255,215,0,0.5)]">
                          <Clock className="w-3 h-3" />
                          <span>{item.time}</span>
                        </span>

                        <span className={`font-cinzel text-[11px] border px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold ${item.tagColor}`}>
                          {item.tag}
                        </span>
                      </div>

                      {/* Title & Icon Header */}
                      <div className="flex items-start space-x-3 mb-2">
                        <div className="p-2.5 rounded-xl bg-[#161208] border border-[#ffd700]/40 text-[#ffd700] shrink-0 mt-0.5">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-cinzel text-[10px] text-[#e5c158] tracking-widest uppercase block font-bold">
                            {item.phase}
                          </span>
                          <h3 className="font-pirate text-2xl sm:text-3xl text-white tracking-wide">
                            <DecipherText text={item.title} />
                          </h3>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="font-cinzel text-xs sm:text-sm text-gray-300 leading-relaxed border-l-2 border-[#ffd700]/50 pl-3.5 py-0.5 mt-3">
                        {item.subtitle}
                      </p>

                      {/* Footer Phase Status */}
                      <div className="mt-4 pt-3 border-t border-[#2a1e12] flex items-center justify-between font-cinzel text-[11px] text-gray-400">
                        <span className="flex items-center space-x-1 text-[#ffd700]">
                          <Sparkles className="w-3 h-3 text-[#ffd700]" />
                          <span>Milestone {item.step} of 09</span>
                        </span>
                        <span className="text-[#cfb07a] text-[10px] uppercase font-bold">
                          BLACK PEARL EXPEDITION
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
