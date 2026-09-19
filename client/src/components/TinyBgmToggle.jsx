import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useBgm } from '../context/BgmContext';
import { playLaserBlip } from '../utils/cyberSound';

const TinyBgmToggle = ({ className = '' }) => {
  const { isPlaying, toggleBgm } = useBgm();

  const handleClick = (e) => {
    e.stopPropagation();
    playLaserBlip();
    toggleBgm();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={isPlaying ? 'BGM: Playing (Click to Turn Off)' : 'BGM: Off (Click to Turn On)'}
      aria-label={isPlaying ? 'Mute Background Music' : 'Play Background Music'}
      className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#08121a]/90 hover:bg-[#121e2c] border border-[#ffd700]/50 hover:border-[#ffd700] text-[#ffd700] shadow-[0_0_15px_rgba(255,215,0,0.25)] hover:shadow-[0_0_20px_rgba(255,215,0,0.6)] transition-all duration-300 flex items-center justify-center cursor-pointer active:scale-90 select-none z-50 backdrop-blur-md group ${className}`}
    >
      {isPlaying ? (
        <div className="relative flex items-center justify-center">
          <Volume2 className="w-4 h-4 text-[#ffd700] group-hover:scale-110 transition-transform" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#ffd700] rounded-full animate-ping" />
        </div>
      ) : (
        <VolumeX className="w-4 h-4 text-gray-400 group-hover:text-[#ffd700] transition-colors" />
      )}
    </button>
  );
};

export default TinyBgmToggle;
