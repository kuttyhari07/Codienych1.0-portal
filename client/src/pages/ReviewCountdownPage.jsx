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

const OFFICIAL_AGENDA = [
  { id: 1, title: 'Registration', time: '09:30 AM to 11:00 AM', day: 'Day 1 • 8 Oct', category: 'General' },
  { id: 2, title: 'Inauguration Ceremony', time: '11:30 AM to 12:00 PM', day: 'Day 1 • 8 Oct', category: 'Inauguration', highlight: true, details: 'Welcome, Prayer song, Lighting Lamp, Welcome Address, Chief Guest Honor, Chief Guest Speech, Program Instruction' },
  { id: 3, title: 'Lunch', time: '12:30 PM to 01:30 PM', day: 'Day 1 • 8 Oct', category: 'Meal' },
  { id: 4, title: 'Task Starts', time: '01:30 PM', day: 'Day 1 • 8 Oct', category: 'Hackathon', highlight: true, details: '24-Hour continuous coding sprint begins!' },
  { id: 5, title: 'Refreshment - 1', time: '02:45 PM', day: 'Day 1 • 8 Oct', category: 'Refreshment', details: 'Fresh Juice' },
  { id: 6, title: 'Review - 1', time: '03:30 PM to 04:30 PM', day: 'Day 1 • 8 Oct', category: 'Evaluation', highlight: true, details: 'Problem Statement, Architecture Diagram & Wireframe Prototype' },
  { id: 7, title: 'Refreshment - 2', time: '04:30 PM to 05:00 PM', day: 'Day 1 • 8 Oct', category: 'Refreshment', details: 'Hot Tea & Samosa' },
  { id: 8, title: 'Dinner', time: '07:30 PM to 08:30 PM', day: 'Day 1 • 8 Oct', category: 'Meal', details: 'Dinner Feast for all participants' },
  { id: 9, title: 'Review - 2', time: '09:30 PM to 10:30 PM', day: 'Day 1 • 8 Oct', category: 'Evaluation', highlight: true, details: 'Prototype Implementation, Database Schema & Backend APIs' },
  { id: 10, title: 'Refreshment - 3', time: '11:30 PM', day: 'Day 1 • 8 Oct', category: 'Refreshment', details: 'Late Night Tea & Biscuit' },
  { id: 11, title: 'Review - 3', time: '12:30 AM to 01:30 AM', day: 'Day 2 • 9 Oct', category: 'Evaluation', highlight: true, details: 'Midnight Code Audit, Edge Cases & Deployment Readiness' },
  { id: 12, title: 'Refreshment - 4', time: '06:00 AM', day: 'Day 2 • 9 Oct', category: 'Refreshment', details: 'Sunrise Coffee & Biscuit' },
  { id: 13, title: 'Breakfast', time: '08:00 AM to 09:00 AM', day: 'Day 2 • 9 Oct', category: 'Meal', details: 'Morning Breakfast' },
  { id: 14, title: 'Review - 4 (Final Evaluation)', time: '09:30 AM to 11:30 AM', day: 'Day 2 • 9 Oct', category: 'Evaluation', highlight: true, details: 'Grand Jury Presentation, Pitch Deck & Live Demo' },
  { id: 15, title: 'Prize Distribution', time: '11:45 AM', day: 'Day 2 • 9 Oct', category: 'Valedictory', highlight: true, details: 'Winners Announcement & Cash Prizes Awarding' },
  { id: 16, title: 'Photo Session & Vote of Thanks', time: '12:15 PM', day: 'Day 2 • 9 Oct', category: 'Valedictory' },
];

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
    phase: 'STANDBY', // 'STANDBY', 'IN_PROGRESS', 'PAUSED', 'ENDED'
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
      const revEndMs = activeReview.reviewEndTime ? new Date(activeReview.reviewEndTime).getTime() : endMs;

      // 1. Manually Paused by Jury
      if (activeReview.status === 'PAUSED') {
        const remainingSec = Math.max(0, Math.floor((endMs - now) / 1000));
        const hours = Math.floor(remainingSec / 3600);
        const minutes = Math.floor((remainingSec % 3600) / 60);
        const seconds = remainingSec % 60;
        setTimeLeft({
          hours,
          minutes,
          seconds,
          totalSeconds: remainingSec,
          phase: 'PAUSED',
          progressPercent: 0,
        });
        return;
      }

      // 2. Concluded / Closed (Past Evaluation End Time or marked COMPLETED)
      if (activeReview.status === 'COMPLETED' || now >= revEndMs) {
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
        return;
      }

      // 3. Before Task Start Time (Standby): strictly when now < startMs
      if (now < startMs) {
        // Machi requirement: COUNTDOWN MUST NOT RUN BEFORE START TIME!
        // Display the allocated total task duration (e.g. 02:00:00 for 2-hour task from 01:30 PM to 03:30 PM) on Standby.
        // Digits are STATIC / FROZEN (NOT counting down!).
        const totalDurationSec = Math.max(0, Math.floor((endMs - startMs) / 1000));
        const hours = Math.floor(totalDurationSec / 3600);
        const minutes = Math.floor((totalDurationSec % 3600) / 60);
        const seconds = totalDurationSec % 60;

        setTimeLeft({
          hours,
          minutes,
          seconds,
          totalSeconds: totalDurationSec,
          phase: 'STANDBY',
          progressPercent: 0,
        });
        return;
      }

      // 4. Students Task Coding Sprint: STRICTLY during task window (now >= startMs && now < endMs)
      if (now >= startMs && now < endMs) {
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
          subPhase: 'TASK_CODING',
          progressPercent: progress,
        });

        // Trigger Audio Alerts strictly while active
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

      // 5. Review Jury Evaluation Window: (now >= endMs && now < revEndMs)
      if (now >= endMs && now < revEndMs) {
        const totalRevSec = Math.max(1, Math.floor((revEndMs - endMs) / 1000));
        const remainingRevSec = Math.max(0, Math.floor((revEndMs - now) / 1000));
        const elapsedRevSec = totalRevSec - remainingRevSec;

        const hours = Math.floor(remainingRevSec / 3600);
        const minutes = Math.floor((remainingRevSec % 3600) / 60);
        const seconds = remainingRevSec % 60;
        const progress = Math.min(100, Math.max(0, (elapsedRevSec / totalRevSec) * 100));

        setTimeLeft({
          hours,
          minutes,
          seconds,
          totalSeconds: remainingRevSec,
          phase: 'EVALUATION',
          subPhase: 'REVIEW_EVALUATION',
          progressPercent: progress,
        });
        return;
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

  const getStatusBadge = (status, isCurrentReview, startTime, endTime, reviewEndTime) => {
    const now = Date.now() + serverOffset;
    const startMs = startTime ? new Date(startTime).getTime() : 0;
    const endMs = endTime ? new Date(endTime).getTime() : 0;
    const revEndMs = reviewEndTime ? new Date(reviewEndTime).getTime() : endMs;

    const isTaskLive = startMs && endMs && now >= startMs && now < endMs && status !== 'COMPLETED';
    const isEvaluationLive = endMs && revEndMs && now >= endMs && now < revEndMs && status !== 'COMPLETED';
    const isConcluded = (revEndMs && now >= revEndMs) || status === 'COMPLETED';

    if (isTaskLive) {
      return (
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/50 text-xs font-cinzel font-bold shadow-[0_0_12px_rgba(239,68,68,0.4)] animate-pulse">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>TASK LIVE</span>
        </span>
      );
    }
    if (isEvaluationLive) {
      return (
        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 text-xs font-cinzel font-bold shadow-[0_0_12px_rgba(0,229,255,0.4)] animate-pulse">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>EVALUATION LIVE</span>
        </span>
      );
    }
    if (isConcluded) {
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
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-cinzel font-bold">
        <Clock className="w-3.5 h-3.5" />
        <span>STANDBY</span>
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

  const nowMs = Date.now() + serverOffset;
  const liveReviewNow = allReviews.find((r) => {
    const s = new Date(r.startTime).getTime();
    const revEnd = new Date(r.reviewEndTime || r.endTime).getTime();
    return nowMs >= s && nowMs < revEnd && r.status !== 'COMPLETED';
  });

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
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-6 sm:py-8 flex flex-col justify-center">
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

        {/* TWO CHRONOMETER BOXES: 24-HOUR MASTER CLOCK ON TOP, ACTIVE STAGE TASK/REVIEW CLOCK BELOW */}
        <div className="flex flex-col space-y-6 sm:space-y-8 mb-8">
          {/* BOX 1: 24-HOUR MASTER EXPEDITION CHRONOMETER */}
          <div className="relative w-full bg-gradient-to-b from-[#091522]/95 via-[#061019]/95 to-[#04090f]/95 border-2 border-[#ffd700]/80 rounded-3xl p-5 sm:p-7 md:p-8 shadow-[0_0_50px_rgba(255,215,0,0.18)] flex flex-col justify-between overflow-hidden backdrop-blur-xl">
            {/* Ornate Corner Accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#ffd700] rounded-tl-3xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-[#ffd700] rounded-tr-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-[#ffd700] rounded-bl-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#ffd700] rounded-br-3xl pointer-events-none" />

            <div>
              {/* Header Tag */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
                <div className="inline-flex items-center space-x-2 bg-[#ffd700]/10 border border-[#ffd700]/40 px-3.5 py-1.5 rounded-full">
                  <Anchor className="w-4 h-4 text-[#ffd700] animate-bounce" />
                  <span className="font-cinzel text-xs sm:text-sm font-black tracking-widest text-[#ffd700] uppercase">
                    24-HOUR MASTER MISSION
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {hackathon24h.isLive ? (
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/50 text-xs font-cinzel font-bold shadow-[0_0_12px_rgba(239,68,68,0.4)] animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      <span>24-HR EXPEDITION LIVE</span>
                    </span>
                  ) : hackathon24h.isUpcoming ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-cinzel font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>COMMENCES TODAY 11:30 AM</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-cinzel font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>24-HR FINALE REACHED</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Title & Window */}
              <div className="text-center mb-5 sm:mb-6">
                <h2 className="font-pirate text-2xl sm:text-3xl md:text-4xl text-white tracking-wide mb-2 leading-tight">
                  24-HOUR MASTER EXPEDITION
                </h2>
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#e5c158] font-cinzel">
                  <span className="inline-flex items-center space-x-1.5 bg-[#0e1d2c] px-3 py-1 rounded-lg border border-[#ffd700]/30 font-bold">
                    <Clock className="w-3.5 h-3.5 text-[#00e5ff]" />
                    <span>EXPEDITION WINDOW: 8 OCT 11:30 AM → 9 OCT 11:30 AM</span>
                  </span>
                </div>
              </div>

              {/* Digital Countdown Clock (Hours, Minutes, Seconds) */}
              <div className="mb-5 max-w-4xl mx-auto w-full">
                <div className="grid grid-cols-3 gap-2.5 sm:gap-4 md:gap-6 text-center">
                  {/* Hours Box */}
                  <div className="bg-[#03070c]/90 border border-[#4a381e] hover:border-[#ffd700] rounded-2xl p-3 sm:p-5 md:p-6 shadow-2xl transition-all">
                    <div className="font-pirate text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#ffd700] pirate-gold-title leading-none">
                      {String(hackathon24h.hours).padStart(2, '0')}
                    </div>
                    <div className="font-cinzel text-[10px] sm:text-xs md:text-sm font-bold text-[#cfb07a] tracking-widest uppercase mt-2">
                      HOURS
                    </div>
                  </div>

                  {/* Minutes Box */}
                  <div className="bg-[#03070c]/90 border border-[#4a381e] hover:border-[#ffd700] rounded-2xl p-3 sm:p-5 md:p-6 shadow-2xl transition-all">
                    <div className="font-pirate text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#ffd700] pirate-gold-title leading-none">
                      {String(hackathon24h.minutes).padStart(2, '0')}
                    </div>
                    <div className="font-cinzel text-[10px] sm:text-xs md:text-sm font-bold text-[#cfb07a] tracking-widest uppercase mt-2">
                      MINUTES
                    </div>
                  </div>

                  {/* Seconds Box */}
                  <div className={`bg-[#03070c]/90 rounded-2xl p-3 sm:p-5 md:p-6 transition-all ${
                    hackathon24h.isLive
                      ? 'border-2 border-[#00e5ff]/50 shadow-[0_0_25px_rgba(0,229,255,0.25)]'
                      : 'border border-[#4a381e] hover:border-[#ffd700] shadow-2xl'
                  }`}>
                    <div className={`font-pirate text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-none ${
                      hackathon24h.isLive
                        ? 'text-[#00e5ff] pirate-cyan-glow animate-pulse'
                        : 'text-[#ffd700] pirate-gold-title'
                    }`}>
                      {String(hackathon24h.seconds).padStart(2, '0')}
                    </div>
                    <div className={`font-cinzel text-[10px] sm:text-xs md:text-sm font-bold tracking-widest uppercase mt-2 ${
                      hackathon24h.isLive ? 'text-[#00e5ff]' : 'text-[#cfb07a]'
                    }`}>
                      SECONDS
                    </div>
                  </div>
                </div>

                {/* Status Indicator Label */}
                <div className="text-center mt-3.5 sm:mt-4">
                  <span className={`inline-block font-cinzel font-black text-xs sm:text-sm tracking-widest uppercase px-4 py-1.5 rounded-full border ${
                    hackathon24h.isLive
                      ? 'bg-red-950/60 text-red-300 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse'
                      : hackathon24h.isUpcoming
                      ? 'bg-amber-950/60 text-amber-300 border-amber-500/50'
                      : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
                  }`}>
                    {hackathon24h.isLive && '⚡ MASTER EXPEDITION IN FLIGHT — REMAINING TIME'}
                    {hackathon24h.isUpcoming && '⏸️ MASTER MISSION COMMENCES AT 11:30 AM'}
                    {hackathon24h.isConcluded && '🏁 24-HOUR EXPEDITION FINALE REACHED'}
                  </span>
                </div>
              </div>
            </div>

            <div className="max-w-4xl mx-auto w-full">
              {/* Dynamic 24-Hour Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center text-[10px] sm:text-xs font-mono text-gray-400 mb-1.5">
                  <span>OCT 8, 11:30 AM</span>
                  <span className="text-[#ffd700] font-bold">{Math.round(hackathon24h.progress)}% COMPLETED</span>
                  <span>OCT 9, 11:30 AM (FREEZE)</span>
                </div>
                <div className="h-3.5 w-full bg-[#03070b] border border-[#ffd700]/30 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00e5ff] via-[#ffd700] to-[#ff4500] transition-all duration-1000 shadow-[0_0_12px_#ffd700]"
                    style={{ width: `${hackathon24h.progress}%` }}
                  />
                </div>
              </div>

              {/* Bottom Mission Summary Card */}
              <div className="bg-[#040a12]/80 border border-[#2a3a4d] rounded-xl p-3 sm:p-3.5 text-xs font-cinzel text-gray-300 leading-relaxed flex items-start space-x-2.5">
                <Anchor className="w-4 h-4 text-[#ffd700] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[#ffd700] font-bold uppercase tracking-wider block mb-0.5">Continuous 24-Hour Voyage:</span>
                  <span>Non-stop coding voyage across all 4 stages. Code freeze locks sharp at 11:30 AM tomorrow.</span>
                </div>
              </div>
            </div>
          </div>

          {/* BOX 2: ACTIVE STAGE & TASK CHRONOMETER (DIRECTLY BELOW 24-HOUR MASTER CLOCK) */}
          {activeReview ? (
            <div className="relative w-full bg-gradient-to-b from-[#091522]/95 via-[#061019]/95 to-[#04090f]/95 border-2 border-[#ffd700]/80 rounded-3xl p-5 sm:p-7 md:p-8 shadow-[0_0_50px_rgba(255,215,0,0.18)] flex flex-col justify-between overflow-hidden backdrop-blur-xl">
              {/* Ornate Corner Accents */}
              <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-[#ffd700] rounded-tl-3xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-[#ffd700] rounded-tr-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-[#ffd700] rounded-bl-3xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-[#ffd700] rounded-br-3xl pointer-events-none" />

              <div>
                {/* If inspecting another review while a live review is active */}
                {liveReviewNow && activeReview._id !== liveReviewNow._id && (
                  <div className="mb-3.5 p-2.5 sm:p-3 bg-red-950/80 border-2 border-red-500 rounded-2xl flex flex-wrap items-center justify-between gap-2 shadow-[0_0_20px_rgba(239,68,68,0.3)] max-w-4xl mx-auto w-full">
                    <div className="flex items-center space-x-2 text-xs font-cinzel text-red-200">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                      <span>
                        <strong>{liveReviewNow.title}</strong> is <strong className="text-white uppercase">LIVE NOW</strong>!
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveReview(liveReviewNow)}
                      className="px-2.5 py-1 bg-red-500 hover:bg-red-400 text-black font-cinzel font-black text-xs rounded-lg transition-all cursor-pointer shadow-md"
                    >
                      SWITCH TO LIVE
                    </button>
                  </div>
                )}

                {/* Active Review Header Tag */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 sm:mb-6">
                  <div className="inline-flex items-center space-x-2 bg-[#ffd700]/10 border border-[#ffd700]/40 px-3.5 py-1.5 rounded-full">
                    <Radio className="w-4 h-4 text-[#ffd700] animate-pulse" />
                    <span className="font-cinzel text-xs sm:text-sm font-black tracking-widest text-[#ffd700] uppercase">
                      {timeLeft.phase === 'IN_PROGRESS'
                        ? `ROUND ${String(activeReview.roundNumber || 1).padStart(2, '0')} • TASK SPRINT LIVE`
                        : timeLeft.phase === 'EVALUATION'
                        ? `ROUND ${String(activeReview.roundNumber || 1).padStart(2, '0')} • JURY EVALUATION LIVE`
                        : timeLeft.phase === 'ENDED'
                        ? `ROUND ${String(activeReview.roundNumber || 1).padStart(2, '0')} • CONCLUDED`
                        : `ROUND ${String(activeReview.roundNumber || 1).padStart(2, '0')} • STANDBY SCHEDULE`}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {getStatusBadge(activeReview.status, activeReview.isCurrent, activeReview.startTime, activeReview.endTime, activeReview.reviewEndTime)}
                    {activeReview.extendedMinutes > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold">
                        +{activeReview.extendedMinutes}m EXTENDED
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Title & Venue */}
                <div className="text-center mb-5 sm:mb-6">
                  <h2 className="font-pirate text-2xl sm:text-3xl md:text-4xl text-white tracking-wide mb-2 leading-tight">
                    {activeReview.title}
                  </h2>
                  
                  <div className="flex flex-wrap items-center justify-center gap-2 text-xs sm:text-xs text-[#e5c158] font-cinzel">
                    <span className="inline-flex items-center space-x-1.5 bg-[#0e1d2c] px-3 py-1 rounded-lg border border-[#ffd700]/30 font-bold">
                      <Clock className="w-3.5 h-3.5 text-[#00e5ff]" />
                      <span>TASK: {formatTimeSlot(activeReview.startTime, activeReview.endTime)}</span>
                    </span>

                    {activeReview.reviewEndTime && (
                      <span className="inline-flex items-center space-x-1.5 bg-[#0e1d2c] px-3 py-1 rounded-lg border border-purple-500/30 text-purple-300 font-bold">
                        <Award className="w-3.5 h-3.5 text-purple-400" />
                        <span>EVALUATION: {formatTimeSlot(activeReview.endTime, activeReview.reviewEndTime)}</span>
                      </span>
                    )}
                    
                    {activeReview.venue && (
                      <span className="inline-flex items-center space-x-1.5 bg-[#0e1d2c] px-2.5 py-1 rounded-lg border border-[#ffd700]/30">
                        <MapPin className="w-3 h-3 text-[#ffd700]" />
                        <span>{activeReview.venue}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* DIGITAL COUNTDOWN CLOCK */}
                <div className="mb-5 max-w-4xl mx-auto w-full">
                  <div className="grid grid-cols-3 gap-2.5 sm:gap-4 md:gap-6 text-center">
                    {/* Hours Box */}
                    <div className="bg-[#03070c]/90 border border-[#4a381e] hover:border-[#ffd700] rounded-2xl p-3 sm:p-5 md:p-6 shadow-2xl transition-all">
                      <div className="font-pirate text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#ffd700] pirate-gold-title leading-none">
                        {String(timeLeft.hours).padStart(2, '0')}
                      </div>
                      <div className="font-cinzel text-[10px] sm:text-xs md:text-sm font-bold text-[#cfb07a] tracking-widest uppercase mt-2">
                        HOURS
                      </div>
                    </div>

                    {/* Minutes Box */}
                    <div className="bg-[#03070c]/90 border border-[#4a381e] hover:border-[#ffd700] rounded-2xl p-3 sm:p-5 md:p-6 shadow-2xl transition-all">
                      <div className="font-pirate text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#ffd700] pirate-gold-title leading-none">
                        {String(timeLeft.minutes).padStart(2, '0')}
                      </div>
                      <div className="font-cinzel text-[10px] sm:text-xs md:text-sm font-bold text-[#cfb07a] tracking-widest uppercase mt-2">
                        MINUTES
                      </div>
                    </div>

                    {/* Seconds Box */}
                    <div className={`bg-[#03070c]/90 rounded-2xl p-3 sm:p-5 md:p-6 transition-all ${
                      timeLeft.phase === 'IN_PROGRESS' || timeLeft.phase === 'EVALUATION'
                        ? 'border-2 border-[#00e5ff]/50 shadow-[0_0_25px_rgba(0,229,255,0.25)]'
                        : 'border border-[#4a381e] hover:border-[#ffd700] shadow-2xl'
                    }`}>
                      <div className={`font-pirate text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-none ${
                        timeLeft.phase === 'IN_PROGRESS' || timeLeft.phase === 'EVALUATION'
                          ? 'text-[#00e5ff] pirate-cyan-glow animate-pulse'
                          : 'text-[#ffd700] pirate-gold-title'
                      }`}>
                        {String(timeLeft.seconds).padStart(2, '0')}
                      </div>
                      <div className={`font-cinzel text-[10px] sm:text-xs md:text-sm font-bold tracking-widest uppercase mt-2 ${
                        timeLeft.phase === 'IN_PROGRESS' || timeLeft.phase === 'EVALUATION' ? 'text-[#00e5ff]' : 'text-[#cfb07a]'
                      }`}>
                        {timeLeft.phase === 'STANDBY' ? 'SECONDS (IDLE)' : 'SECONDS'}
                      </div>
                    </div>
                  </div>

                  {/* Status Indicator Label Below Digits */}
                  <div className="text-center mt-3.5 sm:mt-4">
                    <span className={`inline-block font-cinzel font-black text-xs sm:text-sm tracking-widest uppercase px-4 py-1.5 rounded-full border ${
                      timeLeft.phase === 'IN_PROGRESS'
                        ? 'bg-red-950/60 text-red-300 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse'
                        : timeLeft.phase === 'EVALUATION'
                        ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/50 shadow-[0_0_15px_rgba(0,229,255,0.3)] animate-pulse'
                        : timeLeft.phase === 'STANDBY'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                        : timeLeft.phase === 'PAUSED'
                        ? 'bg-amber-950/60 text-amber-300 border-amber-500/50'
                        : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50'
                    }`}>
                      {timeLeft.phase === 'IN_PROGRESS' && '⚡ TASK CODING SPRINT ACTIVE — REMAINING'}
                      {timeLeft.phase === 'EVALUATION' && '⚖️ JURY REVIEW EVALUATION IN PROGRESS'}
                      {timeLeft.phase === 'STANDBY' && `⏸️ COMMENCES AT ${new Date(activeReview.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                      {timeLeft.phase === 'PAUSED' && '⏸️ SPRINT TEMPORARILY SUSPENDED'}
                      {timeLeft.phase === 'ENDED' && '🏁 STAGE CONCLUDED • TIMER CLOSED'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="max-w-4xl mx-auto w-full">
                {/* Dynamic Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center text-[10px] sm:text-xs font-mono text-gray-400 mb-1.5">
                    <span>{timeLeft.phase === 'STANDBY' ? 'TASK STANDBY' : timeLeft.phase === 'EVALUATION' ? 'EVALUATION' : 'SPRINT START'}</span>
                    <span className="text-[#ffd700] font-bold">
                      {timeLeft.phase === 'STANDBY' ? '0% (IDLE)' : `${Math.round(timeLeft.progressPercent)}% ELAPSED`}
                    </span>
                    <span>{timeLeft.phase === 'STANDBY' ? `OPENS AT ${new Date(activeReview.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : timeLeft.phase === 'EVALUATION' ? 'EVALUATION END' : 'DEADLINE FREEZE'}</span>
                  </div>
                  <div className="h-3.5 w-full bg-[#03070b] border border-[#ffd700]/30 rounded-full overflow-hidden p-0.5 shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#ffd700] via-[#f39c12] to-[#ff4500] transition-all duration-1000 shadow-[0_0_12px_#ffd700]"
                      style={{ width: `${timeLeft.phase === 'STANDBY' ? 0 : timeLeft.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Bottom Context Banner */}
                {timeLeft.phase === 'STANDBY' && (
                  <div className="bg-[#120e06] border border-[#ffd700]/30 rounded-xl p-3 sm:p-3.5 text-xs font-cinzel text-gray-300 leading-relaxed flex items-start space-x-2.5">
                    <Clock className="w-4 h-4 text-[#ffd700] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#ffd700] font-bold uppercase tracking-wider block mb-0.5">Task Standby Mode:</span>
                      <span>Students have <strong className="text-white">{Math.round((new Date(activeReview.endTime) - new Date(activeReview.startTime)) / 60000)} mins</strong> allocated. Timer strictly begins at <strong className="text-white">{new Date(activeReview.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>.</span>
                    </div>
                  </div>
                )}

                {timeLeft.phase === 'EVALUATION' && (
                  <div className="bg-[#031520] border border-cyan-500/40 rounded-xl p-3 sm:p-3.5 text-xs font-cinzel text-gray-300 leading-relaxed flex items-start space-x-2.5">
                    <Award className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-cyan-300 font-bold uppercase tracking-wider block mb-0.5">Jury Evaluation Live:</span>
                      <span>Coding sprint complete. Jury panels are evaluating prototypes until <strong className="text-white">{new Date(activeReview.reviewEndTime || activeReview.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>.</span>
                    </div>
                  </div>
                )}

                {timeLeft.phase === 'IN_PROGRESS' && (
                  <div className="bg-[#1c0808] border border-red-500/40 rounded-xl p-3 sm:p-3.5 text-xs font-cinzel text-gray-300 leading-relaxed flex items-start space-x-2.5">
                    <Zap className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-red-300 font-bold uppercase tracking-wider block mb-0.5">Coding Sprint In Flight:</span>
                      <span>Students are actively coding! Complete deliverables before deadline at <strong className="text-white">{new Date(activeReview.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>.</span>
                    </div>
                  </div>
                )}

                {timeLeft.phase === 'ENDED' && (
                  <div className="bg-[#03150d] border border-emerald-500/40 rounded-xl p-3 sm:p-3.5 text-xs font-cinzel text-gray-300 leading-relaxed flex items-start space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-emerald-300 font-bold uppercase tracking-wider block mb-0.5">Stage Concluded:</span>
                      <span>Stage concluded at <strong className="text-white">{new Date(activeReview.reviewEndTime || activeReview.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>. Timer has closed.</span>
                    </div>
                  </div>
                )}

                {/* Jury Live Announcement Marquee / Alert */}
                {activeReview.announcement && (
                  <div className="mt-3 bg-gradient-to-r from-[#1c1206] via-[#2d1b09] to-[#1c1206] border border-[#ffd700] rounded-xl p-3 flex items-start space-x-2.5 shadow-md">
                    <AlertCircle className="w-4 h-4 text-[#ffd700] flex-shrink-0 mt-0.5 animate-bounce" />
                    <p className="font-cinzel text-xs text-white font-semibold leading-relaxed">
                      <strong className="text-[#ffd700] uppercase">ANNOUNCEMENT: </strong>{activeReview.announcement}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#08121a] border border-[#3a2e1d] rounded-3xl p-8 text-center flex flex-col items-center justify-center">
              <Anchor className="w-12 h-12 text-[#ffd700] mb-3" />
              <h3 className="font-pirate text-2xl text-white">NO ACTIVE REVIEW CONFIGURED</h3>
              <p className="font-cinzel text-xs text-gray-400 mt-2">
                The jury admiralty has not designated an active review schedule milestone yet.
              </p>
            </div>
          )}
        </div>

        {/* SCHEDULE TIMELINE: All Hackathon Review Milestones */}
        <section className="mt-4">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-2.5">
              <Clock className="w-5 h-5 text-[#ffd700]" />
              <h3 className="font-cinzel font-black text-base sm:text-xl text-white tracking-wider">
                HACKATHON TASK & REVIEW SCHEDULE
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
                      {getStatusBadge(rev.status, isSelected, rev.startTime, rev.endTime, rev.reviewEndTime)}
                    </div>

                    <h4 className="font-pirate text-lg sm:text-xl text-white mb-2 leading-snug">
                      {rev.title}
                    </h4>

                    <div className="space-y-1.5 text-xs font-cinzel text-gray-300 mb-3">
                      <div className="flex items-center space-x-2 text-[#ffd700]">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="font-bold">Task: {formatTimeSlot(rev.startTime, rev.endTime)}</span>
                      </div>
                      {rev.reviewEndTime && (
                        <div className="flex items-center space-x-2 text-purple-300">
                          <Award className="w-3.5 h-3.5 text-purple-400" />
                          <span>Evaluation: {formatTimeSlot(rev.endTime, rev.reviewEndTime)}</span>
                        </div>
                      )}
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
                    <div className="flex items-center space-x-2.5">
                      {!isSelected && (
                        <button
                          onClick={() => setActiveReview(rev)}
                          className="text-[11px] font-cinzel font-bold text-[#00e5ff] hover:text-white px-2.5 py-1 rounded-lg bg-[#0e2236] hover:bg-[#15344f] border border-[#00e5ff]/40 transition-colors cursor-pointer"
                        >
                          FOCUS CLOCK
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedReviewModal(rev)}
                        className="text-xs font-cinzel font-bold text-[#ffd700] hover:underline flex items-center space-x-1 cursor-pointer"
                      >
                        <span>DETAILS</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* OFFICIAL ESEC MASTER AGENDA (8.10.2026 - 9.10.2026) */}
        <section className="mt-8 bg-[#061019]/90 border border-[#ffd700]/40 rounded-3xl p-5 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#ffd700]/20">
            <div>
              <div className="flex items-center space-x-2 text-[11px] font-mono text-[#00e5ff] uppercase tracking-wider mb-1">
                <span>ERODE SENGUNTHAR ENGINEERING COLLEGE</span>
                <span>•</span>
                <span>DEPT OF IT</span>
              </div>
              <h3 className="font-pirate text-xl sm:text-2xl text-white tracking-wide">
                CODIENYCH 1.0 <span className="text-[#ffd700] pirate-gold-title">OFFICIAL AGENDA TIMELINE</span>
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#ffd700]/10 border border-[#ffd700]/30 text-[#ffd700] text-xs font-mono font-bold self-start sm:self-auto">
              8.10.2026 – 9.10.2026
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {OFFICIAL_AGENDA.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all flex items-start space-x-3.5 ${
                  item.highlight
                    ? 'bg-[#0f1f2e]/90 border-[#ffd700]/50 shadow-[0_0_15px_rgba(255,215,0,0.12)]'
                    : 'bg-[#03080e]/80 border-[#1f3042] text-gray-300'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-mono font-black ${
                  item.highlight ? 'bg-[#ffd700] text-black shadow-md' : 'bg-[#0e1c29] text-gray-400 border border-[#233547]'
                }`}>
                  {String(item.id).padStart(2, '0')}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-xs sm:text-sm font-bold truncate ${item.highlight ? 'text-white' : 'text-gray-200'}`}>
                      {item.title}
                    </h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap ${
                      item.highlight
                        ? 'bg-[#ffd700]/20 text-[#ffd700] border border-[#ffd700]/40'
                        : 'bg-[#0a1520] text-gray-400 border border-[#1b2b3b]'
                    }`}>
                      {item.time}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-cinzel text-gray-400 mt-1">
                    <span>{item.day}</span>
                    <span className="text-[#00e5ff] text-[10px] font-mono">{item.category}</span>
                  </div>

                  {item.details && (
                    <p className="text-[11px] font-cinzel text-[#cfb07a] mt-1 line-clamp-2 leading-relaxed">
                      {item.details}
                    </p>
                  )}
                </div>
              </div>
            ))}
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
