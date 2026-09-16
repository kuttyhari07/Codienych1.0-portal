import React, { useState } from 'react';
import {
  Cpu,
  Globe,
  ShieldAlert,
  Wifi,
  Cloud,
  ChevronDown,
  ChevronUp,
  CircuitBoard,
  Zap,
} from 'lucide-react';
import SpotlightCard from '../components/SpotlightCard';
import DecipherText from '../components/DecipherText';

const DOMAINS_DATA = [
  {
    id: 'aiml',
    title: 'AI & Machine Learning (AI ML)',
    shortTitle: 'AI ML',
    tagline: 'NEURAL PIRACY // INTELLIGENT AGENTS',
    description:
      'Harness cutting-edge artificial intelligence, neural networks, Generative AI, predictive modeling, and intelligent autonomous systems to solve complex nautical and real-world challenges.',
    icon: Cpu,
    accentColor: '#ffd700',
    borderColor: 'border-[#ffd700]/50 hover:border-[#ffd700]',
    spotlightColor: 'rgba(255, 215, 0, 0.22)',
    bgGradient: 'from-[#1c150c] via-[#0f1722] to-[#08121a]',
    tags: ['Generative AI', 'Deep Learning', 'Computer Vision', 'NLP & LLMs', 'Predictive Modeling'],
  },
  {
    id: 'web-app',
    title: 'Web & App Development',
    shortTitle: 'Web & App Dev',
    tagline: 'DIGITAL FLEETS // FULL-STACK ARTIFACTS',
    description:
      'Engineer lightning-fast responsive web applications, progressive web architectures, and mobile experiences with modern frameworks, reactive interfaces, and scalable APIs.',
    icon: Globe,
    accentColor: '#00e5ff',
    borderColor: 'border-[#00e5ff]/50 hover:border-[#00e5ff]',
    spotlightColor: 'rgba(0, 229, 255, 0.22)',
    bgGradient: 'from-[#0a1e2e] via-[#0c1622] to-[#08121a]',
    tags: ['Full-Stack Web', 'Mobile Apps (iOS/Android)', 'React / Next.js', 'APIs & Microservices'],
  },
  {
    id: 'cybersecurity',
    title: 'Cyber Security',
    shortTitle: 'Cyber Security',
    tagline: 'HIGH-SEAS DEFENSE // ETHICAL OFFENSE',
    description:
      'Forge unbreachable cryptographic bastions, threat intelligence pipelines, vulnerability detection engines, and penetration testing tools to safeguard maritime cyberspace.',
    icon: ShieldAlert,
    accentColor: '#ff4444',
    borderColor: 'border-[#ff4444]/50 hover:border-[#ff4444]',
    spotlightColor: 'rgba(255, 68, 68, 0.2)',
    bgGradient: 'from-[#200c0e] via-[#0e1622] to-[#08121a]',
    tags: ['Network Defense', 'Ethical Hacking', 'Cryptography', 'Threat Detection', 'Zero Trust'],
  },
  {
    id: 'iot',
    title: 'Internet of Things (IOT)',
    shortTitle: 'IOT',
    tagline: 'CONNECTED VESSELS // TELEMETRY & EDGE',
    description:
      'Bridge digital intellect with physical reality. Design smart sensor arrays, embedded controllers, automated telemetry networks, and edge-computing apparatuses.',
    icon: Wifi,
    accentColor: '#39ff14',
    borderColor: 'border-[#39ff14]/60 hover:border-[#39ff14]',
    spotlightColor: 'rgba(57, 255, 20, 0.22)',
    bgGradient: 'from-[#0c2215] via-[#091722] to-[#08121a]',
    tags: ['Arduino', 'ESP32', 'Sensors & Microcontrollers', 'Wokwi / Tinkercad', 'Edge Automation'],
    isIoT: true,
  },
  {
    id: 'cloud',
    title: 'Cloud Computing',
    shortTitle: 'Cloud Computing',
    tagline: 'DISTRIBUTED OCEANS // SCALABLE CLOUD',
    description:
      'Architect resilient distributed backbones, containerized microservices, serverless workflows, multi-cloud topologies, and DevOps pipelines built for infinite Caribbean scale.',
    icon: Cloud,
    accentColor: '#b388ff',
    borderColor: 'border-[#b388ff]/50 hover:border-[#b388ff]',
    spotlightColor: 'rgba(179, 136, 255, 0.22)',
    bgGradient: 'from-[#180a24] via-[#0c1422] to-[#08121a]',
    tags: ['AWS / GCP / Azure', 'Docker & Kubernetes', 'Serverless Functions', 'DevOps & CI/CD'],
  },
];

