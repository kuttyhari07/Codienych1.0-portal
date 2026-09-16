import React, { useEffect, useRef, useState } from 'react';

/**
 * Realistic Caribbean Pirate Theme Interactive Cursor
 * Features:
 * - Hand-crafted Antique Pirate Cutlass / Golden Navigation Compass Pointer
 * - Dynamic angle tilt (the blade smoothly aligns with mouse velocity direction)
 * - Fluid ethereal Aztec Gold Ember & Stardust Particle Trail on high-performance Canvas
 * - Realistic Aztec Medallion & Skull crossbones morph on clickable hover
 * - Micro golden nautical shockwave ripple on click
 */
const InteractiveCursor = () => {
  const canvasRef = useRef(null);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [cursorState, setCursorState] = useState('default'); // 'default' | 'hover' | 'active'
  const [bladeAngle, setBladeAngle] = useState(-45); // degrees
  const [isVisible, setIsVisible] = useState(false);

  // Click shockwave ripples
  const [ripples, setRipples] = useState([]);

  useEffect(() => {
    // Disable on mobile/touch screens
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Particle Trail Pool
    const particles = [];
    let lastX = -100;
    let lastY = -100;
    let currentAngle = -45;
    let targetAngle = -45;

    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;
      setPos({ x, y });
      if (!isVisible) setIsVisible(true);

      // Compute velocity & movement direction angle
      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.hypot(dx, dy);

      if (dist > 3) {
        // Angle in degrees (+90 deg offset for cutlass tip alignment)
        const moveAngle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        targetAngle = moveAngle;

        // Spawn realistic Aztec Gold Embers along movement path
        const spawnCount = Math.min(Math.floor(dist / 4), 3);
        for (let i = 0; i < spawnCount; i++) {
          const spreadX = (Math.random() - 0.5) * 6;
          const spreadY = (Math.random() - 0.5) * 6;
          particles.push({
            x: x + spreadX,
            y: y + spreadY,
            vx: (Math.random() - 0.5) * 0.8 - dx * 0.05,
            vy: (Math.random() - 0.5) * 0.8 - dy * 0.05 + 0.3, // slight upward float
            size: Math.random() * 2.8 + 1.2,
            maxLife: Math.random() * 28 + 20,
            life: 0,
            color: Math.random() > 0.3 ? '#ffd700' : Math.random() > 0.5 ? '#ffe680' : '#ff9900',
            twinkle: Math.random() * Math.PI * 2,
          });
        }
      }

      lastX = x;
      lastY = y;
    };

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.cursor-pointer') ||
        target.getAttribute('role') === 'button'
      ) {
        setCursorState('hover');
      } else {
        setCursorState('default');
      }
    };

    const handleMouseDown = (e) => {
      setCursorState('active');

      // Add click shockwave
      const newRipple = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
      };
      setRipples((prev) => [...prev.slice(-4), newRipple]);

      // Burst of gold dust
      for (let i = 0; i < 14; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = Math.random() * 3.5 + 1.5;
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd,
          size: Math.random() * 3.2 + 1.5,
          maxLife: 35,
          life: 0,
          color: Math.random() > 0.4 ? '#ffd700' : '#ffffff',
          twinkle: Math.random() * Math.PI * 2,
        });
      }
    };

    const handleMouseUp = () => {
      setCursorState('hover');
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    // 60FPS High-Performance Particle Animation Loop
    let animId;
    const render = () => {
      animId = requestAnimationFrame(render);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth blade directional rotation
      let diff = targetAngle - currentAngle;
      // Shortest angle wrap
      while (diff < -180) diff += 360;
      while (diff > 180) diff -= 360;
      currentAngle += diff * 0.2;
      setBladeAngle(currentAngle);

      // Update & Draw Golden Embers
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.twinkle += 0.15;

        const progress = p.life / p.maxLife;
        const alpha = Math.max(0, 1 - progress) * (0.6 + Math.sin(p.twinkle) * 0.4);
        const radius = p.size * (1 - progress * 0.4);

        // Golden Spark Glow
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 8;
        ctx.fill();

        // Cross Sparkle Glint on larger particles
        if (p.size > 2.2 && alpha > 0.4) {
          ctx.strokeStyle = '#fff8db';
          ctx.lineWidth = 1;
          const arm = radius * 1.6;
          ctx.beginPath();
          ctx.moveTo(p.x - arm, p.y);
          ctx.lineTo(p.x + arm, p.y);
          ctx.moveTo(p.x, p.y - arm);
          ctx.lineTo(p.x, p.y + arm);
          ctx.stroke();
        }
        ctx.restore();
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden select-none hidden md:block">
      {/* HTML5 Canvas for Fluid Gold Embers */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Click Shockwave Nautical Ripples */}
      {ripples.map((rip) => (
        <div
          key={rip.id}
          onAnimationEnd={() => setRipples((prev) => prev.filter((r) => r.id !== rip.id))}
          className="fixed pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#ffd700] animate-ping"
          style={{
            left: rip.x,
            top: rip.y,
            width: '32px',
            height: '32px',
            boxShadow: '0 0 25px #ffd700',
            animationDuration: '0.65s',
          }}
        />
      ))}

      {/* THE PIRATE CURSOR (Smooth Cutlass / Aztec Gold Medallion) */}
      <div
        className="fixed top-0 left-0 pointer-events-none transition-transform duration-75 ease-out"
        style={{
          transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        }}
      >
        {cursorState === 'default' && (
          /* REALISTIC PIRATE CUTLASS / ANCIENT DAGGER */
          <div
            className="relative -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out"
            style={{
              transform: `rotate(${bladeAngle}deg) scale(0.92)`,
              filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8)) drop-shadow(0 0 10px rgba(255,215,0,0.5))',
            }}
          >
            <svg width="34" height="46" viewBox="0 0 34 46" fill="none">
              <defs>
                {/* Forged Steel Blade Gradient with Light Shimmer */}
                <linearGradient id="bladeSteel" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="35%" stopColor="#e2e8f0" />
                  <stop offset="70%" stopColor="#94a3b8" />
                  <stop offset="100%" stopColor="#475569" />
                </linearGradient>

                {/* Aztec Gold Hilt & Basket Guard */}
                <linearGradient id="goldHilt" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fff2a3" />
                  <stop offset="50%" stopColor="#ffd700" />
                  <stop offset="100%" stopColor="#b8860b" />
                </linearGradient>

                {/* Ruby Pommel Gem */}
                <radialGradient id="rubyPommel" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ff4d4d" />
                  <stop offset="70%" stopColor="#b30000" />
                  <stop offset="100%" stopColor="#4d0000" />
                </radialGradient>
              </defs>

              {/* Curved Cutlass Blade with Sharp Tip at top (17, 2) */}
              <path
                d="M 17 2 C 18 10, 20 22, 18 30 L 16 30 C 14 22, 16 10, 17 2 Z"
                fill="url(#bladeSteel)"
                stroke="#1e293b"
                strokeWidth="0.8"
              />

              {/* Blade Center Fuller Line */}
              <line x1="17" y1="8" x2="17" y2="28" stroke="#cbd5e1" strokeWidth="0.7" />

              {/* Pirate Cutlass Curved Brass Crossguard */}
              <path
                d="M 10 30 C 13 28, 21 28, 24 30 C 25 31, 23 33, 17 33 C 11 33, 9 31, 10 30 Z"
                fill="url(#goldHilt)"
                stroke="#78350f"
                strokeWidth="0.6"
              />

              {/* Leather Wrapped Grip */}
              <rect x="15.5" y="32" width="3" height="7" rx="1" fill="#3e2410" stroke="#ffd700" strokeWidth="0.4" />

              {/* Pirate Gold Skull / Ruby Pommel Cap */}
              <circle cx="17" cy="41" r="2.8" fill="url(#rubyPommel)" stroke="url(#goldHilt)" strokeWidth="0.8" />
            </svg>
          </div>
        )}

        {cursorState === 'hover' && (
          /* INTERACTIVE AZTEC GOLD MEDALLION & NAUTICAL HELM ON HOVER */
          <div
            className="relative -translate-x-1/2 -translate-y-1/2 animate-spin"
            style={{
              animationDuration: '14s',
              filter: 'drop-shadow(0 0 16px rgba(255,215,0,0.85)) drop-shadow(0 0 28px rgba(255,215,0,0.4))',
            }}
          >
            <svg width="46" height="46" viewBox="0 0 46 46">
              <defs>
                <linearGradient id="aztecCoinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fff8db" />
                  <stop offset="35%" stopColor="#ffd700" />
                  <stop offset="75%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#8a6015" />
                </linearGradient>

                <radialGradient id="centerRubyGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ff4444" />
                  <stop offset="60%" stopColor="#990000" />
                  <stop offset="100%" stopColor="#220000" />
                </radialGradient>
              </defs>

              {/* Outer Nautical Ship Helm Spokes */}
              <circle cx="23" cy="23" r="18" fill="none" stroke="url(#aztecCoinGrad)" strokeWidth="2.2" />
              <circle cx="23" cy="23" r="14" fill="rgba(20, 10, 3, 0.75)" stroke="#ffd700" strokeWidth="1" strokeDasharray="3 3" />

              {/* 8 Ship Helm Handles / Cardinal Spokes */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                const rad = (angle * Math.PI) / 180;
                const x1 = 23 + Math.cos(rad) * 14;
                const y1 = 23 + Math.sin(rad) * 14;
                const x2 = 23 + Math.cos(rad) * 21.5;
                const y2 = 23 + Math.sin(rad) * 21.5;
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="url(#aztecCoinGrad)"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                );
              })}

              {/* Center Skull Emblem / Jewel Core */}
              <circle cx="23" cy="23" r="4.2" fill="url(#centerRubyGlow)" stroke="#ffd700" strokeWidth="1.2" />
              <circle cx="23" cy="23" r="1.5" fill="#ffd700" />
            </svg>
          </div>
        )}

        {cursorState === 'active' && (
          /* ON CLICK / ACTIVE RECOIL */
          <div
            className="relative -translate-x-1/2 -translate-y-1/2 scale-125 transition-transform duration-100"
            style={{
              filter: 'drop-shadow(0 0 20px #ffd700)',
            }}
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#ffd700] to-[#ff9900] border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[#8a1c1c]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveCursor;
