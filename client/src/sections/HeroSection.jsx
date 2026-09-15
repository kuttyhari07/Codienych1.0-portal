import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ChevronDown, Terminal, Zap, Crosshair } from 'lucide-react';
import { motion } from 'framer-motion';
import { EVENT_CONFIG } from '../utils/config';

const HeroSection = () => {
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 16;
      const y = (e.clientY / innerHeight - 0.5) * 16;
      setMouseOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-16 px-4 text-center z-10 overflow-hidden"
    >
      {/* HUD Telemetry Top Stream */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex items-center space-x-3 font-mono text-[10px] text-[#00ff66]/70 mb-3 select-none"
      >
        <span className="flex items-center space-x-1">
          <Crosshair className="w-3 h-3 text-[#00ff66]" />
          <span>SECTOR_ESEC // LAT:11.27 N</span>
        </span>
        <span>•</span>
        <span className="text-gray-400">CIPHER: 0x7F4A9C82</span>
        <span>•</span>
        <span className="text-[#00ff66] animate-pulse">STATUS: MISSION_ARMED</span>
      </motion.div>

      {/* Central Hero Glow Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="inline-flex items-center space-x-2 bg-[#0f2416] border border-[#10b981]/60 px-3.5 py-1.5 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-mono text-[#00ff66] mb-4 sm:mb-5 shadow-[0_0_20px_rgba(0,255,102,0.3)] animate-pulse max-w-[95%]"
      >
        <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00ff66] flex-shrink-0" />
        <span className="tracking-wider sm:tracking-widest uppercase truncate">{EVENT_CONFIG.MISSION_MOTTO}</span>
      </motion.div>

      {/* Presenter / Institution Header with Subtle Parallax */}
      <motion.div
        style={{
          transform: `translate3d(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px, 0)`,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="mb-5 sm:mb-8 max-w-3xl mx-auto px-3 space-y-2 sm:space-y-3 transition-transform duration-200 ease-out"
      >
        <h3 className="font-orbitron font-extrabold text-sm sm:text-lg md:text-2xl text-white uppercase tracking-wider sm:tracking-[0.2em] leading-relaxed neon-glow-green">
          {EVENT_CONFIG.COLLEGE_NAME}
        </h3>
        <div className="flex flex-col items-center justify-center font-orbitron font-extrabold text-xs sm:text-base md:text-lg text-[#00ff66] tracking-wider sm:tracking-[0.25em] uppercase leading-relaxed">
          <span className="text-[#00ff66] neon-glow-green drop-shadow-[0_0_15px_rgba(0,255,102,0.8)]">
            {EVENT_CONFIG.DEPARTMENT}
          </span>
          <span className="text-gray-300 font-semibold text-[11px] sm:text-xs md:text-sm tracking-[0.35em] mt-1 sm:mt-1.5 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
            PRESENTS
          </span>
        </div>
      </motion.div>

      {/* Main Title */}
      <motion.div
        style={{
          transform: `translate3d(${mouseOffset.x * 0.7}px, ${mouseOffset.y * 0.7}px, 0)`,
        }}
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative transition-transform duration-200 ease-out"
      >
        <h1 className="font-orbitron font-black text-3xl sm:text-5xl md:text-7xl xl:text-8xl tracking-wider text-white mb-3 sm:mb-4 neon-glow-green leading-tight">
          {EVENT_CONFIG.EVENT_NAME}
        </h1>
      </motion.div>

      {/* Event Type */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="font-orbitron font-bold text-lg sm:text-2xl md:text-4xl text-[#00ff66] tracking-widest uppercase mb-4 sm:mb-6 drop-shadow-[0_0_15px_rgba(0,255,102,0.8)]"
      >
        {EVENT_CONFIG.EVENT_TYPE}
      </motion.h2>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="font-mono text-sm sm:text-base md:text-xl text-gray-300 max-w-2xl mx-auto mb-5 sm:mb-7 leading-relaxed px-2"
      >
        “{EVENT_CONFIG.TAGLINE}”
      </motion.p>

      {/* Registration Fee Highlight Pill */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        whileHover={{ scale: 1.03 }}
        className="inline-flex items-center space-x-2 bg-[#0a1f12] border-2 border-[#00ff66]/80 px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-mono text-white mb-7 sm:mb-9 shadow-[0_0_25px_rgba(0,255,102,0.3)] hover:shadow-[0_0_35px_rgba(0,255,102,0.5)] transition-all cursor-default"
      >
        <span className="text-[#00ff66] font-bold tracking-wider uppercase">ENTRY FEE:</span>
        <span className="font-orbitron font-extrabold text-base sm:text-xl text-[#00ff66]">₹{EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER}</span>
        <span className="text-gray-400 font-mono text-xs">/ MEMBER</span>
        <span className="text-gray-500 hidden sm:inline">|</span>
        <span className="text-gray-300 text-xs hidden sm:inline">(4 to 6 Members / Team)</span>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-6 w-full max-w-sm sm:max-w-md mx-auto px-2"
      >
        <Link
          to="/register"
          className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl font-orbitron font-extrabold text-sm sm:text-base text-black bg-[#00ff66] hover:bg-[#10b981] hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(0,255,102,0.5)] hover:shadow-[0_0_35px_rgba(0,255,102,0.8)] transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-2.5"
        >
          <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>REGISTER NOW</span>
        </Link>

        <a
          href="#about"
          className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl font-orbitron font-bold text-sm sm:text-base text-gray-200 bg-[#0f1e14]/80 border border-[#10b981]/50 hover:border-[#00ff66] hover:text-[#00ff66] transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-2.5"
        >
          <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981]" />
          <span>EXPLORE THE EVENT</span>
        </a>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.75 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex flex-col items-center hover:opacity-100 transition-opacity"
      >
        <span className="font-mono text-[10px] text-[#10b981] tracking-widest uppercase mb-1">
          SCROLL TO MISSION
        </span>
        <a href="#about" aria-label="Scroll down">
          <ChevronDown className="w-6 h-6 text-[#00ff66] animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
