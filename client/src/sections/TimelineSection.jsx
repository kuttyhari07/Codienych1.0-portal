import React, { useState, useEffect, useRef } from 'react';
import { 
  Compass, 
  Anchor, 
  Skull, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Map as MapIcon, 
  List, 
  Clock, 
  Award, 
  CheckCircle2, 
  Code2, 
  Swords, 
  Ship, 
  Send 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DecipherText from '../components/DecipherText';
import { playLaserBlip, playChirp } from '../utils/cyberSound';

/**
 * 8 Core Hackathon Voyage Stages matching the Marauder's Sea Chart layout
 * Positions correspond to percentage coords (x, y) on the parchment canvas
 */
const VOYAGE_STAGES = [
  {
    id: 1,
    step: '01',
    day: 'DAY 1 • 29 SEP',
    time: '08:30 AM',
    title: 'REGISTRATION & CHECK-IN',
    deck: 'Harbor Clearance Deck',
    x: 20,
    y: 38,
    summary: 'On-site reporting, student physical ID verification & official pirate delegate kit handover at the port gates.',
    icon: Anchor,
    phase: 'PORT DOCKING',
  },
  {
    id: 2,
    step: '02',
    day: 'DAY 1 • 29 SEP',
    time: '09:30 AM',
    title: 'INAUGURAL CEREMONY',
    deck: 'Main Fleet Auditorium',
    x: 41,
    y: 28,
    summary: 'Grand opening invocation, chief guest address, fleet guidelines, and 24-hour voyage countdown kick-off.',
    icon: Sparkles,
    phase: 'SAILS HOISTED',
  },
  {
    id: 3,
    step: '03',
    day: 'DAY 1 • 29 SEP',
    time: '10:00 AM',
    title: 'HACKATHON BEGINS',
    deck: 'Command Hacking Bays',
    x: 61,
    y: 28,
    summary: 'Secret problem statements unsealed simultaneously on the high seas. Crews anchor into sprint architecture.',
    icon: Swords,
    phase: 'EXPEDITION LAUNCH',
  },
  {
    id: 4,
    step: '04',
    day: 'DAY 1 • 29 SEP',
    time: '04:30 PM',
    title: 'REVIEW ROUND 1',
    deck: 'Mentorship Zone',
    x: 81,
    y: 38,
    summary: 'Present problem statement analysis, proposed architectural solution, tech stack, and initial schema to admirals.',
    icon: Code2,
    phase: 'ARCHITECTURAL SCRUTINY',
  },
  {
    id: 5,
    step: '05',
    day: 'DAY 1 • 29 SEP',
    time: '11:30 PM',
    title: 'REVIEW ROUND 2',
    deck: 'Midwatch Quarters',
    x: 78,
    y: 72,
    summary: 'Midnight progress audit, core API & database connectivity demo, feedback iteration before the dawn sprint.',
    icon: CheckCircle2,
    phase: 'MIDNIGHT RAID AUDIT',
  },
  {
    id: 6,
    step: '06',
    day: 'DAY 2 • 30 SEP',
    time: '04:00 AM',
    title: 'CONTINUOUS BUILDING',
    deck: 'High Seas Engine Room',
    x: 59,
    y: 76,
    summary: 'High-octane overnight coding voyage fueled by snacks, refreshments, and tactical bug squashing.',
    icon: Ship,
    phase: 'NIGHT HIGH SEAS SURGE',
  },
  {
    id: 7,
    step: '07',
    day: 'DAY 2 • 30 SEP',
    time: '09:30 AM',
    title: 'HACKATHON CONCLUDES',
    deck: 'Admiralty Registry',
    x: 39,
    y: 76,
    summary: 'Official code repo freeze. Final GitHub repository link, presentation deck & demo video submitted.',
    icon: Send,
    phase: 'ANCHORS DROPPED',
  },
  {
    id: 8,
    step: '08',
    day: 'DAY 2 • 30 SEP',
    time: '02:00 PM',
    title: 'VALEDICTION & PRIZES',
    deck: 'Grand Galleon Stage',
    x: 19,
    y: 68,
    summary: 'Grand closing ceremony, top squad announcements, cash bounties, trophies, and certificate distribution.',
    icon: Award,
    phase: 'AZTEC GOLD PLUNDER',
  },
];

// Dotted path coordinates linking 01 -> 02 -> 03 -> 04 -> 05 -> 06 -> 07 -> 08 -> 01
const SVG_PATH = 'M 200 228 C 300 180, 360 168, 410 168 C 510 168, 560 168, 610 168 C 710 170, 770 190, 810 228 C 840 330, 820 390, 780 432 C 700 460, 640 456, 590 456 C 490 456, 440 456, 390 456 C 290 450, 230 430, 190 408 Z';

const TimelineSection = () => {
  const [activeIdx, setActiveIdx] = useState(3); // Start highlighted at Stage 04 like screenshot
  const [isPlaying, setIsPlaying] = useState(true);
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list'
  const timerRef = useRef(null);

  // Auto-tour through the voyage stages every 4.5 seconds
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setActiveIdx(prev => (prev + 1) % VOYAGE_STAGES.length);
      }, 4500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const handleSelectStage = (idx) => {
    playLaserBlip();
    setActiveIdx(idx);
  };

  const handleTogglePlay = () => {
    playChirp();
    setIsPlaying(prev => !prev);
  };

  const handleReset = () => {
    playLaserBlip();
    setActiveIdx(0);
  };

  const handlePrev = () => {
    playLaserBlip();
    setActiveIdx(prev => (prev === 0 ? VOYAGE_STAGES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    playLaserBlip();
    setActiveIdx(prev => (prev + 1) % VOYAGE_STAGES.length);
  };

  const activeStage = VOYAGE_STAGES[activeIdx];
  const prevStage = VOYAGE_STAGES[(activeIdx - 1 + VOYAGE_STAGES.length) % VOYAGE_STAGES.length];

  return (
    <section id="timeline" className="relative py-16 sm:py-24 px-3 sm:px-6 z-10 select-none overflow-hidden">
      {/* Deep Ocean Ambient Backdrop */}
      <div className="absolute inset-0 bg-[#03070b]/90 pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-20">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-2 font-cinzel font-bold text-[11px] sm:text-xs text-[#ffd700] tracking-widest uppercase mb-2 bg-[#ffd700]/10 px-3.5 py-1 rounded-full border border-[#ffd700]/30 shadow-[0_0_15px_rgba(255,215,0,0.15)]">
            <Compass className="w-3.5 h-3.5 text-[#ffd700] animate-spin" style={{ animationDuration: '24s' }} />
            <span>// 24-HOUR MARAUDER'S SEA CHART</span>
          </div>

          <h2 className="font-pirate text-3xl sm:text-5xl md:text-6xl text-white tracking-wide">
            VOYAGE <span className="text-[#ffd700] pirate-gold-title"><DecipherText text="MAP" /></span> & TIMELINE
          </h2>

          <p className="font-cinzel text-xs sm:text-sm text-gray-300 max-w-xl mx-auto mt-2">
            Navigate the 8 legendary maritime stages of CODIENYCH 1.0 inscribed across the ancient Caribbean sea chart.
          </p>

          {/* View Toggle on Mobile & Desktop */}
          <div className="mt-4 inline-flex items-center p-1 bg-[#120b05] border border-[#d4af37]/40 rounded-full shadow-lg">
            <button
              type="button"
              onClick={() => { playLaserBlip(); setViewMode('map'); }}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-cinzel font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-gradient-to-r from-[#8a1c1c] to-[#5c0e0e] text-[#ffe57f] shadow-md border border-[#d4af37]/60'
                  : 'text-gray-400 hover:text-[#ffd700]'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>CARIBBEAN REALM MAP</span>
            </button>

            <button
              type="button"
              onClick={() => { playLaserBlip(); setViewMode('list'); }}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-cinzel font-bold transition-all ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-[#8a1c1c] to-[#5c0e0e] text-[#ffe57f] shadow-md border border-[#d4af37]/60'
                  : 'text-gray-400 hover:text-[#ffd700]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>CHRONICLE LOG</span>
            </button>
          </div>
        </div>

        {/* MAP VIEW: Authentic Marauder's Parchment Sea Chart */}
        {viewMode === 'map' && (
          <div className="relative">
            {/* Scrollable container on very small mobile screens */}
            <div className="overflow-x-auto pb-4 pt-1 rounded-2xl custom-scrollbar">
              <div className="min-w-[820px] lg:min-w-full">
                {/* The Parchment Map Board */}
                <div
                  className="relative rounded-2xl overflow-hidden border-[3px] border-[#4a2e16] shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(70,38,12,0.4)]"
                  style={{
                    backgroundColor: '#f1e2c6',
                    backgroundImage: `
                      radial-gradient(ellipse at 50% 50%, rgba(255, 250, 240, 0.85) 0%, rgba(235, 215, 180, 0.7) 65%, rgba(185, 145, 95, 0.6) 100%),
                      url('/pirate-ancient-scroll.png')
                    `,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    boxShadow: 'inset 0 0 50px rgba(60, 32, 10, 0.45)',
                  }}
                >
                  {/* Antique Double-Line Border with Corner Flourishes */}
                  <div className="absolute inset-2 sm:inset-3 border border-[#6b421a]/35 rounded-xl pointer-events-none z-10" />
                  <div className="absolute inset-3 sm:inset-4 border border-[#6b421a]/20 rounded-lg pointer-events-none z-10" />

                  {/* Corner Ornaments */}
                  <div className="absolute top-4 left-4 text-[#6b421a]/40 font-cinzel text-xs pointer-events-none z-10">╔══</div>
                  <div className="absolute top-4 right-4 text-[#6b421a]/40 font-cinzel text-xs pointer-events-none z-10">══╗</div>
                  <div className="absolute bottom-4 left-4 text-[#6b421a]/40 font-cinzel text-xs pointer-events-none z-10">╚══</div>
                  <div className="absolute bottom-4 right-4 text-[#6b421a]/40 font-cinzel text-xs pointer-events-none z-10">══╝</div>

                  {/* Cartographic Faint Architectural Grid & Passages */}
                  <div className="absolute inset-0 pointer-events-none opacity-25">
                    {/* Faint room boxes like Marauder's Map */}
                    <div className="absolute top-16 left-16 w-44 h-24 border border-dashed border-[#5a3313]/60 rounded" />
                    <div className="absolute top-16 right-16 w-52 h-28 border border-dashed border-[#5a3313]/60 rounded" />
                    <div className="absolute bottom-20 left-16 w-48 h-24 border border-dashed border-[#5a3313]/60 rounded" />
                    <div className="absolute bottom-20 right-20 w-44 h-24 border border-dashed border-[#5a3313]/60 rounded" />
                  </div>

                  {/* TOP CONTROL BAR (Matching User's Reference) */}
                  <div className="relative z-20 pt-4 px-6 flex items-center justify-between">
                    {/* Left: Badges */}
                    <div className="flex flex-col space-y-1.5">
                      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded bg-[#3b200b]/10 border border-[#5c3514]/30 shadow-xs">
                        <Anchor className="w-3 h-3 text-[#703d16]" />
                        <span className="font-cinzel text-[10px] sm:text-[11px] font-bold text-[#452811] uppercase tracking-wider">
                          CODIENYCH 1.0 EXPEDITION
                        </span>
                      </div>
                      <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded bg-[#3b200b]/15 border border-[#5c3514]/40">
                        <span className="text-[#8a1c1c] text-xs">📜</span>
                        <span className="font-cinzel text-[10px] sm:text-[11px] font-extrabold text-[#3a1d07] uppercase tracking-widest">
                          MAP OF THE CARIBBEAN REALM 1.0
                        </span>
                      </div>
                    </div>

                    {/* Center Watermark */}
                    <div className="hidden md:block text-center opacity-45 pointer-events-none">
                      <span className="font-cinzel text-[10px] tracking-[0.25em] text-[#5c3311] font-bold uppercase">
                        EXPEDITION ITINERARY & STAGES • CODIENYCH 1.0 PIRATES VOYAGE
                      </span>
                    </div>

                    {/* Right: Controls (Pause / Play & Reset) */}
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={handleTogglePlay}
                        className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-md bg-[#2e190b]/10 hover:bg-[#2e190b]/20 border border-[#5c3514]/40 text-[#40220a] font-cinzel text-[11px] font-bold transition-all shadow-xs"
                        title={isPlaying ? 'Pause Auto Tour' : 'Resume Auto Tour'}
                      >
                        {isPlaying ? (
                          <>
                            <Pause className="w-3 h-3 text-[#703d16]" />
                            <span>PAUSE</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 text-[#703d16]" />
                            <span>PLAY</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleReset}
                        className="p-1 rounded-md bg-[#2e190b]/10 hover:bg-[#2e190b]/20 border border-[#5c3514]/40 text-[#40220a] transition-all"
                        title="Reset to Stage 01"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* MAP CANVAS WITH COMPASS ROSE & WAYPOINTS */}
                  <div className="relative w-full h-[540px] sm:h-[600px]">
                    {/* CENTER COMPASS ROSE (Matching Screenshot) */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
                      <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] flex items-center justify-center">
                        {/* Concentric Dashed Navigation Circles */}
                        <div className="absolute inset-0 rounded-full border border-dashed border-[#6b421a]/30" />
                        <div className="absolute inset-8 rounded-full border border-dashed border-[#6b421a]/20" />
                        <div className="absolute inset-16 rounded-full border border-[#6b421a]/25" />
                        <div className="absolute inset-28 rounded-full border border-[#6b421a]/20" />

                        {/* Cardinal Direction Letters */}
                        <span className="absolute top-1 left-1/2 -translate-x-1/2 font-cinzel font-black text-xl sm:text-2xl text-[#8a1c1c] tracking-wider drop-shadow-sm">
                          N
                        </span>
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-cinzel font-black text-lg sm:text-xl text-[#6b421a] tracking-wider">
                          S
                        </span>
                        <span className="absolute left-1 top-1/2 -translate-y-1/2 font-cinzel font-black text-lg sm:text-xl text-[#6b421a] tracking-wider">
                          W
                        </span>
                        <span className="absolute right-1 top-1/2 -translate-y-1/2 font-cinzel font-black text-lg sm:text-xl text-[#6b421a] tracking-wider">
                          E
                        </span>

                        {/* Compass Star Needles (SVG) */}
                        <svg className="w-full h-full opacity-60" viewBox="0 0 400 400">
                          {/* North Point (Burgundy/Crimson) */}
                          <polygon points="200,30 212,190 200,200 188,190" fill="#8a1c1c" />
                          <polygon points="200,30 200,200 188,190" fill="#a82828" opacity="0.8" />
                          {/* South Point */}
                          <polygon points="200,370 212,210 200,200 188,210" fill="#7a481c" />
                          {/* East Point */}
                          <polygon points="370,200 210,212 200,200 210,188" fill="#7a481c" />
                          {/* West Point */}
                          <polygon points="30,200 190,212 200,200 190,188" fill="#7a481c" />
                          {/* Diagonal 4 Points */}
                          <polygon points="320,80 206,194 200,200 194,206" fill="#8c5825" opacity="0.6" />
                          <polygon points="80,320 206,194 200,200 194,206" fill="#8c5825" opacity="0.6" />
                          <polygon points="320,320 194,194 200,200 206,206" fill="#8c5825" opacity="0.6" />
                          <polygon points="80,80 194,194 200,200 206,206" fill="#8c5825" opacity="0.6" />
                        </svg>

                        {/* Center Glowing Hub */}
                        <div className="absolute w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#ffd700] via-[#c49021] to-[#8a5d12] border-2 border-[#5c3514] shadow-[0_0_12px_rgba(255,215,0,0.6)] flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#8a1c1c]" />
                        </div>
                      </div>
                    </div>

                    {/* SVG DOTTED MARAUDER'S TRAIL */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 600" preserveAspectRatio="none">
                      {/* Curving Dotted Route */}
                      <path
                        d={SVG_PATH}
                        fill="none"
                        stroke="#6b421a"
                        strokeWidth="2"
                        strokeDasharray="4 6"
                        opacity="0.5"
                      />
                    </svg>

                    {/* ANIMATED PIRATE FOOTPRINTS (Between Prev Stage and Active Stage) */}
                    <div
                      className="absolute pointer-events-none z-15 transition-all duration-700 ease-out"
                      style={{
                        left: `${(prevStage.x + activeStage.x) / 2}%`,
                        top: `${(prevStage.y + activeStage.y) / 2}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <div className="flex items-center space-x-1.5 opacity-80 animate-pulse">
                        <span className="text-xs text-[#5c3010] transform rotate-12">🐾</span>
                        <span className="text-xs text-[#5c3010] transform -rotate-12">🐾</span>
                        <span className="text-xs text-[#5c3010] transform rotate-12">🐾</span>
                      </div>
                    </div>

                    {/* 8 STAGE WAYPOINT NODES */}
                    {VOYAGE_STAGES.map((stg, idx) => {
                      const isActive = activeIdx === idx;

                      return (
                        <div
                          key={stg.id}
                          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-25 group"
                          style={{ left: `${stg.x}%`, top: `${stg.y}%` }}
                          onClick={() => handleSelectStage(idx)}
                        >
                          <div className="flex flex-col items-center">
                            {/* Animated Pulse Aura for Active Node */}
                            {isActive && (
                              <div className="absolute -inset-3 rounded-full bg-[#8a1c1c]/25 animate-ping pointer-events-none" />
                            )}

                            {/* Waypoint Shield / Wax Crest (Matching Reference Image) */}
                            <div
                              className={`relative w-11 h-13 sm:w-13 sm:h-15 flex flex-col items-center justify-center transition-all duration-300 ${
                                isActive
                                  ? 'scale-115 -translate-y-1 drop-shadow-[0_8px_16px_rgba(138,28,28,0.5)]'
                                  : 'hover:scale-105 drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]'
                              }`}
                            >
                              {/* Shield Polygon SVG with Double Border */}
                              <svg className="w-12 h-14 sm:w-14 sm:h-16" viewBox="0 0 56 66">
                                <defs>
                                  <linearGradient id={`shield-grad-${stg.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                                    {isActive ? (
                                      <>
                                        <stop offset="0%" stopColor="#fff8e7" />
                                        <stop offset="100%" stopColor="#faebd0" />
                                      </>
                                    ) : (
                                      <>
                                        <stop offset="0%" stopColor="#f7ecd7" />
                                        <stop offset="100%" stopColor="#edd8b9" />
                                      </>
                                    )}
                                  </linearGradient>
                                </defs>

                                {/* Shield Body */}
                                <path
                                  d="M 28 3 L 52 11 L 52 38 C 52 52, 28 63, 28 63 C 28 63, 4 52, 4 38 L 4 11 Z"
                                  fill={`url(#shield-grad-${stg.id})`}
                                  stroke={isActive ? '#8a1c1c' : '#6b421a'}
                                  strokeWidth={isActive ? '2.5' : '1.5'}
                                />

                                {/* Inner Shield Filigree Line */}
                                <path
                                  d="M 28 7 L 48 14 L 48 37 C 48 48, 28 58, 28 58 C 28 58, 8 48, 8 37 L 8 14 Z"
                                  fill="none"
                                  stroke={isActive ? '#8a1c1c' : '#7d4d22'}
                                  strokeWidth="0.8"
                                  strokeOpacity={isActive ? '0.9' : '0.5'}
                                />
                              </svg>

                              {/* Stage Number Inside Shield */}
                              <span
                                className={`absolute top-4 sm:top-4.5 font-cinzel font-bold text-xs sm:text-sm tracking-wider ${
                                  isActive ? 'text-[#8a1c1c] font-black' : 'text-[#3b1f09]'
                                }`}
                              >
                                {stg.step}
                              </span>

                              {/* Active Pirate Ship / Aztec Flag Marker */}
                              {isActive && (
                                <div className="absolute -top-3.5 right-0 animate-bounce">
                                  <div className="w-5 h-5 rounded-full bg-[#8a1c1c] border border-[#ffd700] flex items-center justify-center shadow-md">
                                    <Ship className="w-3 h-3 text-[#ffe57f]" />
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Cartouche Stage Label (Below Shield) */}
                            <div
                              className={`mt-1.5 px-3 py-1 rounded-md text-center max-w-[155px] sm:max-w-[175px] transition-all duration-300 ${
                                isActive
                                  ? 'bg-[#8a1c1c]/15 border-2 border-[#8a1c1c] shadow-sm'
                                  : 'bg-[#3b200b]/[0.06] hover:bg-[#3b200b]/[0.12] border border-[#5c3514]/25'
                              }`}
                            >
                              <span
                                className={`font-cinzel text-[10px] sm:text-[11px] uppercase tracking-wider block font-extrabold leading-tight ${
                                  isActive ? 'text-[#751616]' : 'text-[#381c07]'
                                }`}
                              >
                                {stg.title}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* BOTTOM STAGE DOSSIER BANNER (Matching Reference Image) */}
                  <div className="relative z-20 px-4 sm:px-6 py-3 sm:py-4 border-t-2 border-[#5c3514]/30 bg-[#2b1709]/[0.08] backdrop-blur-xs flex flex-col md:flex-row items-center justify-between gap-3">
                    {/* Left: Day/Time Pill */}
                    <div className="flex items-center space-x-2.5 flex-shrink-0">
                      <div className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#8a1c1c] to-[#5c0e0e] border border-[#ffd700]/60 text-[#ffe57f] font-cinzel text-[11px] sm:text-xs font-black tracking-wider shadow-sm flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#ffd700]" />
                        <span>{activeStage.day}</span>
                        <span className="opacity-60">•</span>
                        <span>{activeStage.time}</span>
                      </div>
                    </div>

                    {/* Middle: Stage Dossier Briefing */}
                    <div className="flex-1 text-center md:text-left min-w-0 px-2">
                      <p className="font-cinzel text-xs sm:text-[13px] text-[#2c1607] font-medium leading-snug">
                        <span className="font-bold text-[#8a1c1c] uppercase tracking-wider">
                          Stage {activeStage.step}: {activeStage.title} ({activeStage.deck})
                        </span>{' '}
                        — <span className="italic">"{activeStage.summary}"</span>
                      </p>
                    </div>

                    {/* Right: Stage Navigation (Prev / Next) */}
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button
                        type="button"
                        onClick={handlePrev}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-[#3b200b]/10 hover:bg-[#3b200b]/20 border border-[#5c3514]/40 text-[#40220a] font-cinzel text-xs font-bold transition-all"
                        title="Previous Stage"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="hidden sm:inline">PREV</span>
                      </button>

                      <div className="font-cinzel text-xs font-bold text-[#6b3510] px-1">
                        {activeStage.step} / 08
                      </div>

                      <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#8a1c1c] to-[#5c0e0e] hover:from-[#a32222] hover:to-[#6e1212] border border-[#ffd700]/70 text-[#ffe57f] font-cinzel text-xs font-bold transition-all shadow-sm"
                        title="Next Stage"
                      >
                        <span className="hidden sm:inline">NEXT</span>
                        <ChevronRight className="w-4 h-4 text-[#ffd700]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile swipe helper hint */}
            <div className="block lg:hidden text-center mt-2">
              <span className="text-[10px] font-cinzel text-gray-400 bg-black/40 px-3 py-1 rounded-full border border-gray-700">
                👆 Swipe horizontally to explore full sea chart map, or tap any stage
              </span>
            </div>
          </div>
        )}

        {/* LIST VIEW: Detailed Chronicle Log */}
        {viewMode === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {VOYAGE_STAGES.map((stg, idx) => {
              const Icon = stg.icon;
              const isActive = activeIdx === idx;

              return (
                <div
                  key={stg.id}
                  onClick={() => handleSelectStage(idx)}
                  className={`cursor-pointer p-4 sm:p-5 rounded-xl border transition-all duration-300 relative group overflow-hidden ${
                    isActive
                      ? 'bg-gradient-to-r from-[#211107] to-[#120803] border-2 border-[#ffd700] shadow-[0_0_25px_rgba(255,215,0,0.3)]'
                      : 'bg-[#0a0603]/80 border-[#4a2e16]/50 hover:border-[#ffd700]/60'
                  }`}
                >
                  <div className="flex items-start space-x-3.5">
                    {/* Stage Shield */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isActive
                          ? 'bg-[#8a1c1c] text-[#ffe57f] border border-[#ffd700]'
                          : 'bg-[#211107] text-[#ffd700] border border-[#4a2e16]'
                      }`}
                    >
                      <span className="font-cinzel text-sm font-black">{stg.step}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-cinzel text-[11px] text-[#ffd700] font-bold">
                          {stg.day} • {stg.time}
                        </span>
                        <span className="font-cinzel text-[10px] text-gray-400 uppercase">
                          {stg.phase}
                        </span>
                      </div>

                      <h4 className="font-pirate text-xl text-white tracking-wide">
                        {stg.title}
                      </h4>

                      <p className="font-cinzel text-xs text-gray-300 mt-1 leading-relaxed">
                        {stg.summary}
                      </p>

                      <div className="mt-2 pt-2 border-t border-[#4a2e16]/40 flex items-center space-x-1.5 text-[11px] font-cinzel text-gray-400">
                        <Icon className="w-3.5 h-3.5 text-[#ffd700]" />
                        <span>Deck: {stg.deck}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default TimelineSection;
