import React, { useEffect, useState, useRef } from 'react';

const InteractiveCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trailingPos, setTrailingPos] = useState({ x: -100, y: -100 });
  const [cursorState, setCursorState] = useState('default'); // 'default' | 'pointer' | 'interactive' | 'secret'
  const [isVisible, setIsVisible] = useState(false);
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let targetX = -100;
    let targetY = -100;
    let currentTrailX = -100;
    let currentTrailY = -100;
    let rafId;

    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setPos({ x: targetX, y: targetY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.closest('[data-cursor-text]')) {
        setCursorState('interactive');
        setCursorText(target.closest('[data-cursor-text]').getAttribute('data-cursor-text'));
      } else if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.cursor-pointer')
      ) {
        setCursorState('pointer');
        setCursorText('');
      } else {
        setCursorState('default');
        setCursorText('');
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    const updateTrail = () => {
      currentTrailX += (targetX - currentTrailX) * 0.22;
      currentTrailY += (targetY - currentTrailY) * 0.22;
      setTrailingPos({ x: currentTrailX, y: currentTrailY });
      rafId = requestAnimationFrame(updateTrail);
    };
    rafId = requestAnimationFrame(updateTrail);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden hidden md:block select-none">
      {/* Outer Cyber Reticle Ring */}
      <div
        className="fixed top-0 left-0 transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${trailingPos.x}px, ${trailingPos.y}px, 0)`,
        }}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 flex items-center justify-center ${
            cursorState === 'pointer'
              ? 'w-12 h-12 border-[#00ff66] bg-[#00ff66]/15 shadow-[0_0_20px_rgba(0,255,102,0.6)] scale-110'
              : cursorState === 'interactive'
              ? 'w-20 h-20 border-[#00ff66] bg-[#050b07]/90 shadow-[0_0_25px_rgba(0,255,102,0.8)] backdrop-blur-md'
              : 'w-8 h-8 border-[#00ff66]/40 bg-transparent'
          }`}
        >
          {cursorState === 'interactive' && cursorText && (
            <span className="font-mono text-[9px] text-[#00ff66] font-bold uppercase tracking-wider text-center px-1 animate-pulse">
              {cursorText}
            </span>
          )}

          {/* Crosshair ticks */}
          {cursorState !== 'interactive' && (
            <>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-[#00ff66]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-1 bg-[#00ff66]" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0.5 bg-[#00ff66]" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-0.5 bg-[#00ff66]" />
            </>
          )}
        </div>
      </div>

      {/* Center Precise Laser Dot */}
      <div
        className="fixed top-0 left-0"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#00ff66] shadow-[0_0_10px_#00ff66]" />
      </div>
    </div>
  );
};

export default InteractiveCursor;
