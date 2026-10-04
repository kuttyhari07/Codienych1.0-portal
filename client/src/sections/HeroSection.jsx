import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Compass, Skull, Anchor, Sparkles, Swords, Trophy, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { EVENT_CONFIG } from '../utils/config';
import useRegistrationStatus from '../utils/useRegistrationStatus';
import Cyber3dReactorCanvas from '../components/Cyber3dReactorCanvas';

const HeroSection = () => {
  const { isClosed } = useRegistrationStatus();
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
      {/* Nautical Telemetry Coordinates Stream */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="flex items-center space-x-3 font-mono text-[10px] sm:text-xs text-[#e5c158]/80 mb-3 select-none"
      >
        <span className="flex items-center space-x-1 text-[#00e5ff]">
          <Compass className="w-3.5 h-3.5 text-[#00e5ff] animate-spin" style={{ animationDuration: '16s' }} />
          <span>PORT: ESEC // LAT: 11.27° N, 77.58° E</span>
        </span>
        <span>•</span>
        <span className="text-gray-400">EXPEDITION: 24-HOUR HIGH SEAS</span>
        <span>•</span>
        <span className="text-[#e5c158] font-bold animate-pulse">SAILS HOISTED ⚔️</span>
      </motion.div>

      {/* Central Motto Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="inline-flex items-center space-x-2 bg-[#161208]/90 border border-[#e5c158]/70 px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-cinzel text-[#ffd700] mb-4 sm:mb-5 shadow-[0_0_20px_rgba(229,193,88,0.35)] animate-pulse max-w-[95%]"
      >
        <Sparkles className="w-3.5 h-3.5 text-[#ffd700] flex-shrink-0" />
        <span className="tracking-widest uppercase font-bold truncate">{EVENT_CONFIG.MISSION_MOTTO}</span>
      </motion.div>

      {/* Presenter / Institution Header with Parallax */}
      <motion.div
        style={{
          transform: `translate3d(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px, 0)`,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="mb-4 sm:mb-6 max-w-3xl mx-auto px-3 space-y-1.5 sm:space-y-2 transition-transform duration-200 ease-out"
      >
        <h3 className="font-cinzel font-black text-sm sm:text-lg md:text-2xl text-white uppercase tracking-wider sm:tracking-[0.18em] leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          {EVENT_CONFIG.COLLEGE_NAME}
        </h3>
        <div className="flex flex-col items-center justify-center font-cinzel font-bold text-xs sm:text-base md:text-lg text-[#e5c158] tracking-wider sm:tracking-[0.22em] uppercase leading-relaxed">
          <span className="text-[#e5c158] pirate-gold-glow">
            {EVENT_CONFIG.DEPARTMENT}
          </span>
          <span className="text-gray-300 font-serif text-[10px] sm:text-xs md:text-sm tracking-[0.35em] mt-0.5 drop-shadow-[0_0_8px_rgba(229,193,88,0.4)]">
            PROUDLY PRESENTS
          </span>
        </div>
      </motion.div>

      {/* Main Event Title in Authentic Pirates of the Caribbean Gothic Typography */}
      <motion.div
        style={{
          transform: `translate3d(${mouseOffset.x * 0.7}px, ${mouseOffset.y * 0.7}px, 0)`,
        }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative transition-transform duration-200 ease-out my-1"
      >
        <h1 className="font-pirate text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-wider text-[#ffd700] mb-2 leading-none pirate-gold-title">
          {EVENT_CONFIG.EVENT_NAME}
        </h1>
      </motion.div>

      {/* Event Type & Pirates Tag */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.55 }}
        className="font-caribbean font-black text-lg sm:text-2xl md:text-4xl text-[#00e5ff] tracking-widest uppercase mb-3 sm:mb-4 drop-shadow-[0_0_20px_rgba(0,229,255,0.7)]"
      >
        {EVENT_CONFIG.EVENT_TYPE}
      </motion.h2>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="font-medieval text-sm sm:text-base md:text-xl text-[#f4e6c3] max-w-2xl mx-auto mb-2 leading-relaxed px-2 italic drop-shadow-md"
      >
        “{EVENT_CONFIG.TAGLINE}”
      </motion.p>

      {/* 3D Interactive Jack Sparrow Cursed Aztec Compass */}
      <motion.div
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.65 }}
        className="my-2"
      >
        <Cyber3dReactorCanvas />
      </motion.div>

      {/* Cash Prize & Crew Bounty Fee Highlight Pills */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        className="flex flex-wrap items-center justify-center gap-3.5 mb-7 sm:mb-9 max-w-4xl mx-auto"
      >
        {/* Prize Pool Pill */}
        <a
          href="#prizes"
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#201507] via-[#2f1f09] to-[#201507] border-2 border-[#ffd700] px-4 py-2 sm:px-6 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-cinzel text-white shadow-[0_0_25px_rgba(255,215,0,0.45)] hover:shadow-[0_0_40px_rgba(255,215,0,0.7)] transition-all cursor-pointer transform hover:scale-105"
        >
          <Trophy className="w-4 h-4 text-[#ffd700] animate-bounce" />
          <span className="text-[#ffd700] font-bold tracking-wider uppercase">CASH PRIZE:</span>
          <span className="font-pirate text-lg sm:text-2xl text-[#ffd700]">UPTO 50K+</span>
          <span className="text-[#00e5ff] font-bold hidden sm:inline">& FREE INTERNSHIP</span>
        </a>

        {/* Registration Fee Highlight Pill */}
        <div
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#1c150c] via-[#2a1e12] to-[#1c150c] border-2 border-[#e5c158] px-4 py-2 sm:px-6 sm:py-2.5 rounded-2xl text-xs sm:text-sm font-cinzel text-white shadow-[0_0_20px_rgba(229,193,88,0.3)] hover:shadow-[0_0_35px_rgba(229,193,88,0.5)] transition-all cursor-default"
        >
          <CoinsIcon />
          <span className="text-[#ffd700] font-bold tracking-wider uppercase">CREW FEE:</span>
          <span className="font-pirate text-lg sm:text-2xl text-[#ffd700]">₹{EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER}</span>
          <span className="text-gray-300 font-mono text-xs">/ MEMBER</span>
        </div>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-6 w-full max-w-sm sm:max-w-lg mx-auto px-2"
      >
        {isClosed ? (
          <Link
            to="/register"
            className="w-full sm:w-auto px-7 py-3.5 sm:px-9 sm:py-4 rounded-xl font-pirate text-xl sm:text-2xl text-red-300 bg-gradient-to-r from-[#2f0c0c] via-[#481212] to-[#240808] hover:from-[#3a1212] hover:to-[#2f0c0c] border border-red-500/60 shadow-[0_0_25px_rgba(239,68,68,0.4)] flex items-center justify-center space-x-2.5 font-bold transition-all"
          >
            <Lock className="w-5 h-5 text-red-400" />
            <span>REGISTRATION CLOSED</span>
          </Link>
        ) : (
          <Link
            to="/register"
            className="w-full sm:w-auto px-7 py-3.5 sm:px-9 sm:py-4 rounded-xl font-pirate text-xl sm:text-2xl text-black bg-gradient-to-r from-[#ffd700] via-[#e5c158] to-[#b8860b] hover:from-[#fff2a3] hover:to-[#ffd700] transition-all duration-300 shadow-[0_0_25px_rgba(229,193,88,0.6)] hover:shadow-[0_0_40px_rgba(255,215,0,0.9)] transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-2.5 font-bold"
          >
            <Swords className="w-5 h-5 text-black" />
            <span>JOIN THE CREW (REGISTER)</span>
          </Link>
        )}

        <a
          href="#about"
          className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl font-cinzel font-bold text-xs sm:text-sm text-[#f4e6c3] bg-[#091522]/85 border border-[#e5c158]/60 hover:border-[#ffd700] hover:text-[#ffd700] transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-2.5 shadow-lg"
        >
          <Anchor className="w-4 h-4 text-[#00e5ff]" />
          <span>EXPLORE THE HIGH SEAS</span>
        </a>
      </motion.div>

      {/* Scroll Down Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center hover:opacity-100 transition-opacity select-none"
      >
        <span className="font-cinzel text-[10px] text-[#e5c158] tracking-widest uppercase mb-1">
          SCROLL TO EXPEDITION
        </span>
        <a href="#about" aria-label="Scroll down">
          <ChevronDown className="w-6 h-6 text-[#ffd700] animate-bounce" />
        </a>
      </motion.div>
    </section>
  );
};

const CoinsIcon = () => (
  <span className="text-base animate-pulse">🪙</span>
);

export default HeroSection;
