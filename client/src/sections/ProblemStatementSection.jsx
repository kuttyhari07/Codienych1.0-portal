import React, { useState } from 'react';
import { Lock, EyeOff, ShieldAlert, Cpu, Globe, Server, Terminal, Radio, Sparkles } from 'lucide-react';

const domains = [
  {
    id: 'ai',
    tag: '01 // AI & INTELLIGENT SYSTEMS',
    name: 'AI, LLMs & Machine Learning',
    icon: Cpu,
    telemetry: 'AUTONOMOUS_NETWORKS // NEURAL_PIPELINES',
    description:
      'Autonomous intelligent agents, predictive analytics, vision pipelines, and self-orchestrating software systems that solve complex real-world challenges.',
    metrics: { complexity: 'HIGH', latency: '0.4ms', cipher: '0x88FE10AA' },
  },
  {
    id: 'web',
    tag: '02 // DECENTRALIZED & WEB TECH',
    name: 'Next-Gen Web & Cloud Systems',
    icon: Globe,
    telemetry: 'DISTRIBUTED_NODES // RESILIENT_STACKS',
    description:
      'Ultra-scalable modern web architectures, decentralized protocols, resilient APIs, and low-latency microservices built for mission-critical operations.',
    metrics: { complexity: 'HIGH', latency: '0.1ms', cipher: '0x48FA0012' },
  },
  {
    id: 'cyber',
    tag: '03 // CYBER DEFENSE & SECURE OPS',
    name: 'Cybersecurity & Zero Trust',
    icon: Server,
    telemetry: 'CRYPTOGRAPHIC_LAYER // ZERO_TRUST',
    description:
      'Hardened security frameworks, vulnerability detection, identity management, threat intelligence, and zero-trust protocol implementation.',
    metrics: { complexity: 'CRITICAL', latency: '0.2ms', cipher: '0xCC4019AE' },
  },
  {
    id: 'iot',
    tag: '04 // SMART AUTOMATION & IOT',
    name: 'Smart Hardware & Automation',
    icon: Terminal,
    telemetry: 'EDGE_SENSORS // EMBEDDED_TELEMETRY',
    description:
      'Edge computing, industrial automation, connected sensor networks, smart cities, and realtime telemetry streaming hardware solutions.',
    metrics: { complexity: 'HIGH', latency: '0.8ms', cipher: '0x99AA48BC' },
  },
  {
    id: 'open',
    tag: '05 // OPEN INNOVATION',
    name: 'Open Breakthrough Innovation',
    icon: Radio,
    telemetry: 'MULTIDISCIPLINARY // DISRUPTIVE_TECH',
    description:
      'Cross-domain breakthrough solutions addressing Healthcare, FinTech, AgriTech, Clean Energy, and high-impact societal problems.',
    metrics: { complexity: 'UNRESTRICTED', latency: 'STREAMING', cipher: '0x7F4A9C82' },
  },
];

