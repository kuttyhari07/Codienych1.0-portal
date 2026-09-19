import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const BgmContext = createContext(null);

export const BgmProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const userPausedRef = useRef(false);

  useEffect(() => {
    // Clear any previous stored mute so BGM always plays by default on visit/refresh
    try {
      localStorage.removeItem('codienych_bgm_off');
      localStorage.removeItem('codienych_bgm_user_paused');
      localStorage.removeItem('codienych_bgm_enabled');
    } catch (e) {}

    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.22; // Mild ambient volume as requested
    audio.loop = true;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    // Play function
    const playAudio = () => {
      if (userPausedRef.current) return;
      audio.volume = 0.22;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Autoplay policy prevented immediate playback without user interaction
            setIsPlaying(false);
          });
      }
    };

    // 1. Immediate play on mount
    playAudio();

    // 2. Browser autoplay fallback: play on first interaction anywhere
    const triggerPlayOnGesture = () => {
      if (!userPausedRef.current && audio.paused) {
        playAudio();
      }
    };

    const gestureEvents = ['pointerdown', 'mousedown', 'touchstart', 'touchend', 'click', 'keydown', 'wheel'];
    gestureEvents.forEach((evt) => {
      window.addEventListener(evt, triggerPlayOnGesture, { passive: true });
      document.addEventListener(evt, triggerPlayOnGesture, { passive: true });
    });

    return () => {
      gestureEvents.forEach((evt) => {
        window.removeEventListener(evt, triggerPlayOnGesture);
        document.removeEventListener(evt, triggerPlayOnGesture);
      });
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

  const toggleBgm = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      // User explicitly wants to turn it OFF
      userPausedRef.current = true;
      audio.pause();
      setIsPlaying(false);
    } else {
      // User explicitly wants to turn it back ON
      userPausedRef.current = false;
      audio.volume = 0.22;
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.warn('BGM play failed:', err));
    }
  };

  return (
    <BgmContext.Provider value={{ isPlaying, toggleBgm }}>
      {/* Real DOM audio element with autoPlay and loop */}
      <audio
        ref={audioRef}
        src="/pirates-of-caribbean-theme.mp3"
        autoPlay
        loop
        playsInline
        preload="auto"
      />
      {children}
    </BgmContext.Provider>
  );
};

export const useBgm = () => {
  const context = useContext(BgmContext);
  if (!context) {
    return { isPlaying: false, toggleBgm: () => {} };
  }
  return context;
};

export default BgmContext;
