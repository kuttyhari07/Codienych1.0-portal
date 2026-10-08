import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, Maximize, Minimize, Volume2, VolumeX, Radio, MapPin, 
  AlertCircle, CheckCircle2, PauseCircle, ArrowLeft, Anchor, 
  Zap, Award, Info, Sparkles, RefreshCw, ChevronRight, ShieldCheck 
} from 'lucide-react';
import api from '../services/api';
import { 
  playChirp, 
  playVictoryFanfare, 
  playBassDrop, 
  playLaserSweep, 
  isSoundEnabled, 
  toggleSound 
} from '../utils/cyberSound';
import CyberEnergyMatrixCanvas from '../components/CyberEnergyMatrixCanvas';

const ReviewCountdownPage = () => {
  const [activeReview, setActiveReview] = useState(null);
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverOffset, setServerOffset] = useState(0); // diff between server and local time
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState(Date.now());
  const [selectedReviewModal, setSelectedReviewModal] = useState(null);

  // Live timer states
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalSeconds: 0,
    phase: 'UPCOMING', // 'STARTING_SOON', 'IN_PROGRESS', 'PAUSED', 'ENDED'
    progressPercent: 0,
  });

  // Global 24-hour Hackathon Clock (Today 11:30 AM -> Tomorrow 11:30 AM)
  const [hackathon24h, setHackathon24h] = useState({
    hours: 24,
    minutes: 0,
    seconds: 0,
    progress: 0,
    isLive: false,
    isUpcoming: false,
    isConcluded: false,
  });

  const timerRef = useRef(null);
  const playedWarningsRef = useRef({ tenMin: false, fiveMin: false, oneMin: false, ended: false });

  // Fetch active review and schedule from server
  const fetchReviewData = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const res = await api.get('/reviews/active');
      if (res.data.success && res.data.data) {
        const { activeReview: active, allReviews: reviews, serverTime } = res.data.data;
        
        if (serverTime) {
          const sTime = new Date(serverTime).getTime();
          const lTime = Date.now();
          setServerOffset(sTime - lTime);
        }

        setActiveReview(active);
        setAllReviews(reviews || []);
        setLastSyncTime(Date.now());
      }
    } catch (err) {
      console.error('[Review Countdown Sync Error]', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  // Initial fetch and 6-second auto-poll for live admin updates
  useEffect(() => {
    fetchReviewData(true);
    const pollInterval = setInterval(() => {
      fetchReviewData(false);
    }, 6000);

    return () => clearInterval(pollInterval);
  }, [fetchReviewData]);

  // Real-time 1-second countdown clock calculation
  useEffect(() => {
    const calculateCountdown = () => {
      const now = Date.now() + serverOffset;

      // Calculate Global 24-Hour Hackathon Mission Clock (Today 11:30 AM -> Tomorrow 11:30 AM)
      const hStartMs = new Date('2026-10-08T11:30:00+05:30').getTime();
      const hEndMs = new Date('2026-10-09T11:30:00+05:30').getTime();

      if (now < hStartMs) {
        const diffSec = Math.max(0, Math.floor((hStartMs - now) / 1000));
        setHackathon24h({
          hours: Math.floor(diffSec / 3600),
          minutes: Math.floor((diffSec % 3600) / 60),
          seconds: diffSec % 60,
          progress: 0,
          isLive: false,
          isUpcoming: true,
          isConcluded: false,
        });
      } else if (now >= hStartMs && now <= hEndMs) {
        const diffSec = Math.max(0, Math.floor((hEndMs - now) / 1000));
        const totalSec = Math.floor((hEndMs - hStartMs) / 1000);
        const elapsedSec = totalSec - diffSec;
        const progress = Math.min(100, Math.max(0, (elapsedSec / totalSec) * 100));

        setHackathon24h({
          hours: Math.floor(diffSec / 3600),
          minutes: Math.floor((diffSec % 3600) / 60),
          seconds: diffSec % 60,
          progress,
          isLive: true,
          isUpcoming: false,
          isConcluded: false,
        });
      } else {
        setHackathon24h({
          hours: 0,
          minutes: 0,
          seconds: 0,
          progress: 100,
          isLive: false,
          isUpcoming: false,
          isConcluded: true,
        });
      }

      if (!activeReview) return;

      const startMs = new Date(activeReview.startTime).getTime();
      const endMs = new Date(activeReview.endTime).getTime();

      if (activeReview.status === 'PAUSED') {
        const diff = Math.max(0, Math.floor((endMs - now) / 1000));
        setTimeLeft((prev) => ({
          ...prev,
          phase: 'PAUSED',
        }));
        return;
      }

      if (activeReview.status === 'COMPLETED') {
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 0,
          phase: 'ENDED',
          progressPercent: 100,
        });
        return;
      }

      // Check if not started yet
      if (now < startMs) {
        const diffSeconds = Math.max(0, Math.floor((startMs - now) / 1000));
        const hours = Math.floor(diffSeconds / 3600);
        const minutes = Math.floor((diffSeconds % 3600) / 60);
        const seconds = diffSeconds % 60;

        setTimeLeft({
          hours,
          minutes,
          seconds,
          totalSeconds: diffSeconds,
          phase: 'STARTING_SOON',
          progressPercent: 0,
        });
        return;
      }

      // Review In Progress
      if (now >= startMs && now <= endMs) {
        const totalDurationSec = Math.max(1, Math.floor((endMs - startMs) / 1000));
        const remainingSec = Math.max(0, Math.floor((endMs - now) / 1000));
        const elapsedSec = totalDurationSec - remainingSec;

        const hours = Math.floor(remainingSec / 3600);
        const minutes = Math.floor((remainingSec % 3600) / 60);
        const seconds = remainingSec % 60;
        const progress = Math.min(100, Math.max(0, (elapsedSec / totalDurationSec) * 100));

        setTimeLeft({
          hours,
          minutes,
          seconds,
          totalSeconds: remainingSec,
          phase: 'IN_PROGRESS',
          progressPercent: progress,
        });

        // Trigger Audio Alerts
        if (soundOn) {
          if (remainingSec <= 600 && remainingSec > 598 && !playedWarningsRef.current.tenMin) {
            playedWarningsRef.current.tenMin = true;
            playChirp();
          }
          if (remainingSec <= 300 && remainingSec > 298 && !playedWarningsRef.current.fiveMin) {
            playedWarningsRef.current.fiveMin = true;
            playLaserSweep();
          }
          if (remainingSec <= 60 && remainingSec > 58 && !playedWarningsRef.current.oneMin) {
            playedWarningsRef.current.oneMin = true;
            playBassDrop();
          }
        }
        return;
      }

      // Past End Time
      if (now > endMs) {
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
          totalSeconds: 0,
          phase: 'ENDED',
          progressPercent: 100,
        });

        if (soundOn && !playedWarningsRef.current.ended) {
          playedWarningsRef.current.ended = true;
          playVictoryFanfare();
        }
      }
    };

    calculateCountdown();
    timerRef.current = setInterval(calculateCountdown, 1000);
    return () => clearInterval(timerRef.current);
  }, [activeReview, serverOffset, soundOn]);

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const handleSoundToggle = () => {
    const nextState = toggleSound();
    setSoundOn(nextState);
    if (nextState) playChirp();
  };

  // Helper date formatter
  const formatTimeSlot = (startTime, endTime) => {
    if (!startTime || !endTime) return 'TBD';
    const s = new Date(startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const e = new Date(endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${s} — ${e}`;
  };

  const getStatusBadge = (status, isCurrentReview) => {
    if (isCurrentReview && status === 'ACTIVE') {
      return (
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/50 text-xs font-cinzel font-bold shadow-[0_0_12px_rgba(239,68,68,0.4)] animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>LIVE NOW</span>
        </span>
      );
    }
    if (status === 'COMPLETED') {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-cinzel font-bold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>CONCLUDED</span>
        </span>
      );
    }
    if (status === 'PAUSED') {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xs font-cinzel font-bold">
          <PauseCircle className="w-3.5 h-3.5" />
          <span>PAUSED</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-blue-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-cinzel font-bold">
        <Clock className="w-3.5 h-3.5" />
        <span>UPCOMING</span>
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#03070b] flex flex-col items-center justify-center text-[#ffd700] select-none p-4">
        <div className="relative w-16 h-16 flex items-center justify-center mb-4">
          <div className="absolute inset-0 border-2 border-[#ffd700]/30 rounded-full animate-ping" />
          <div className="w-12 h-12 border-2 border-t-[#ffd700] border-r-[#ffd700] border-b-transparent border-l-transparent rounded-full animate-spin" />
        </div>
        <span className="font-cinzel text-sm tracking-widest uppercase font-bold text-gray-200">
          SYNCHRONIZING REVIEW CHRONOMETER...
        </span>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#020509] text-[#f4e6c3] flex flex-col relative overflow-x-hidden ${isFullscreen ? 'p-2 sm:p-6' : ''}`}>
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-[#ffd700]/15 via-[#00e5ff]/5 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Top Telemetry Bar */}
      {!isFullscreen && (
        <header className="relative z-20 bg-[#061019]/90 backdrop-blur-md border-b border-[#3a2e1d] px-4 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link
              to="/portal"
              className="p-1.5 sm:p-2 rounded-lg bg-[#0c1e2d] border border-[#ffd700]/50 text-[#ffd700] hover:bg-[#ffd700] hover:text-black transition-colors flex items-center space-x-1"
              title="Return to Hackathon Portal"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-xs font-cinzel font-bold">PORTAL</span>
            </Link>

            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#140e06] border border-[#ffd700] overflow-hidden p-0.5">
                <img src="/codienych-logo-round.png" alt="CODIENYCH 1.0" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <h1 className="font-cinzel font-black text-sm sm:text-base text-white tracking-wider flex items-center gap-2">
                  <span>CODIENYCH 1.0</span>
                  <span className="text-[#ffd700] text-xs font-mono font-normal hidden md:inline">// REVIEW CHRONOMETER</span>
                </h1>
                <span className="text-[10px] font-mono text-[#00e5ff] tracking-widest block leading-none">
                  24-HOUR STAGE TELEMETRY
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Live Sync Status */}
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#081a29] border border-[#00e5ff]/40 text-[#00e5ff] text-[11px] font-mono">
              <span className="w-2 h-2 rounded-full bg-[#00e5ff] animate-ping" />
              <span>LIVE CLOUD SYNC</span>
            </div>

            {/* Audio Toggle */}
            <button
              onClick={handleSoundToggle}
              className={`p-2 rounded-lg border transition-all cursor-pointer ${
                soundOn
                  ? 'bg-[#1a1409] border-[#ffd700] text-[#ffd700] shadow-[0_0_10px_rgba(255,215,0,0.3)]'
                  : 'bg-[#091522] border-[#223344] text-gray-500'
              }`}
              title={soundOn ? 'Mute Chimes & Siren' : 'Enable Chimes & Siren'}
            >
              {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Fullscreen / Projector Mode */}
            <button
              onClick={toggleFullscreen}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#ffd700] to-[#f39c12] hover:brightness-110 text-black font-cinzel font-bold text-xs transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)] cursor-pointer"
              title="Toggle Large Screen Projector Mode"
            >
              {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isFullscreen ? 'EXIT PROJECTOR' : 'PROJECTOR MODE'}</span>
            </button>
          </div>
        </header>
      )}

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col justify-center">
        {/* Fullscreen Minimal Header */}
        {isFullscreen && (
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#ffd700]/30">
            <div className="flex items-center space-x-3">
              <div className="w-7 h-7 rounded-full bg-[#140e06] border border-[#ffd700] overflow-hidden p-0.5">
                <img src="/codienych-logo-round.png" alt="CODIENYCH 1.0" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="font-pirate text-lg text-[#ffd700]">CODIENYCH 1.0 • LIVE AUDITORIUM STAGE</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSoundToggle}
                className="text-[#ffd700] p-1.5 rounded-lg bg-[#0c1e2d] border border-[#ffd700]/50"
              >
                {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleFullscreen}
                className="px-3 py-1 rounded-lg bg-[#ffd700] text-black font-cinzel text-xs font-bold"
              >
                EXIT FULLSCREEN
              </button>
            </div>
          </div>
        )}

        {/* Global 24-Hour Hackathon Mission Clock Banner */}
        <div className="bg-[#061019]/90 border border-[#ffd700]/50 rounded-2xl p-4 sm:p-5 mb-6 shadow-xl backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#ffd700]/15 border border-[#ffd700]/50 flex items-center justify-center flex-shrink-0">
                <Anchor className="w-5 h-5 text-[#ffd700] animate-bounce" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  {hackathon24h.isLive ? (
                    <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-mono font-bold animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      <span>24-HR EXPEDITION LIVE</span>
                    </span>
                  ) : hackathon24h.isUpcoming ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-mono font-bold">
                      STARTS TODAY 11:30 AM
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold">
                      24-HR FINALE REACHED
                    </span>
                  )}
                  <span className="text-xs sm:text-sm font-cinzel font-black text-white uppercase tracking-wider">
                    24-HOUR MASTER EXPEDITION CLOCK
                  </span>
                </div>
                <p className="text-[11px] font-cinzel text-gray-400 mt-0.5">
                  Continuous High Seas Sprint: <strong className="text-[#ffd700]">Today 11:30 AM</strong> → <strong className="text-[#ffd700]">Tomorrow 11:30 AM IST (October 8 – 9, 2026)</strong>
                </p>
              </div>
            </div>

            {/* Countdown Clock Pill */}
            <div className="flex items-center space-x-2.5 bg-[#03070c] px-4 py-2 rounded-xl border border-[#ffd700]/40 shadow-inner flex-shrink-0">
              <Clock className="w-4 h-4 text-[#00e5ff]" />
              <div className="font-mono text-base sm:text-lg font-black text-[#ffd700] tracking-wider">
                {String(hackathon24h.hours).padStart(2, '0')}h : {String(hackathon24h.minutes).padStart(2, '0')}m : {String(hackathon24h.seconds).padStart(2, '0')}s
              </div>
              <span className="text-[10px] font-cinzel text-gray-400 font-bold uppercase">
                {hackathon24h.isLive ? 'REMAINING' : hackathon24h.isUpcoming ? 'TO KICK-OFF' : 'FINISHED'}
              </span>
            </div>
          </div>

          {/* Overall 24-Hour Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between items-center text-[10px] font-mono text-gray-400 mb-1">
              <span>OCT 8, 11:30 AM</span>
              <span className="text-[#ffd700] font-bold">{Math.round(hackathon24h.progress)}% COMPLETED</span>
              <span>OCT 9, 11:30 AM (CODE FREEZE)</span>
            </div>
            <div className="h-2 w-full bg-[#03070b] border border-[#ffd700]/25 rounded-full overflow-hidden p-0.5 shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#00e5ff] via-[#ffd700] to-[#ff4500] transition-all duration-1000"
                style={{ width: `${hackathon24h.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Hero Active Review Card */}
        {activeReview ? (
          <div className="relative bg-gradient-to-b from-[#091522]/95 via-[#061019]/95 to-[#04090f]/95 border-2 border-[#ffd700]/80 rounded-3xl p-5 sm:p-8 md:p-10 shadow-[0_0_60px_rgba(255,215,0,0.18)] mb-8 overflow-hidden backdrop-blur-xl">
            {/* Top Ornate Accents */}
            <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-[#ffd700] rounded-tl-3xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-[#ffd700] rounded-tr-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-[#ffd700] rounded-bl-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-[#ffd700] rounded-br-3xl pointer-events-none" />

            {/* Active Review Header Tag */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
              <div className="inline-flex items-center space-x-2 bg-[#ffd700]/10 border border-[#ffd700]/40 px-3.5 py-1.5 rounded-full">
                <Radio className="w-4 h-4 text-[#ffd700] animate-pulse" />
                <span className="font-cinzel text-xs sm:text-sm font-black tracking-widest text-[#ffd700] uppercase">
                  ROUND {String(activeReview.roundNumber || 1).padStart(2, '0')} IN FOCUS
                </span>
              </div>

              <div className="flex items-center space-x-3">
                {getStatusBadge(activeReview.status, activeReview.isCurrent)}
                {activeReview.extendedMinutes > 0 && (
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold">
                    +{activeReview.extendedMinutes}m EXTENDED
                  </span>
                )}
              </div>
            </div>

            {/* Review Title & Venue */}
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="font-pirate text-2xl sm:text-4xl md:text-5xl text-white tracking-wide mb-2 sm:mb-3">
                {activeReview.title}
              </h2>
              
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-[#e5c158] font-cinzel">
                <span className="inline-flex items-center space-x-1.5 bg-[#0e1d2c] px-3 py-1 rounded-lg border border-[#ffd700]/30 font-bold">
                  <Clock className="w-3.5 h-3.5 text-[#00e5ff]" />
                  <span>WINDOW: {formatTimeSlot(activeReview.startTime, activeReview.endTime)}</span>
                </span>
                
                {activeReview.venue && (
                  <span className="inline-flex items-center space-x-1.5 bg-[#0e1d2c] px-3 py-1 rounded-lg border border-[#ffd700]/30">
                    <MapPin className="w-3.5 h-3.5 text-[#ffd700]" />
                    <span>{activeReview.venue}</span>
                  </span>
                )}
              </div>
            </div>

            {/* MASSIVE DIGITAL COUNTDOWN CLOCK */}
            <div className="max-w-3xl mx-auto mb-6 sm:mb-8">
              <div className="grid grid-cols-3 gap-2.5 sm:gap-6 text-center">
                {/* Hours Box */}
                <div className="bg-[#03070c]/90 border border-[#4a381e] hover:border-[#ffd700] rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-2xl transition-all">
                  <div className="font-pirate text-4xl sm:text-7xl md:text-8xl text-[#ffd700] pirate-gold-title leading-none">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </div>
                  <div className="font-cinzel text-[10px] sm:text-xs font-bold text-[#cfb07a] tracking-widest uppercase mt-2">
                    HOURS
                  </div>
                </div>

                {/* Minutes Box */}
                <div className="bg-[#03070c]/90 border border-[#4a381e] hover:border-[#ffd700] rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-2xl transition-all">
                  <div className="font-pirate text-4xl sm:text-7xl md:text-8xl text-[#ffd700] pirate-gold-title leading-none">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </div>
                  <div className="font-cinzel text-[10px] sm:text-xs font-bold text-[#cfb07a] tracking-widest uppercase mt-2">
                    MINUTES
                  </div>
                </div>

                {/* Seconds Box */}
                <div className="bg-[#03070c]/90 border-2 border-[#00e5ff]/50 rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-[0_0_25px_rgba(0,229,255,0.25)] transition-all">
                  <div className="font-pirate text-4xl sm:text-7xl md:text-8xl text-[#00e5ff] pirate-cyan-glow leading-none animate-pulse">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </div>
                  <div className="font-cinzel text-[10px] sm:text-xs font-bold text-[#00e5ff] tracking-widest uppercase mt-2">
                    SECONDS
                  </div>
                </div>
              </div>

              {/* Status Indicator Label Below Digits */}
              <div className="text-center mt-4">
                <span className={`inline-block font-cinzel font-black text-xs sm:text-sm tracking-widest uppercase px-4 py-1.5 rounded-full border ${
                  timeLeft.phase === 'IN_PROGRESS'
                    ? 'bg-red-950/60 text-red-300 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse'
                    : timeLeft.phase === 'STARTING_SOON'
                    ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/50'
                    : timeLeft.phase === 'PAUSED'
                    ? 'bg-amber-950/60 text-amber-300 border-amber-500/50'
                    : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
                }`}>
                  {timeLeft.phase === 'IN_PROGRESS' && '⚡ EVALUATION WINDOW ACTIVE — TIME REMAINING'}
                  {timeLeft.phase === 'STARTING_SOON' && '⏳ COUNTDOWN TO ROUND INVOCATION'}
                  {timeLeft.phase === 'PAUSED' && '⏸️ REVIEW TEMPORARILY SUSPENDED BY JURY'}
                  {timeLeft.phase === 'ENDED' && '🏁 REVIEW ROUND CONCLUDED'}
                </span>
              </div>
            </div>

            {/* Dynamic Progress Bar */}
            <div className="max-w-3xl mx-auto mb-6">
              <div className="flex justify-between items-center text-[11px] font-mono text-gray-400 mb-1.5">
                <span>STAGE COMMENCEMENT</span>
                <span className="text-[#ffd700] font-bold">{Math.round(timeLeft.progressPercent)}% ELAPSED</span>
                <span>DEADLINE FREEZE</span>
              </div>
              <div className="h-3 w-full bg-[#03070b] border border-[#ffd700]/30 rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#ff4500] transition-all duration-1000 shadow-[0_0_12px_#ffd700]"
                  style={{ width: `${timeLeft.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Jury Live Announcement Marquee / Alert */}
            {activeReview.announcement && (
              <div className="max-w-3xl mx-auto bg-gradient-to-r from-[#1c1206] via-[#2d1b09] to-[#1c1206] border-2 border-[#ffd700] rounded-2xl p-4 sm:p-5 flex items-start space-x-3 sm:space-x-4 shadow-[0_0_20px_rgba(255,215,0,0.25)] animate-fadeIn">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#ffd700] flex-shrink-0 mt-0.5 animate-bounce" />
                <div className="flex-1">
                  <span className="block font-cinzel text-xs font-black text-[#ffd700] tracking-wider uppercase mb-1">
                    OFFICIAL JURY / ADMIRALTY ANNOUNCEMENT:
                  </span>
                  <p className="font-cinzel text-xs sm:text-sm text-white font-semibold leading-relaxed">
                    {activeReview.announcement}
                  </p>
                </div>
              </div>
            )}

            {/* Review Description & Evaluation Criteria */}
            {activeReview.description && (
              <div className="max-w-3xl mx-auto mt-5 bg-[#040a12]/80 border border-[#2a3a4d] rounded-xl p-4 text-xs font-cinzel text-gray-300 leading-relaxed flex items-start space-x-2.5">
                <Info className="w-4 h-4 text-[#00e5ff] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#00e5ff] font-bold uppercase tracking-wider block mb-0.5">Round Guidelines & Expectations:</span>
                  <span>{activeReview.description}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#08121a] border border-[#3a2e1d] rounded-2xl p-8 text-center max-w-xl mx-auto mb-8">
            <Anchor className="w-12 h-12 text-[#ffd700] mx-auto mb-3" />
            <h3 className="font-pirate text-2xl text-white">NO ACTIVE REVIEW CONFIGURED</h3>
            <p className="font-cinzel text-xs text-gray-400 mt-2">
              The jury admiralty has not designated an active review schedule milestone yet.
            </p>
          </div>
        )}

        {/* SCHEDULE TIMELINE: All Hackathon Review Milestones */}
        <section className="mt-4">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-2.5">
              <Clock className="w-5 h-5 text-[#ffd700]" />
              <h3 className="font-cinzel font-black text-base sm:text-xl text-white tracking-wider">
                HACKATHON REVIEW SCHEDULE & STAGES
              </h3>
            </div>
            <span className="text-[11px] font-mono text-gray-400">
              {allReviews.length} MILESTONES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allReviews.map((rev) => {
              const isSelected = activeReview && activeReview._id === rev._id;
              return (
                <div
                  key={rev._id}
                  className={`relative rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#0a1827] border-2 border-[#ffd700] shadow-[0_0_25px_rgba(255,215,0,0.25)]'
                      : 'bg-[#061019]/80 border border-[#233547] hover:border-[#ffd700]/50'
                  }`}
                >
                  {/* Current Active Indicator Pill */}
                  {isSelected && (
                    <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#ffd700] text-black font-cinzel font-black text-[10px] tracking-wider uppercase shadow-md flex items-center space-x-1">
                      <Sparkles className="w-3 h-3" />
                      <span>LIVE FOCUS STAGE</span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono text-xs font-bold text-[#00e5ff] tracking-wider">
                        STAGE {String(rev.roundNumber).padStart(2, '0')}
                      </span>
                      {getStatusBadge(rev.status, rev.isCurrent)}
                    </div>

                    <h4 className="font-pirate text-lg sm:text-xl text-white mb-2 leading-snug">
                      {rev.title}
                    </h4>

                    <div className="space-y-1.5 text-xs font-cinzel text-gray-300 mb-3">
                      <div className="flex items-center space-x-2 text-[#ffd700]">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-bold">{formatTimeSlot(rev.startTime, rev.endTime)}</span>
                      </div>
                      {rev.venue && (
                        <div className="flex items-center space-x-2 text-gray-400">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>{rev.venue}</span>
                        </div>
                      )}
                    </div>

                    {rev.description && (
                      <p className="text-[11px] text-gray-400 line-clamp-2 font-cinzel leading-relaxed">
                        {rev.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#1c2e40] flex items-center justify-between">
                    <span className="text-[10px] font-mono text-gray-500">
                      Duration: {Math.round((new Date(rev.endTime) - new Date(rev.startTime)) / (1000 * 60))} mins
                    </span>
                    <button
                      onClick={() => setSelectedReviewModal(rev)}
                      className="text-xs font-cinzel font-bold text-[#ffd700] hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <span>VIEW DETAILS</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Ambient Waveform Canvas at bottom */}
        <div className="mt-8">
          <CyberEnergyMatrixCanvas />
        </div>
      </main>

      {/* Review Details Modal */}
      {selectedReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#08121a] border-2 border-[#ffd700] rounded-2xl w-full max-w-xl overflow-hidden shadow-[0_0_50px_rgba(255,215,0,0.25)] flex flex-col">
            <div className="bg-[#0e1d2c] px-6 py-4 border-b border-[#ffd700]/30 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Award className="w-5 h-5 text-[#ffd700]" />
                <h3 className="font-cinzel font-black text-base text-white tracking-wider">
                  ROUND {selectedReviewModal.roundNumber} DETAILS
                </h3>
              </div>
              <button
                onClick={() => setSelectedReviewModal(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-pirate text-2xl text-[#ffd700] mb-1">
                  {selectedReviewModal.title}
                </h4>
                <div className="flex flex-wrap items-center gap-3 text-xs font-cinzel text-gray-300 mt-2">
                  <span className="bg-[#050d14] px-2.5 py-1 rounded border border-[#2b3c4f]">
                    ⏰ {formatTimeSlot(selectedReviewModal.startTime, selectedReviewModal.endTime)}
                  </span>
                  <span className="bg-[#050d14] px-2.5 py-1 rounded border border-[#2b3c4f]">
                    📍 {selectedReviewModal.venue || 'Bays & Labs'}
                  </span>
                  <span>{getStatusBadge(selectedReviewModal.status, selectedReviewModal.isCurrent)}</span>
                </div>
              </div>

              {selectedReviewModal.description && (
                <div className="bg-[#050d14] p-4 rounded-xl border border-[#1e2e40]">
                  <span className="font-cinzel text-xs text-[#00e5ff] font-bold block mb-1">
                    EVALUATION RUBRIC & PROTOCOL:
                  </span>
                  <p className="font-cinzel text-xs text-gray-200 leading-relaxed whitespace-pre-wrap">
                    {selectedReviewModal.description}
                  </p>
                </div>
              )}

              {selectedReviewModal.announcement && (
                <div className="bg-amber-950/40 p-4 rounded-xl border border-amber-500/50">
                  <span className="font-cinzel text-xs text-amber-400 font-bold block mb-1">
                    ACTIVE ANNOUNCEMENT:
                  </span>
                  <p className="font-cinzel text-xs text-amber-200 leading-relaxed">
                    {selectedReviewModal.announcement}
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedReviewModal(null)}
                  className="px-5 py-2 rounded-xl bg-[#ffd700] hover:bg-[#ffe066] text-black font-cinzel font-bold text-xs cursor-pointer shadow-md"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewCountdownPage;
