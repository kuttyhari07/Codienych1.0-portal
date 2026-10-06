import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scroll, ChevronDown, ChevronUp, Skull } from 'lucide-react';
import DecipherText from './DecipherText';
import { playLaserBlip } from '../utils/cyberSound';

/**
 * Realistic 3D Ancient Parchment Scroll Component
 * Features authentic photorealistic wooden spindles with brass anchor finials,
 * tightly rolled crinkled parchment with leather strap & wax seal when closed,
 * and smooth physical unrolling/roll-up animations with direct parchment text.
 */
const AncientParchmentScroll = ({
  id,
  subtitle = '// PIRATE CODE',
  title = 'CREW FORMATION',
  goldTitle = 'ARTICLES',
  description = 'Mandatory pirate maritime bylaws binding every crew docking at the hackathon fleet.',
  badge = '9 ARTICLES',
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    const handleOpen = (e) => {
      if (!e.detail?.id || e.detail.id === id) {
        setIsOpen(true);
      }
    };
    window.addEventListener('open-parchment-scroll', handleOpen);
    return () => window.removeEventListener('open-parchment-scroll', handleOpen);
  }, [id]);

  const handleToggle = () => {
    playLaserBlip();
    setIsOpen(prev => !prev);
  };

  return (
    <div id={id} className="relative py-8 sm:py-16 px-2 sm:px-6 z-10 max-w-5xl mx-auto select-none">
      {/* Scroll Header Area */}
      <div className="text-center mb-5 sm:mb-8">
        <div className="inline-block font-cinzel font-bold text-[11px] sm:text-xs text-[#ffd700] tracking-widest uppercase mb-1.5">
          {subtitle}
        </div>
        <h2 className="font-pirate text-2xl sm:text-5xl md:text-6xl text-white tracking-wide leading-tight">
          {title} <span className="text-[#ffd700] pirate-gold-title"><DecipherText text={goldTitle} /></span>
        </h2>
        <p className="font-cinzel text-[11px] sm:text-sm text-gray-300 mt-1 max-w-xl mx-auto px-2">
          {description}
        </p>
      </div>

      {/* CLOSED STATE: Photorealistic Rolled Parchment Scroll with Wax Seal */}
      {!isOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-expanded={false}
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleToggle();
            }
          }}
          className="group relative cursor-pointer focus:outline-none flex flex-col items-center justify-center max-w-2xl mx-auto transition-transform duration-300 hover:scale-[1.02]"
        >
          {/* Photorealistic Closed Scroll Image */}
          <div className="relative w-full max-w-xl sm:max-w-2xl px-2 sm:px-4">
            <img
              src="/pirate-scroll-closed.png"
              alt="Ancient Closed Pirate Scroll with Wax Seal"
              className="w-full h-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.95)] filter transition-all duration-300 group-hover:drop-shadow-[0_0_35px_rgba(255,215,0,0.45)]"
            />
          </div>

          {/* Interactive Unroll Action Button */}
          <div className="mt-3 sm:mt-4">
            <div className="relative inline-flex items-center space-x-2.5 sm:space-x-3 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#1c1208] via-[#331f0e] to-[#1c1208] border-2 border-[#ffd700] group-hover:border-[#ffe885] shadow-[0_0_25px_rgba(255,215,0,0.35),0_8px_20px_rgba(0,0,0,0.8)] group-hover:shadow-[0_0_35px_rgba(255,215,0,0.6)] transition-all duration-300">
              {/* Embossed Wax Seal Badge */}
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-[#b31b1b] via-[#820d0d] to-[#450505] border border-[#ff8585] shadow-[0_2px_5px_rgba(0,0,0,0.6)] flex items-center justify-center flex-shrink-0">
                <Skull className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#ffd700]" />
              </div>

              <span className="font-cinzel font-bold text-[11px] sm:text-sm text-[#ffd700] tracking-wider uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                Click to Unroll Scroll ({badge})
              </span>

              <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffd700] transition-transform group-hover:translate-y-0.5 animate-bounce" />
            </div>
          </div>
        </div>
      )}

      {/* OPEN STATE: Photorealistic Unrolled Parchment Map with Wooden Rods */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, scaleY: 0.92 }}
            animate={{ opacity: 1, height: 'auto', scaleY: 1 }}
            exit={{ opacity: 0, height: 0, scaleY: 0.92 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: 'top center' }}
            className="overflow-hidden relative max-w-4xl mx-auto"
          >
            {/* Top Photorealistic Wooden Spindle Rod */}
            <div
              role="button"
              tabIndex={0}
              onClick={handleToggle}
              title="Click to roll up scroll"
              className="relative z-30 w-full max-w-3xl sm:max-w-4xl mx-auto -mb-3 sm:-mb-7 cursor-pointer group/rod transition-transform hover:scale-[1.01]"
            >
              <img
                src="/pirate-scroll-rod.png"
                alt="Top Wooden Scroll Rod with Anchor Finials"
                className="w-full h-auto object-contain drop-shadow-[0_12px_24px_rgba(0,0,0,0.95)]"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/rod:opacity-100 transition-opacity pointer-events-none">
                <span className="bg-[#120a04]/90 text-[#ffd700] border border-[#ffd700]/60 text-[9px] sm:text-xs font-cinzel font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-lg">
                  ▲ Click to Roll Up Scroll
                </span>
              </div>
            </div>

            {/* The Authentic Ancient Scroll Parchment Surface */}
            <div className="relative z-20 shadow-[0_20px_50px_rgba(0,0,0,0.85)] overflow-hidden rounded-lg sm:rounded-2xl border-2 sm:border-[3px] border-[#5a3313]/50">
              {/* Paper background with authentic parchment texture without stretching distortion */}
              <div
                className="relative overflow-hidden bg-[#e8d2a8]"
                style={{
                  backgroundImage: "radial-gradient(ellipse at 50% 10%, rgba(255, 248, 230, 0.7) 0%, rgba(225, 192, 142, 0.5) 60%, rgba(138, 85, 34, 0.35) 100%), url('/pirate-ancient-scroll.png')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center top',
                  backgroundRepeat: 'no-repeat',
                  boxShadow: 'inset 0 0 35px rgba(60, 30, 10, 0.35)',
                }}
              >
                {/* Vintage Warm Paper Overlay for crisp text readability */}
                <div className="relative z-10 px-3.5 sm:px-10 md:px-16 py-7 sm:py-14 text-[#2c1708]">
                  {/* Top Filigree Charter Label */}
                  <div className="text-center mb-4 sm:mb-6">
                    <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#3d2412]/10 border border-[#6b421a]/30 max-w-full">
                      <Scroll className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#6b421a] flex-shrink-0" />
                      <span className="font-cinzel text-[9px] sm:text-[11px] font-bold text-[#452811] uppercase tracking-widest truncate">
                        ROYAL PIRATE CHARTER // {title}
                      </span>
                    </div>
                  </div>

                  {/* DIRECT PARCHMENT CONTENT HERE */}
                  <div className="relative z-20">
                    {children}
                  </div>

                  {/* Bottom Wax Seal & Quick Re-Roll Button */}
                  <div className="mt-6 sm:mt-8 pt-4 text-center border-t border-[#6b421a]/25 flex flex-col items-center">
                    <button
                      type="button"
                      onClick={handleToggle}
                      className="inline-flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#3e2410] to-[#251509] hover:from-[#543015] hover:to-[#381f0d] text-[#ffe57f] border-2 border-[#d4af37] shadow-[0_4px_12px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(255,215,0,0.4)] text-[11px] sm:text-xs font-cinzel font-bold tracking-wider uppercase transition-all"
                    >
                      <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffd700]" />
                      <span>Roll Up Ancient Scroll</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Photorealistic Wooden Spindle Rod */}
            <div
              role="button"
              tabIndex={0}
              onClick={handleToggle}
              title="Click to roll up scroll"
              className="relative z-30 w-full max-w-3xl sm:max-w-4xl mx-auto -mt-3 sm:-mt-7 cursor-pointer group/rod transition-transform hover:scale-[1.01]"
            >
              <img
                src="/pirate-scroll-rod.png"
                alt="Bottom Wooden Scroll Rod with Anchor Finials"
                className="w-full h-auto object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.95)]"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/rod:opacity-100 transition-opacity pointer-events-none">
                <span className="bg-[#120a04]/90 text-[#ffd700] border border-[#ffd700]/60 text-[9px] sm:text-xs font-cinzel font-bold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full shadow-lg">
                  ▲ Click to Roll Up Scroll
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AncientParchmentScroll;
