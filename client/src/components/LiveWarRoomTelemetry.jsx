import React, { useState, useEffect } from 'react';
import { ShieldCheck, Activity, Cpu, Wifi, Server, Flame, Sparkles, Database, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { playLaserBlip, playChirp } from '../utils/cyberSound';
import SpotlightCard from './SpotlightCard';

const LiveWarRoomTelemetry = () => {
  const [activeTab, setActiveTab] = useState('overview');
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
      <SpotlightCard className="p-6 sm:p-10 border-2 border-[#00ff66]/50 bg-gradient-to-b from-[#081f12] via-[#05140b] to-[#020905] rounded-3xl shadow-[0_0_50px_rgba(0,255,102,0.25)] text-left relative overflow-hidden hud-corner-box">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00ff66]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Live Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1b3524] pb-4 mb-6">
          <div className="flex items-center space-x-2.5">
            <span className="w-3 h-3 rounded-full bg-[#00ff66] animate-ping" />
            <Activity className="w-5 h-5 text-[#00ff66]" />
            <h3 className="font-orbitron font-extrabold text-lg sm:text-2xl text-white tracking-wide">
              LIVE MISSION WAR ROOM TELEMETRY
            </h3>
          </div>

          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="bg-[#050b07] border border-[#00ff66]/40 px-3 py-1 rounded-full text-[#00ff66]">
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
                className="bg-[#040e08] border border-[#1b3524] hover:border-[#00ff66] p-5 rounded-2xl transition-all duration-300 shadow-md group cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-[#082213] border border-[#00ff66] flex items-center justify-center group-hover:shadow-[0_0_15px_#00ff66] transition-all">
                      <Icon className="w-5 h-5 text-[#00ff66]" />
                    </div>
                    <div>
                      <h4 className="font-orbitron font-bold text-sm sm:text-base text-white group-hover:text-[#00ff66] transition-colors">
                        {station.name}
                      </h4>
                      <span className="font-mono text-[10px] text-[#10b981] font-semibold">
                        {station.status}
                      </span>
                    </div>
                  </div>

                  <span className="font-mono text-[10px] bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/30 px-2.5 py-0.5 rounded-full font-bold">
                    {station.load}
                  </span>
                </div>

                <p className="font-mono text-xs text-gray-300 leading-relaxed">
                  {station.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Interactive Telemetry Ticker */}
        <div className="mt-6 pt-4 border-t border-[#1b3524] flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-gray-400">
          <div className="flex items-center space-x-2">
            <Server className="w-4 h-4 text-[#00ff66]" />
            <span>SERVER LATENCY: <span className="text-[#00ff66] font-bold">{networkPing} ms</span></span>
          </div>

          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-[#00ff66]" />
            <span>CLUSTER CORE LOAD: <span className="text-[#00ff66] font-bold">{cpuUsage}%</span></span>
          </div>

          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#00ff66]" />
            <span>SQUAD TELEMETRY PULSES: <span className="text-[#00ff66] font-bold">{pulseCount}</span></span>
          </div>
        </div>
      </SpotlightCard>
    </div>
  );
};

export default LiveWarRoomTelemetry;