const DomainsSection = () => {
  const [hardwareOpen, setHardwareOpen] = useState(true);

  return (
    <section id="domains" className="relative py-24 px-4 z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block font-cinzel font-bold text-xs text-[#ffd700] tracking-widest uppercase mb-2">
            // BATTLE REALMS & TRACKS
          </div>
          <h2 className="font-pirate text-4xl sm:text-6xl text-white tracking-wide mb-3">
            HACKATHON <span className="text-[#ffd700] pirate-gold-title"><DecipherText text="DOMAINS" /></span>
          </h2>
          <p className="font-cinzel text-xs sm:text-sm text-[#e5c158] uppercase tracking-widest font-semibold max-w-2xl mx-auto">
            CHOOSE YOUR EXPEDITION REALM — FORGE YOUR ARTIFACT ACROSS 5 CUTTING-EDGE PIRATE TECH TRACKS
          </p>
        </div>

        {/* Top 3 Domains (AI ML, Web & App, Cyber Security) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {DOMAINS_DATA.slice(0, 3).map((domain) => {
            const Icon = domain.icon;
            return (
              <SpotlightCard
                key={domain.id}
                borderColor={domain.borderColor}
                spotlightColor={domain.spotlightColor}
                className={`p-6 sm:p-7 flex flex-col justify-between bg-gradient-to-b ${domain.bgGradient}`}
              >
                <div>
                  {/* Domain Icon & Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center border shadow-md"
                      style={{
                        backgroundColor: '#050c14',
                        borderColor: domain.accentColor,
                        boxShadow: `0 0 16px ${domain.accentColor}33`,
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: domain.accentColor }} />
                    </div>
                    <span
                      className="text-[10px] font-cinzel font-bold tracking-wider px-2.5 py-1 rounded-md border"
                      style={{
                        color: domain.accentColor,
                        borderColor: `${domain.accentColor}40`,
                        backgroundColor: `${domain.accentColor}12`,
                      }}
                    >
                      {domain.shortTitle}
                    </span>
                  </div>

                  <div className="text-[11px] font-cinzel text-gray-400 uppercase tracking-widest mb-1 font-semibold">
                    {domain.tagline}
                  </div>

                  <h3 className="font-pirate text-2xl sm:text-3xl text-white mb-3">
                    <DecipherText text={domain.title} />
                  </h3>

                  <p className="font-cinzel text-xs text-gray-300 leading-relaxed mb-6">
                    {domain.description}
                  </p>
                </div>

                {/* Tech Chips */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap gap-1.5">
                  {domain.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-cinzel font-medium bg-[#04080e]/90 text-gray-300 border border-white/10 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            );
          })}
        </div>

        {/* Bottom 2 Domains (IOT & Cloud Computing) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* IOT Featured Card (7 cols on desktop with Hardware & Simulation Accordion) */}
          <div className="lg:col-span-7">
            <SpotlightCard
              borderColor="border-[#39ff14]/60 hover:border-[#39ff14]"
              spotlightColor="rgba(57, 255, 20, 0.22)"
              className="p-6 sm:p-7 flex flex-col justify-between h-full bg-gradient-to-b from-[#0c2215] via-[#091722] to-[#08121a] shadow-[0_0_30px_rgba(57,255,20,0.12)]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-[#39ff14] bg-[#050c14] shadow-[0_0_18px_rgba(57,255,20,0.3)]">
                    <Wifi className="w-6 h-6 text-[#39ff14]" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-cinzel font-bold text-[#39ff14] tracking-wider px-2.5 py-1 rounded-md border border-[#39ff14]/40 bg-[#39ff14]/10">
                      IOT
                    </span>
                  </div>
                </div>

                <div className="text-[11px] font-cinzel text-gray-400 uppercase tracking-widest mb-1 font-semibold">
                  CONNECTED VESSELS // TELEMETRY & EDGE
                </div>

                <h3 className="font-pirate text-2xl sm:text-3xl text-white mb-2">
                  <DecipherText text="Internet of Things (IOT)" />
                </h3>

                <p className="font-cinzel text-xs text-gray-300 leading-relaxed mb-5">
                  Bridge digital intellect with physical reality. Design smart sensor arrays, embedded controllers, automated telemetry networks, and edge-computing apparatuses.
                </p>

                {/* --- HARDWARE & SIMULATION ACCORDION (REQUESTED SPECIFICALLY FOR IOT) --- */}
                <div className="mb-5 rounded-xl border-2 border-[#39ff14]/40 bg-[#05111a]/95 overflow-hidden shadow-lg transition-all duration-300">
                  <button
                    type="button"
                    onClick={() => setHardwareOpen(!hardwareOpen)}
                    className="w-full flex items-center justify-between p-3.5 sm:p-4 bg-gradient-to-r from-[#0d2218] to-[#091520] hover:from-[#112d20] hover:to-[#0c1c2b] text-left transition-colors cursor-pointer border-b border-white/5"
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#39ff14]/15 border border-[#39ff14]/50 flex items-center justify-center">
                        <CircuitBoard className="w-4 h-4 text-[#39ff14]" />
                      </div>
                      <div>
                        <span className="font-pirate text-lg sm:text-xl text-[#ffd700] tracking-wide block leading-none">
                          Hardware & Simulation
                        </span>
                        <span className="font-cinzel text-[10px] text-[#39ff14] font-bold tracking-wider uppercase">
                          Important Guideline for IOT Crews
                        </span>
                      </div>
                    </div>
                    <div className="text-[#ffd700] p-1 rounded-md hover:bg-white/10 transition-colors">
                      {hardwareOpen ? (
                        <ChevronUp className="w-5 h-5 text-[#ffd700]" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-[#ffd700]" />
                      )}
                    </div>
                  </button>

                  {hardwareOpen && (
                    <div className="p-4 sm:p-5 text-gray-200 font-cinzel text-xs leading-relaxed space-y-3 bg-[#040c12]">
                      <div className="flex items-start space-x-2.5 p-3 rounded-lg bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#85e876]">
                        <Zap className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#39ff14]" />
                        <span className="font-bold text-white text-[11px] sm:text-xs">
                          Hardware is NOT mandatory. A functional simulation/prototype and PPT are sufficient for evaluation.
                        </span>
                      </div>

                      <p className="text-gray-300 text-[11px] sm:text-xs leading-relaxed">
                        Participants may bring Arduino, ESP32, sensors, microcontrollers, modules and other components.
                      </p>

                      <div className="pt-1">
                        <span className="text-[10px] font-bold text-[#ffd700] uppercase tracking-wider block mb-1.5">
                          Suitable Simulation Platforms Include:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {['Wokwi', 'Proteus', 'MATLAB / Simulink', 'Tinkercad'].map((platform) => (
                            <span
                              key={platform}
                              className="text-[10px] font-cinzel font-bold bg-[#0a1824] text-[#00e5ff] border border-[#00e5ff]/40 px-2.5 py-1 rounded-md shadow-sm"
                            >
                              ⚡ {platform}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-[10px] text-gray-400 italic pt-1 border-t border-white/10">
                        * Participants are fully responsible for their own hardware.
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tech Chips */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap gap-1.5">
                {['Arduino', 'ESP32', 'Sensors & Microcontrollers', 'Wokwi / Tinkercad', 'Edge Automation'].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-cinzel font-medium bg-[#04080e]/90 text-gray-300 border border-white/10 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          </div>

          {/* Cloud Computing Card (5 cols on desktop) */}
          <div className="lg:col-span-5">
            <SpotlightCard
              borderColor="border-[#b388ff]/50 hover:border-[#b388ff]"
              spotlightColor="rgba(179, 136, 255, 0.22)"
              className="p-6 sm:p-7 flex flex-col justify-between h-full bg-gradient-to-b from-[#180a24] via-[#0c1422] to-[#08121a]"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-[#b388ff] bg-[#050c14] shadow-[0_0_18px_rgba(179,136,255,0.3)]">
                    <Cloud className="w-6 h-6 text-[#b388ff]" />
                  </div>
                  <span className="text-[10px] font-cinzel font-bold text-[#b388ff] tracking-wider px-2.5 py-1 rounded-md border border-[#b388ff]/40 bg-[#b388ff]/10">
                    Cloud Computing
                  </span>
                </div>

                <div className="text-[11px] font-cinzel text-gray-400 uppercase tracking-widest mb-1 font-semibold">
                  DISTRIBUTED OCEANS // SCALABLE CLOUD
                </div>

                <h3 className="font-pirate text-2xl sm:text-3xl text-white mb-3">
                  <DecipherText text="Cloud Computing" />
                </h3>

                <p className="font-cinzel text-xs text-gray-300 leading-relaxed mb-6">
                  Architect resilient distributed backbones, containerized microservices, serverless workflows, multi-cloud topologies, and DevOps pipelines built for infinite Caribbean scale.
                </p>

                <div className="p-3.5 rounded-xl bg-[#060e18] border border-[#b388ff]/30 text-xs font-cinzel text-gray-300 space-y-2 mb-6">
                  <div className="flex items-center space-x-2 text-[#b388ff] font-bold text-[11px]">
                    <Zap className="w-4 h-4" />
                    <span>Focus Areas & Architectures</span>
                  </div>
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    Deploy scalable distributed systems, container orchestration, serverless microservices, and automated CI/CD infrastructure.
                  </p>
                </div>
              </div>

              {/* Tech Chips */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap gap-1.5">
                {['AWS / GCP / Azure', 'Docker & Kubernetes', 'Serverless Functions', 'DevOps & CI/CD'].map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-cinzel font-medium bg-[#04080e]/90 text-gray-300 border border-white/10 px-2 py-0.5 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DomainsSection;
