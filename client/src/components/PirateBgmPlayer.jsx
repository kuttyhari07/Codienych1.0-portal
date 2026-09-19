import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Volume2, VolumeX, Play, Pause, Disc, Music, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { playLaserBlip } from '../utils/cyberSound';

const BGM_SRC = '/pirates-of-caribbean-theme.mp3';

const PirateBgmPlayer = () => {
  const location = useLocation();
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('codienych_bgm_volume');
    return saved !== null ? parseFloat(saved) : 0.35;
  });
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('codienych_bgm_muted') === 'true';
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showPrompt, setShowPrompt] = useState(true);

  // Hide on admin routes
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;
    audio.loop = true;

    // Check saved preference
    const savedDisabled = localStorage.getItem('codienych_bgm_enabled') === 'false';

    const tryAutoPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        setHasInteracted(true);
        setShowPrompt(false);
      } catch (err) {
        // Autoplay blocked by browser policy until user gesture
        setIsPlaying(false);
      }
    };

    if (!savedDisabled && !isAdminRoute) {
      tryAutoPlay();

      // Trigger on first click / touch / key press anywhere on page
      const handleFirstGesture = () => {
        const currentAudio = audioRef.current;
        if (currentAudio && currentAudio.paused && localStorage.getItem('codienych_bgm_enabled') !== 'false') {
          currentAudio.play()
            .then(() => {
              setIsPlaying(true);
              setHasInteracted(true);
              setShowPrompt(false);
            })
            .catch(() => {});
        }
      };

      window.addEventListener('click', handleFirstGesture, { once: true });
      window.addEventListener('touchstart', handleFirstGesture, { once: true });
      window.addEventListener('keydown', handleFirstGesture, { once: true });

      return () => {
        window.removeEventListener('click', handleFirstGesture);
        window.removeEventListener('touchstart', handleFirstGesture);
        window.removeEventListener('keydown', handleFirstGesture);
      };
    }
  }, [isAdminRoute]);

  // Pause when navigating to admin, resume when back to public
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isAdminRoute) {
      if (!audio.paused) {
        audio.pause();
        setIsPlaying(false);
      }
    }
  }, [isAdminRoute]);

  // Handle play / pause toggle
  const togglePlay = () => {
    playLaserBlip();
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      localStorage.setItem('codienych_bgm_enabled', 'false');
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          setHasInteracted(true);
          setShowPrompt(false);
          localStorage.setItem('codienych_bgm_enabled', 'true');
        })
        .catch((err) => {
          console.warn('Audio play prevented:', err);
        });
    }
  };

  // Handle Mute toggle
  const toggleMute = (e) => {
    e.stopPropagation();
    playLaserBlip();
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
      localStorage.setItem('codienych_bgm_muted', 'false');
    } else {
      audio.volume = 0;
      setIsMuted(true);
      localStorage.setItem('codienych_bgm_muted', 'true');
    }
  };

  // Handle Volume Change
  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    localStorage.setItem('codienych_bgm_volume', newVol.toString());
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
      localStorage.setItem('codienych_bgm_muted', 'false');
    }
  };

  if (isAdminRoute) return null;

  return (
    <>
      <audio ref={audioRef} src={BGM_SRC} preload="auto" />

      {/* Floating Pirate BGM Player */}
      <div className="fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-40 select-none">
        {/* First-time prompt bubble if not yet playing */}
        <AnimatePresence>
          {!isPlaying && showPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.9 }}
              onClick={togglePlay}
              className="mb-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#1c1208] via-[#2a1708] to-[#1c1208] border border-[#ffd700] text-[#ffd700] shadow-[0_0_20px_rgba(255,215,0,0.5)] cursor-pointer flex items-center space-x-2 text-[10px] sm:text-xs font-cinzel font-bold tracking-wider animate-pulse backdrop-blur-md"
            >
              <Music className="w-3.5 h-3.5 text-[#ffd700]" />
              <span>🎵 TAP TO PLAY PIRATE BGM</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Player Bar */}
        <div className="relative group bg-[#091522]/95 border-2 border-[#ffd700] p-2 sm:p-2.5 rounded-2xl shadow-[0_0_25px_rgba(255,215,0,0.4)] backdrop-blur-md flex items-center space-x-2.5 sm:space-x-3 transition-all duration-300">
          {/* Spinning Pirate Medallion / Disc */}
          <button
            type="button"
            onClick={togglePlay}
            title={isPlaying ? 'Pause Pirate BGM' : 'Play Pirate BGM'}
            className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#ffd700] via-[#f39c12] to-[#b8860b] p-0.5 shadow-[0_0_15px_rgba(255,215,0,0.5)] flex items-center justify-center flex-shrink-0 cursor-pointer group-hover:scale-105 transition-transform"
          >
            <div
              className={`w-full h-full rounded-full bg-[#070e17] flex items-center justify-center relative overflow-hidden ${
                isPlaying ? 'animate-spin' : ''
              }`}
              style={{ animationDuration: '6s' }}
            >
              {/* Disc grooves */}
              <div className="absolute inset-1 rounded-full border border-[#ffd700]/30" />
              <div className="absolute inset-2 rounded-full border border-[#ffd700]/20" />
              <img
                src="/pirate-skeleton-face.png"
                alt="Pirate Medallion"
                className="w-5 h-5 sm:w-6 sm:h-6 object-contain rounded-full"
              />
            </div>

            {/* Center Play/Pause Overlay Icon */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
              {isPlaying ? (
                <Pause className="w-4 h-4 text-[#ffd700] fill-[#ffd700]" />
              ) : (
                <Play className="w-4 h-4 text-[#ffd700] fill-[#ffd700] ml-0.5" />
              )}
            </div>
          </button>

          {/* Track Info & Equalizer */}
          <div className="flex flex-col cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
            <div className="flex items-center space-x-1.5">
              <span className="font-cinzel text-[9px] sm:text-[10px] text-[#ffd700] font-black uppercase tracking-widest flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] animate-ping" />
                <span>PIRATE BGM</span>
              </span>
              <span className="text-[10px] text-gray-500">•</span>
              <span className="font-mono text-[9px] text-gray-400">
                {isPlaying ? 'PLAYING' : 'PAUSED'}
              </span>
            </div>

            <div className="flex items-center space-x-2 mt-0.5">
              <span className="font-pirate text-xs sm:text-sm text-white tracking-wider truncate max-w-[110px] sm:max-w-[140px] drop-shadow-sm">
                Pirates of Caribbean
              </span>

              {/* Animated Equalizer Wave Bars */}
              <div className="flex items-end space-x-0.5 h-4">
                <span
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isPlaying ? 'bg-[#ffd700] animate-eq-1' : 'bg-gray-600 h-1'
                  }`}
                />
                <span
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isPlaying ? 'bg-[#ffd700] animate-eq-2' : 'bg-gray-600 h-1.5'
                  }`}
                />
                <span
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isPlaying ? 'bg-[#00e5ff] animate-eq-3' : 'bg-gray-600 h-1'
                  }`}
                />
                <span
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isPlaying ? 'bg-[#ffd700] animate-eq-4' : 'bg-gray-600 h-2'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Primary Action Buttons: Play/Pause, Mute, Volume Expand */}
          <div className="flex items-center space-x-1 pl-1 border-l border-[#ffd700]/30">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              title={isPlaying ? 'Pause' : 'Play'}
              className="p-1.5 rounded-lg bg-[#142334] hover:bg-[#ffd700] text-[#ffd700] hover:text-black transition-all cursor-pointer shadow-sm active:scale-95"
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </button>

            {/* Mute/Unmute Button */}
            <button
              type="button"
              onClick={toggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
              className="p-1.5 rounded-lg bg-[#142334] hover:bg-[#ffd700] text-[#ffd700] hover:text-black transition-all cursor-pointer shadow-sm active:scale-95"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5" />
              ) : (
                <Volume2 className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Expand / Volume Toggle */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? 'Collapse controls' : 'Adjust volume'}
              className="p-1 text-gray-400 hover:text-[#ffd700] transition-colors cursor-pointer"
            >
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expandable Volume Slider Popover */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="mt-2 p-3 bg-[#08121a]/98 border border-[#ffd700]/70 rounded-xl shadow-[0_0_20px_rgba(255,215,0,0.3)] backdrop-blur-md max-w-xs"
            >
              <div className="flex items-center justify-between font-cinzel text-[10px] text-[#ffd700] mb-1.5 font-bold">
                <span>BGM VOLUME</span>
                <span>{Math.round((isMuted ? 0 : volume) * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-1.5 bg-[#1a2c3d] rounded-lg appearance-none cursor-pointer accent-[#ffd700]"
              />
              <div className="flex justify-between font-mono text-[9px] text-gray-400 mt-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default PirateBgmPlayer;
