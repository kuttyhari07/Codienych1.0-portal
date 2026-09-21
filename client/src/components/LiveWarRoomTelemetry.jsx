import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, Cpu, Wifi, Server, Flame, Sparkles, Database, Users, Award, Compass, Anchor } from 'lucide-react';
import { motion } from 'framer-motion';
import { playLaserBlip } from '../utils/cyberSound';
import SpotlightCard from './SpotlightCard';

const LiveWarRoomTelemetry = () => {
  const [pulseCount, setPulseCount] = useState(148);
  const [cpuUsage, setCpuUsage] = useState(42);
  const [networkPing, setNetworkPing] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuUsage(Math.floor(35 + Math.random() * 25));
      setNetworkPing(Math.floor(10 + Math.random() * 8));
      if (Math.random() > 0.7) {
        setPulseCount((prev) => prev + 1);
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const stations = [
    {
      id: 'ai-core',
      name: 'NEURAL AI CLUSTER',
      icon: Cpu,
      status: 'OPTIMAL (99.8%)',
      desc: 'High-throughput GPUs ready for machine learning model training & API inferences.',
      load: `${cpuUsage}% ACTIVE`,
    },
    {
      id: 'network',
      name: 'GIGABIT FIBER MESH',
      icon: Wifi,
      status: '10 Gbps LOW-LATENCY',
      desc: 'Dedicated campus-wide high-speed fiber backbone with zero packet throttling.',
      load: `${networkPing}ms PING`,
    },
    {
      id: 'chill-lounge',
      name: 'CHILL & REFUELLING HUB',
      icon: Flame,
      status: 'NON-STOP ACTIVE',
      desc: 'Midnight hot coffee, board games (Chess, Carrom) & refreshment bars.',
      load: '24 HRS OPEN',
    },
    {
      id: 'eval-engine',
      name: 'JURY EVALUATION MATRIX',
      icon: Award,
      status: 'SYNCHRONIZED',
      desc: 'Real-time multi-dimensional scoring protocol covering UI/UX, Code & Innovation.',
      load: 'LOCKED TILL SUBMISSION',
    },
  ];

  return (
    <div className="mt-14 max-w-5xl mx-auto">
      <SpotlightCard className="p-4 sm:p-8 md:p-10 border-2 border-[#ffd700]/70 bg-gradient-to-b from-[#081522] via-[#050f18] to-[#02060b] rounded-2xl sm:rounded-3xl shadow-[0_0_50px_rgba(255,215,0,0.25)] text-left relative overflow-hidden pirate-corner-box">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ffd700]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Live Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3a2e1d] pb-4 mb-6">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffd700] animate-ping flex-shrink-0" />
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-[#ffd700] flex-shrink-0" />
            <h3 className="font-pirate font-extrabold text-xl sm:text-2xl md:text-3xl text-[#ffd700] tracking-wider pirate-gold-glow">
              LIVE WAR ROOM TELEMETRY
            </h3>
          </div>

          <div className="flex items-center space-x-2 font-cinzel text-xs">
            <span className="bg-[#0c1e2d] border border-[#ffd700]/50 px-3 py-1 rounded-full text-[#ffd700] shadow-sm whitespace-nowrap text-[10px] sm:text-xs">
              ⚡ SQUAD UPLINK: CONNECTED
            </span>
          </div>
        </div>

        {/* 4 Interactive Mission Stations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {stations.map((station) => {
            const Icon = station.icon;
            return (
              <motion.div
                key={station.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => playLaserBlip()}
                className="bg-[#04090f]/90 border border-[#3a2e1d] hover:border-[#ffd700] p-4 sm:p-5 rounded-2xl transition-all duration-300 shadow-md group cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5 sm:gap-3 mb-3">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-[#0c1e2d] border border-[#ffd700]/60 flex items-center justify-center flex-shrink-0 group-hover:border-[#ffd700] group-hover:shadow-[0_0_15px_#ffd700] transition-all">
                      <Icon className="w-5 h-5 text-[#ffd700]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-cinzel font-bold text-sm sm:text-base text-white group-hover:text-[#ffd700] transition-colors leading-tight">
                        {station.name}
                      </h4>
                      <span className="font-cinzel text-[10px] text-[#e5c158] font-semibold block mt-0.5">
                        {station.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center sm:self-start">
                    <span className="inline-flex items-center font-cinzel text-[10px] sm:text-xs bg-[#ffd700]/15 text-[#ffd700] border border-[#ffd700]/40 px-3 py-1 rounded-full font-bold whitespace-nowrap tracking-wider shadow-sm">
                      {station.load}
                    </span>
                  </div>
                </div>

                <p className="font-mono text-xs text-gray-300 leading-relaxed">
                  {station.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Interactive Telemetry Ticker */}
        <div className="mt-6 pt-4 border-t border-[#3a2e1d] flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] sm:text-[11px] text-gray-400">
          <div className="flex items-center space-x-2">
            <Server className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffd700] flex-shrink-0" />
            <span>SERVER LATENCY: <span className="text-[#ffd700] font-bold">{networkPing} ms</span></span>
          </div>

          <div className="flex items-center space-x-2">
            <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00e5ff] flex-shrink-0" />
            <span>CLUSTER CORE LOAD: <span className="text-[#00e5ff] font-bold">{cpuUsage}%</span></span>
          </div>

          <div className="flex items-center space-x-2">
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffd700] flex-shrink-0" />
            <span>SQUAD TELEMETRY PULSES: <span className="text-[#ffd700] font-bold">{pulseCount}</span></span>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
};

export default LiveWarRoomTelemetry;
