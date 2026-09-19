import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const BgmContext = createContext(null);

export const BgmProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Single shared audio instance for seamless background playback
    const audio = new Audio('/pirates-of-caribbean-theme.mp3');
    audio.loop = true;
    audio.volume = 0.18; // Mild, subtle ambient volume as requested
    audioRef.current = audio;

    const tryPlay = () => {
      if (localStorage.getItem('codienych_bgm_off') === 'true') {
        setIsPlaying(false);
        return;
      }
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Autoplay restricted until user gesture
          setIsPlaying(false);
        });
    };

    tryPlay();

    // Fallback on first user gesture anywhere on the window (click, tap, key, scroll)
    const handleFirstGesture = () => {
      if (audio.paused && localStorage.getItem('codienych_bgm_off') !== 'true') {
        audio.play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    };

    window.addEventListener('click', handleFirstGesture, { once: true });
    window.addEventListener('touchstart', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    window.addEventListener('scroll', handleFirstGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
      window.removeEventListener('scroll', handleFirstGesture);
      audio.pause();
    };
  }, []);

  const toggleBgm = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused) {
      audio.pause();
      setIsPlaying(false);
      localStorage.setItem('codienych_bgm_off', 'true');
    } else {
      audio.play()
        .then(() => {
          setIsPlaying(true);
          localStorage.removeItem('codienych_bgm_off');
        })
        .catch((err) => {
          console.warn('Audio play failed:', err);
        });
    }
  };

  return (
    <BgmContext.Provider value={{ isPlaying, toggleBgm }}>
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
