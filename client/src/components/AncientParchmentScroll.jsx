import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scroll, ChevronDown, ChevronUp, Skull } from 'lucide-react';
import DecipherText from './DecipherText';
import { playLaserBlip } from '../utils/cyberSound';

/**
 * 3D Ancient Parchment Scroll Component
 * Recreates an authentic pirate scroll on 3D wooden rollers with carved gold finials,
 * crimson wax seal, realistic unrolling physics, and direct parchment text.
 */
const AncientParchmentScroll = ({
  id,
  subtitle = '// PIRATE CODE',
  title = 'CREW ARTICLES',
  goldTitle = 'FORMATION',
  description = 'Ancient bylaws and maritime rules binding all pirate crews.',
  badge = '9 ARTICLES',
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => {
    playLaserBlip();
    setIsOpen(prev => !prev);
  };

  return (
    <div id={id} className="relative py-12 sm:py-20 px-3 sm:px-6 z-10 max-w-5xl mx-auto select-none">
      {/* Scroll Cylinder / Header Trigger */}
      <div className="relative flex flex-col items-center">
        {/* Section Category Eyebrow */}
        <div className="inline-block font-cinzel font-bold text-xs text-[#ffd700] tracking-widest uppercase mb-3 text-center">
          {subtitle}
        </div>

        {/* 3D Top Wooden Roller Bar with Carved Golden Finials */}
        <div
          role="button"
          tabIndex={0}
          aria-expanded={isOpen}
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle();
            }
          }}
          className="group w-full max-w-3xl cursor-pointer focus:outline-none transition-transform hover:scale-[1.01]"
        >
          {/* Top Roller Assembly */}
          <div className="relative flex items-center justify-between px-1">
            {/* Left 3D Golden Finial Knob */}
            <div className="relative z-20 flex items-center -mr-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#ffe57f] via-[#cda335] to-[#422d08] border-2 border-[#ffd700]/70 shadow-[0_6px_15px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.6)] flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-gradient-to-tl from-[#5c4013] to-[#ffe57f] shadow-inner" />
              </div>
              <div className="w-2.5 h-6 sm:h-7 bg-gradient-to-r from-[#ffd700] via-[#8c6518] to-[#422d08] rounded-sm -ml-1 shadow-md border-y border-[#ffd700]/40" />
            </div>

            {/* Main 3D Cylindrical Wooden Dowel */}
            <div className="relative flex-1 h-8 sm:h-9 rounded-full overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.9)] border-t border-b border-[#ffd700]/40 bg-gradient-to-b from-[#6e4318] via-[#a86c35] via-[#dfa561] to-[#2e1706] flex items-center justify-center">
              {/* Wood Grain Highlights */}
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.15)_30%,transparent_60%,rgba(255,255,255,0.15)_80%,transparent_100%)] pointer-events-none" />
              {/* Metallic Gold Trim Bands */}
              <div className="absolute left-6 top-0 bottom-0 w-2 bg-gradient-to-b from-[#ffd700] via-[#946c18] to-[#ffd700] opacity-80" />
              <div className="absolute right-6 top-0 bottom-0 w-2 bg-gradient-to-b from-[#ffd700] via-[#946c18] to-[#ffd700] opacity-80" />

              {/* Title inside the wooden bar */}
              <div className="relative z-10 flex items-center space-x-2 px-4">
                <Scroll className="w-4 h-4 text-[#ffd700] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
                <span className="font-pirate text-sm sm:text-base tracking-widest text-[#fff4cc] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] uppercase">
                  {title}
                </span>
                <span className="text-[10px] font-cinzel font-bold text-[#ffd700] bg-[#1a0f05]/80 px-2 py-0.5 rounded-full border border-[#ffd700]/50 ml-1">
                  {badge}
                </span>
              </div>
            </div>

            {/* Right 3D Golden Finial Knob */}
            <div className="relative z-20 flex items-center -ml-2">
              <div className="w-2.5 h-6 sm:h-7 bg-gradient-to-l from-[#ffd700] via-[#8c6518] to-[#422d08] rounded-sm -mr-1 shadow-md border-y border-[#ffd700]/40" />
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#ffe57f] via-[#cda335] to-[#422d08] border-2 border-[#ffd700]/70 shadow-[0_6px_15px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.6)] flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-gradient-to-tl from-[#5c4013] to-[#ffe57f] shadow-inner" />
              </div>
            </div>
          </div>

          {/* Banner Card with Title & Status (Visible in both states) */}
          <div className="mt-3 text-center">
            <h2 className="font-pirate text-3xl sm:text-5xl md:text-6xl text-white tracking-wide">
              {title} <span className="text-[#ffd700] pirate-gold-title"><DecipherText text={goldTitle} /></span>
            </h2>
            <p className="font-cinzel text-xs sm:text-sm text-gray-300 mt-1 max-w-xl mx-auto">
              {description}
            </p>

            {/* Interactive 3D Wax Seal Action Button */}
            <div className="mt-4 flex justify-center">
              <button
                type="button"
                className="relative inline-flex items-center space-x-3 px-6 py-2.5 rounded-full bg-gradient-to-r from-[#201509] via-[#35210e] to-[#201509] border-2 border-[#ffd700] hover:border-[#ffe885] shadow-[0_0_20px_rgba(255,215,0,0.35),0_6px_15px_rgba(0,0,0,0.7)] group-hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] transition-all duration-300"
              >
                {/* 3D Wax Seal Icon */}
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#b31b1b] via-[#820d0d] to-[#450505] border border-[#ff6b6b] shadow-[0_2px_6px_rgba(0,0,0,0.6),inset_0_1px_3px_rgba(255,255,255,0.4)] flex items-center justify-center flex-shrink-0">
                  <Skull className="w-4 h-4 text-[#ffd700]" />
                </div>

                <span className="font-cinzel font-bold text-xs sm:text-sm text-[#ffd700] tracking-wider uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                  {isOpen ? '📜 Click to Roll Up Scroll' : `📜 Click to Unroll Scroll (${badge})`}
                </span>

                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#ffd700] transition-transform group-hover:-translate-y-0.5" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#ffd700] transition-transform group-hover:translate-y-0.5 animate-bounce" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Unrolling Parchment Area */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, scaleY: 0.92 }}
            animate={{ opacity: 1, height: 'auto', scaleY: 1 }}
            exit={{ opacity: 0, height: 0, scaleY: 0.92 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'top center' }}
            className="overflow-hidden mt-6 relative"
          >
            {/* Parchment Paper Roll Container */}
            <div className="relative max-w-4xl mx-auto">
              {/* Top Curl Shadow where paper emerges from wooden dowel */}
              <div className="h-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none rounded-t-lg relative z-20" />

              {/* The Authentic Ancient Scroll Parchment Surface */}
              <div
                className="relative shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden rounded-lg"
                style={{
                  backgroundImage: "url('/pirate-ancient-scroll.png')",
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              >
                {/* Vintage Warm Paper Overlay for contrast & legibility */}
                <div className="relative z-10 px-6 sm:px-14 md:px-20 py-10 sm:py-14 text-[#2c1708]">
                  {/* Subtle Top Filigree Badge inside parchment */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#3d2412]/10 border border-[#6b421a]/30">
                      <Scroll className="w-3.5 h-3.5 text-[#6b421a]" />
                      <span className="font-cinzel text-[11px] font-bold text-[#452811] uppercase tracking-widest">
                        AUTHENTIC ROYAL PIRATE CHARTER
                      </span>
                    </div>
                  </div>

                  {/* DIRECT PARCHMENT CONTENT HERE */}
                  <div className="relative z-20">
                    {children}
                  </div>

                  {/* Bottom Wax Seal & Quick Re-Roll Button */}
                  <div className="mt-8 pt-4 text-center border-t border-[#6b421a]/25 flex flex-col items-center">
                    <button
                      type="button"
                      onClick={handleToggle}
                      className="inline-flex items-center space-x-2 px-6 py-2 rounded-full bg-gradient-to-r from-[#3e2410] to-[#251509] hover:from-[#543015] hover:to-[#381f0d] text-[#ffe57f] border border-[#d4af37] shadow-[0_4px_12px_rgba(0,0,0,0.4)] text-xs font-cinzel font-bold tracking-wider uppercase transition-all"
                    >
                      <ChevronUp className="w-4 h-4 text-[#ffd700]" />
                      <span>Roll Up Ancient Scroll</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom Curl Shadow where paper enters bottom roller */}
              <div className="h-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none rounded-b-lg relative z-20" />

              {/* 3D Bottom Wooden Roller Bar with Golden Finials */}
              <div className="relative flex items-center justify-between px-1 -mt-2">
                {/* Left 3D Golden Finial Knob */}
                <div className="relative z-20 flex items-center -mr-2">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#ffe57f] via-[#cda335] to-[#422d08] border-2 border-[#ffd700]/70 shadow-[0_6px_15px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.6)] flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-tl from-[#5c4013] to-[#ffe57f] shadow-inner" />
                  </div>
                  <div className="w-2.5 h-6 sm:h-7 bg-gradient-to-r from-[#ffd700] via-[#8c6518] to-[#422d08] rounded-sm -ml-1 shadow-md border-y border-[#ffd700]/40" />
                </div>

                {/* Bottom Cylindrical Wooden Dowel */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={handleToggle}
                  className="relative flex-1 h-7 sm:h-8 rounded-full overflow-hidden shadow-[0_8px_25px_rgba(0,0,0,0.9)] border-t border-b border-[#ffd700]/40 bg-gradient-to-b from-[#6e4318] via-[#a86c35] via-[#dfa561] to-[#2e1706] cursor-pointer flex items-center justify-center group"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.15)_30%,transparent_60%,rgba(255,255,255,0.15)_80%,transparent_100%)] pointer-events-none" />
                  <div className="absolute left-6 top-0 bottom-0 w-2 bg-gradient-to-b from-[#ffd700] via-[#946c18] to-[#ffd700] opacity-80" />
                  <div className="absolute right-6 top-0 bottom-0 w-2 bg-gradient-to-b from-[#ffd700] via-[#946c18] to-[#ffd700] opacity-80" />
                  <span className="font-cinzel text-[11px] font-bold text-[#ffd700] uppercase tracking-widest flex items-center space-x-1 drop-shadow-md">
                    <ChevronUp className="w-3.5 h-3.5 text-[#ffd700]" />
                    <span>Click Dowel to Roll Up</span>
                  </span>
                </div>

                {/* Right 3D Golden Finial Knob */}
                <div className="relative z-20 flex items-center -ml-2">
                  <div className="w-2.5 h-6 sm:h-7 bg-gradient-to-l from-[#ffd700] via-[#8c6518] to-[#422d08] rounded-sm -mr-1 shadow-md border-y border-[#ffd700]/40" />
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#ffe57f] via-[#cda335] to-[#422d08] border-2 border-[#ffd700]/70 shadow-[0_6px_15px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.6)] flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-tl from-[#5c4013] to-[#ffe57f] shadow-inner" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AncientParchmentScroll;