const ProblemStatementSection = () => {
  const [activeDomain, setActiveDomain] = useState(domains[0]);

  return (
    <section id="problem-statement" className="relative py-24 px-4 z-10">
      <div className="max-w-6xl mx-auto">
        {/* Section Title Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 font-mono text-xs text-[#00ff66] tracking-widest uppercase mb-3 bg-[#00ff66]/10 px-3.5 py-1 rounded-full border border-[#00ff66]/30">
            <EyeOff className="w-3.5 h-3.5 text-[#00ff66]" />
            <span>// CLASSIFIED PROTOCOL & SECTORS</span>
          </div>
          <h2 className="font-orbitron font-extrabold text-3xl sm:text-5xl text-white tracking-wide mb-4">
            DOMAINS & <span className="text-[#00ff66]">PROBLEM STATEMENT</span>
          </h2>
          <p className="font-mono text-xs sm:text-sm text-[#10b981] uppercase tracking-widest">
            EXPLORE HACKATHON SECTORS • SPOT REVEAL AT GRAND OPENING
          </p>
        </div>

        {/* Central Classified Spot Announcement Card */}
        <div className="bg-gradient-to-b from-[#0a180f] to-[#040e08] border-2 border-[#00ff66] rounded-2xl p-6 sm:p-10 mb-10 shadow-[0_0_35px_rgba(0,255,102,0.25)] relative overflow-hidden hud-corner-box">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-5">
              <div className="w-16 h-16 rounded-2xl bg-[#0f2416] border-2 border-[#00ff66] flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(0,255,102,0.4)]">
                <Lock className="w-8 h-8 text-[#00ff66] animate-pulse" />
              </div>
              <div>
                <span className="font-mono text-xs text-[#10b981] uppercase tracking-widest font-bold block mb-1">
                  OFFICIAL HACKATHON DIRECTIVE
                </span>
                <h3 className="font-orbitron font-black text-xl sm:text-3xl text-white">
                  “THE PROBLEM STATEMENT WILL BE REVEALED ON THE SPOT DURING THE HACKATHON.”
                </h3>
              </div>
            </div>

            <div className="bg-[#050b07] border border-[#00ff66]/40 p-4 rounded-xl flex-shrink-0 text-center font-mono text-xs text-gray-300">
              <span className="text-[#00ff66] font-bold block mb-1">EQUAL OPPORTUNITY</span>
              <span>Identical release time for all squads at Opening Ceremony</span>
            </div>
          </div>
        </div>

        {/* Interactive Domains / Sector Telemetry Explorer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column: Domain Selector List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between font-mono text-xs text-gray-400 px-2 mb-1">
              <span>SELECT SECTOR</span>
              <span className="text-[#00ff66]">[ 5 DOMAINS ]</span>
            </div>

            {domains.map((dom) => {
              const Icon = dom.icon;
              const isSelected = activeDomain.id === dom.id;
              return (
                <button
                  key={dom.id}
                  onClick={() => setActiveDomain(dom)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#0f2e1a] border-[#00ff66] shadow-[0_0_20px_rgba(0,255,102,0.3)] translate-x-1'
                      : 'bg-[#0a140e]/90 border-gray-800 hover:border-[#10b981]/60 hover:bg-[#0f2216]'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#00ff66] text-black shadow-[0_0_10px_#00ff66]'
                          : 'bg-[#050b07] text-[#00ff66] border border-gray-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-[#10b981] block tracking-wider">
                        {dom.tag}
                      </span>
                      <span className="font-orbitron font-bold text-sm text-white block">
                        {dom.name}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`font-mono text-xs ${
                      isSelected ? 'text-[#00ff66] font-bold' : 'text-gray-600'
                    }`}
                  >
                    →
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Domain Telemetry Screen */}
          <div className="lg:col-span-7 bg-[#0a140e]/95 border-2 border-[#1b3524] hover:border-[#00ff66]/60 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden flex flex-col justify-between hud-corner-box">
            {/* Top Radar & Sector Stats Header */}
            <div>
              <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[#00ff66] animate-ping" />
                  <span className="font-mono text-xs text-[#00ff66] font-bold uppercase tracking-wider">
                    {activeDomain.telemetry}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-gray-400">
                  CIPHER: {activeDomain.metrics.cipher}
                </span>
              </div>

              <div className="flex items-center space-x-3 mb-4">
                <activeDomain.icon className="w-8 h-8 text-[#00ff66]" />
                <h3 className="font-orbitron font-extrabold text-2xl text-white">
                  {activeDomain.name}
                </h3>
              </div>

              <p className="font-mono text-sm text-gray-300 leading-relaxed mb-6">
                {activeDomain.description}
              </p>
            </div>

            {/* Bottom Radar Matrix & Telemetry Grid */}
            <div className="pt-4 border-t border-gray-800/80">
              <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                <div className="bg-[#050b07] border border-gray-800 p-3 rounded-lg">
                  <span className="text-gray-500 text-[10px] block uppercase">SECTOR LEVEL</span>
                  <span className="text-[#00ff66] font-bold">{activeDomain.metrics.complexity}</span>
                </div>
                <div className="bg-[#050b07] border border-gray-800 p-3 rounded-lg">
                  <span className="text-gray-500 text-[10px] block uppercase">BENCHMARK</span>
                  <span className="text-white font-bold">{activeDomain.metrics.latency}</span>
                </div>
                <div className="bg-[#050b07] border border-gray-800 p-3 rounded-lg">
                  <span className="text-gray-500 text-[10px] block uppercase">STATUS</span>
                  <span className="text-[#10b981] font-bold">READY // 24H</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemStatementSection;
