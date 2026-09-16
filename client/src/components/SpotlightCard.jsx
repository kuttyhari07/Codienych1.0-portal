import React, { useRef, useState } from 'react';
import { playLaserBlip } from '../utils/cyberSound';

const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'rgba(229, 193, 88, 0.2)',
  borderColor = 'border-[#5a4422] hover:border-[#ffd700]',
}) => {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
    playLaserBlip();
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative rounded-2xl bg-[#08121a]/95 border ${borderColor} overflow-hidden transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-[0_0_30px_rgba(229,193,88,0.22)] hud-corner-box ${className}`}
    >
      {/* Radial Cursor Flashlight Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 rounded-2xl"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 60%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default SpotlightCard;
