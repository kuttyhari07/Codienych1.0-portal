import React, { useEffect, useRef, useState } from 'react';

// Procedural SVG pirate artwork for each section
const sceneArtwork = {
  home: {
    title: 'CAPTAIN JACK SPARROW & THE BLACK PEARL',
    svg: (
      <svg className="w-full h-full opacity-30 pointer-events-none" viewBox="0 0 1000 1000" fill="none">
        <defs>
          <radialGradient id="homeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#e5c158" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#00e5ff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#03070b" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="500" cy="400" r="340" fill="url(#homeGlow)" />
        {/* Ancient Compass Rose Watermark */}
        <circle cx="500" cy="400" r="280" stroke="#e5c158" strokeWidth="1.5" strokeDasharray="12,8" opacity="0.4" />
        <circle cx="500" cy="400" r="210" stroke="#00e5ff" strokeWidth="1" strokeDasharray="4,8" opacity="0.3" />
        <polygon points="500,160 520,380 500,400 480,380" fill="#e5c158" opacity="0.5" />
        <polygon points="500,640 520,420 500,400 480,420" fill="#b8860b" opacity="0.5" />
        <polygon points="740,400 520,420 500,400 520,380" fill="#e5c158" opacity="0.5" />
        <polygon points="260,400 480,420 500,400 480,380" fill="#b8860b" opacity="0.5" />
      </svg>
    ),
  },
  about: {
    title: 'PIRATES CAPTAIN HELM & CUTLASSES',
    svg: (
      <svg className="w-full h-full opacity-25" viewBox="0 0 1000 1000" fill="none">
        <circle cx="500" cy="500" r="220" stroke="#e5c158" strokeWidth="6" />
        <circle cx="500" cy="500" r="140" stroke="#d4af37" strokeWidth="3" />
        <circle cx="500" cy="500" r="50" fill="#e5c158" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1="500"
            y1="500"
            x2={500 + 290 * Math.cos((deg * Math.PI) / 180)}
            y2={500 + 290 * Math.sin((deg * Math.PI) / 180)}
            stroke="#e5c158"
            strokeWidth="6"
            strokeLinecap="round"
          />
        ))}
      </svg>
    ),
  },
  dates: {
    title: 'NAUTICAL CHRONOMETER & ANCHOR',
    svg: (
      <svg className="w-full h-full opacity-25" viewBox="0 0 1000 1000" fill="none">
        <circle cx="500" cy="500" r="300" stroke="#e5c158" strokeWidth="2" strokeDasharray="15,10" />
        <circle cx="500" cy="500" r="220" stroke="#00e5ff" strokeWidth="1" />
        <circle cx="500" cy="300" r="35" stroke="#e5c158" strokeWidth="6" />
        <line x1="500" y1="335" x2="500" y2="720" stroke="#e5c158" strokeWidth="8" strokeLinecap="round" />
        <line x1="400" y1="420" x2="600" y2="420" stroke="#e5c158" strokeWidth="8" strokeLinecap="round" />
        <path d="M320 620 Q500 820 680 620" stroke="#e5c158" strokeWidth="12" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  countdown: {
    title: 'CARIBBEAN LIGHTNING & STORM SEAS',
    svg: (
      <svg className="w-full h-full opacity-30" viewBox="0 0 1000 1000" fill="none">
        <path d="M520 60 L440 380 L560 400 L380 920" stroke="#00e5ff" strokeWidth="6" strokeLinecap="round" filter="drop-shadow(0 0 15px #00e5ff)" />
        <path d="M620 140 L560 340 L650 360 L500 780" stroke="#e5c158" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
      </svg>
    ),
  },
  prizes: {
    title: 'CURSED AZTEC GOLD COINS & TREASURE CHEST',
    svg: (
      <svg className="w-full h-full opacity-30" viewBox="0 0 1000 1000" fill="none">
        <circle cx="500" cy="500" r="280" stroke="#ffd700" strokeWidth="4" strokeDasharray="10,6" />
        <circle cx="500" cy="500" r="230" fill="#140d04" stroke="#e5c158" strokeWidth="3" opacity="0.6" />
      </svg>
    ),
  },
  timeline: {
    title: 'BLACK PEARL EXPEDITION VOYAGE',
    svg: (
      <svg className="w-full h-full opacity-25" viewBox="0 0 1000 1000" fill="none">
        <path d="M150 800 Q350 400 500 250 T850 800" stroke="#e5c158" strokeWidth="3" strokeDasharray="14,10" />
      </svg>
    ),
  },
};

const sectionIds = [
  'home',
  'about',
  'dates',
  'countdown',
  'prizes',
  'entertainment',
  'problem-statement',
  'team-rules',
  'hackathon-rules',
  'timeline',
  'faq',
  'contact',
];

const CinematicBackground = () => {
  const [activeScene, setActiveScene] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const canvasRef = useRef(null);

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver for section transitions
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && sectionIds.includes(entry.target.id)) {
            setActiveScene(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -20% 0px', threshold: 0.1 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Lightning, Sea Sparks & Gold Doubloons Canvas Particle Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Glowing Aztec gold embers & sea mist particles
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.6,
      speedY: Math.random() * 0.6 + 0.2,
      speedX: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.6 + 0.2,
      isGold: Math.random() > 0.35,
    }));

    let lightningTimer = 0;
    let lightningFlash = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle atmospheric ocean depth gradient that lets the background photo shine through
      const grad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height * 0.45,
        150,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.85
      );
      grad.addColorStop(0, 'rgba(6, 20, 32, 0.15)');
      grad.addColorStop(0.7, 'rgba(3, 8, 14, 0.45)');
      grad.addColorStop(1, 'rgba(2, 5, 8, 0.75)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Atmospheric Caribbean Storm Lightning
      lightningTimer++;
      if (lightningTimer > 220 && Math.random() > 0.95) {
        lightningFlash = 0.85;
        lightningTimer = 0;
      }
      if (lightningFlash > 0) {
        ctx.fillStyle = `rgba(0, 229, 255, ${lightningFlash * 0.18})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        lightningFlash -= 0.04;
      }

      // Render Floating Embers & Aztec Gold Sparks
      particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.isGold ? '#e5c158' : '#00e5ff';
        ctx.shadowColor = p.isGold ? '#ffd700' : '#00e5ff';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        p.y -= p.speedY;
        p.x += p.speedX;
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* Top Gold & Cyan Scroll Progress Indicator Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#1c150c] z-50">
        <div
          className="h-full bg-gradient-to-r from-[#e5c158] via-[#ffd700] to-[#00e5ff] transition-all duration-150 shadow-[0_0_12px_#e5c158]"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Hero Image Backdrop (Jack Sparrow + Black Pearl + Lightning + Nautical Chart) */}
      <div className="absolute inset-0 bg-[#02060a]">
        {/* Desktop / Landscape View */}
        <img
          src="/pirates-hero-bg-upright.jpg"
          alt="Jack Sparrow Pirates of the Caribbean Background"
          className="w-full h-full object-cover object-center opacity-70 md:opacity-75 scale-105 transition-transform duration-1000 ease-out"
          style={{
            transform: `scale(${1.02 + scrollProgress * 0.05}) translateY(${-scrollProgress * 25}px)`,
          }}
        />
        {/* Balanced Vignette Overlays for Maximum Contrast & Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#02060a]/50 via-[#02060a]/30 to-[#02060a]/80 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#02060a]/75 via-transparent to-[#02060a]/75 pointer-events-none" />
      </div>

      {/* Dynamic Lightning & Gold Spark Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Sticky Pirate Theme Artwork Overlays */}
      <div className="absolute inset-0 flex items-center justify-center">
        {sectionIds.map((id) => {
          const isActive = activeScene === id;
          const scene = sceneArtwork[id] || sceneArtwork.home;

          return (
            <div
              key={id}
              className={`absolute inset-0 flex items-center justify-center p-6 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                isActive ? 'opacity-100 blur-0 z-10' : 'opacity-0 blur-sm z-0'
              }`}
            >
              <div className="w-full max-w-4xl h-[70vh] flex items-center justify-center">
                {scene.svg}
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtle Nautical Map Chart Grid */}
      <div className="absolute inset-0 hex-grid-overlay opacity-20" />
      <div className="absolute inset-0 scanline-bg opacity-15" />
    </div>
  );
};

export default CinematicBackground;
