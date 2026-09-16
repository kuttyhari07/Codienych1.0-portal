import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import CinematicBackground from '../components/CinematicBackground';
import InteractiveCursor from '../components/InteractiveCursor';
import RealisticCompass3D from '../components/RealisticCompass3D';
import { EVENT_CONFIG } from '../utils/config';
import { Compass, Sparkles, Swords, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playLaserBlip } from '../utils/cyberSound';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#020508] text-[#f4e6c3] overflow-x-hidden selection:bg-[#ffd700] selection:text-black flex flex-col justify-between">
      {/* Loading Screen Overlay */}
      <AnimatePresence>
        {isLoading && <LoadingScreen onFinish={() => setIsLoading(false)} />}
      </AnimatePresence>

      {/* Interactive Ambient Cursor */}
      <InteractiveCursor />

      {/* Sticky Cinematic Scroll Background */}
      <CinematicBackground />

      {/* Main Landing Gateway (No Navbar as requested) */}
      <motion.main
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center justify-center pt-8 sm:pt-12 pb-8 px-4 text-center max-w-6xl mx-auto w-full"
      >
        {/* Top Telemetry Tag */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center space-x-2 sm:space-x-3 font-mono text-[10px] sm:text-xs text-[#e5c158]/80 mb-3 select-none"
        >
          <span className="flex items-center space-x-1 text-[#00e5ff]">
            <Compass className="w-3.5 h-3.5 text-[#00e5ff] animate-spin" style={{ animationDuration: '16s' }} />
            <span>PORT: ESEC // LAT: 11.27° N, 77.58° E</span>
          </span>
          <span>•</span>
          <span className="text-[#ffd700] font-bold animate-pulse">EXPEDITION 2026 ⚔️</span>
        </motion.div>

        {/* Institution / College Name & Department Presents */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-3 max-w-3xl mx-auto space-y-1.5"
        >
          <h2 className="font-cinzel font-black text-base sm:text-xl md:text-3xl text-white uppercase tracking-wider sm:tracking-[0.18em] leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
            {EVENT_CONFIG.COLLEGE_NAME}
          </h2>
          <div className="flex flex-col items-center justify-center font-cinzel font-bold text-xs sm:text-base md:text-lg text-[#ffd700] tracking-wider sm:tracking-[0.22em] uppercase leading-relaxed">
            <span className="text-[#ffd700] pirate-gold-glow">
              {EVENT_CONFIG.DEPARTMENT}
            </span>
            <span className="text-gray-300 font-serif text-[10px] sm:text-xs md:text-sm tracking-[0.35em] mt-0.5">
              PROUDLY PRESENTS
            </span>
          </div>
        </motion.div>

        {/* Event Name Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="relative my-1 sm:my-2"
        >
          <h1 className="font-pirate text-6xl sm:text-8xl md:text-9xl tracking-wider text-[#ffd700] leading-none pirate-gold-title">
            {EVENT_CONFIG.EVENT_NAME}
          </h1>
        </motion.div>

        {/* Subtitle / Event Type */}
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="font-caribbean font-black text-lg sm:text-2xl md:text-3xl text-[#00e5ff] tracking-widest uppercase mb-1 drop-shadow-[0_0_20px_rgba(0,229,255,0.7)]"
        >
          {EVENT_CONFIG.EVENT_TYPE}
        </motion.h3>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="font-medieval text-xs sm:text-base text-[#f4e6c3] max-w-xl mx-auto mb-2 italic opacity-90"
        >
          “{EVENT_CONFIG.TAGLINE}”
        </motion.p>

        {/* Registration Fee & Team Enlistment Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="my-3 inline-flex items-center space-x-2.5 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#1c1208]/95 via-[#2b1709]/95 to-[#1c1208]/95 border-2 border-[#ffd700] shadow-[0_0_25px_rgba(255,215,0,0.35)] backdrop-blur-md select-none"
        >
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-[#ffd700] via-[#f39c12] to-[#b8860b] flex items-center justify-center text-black font-black text-xs sm:text-sm shadow-md flex-shrink-0">
            ₹
          </div>
          <div className="text-left">
            <div className="font-cinzel text-[9px] sm:text-[10px] text-[#ffd700] tracking-widest uppercase font-bold leading-none">
              VOYAGE ENLISTMENT FEE
            </div>
            <div className="font-cinzel text-xs sm:text-sm text-white font-extrabold tracking-wider mt-0.5">
              <span className="text-[#ffd700] font-black text-sm sm:text-base">₹{EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER}</span>{' '}
              <span className="text-gray-300 font-medium text-[11px] sm:text-xs">/ Member</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center border-l border-[#ffd700]/30 pl-3 font-cinzel text-[11px] text-[#cfb07a] font-semibold">
            (4 to 6 Pirates per Crew)
          </div>
        </motion.div>

        {/* Realistic 3D Interactive Rotating Pirate Compass (Inspired by Captain Jack Sparrow Reference) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.65 }}
          className="my-3 sm:my-4 flex flex-col items-center justify-center w-full"
        >
          <RealisticCompass3D />
        </motion.div>

        {/* Primary Voyage Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-xl px-4"
        >
          <button
            type="button"
            onClick={() => {
              playLaserBlip();
              navigate('/portal');
            }}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl font-cinzel font-black text-sm sm:text-base text-black bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#b8860b] hover:from-[#ffe66d] hover:to-[#ffd700] transition-all duration-300 shadow-[0_0_30px_rgba(255,215,0,0.6)] hover:shadow-[0_0_50px_rgba(255,215,0,0.85)] transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-2.5 cursor-pointer uppercase tracking-wider"
          >
            <Compass className="w-5 h-5 text-black" />
            <span>EXPLORE EVENT PORTAL</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>

          <button
            type="button"
            onClick={() => {
              playLaserBlip();
              navigate('/register');
            }}
            className="w-full sm:w-auto px-7 py-4 rounded-2xl font-cinzel font-bold text-xs sm:text-sm text-[#ffd700] bg-[#120a04]/90 hover:bg-[#ffd700] hover:text-black border-2 border-[#ffd700]/70 hover:border-[#ffd700] transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transform hover:-translate-y-1 active:scale-95 flex items-center justify-center space-x-2 cursor-pointer uppercase tracking-wider backdrop-blur-sm"
          >
            <Swords className="w-4 h-4" />
            <span>JOIN THE CREW (REGISTER)</span>
          </button>
        </motion.div>
      </motion.main>

      {/* Minimal Footer Signature on Landing */}
      <footer className="relative z-10 py-4 text-center font-cinzel text-[11px] text-gray-400 border-t border-[#3a2e1d]/40">
        <span>© 2026 {EVENT_CONFIG.DEPARTMENT} • {EVENT_CONFIG.COLLEGE_NAME}</span>
      </footer>
    </div>
  );
};

export default HomePage;
