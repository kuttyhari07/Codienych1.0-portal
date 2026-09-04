import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ChevronDown, Terminal, Zap } from 'lucide-react';
import { EVENT_CONFIG } from '../utils/config';

const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center z-10"
    >
      {/* Central Hero Glow Badge */}
      <div className="inline-flex items-center space-x-2 bg-[#0f2416] border border-[#10b981]/60 px-3.5 py-1.5 sm:px-4 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-mono text-[#00ff66] mb-4 sm:mb-5 shadow-[0_0_20px_rgba(0,255,102,0.3)] animate-pulse max-w-[95%]">
        <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#00ff66] flex-shrink-0" />
        <span className="tracking-wider sm:tracking-widest uppercase truncate">{EVENT_CONFIG.MISSION_MOTTO}</span>
      </div>

      {/* Presenter / Institution Header */}
      <div className="mb-4 sm:mb-6 max-w-xl mx-auto px-2 space-y-1.5 sm:space-y-2">
        <p className="font-mono text-[11px] sm:text-sm md:text-base text-gray-300 uppercase tracking-widest leading-relaxed">
          {EVENT_CONFIG.COLLEGE_NAME}
        </p>
        <div className="flex flex-col items-center justify-center font-orbitron font-semibold text-xs sm:text-sm text-[#00ff66] tracking-wider sm:tracking-[0.2em] uppercase leading-relaxed">
          <span className="text-[#00ff66] drop-shadow-[0_0_8px_rgba(0,255,102,0.4)]">
            DEPARTMENT OF INFORMATION TECHNOLOGY
          </span>
          <span className="text-gray-400 font-normal text-[10px] sm:text-xs tracking-[0.25em] mt-0.5 sm:mt-1">
            PRESENTS
          </span>
        </div>
      </div>

      {/* Main Title */}
      <h1 className="font-orbitron font-black text-3xl sm:text-5xl md:text-7xl xl:text-8xl tracking-wider text-white mb-3 sm:mb-4 neon-glow-green leading-tight">
        {EVENT_CONFIG.EVENT_NAME}
      </h1>

      {/* Event Type */}
      <h2 className="font-orbitron font-bold text-lg sm:text-2xl md:text-4xl text-[#00ff66] tracking-widest uppercase mb-4 sm:mb-6 drop-shadow-[0_0_15px_rgba(0,255,102,0.8)]">
        {EVENT_CONFIG.EVENT_TYPE}
      </h2>

      {/* Tagline */}
      <p className="font-mono text-sm sm:text-base md:text-xl text-gray-300 max-w-2xl mx-auto mb-7 sm:mb-10 leading-relaxed px-2">
        “{EVENT_CONFIG.TAGLINE}”
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-6 w-full max-w-sm sm:max-w-md mx-auto px-2">
        <Link
          to="/register"
          className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl font-orbitron font-extrabold text-sm sm:text-base text-black bg-[#00ff66] hover:bg-[#10b981] hover:text-white transition-all shadow-[0_0_20px_rgba(0,255,102,0.5)] hover:shadow-[0_0_35px_rgba(0,255,102,0.8)] transform hover:-translate-y-0.5 flex items-center justify-center space-x-2.5"
        >
          <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>REGISTER NOW</span>
        </Link>

        <a
          href="#about"
          className="w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-xl font-orbitron font-bold text-sm sm:text-base text-gray-200 bg-[#0f1e14]/80 border border-[#10b981]/50 hover:border-[#00ff66] hover:text-[#00ff66] transition-all transform hover:-translate-y-0.5 flex items-center justify-center space-x-2.5"
        >
          <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-[#10b981]" />
          <span>EXPLORE THE EVENT</span>
        </a>
      </div>

      {/* Scroll Down Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center opacity-70 hover:opacity-100 transition-opacity">
        <span className="font-mono text-[10px] text-[#10b981] tracking-widest uppercase mb-1">
          SCROLL TO MISSION
        </span>
        <a href="#about" aria-label="Scroll down">
          <ChevronDown className="w-6 h-6 text-[#00ff66] animate-bounce" />
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
