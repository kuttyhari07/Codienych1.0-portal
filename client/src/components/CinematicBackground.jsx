import React, { useEffect, useRef, useState } from 'react';

// Procedural SVG character & scene overlays for each section
const sceneArtwork = {
  home: {
    title: 'MYSTERIOUS HERO SILHOUETTE',
    svg: (
      <svg className="w-full h-full opacity-45" viewBox="0 0 1000 1000" fill="none">
        <defs>
          <radialGradient id="homeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#00ff66" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#050b07" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="500" cy="400" r="320" fill="url(#homeGlow)" />
        {/* Superhero Cape & Pose Silhouette */}
        <path d="M500 220 L450 320 L380 500 L440 850 L560 850 L620 500 L550 320 Z" fill="#030805" stroke="#10b981" strokeWidth="2.5" />
        <circle cx="500" cy="200" r="45" fill="#05140b" stroke="#00ff66" strokeWidth="3.5" />
        <path d="M470 200 L530 200" stroke="#00ff66" strokeWidth="4" />
        {/* Energy Aura Rays */}
        <path d="M500 150 L500 50 M350 200 L250 120 M650 200 L750 120" stroke="#00ff66" strokeWidth="2" strokeDasharray="5,5" opacity="0.7" />
      </svg>
    ),
  },
  about: {
    title: 'FUTURISTIC HERO SHIELD',
    svg: (
      <svg className="w-full h-full opacity-40" viewBox="0 0 1000 1000" fill="none">
        <polygon points="500,150 750,300 700,750 500,900 300,750 250,300" fill="#06160c" stroke="#00ff66" strokeWidth="4" />
        <polygon points="500,220 680,330 640,690 500,800 360,690 320,330" fill="#040c07" stroke="#10b981" strokeWidth="2" />
        <circle cx="500" cy="510" r="120" fill="#0a2013" stroke="#00ff66" strokeWidth="3" />
        <path d="M440 510 L560 510 M500 450 L500 570" stroke="#00ff66" strokeWidth="6" strokeLinecap="round" />
      </svg>
    ),
  },
  dates: {
    title: 'CHRONO GUARDIAN SILHOUETTE',
    svg: (
      <svg className="w-full h-full opacity-40" viewBox="0 0 1000 1000" fill="none">
        <circle cx="500" cy="500" r="350" stroke="#00ff66" strokeWidth="2" strokeDasharray="15,10" opacity="0.6" />
        <circle cx="500" cy="500" r="260" stroke="#10b981" strokeWidth="1.5" />
        <path d="M500 240 L500 500 L680 500" stroke="#00ff66" strokeWidth="5" strokeLinecap="round" />
        <path d="M500 350 L300 480 L180 320 L280 650 L460 580 Z" fill="#05140b" stroke="#10b981" />
        <path d="M500 350 L700 480 L820 320 L720 650 L540 580 Z" fill="#05140b" stroke="#10b981" />
      </svg>
    ),
  },
  countdown: {
    title: 'LIGHTNING & STORM HERO',
    svg: (
      <svg className="w-full h-full opacity-45" viewBox="0 0 1000 1000" fill="none">
        <path d="M500 50 L420 380 L520 400 L380 900" stroke="#00ff66" strokeWidth="8" strokeLinecap="round" />
        <path d="M600 120 L540 320 L620 340 L480 750" stroke="#10b981" strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        <circle cx="500" cy="400" r="180" fill="#00ff66" fillOpacity="0.12" />
      </svg>
    ),
  },
  treasure: {
    title: 'VAULT GUARDIAN CHARACTER',
    svg: (
      <svg className="w-full h-full opacity-40" viewBox="0 0 1000 1000" fill="none">
        <rect x="250" y="250" width="500" height="500" rx="40" fill="#05160c" stroke="#00ff66" strokeWidth="4" />
        <circle cx="500" cy="500" r="160" fill="#082213" stroke="#10b981" strokeWidth="3" />
        <path d="M500 340 L500 660 M340 500 L660 500 M380 380 L620 620 M620 380 L380 620" stroke="#00ff66" strokeWidth="2" strokeDasharray="8,8" />
      </svg>
    ),
  },
  'prize-reveal': {
    title: 'SUPERHERO TEAM SCENE',
    svg: (
      <svg className="w-full h-full opacity-45" viewBox="0 0 1000 1000" fill="none">
        <path d="M500 300 L430 450 L420 850 L580 850 L570 450 Z" fill="#061a0e" stroke="#00ff66" strokeWidth="3" />
        <path d="M300 400 L250 520 L240 850 L360 850 L350 520 Z" fill="#041009" stroke="#10b981" strokeWidth="2" />
        <path d="M700 400 L650 520 L640 850 L760 850 L750 520 Z" fill="#041009" stroke="#10b981" strokeWidth="2" />
        <circle cx="500" cy="270" r="35" fill="#051a0e" stroke="#00ff66" strokeWidth="3" />
        <circle cx="300" cy="370" r="28" fill="#051a0e" stroke="#10b981" strokeWidth="2" />
        <circle cx="700" cy="370" r="28" fill="#051a0e" stroke="#10b981" strokeWidth="2" />
      </svg>
    ),
  },
  'problem-statement': {
    title: 'DARK THREAT SCENE',
    svg: (
      <svg className="w-full h-full opacity-40" viewBox="0 0 1000 1000" fill="none">
        <polygon points="500,100 850,300 850,700 500,900 150,700 150,300" fill="#040b06" stroke="#00ff66" strokeWidth="2" strokeDasharray="12,6" />
        <circle cx="500" cy="500" r="220" fill="#0a1a0f" stroke="#ff3333" strokeWidth="2" opacity="0.6" />
        <path d="M350 500 L650 500 M500 350 L500 650" stroke="#00ff66" strokeWidth="4" />
      </svg>
    ),
  },
  'team-rules': {
    title: 'BATTLE-READY HERO',
    svg: (
      <svg className="w-full h-full opacity-40" viewBox="0 0 1000 1000" fill="none">
        <path d="M500 200 L650 350 L600 850 L400 850 L350 350 Z" fill="#05160c" stroke="#10b981" strokeWidth="3" />
        <circle cx="500" cy="180" r="40" fill="#092414" stroke="#00ff66" strokeWidth="3" />
        <path d="M320 280 L420 500 M680 280 L580 500" stroke="#00ff66" strokeWidth="5" strokeLinecap="round" />
      </svg>
    ),
  },
  'hackathon-rules': {
    title: 'TECHNOLOGY-FOCUSED HERO',
    svg: (
      <svg className="w-full h-full opacity-40" viewBox="0 0 1000 1000" fill="none">
        <rect x="200" y="200" width="600" height="600" rx="30" fill="#041209" stroke="#10b981" strokeWidth="2" />
        <path d="M200 400 L800 400 M200 600 L800 600 M400 200 L400 800 M600 200 L600 800" stroke="#00ff66" strokeWidth="1" opacity="0.3" />
        <circle cx="500" cy="500" r="140" fill="#0a2414" stroke="#00ff66" strokeWidth="3" />
      </svg>
    ),
  },
  timeline: {
    title: 'TEAM ASSEMBLING COMMAND CENTER',
    svg: (
      <svg className="w-full h-full opacity-40" viewBox="0 0 1000 1000" fill="none">
        <path d="M100 800 L300 400 L500 200 L700 400 L900 800" stroke="#00ff66" strokeWidth="3" strokeDasharray="10,10" />
        <circle cx="500" cy="200" r="30" fill="#00ff66" />
        <circle cx="300" cy="400" r="25" fill="#10b981" />
        <circle cx="700" cy="400" r="25" fill="#10b981" />
      </svg>
    ),
  },
  prizes: {
    title: 'POWERFUL TEAM SCENE',
    svg: (
      <svg className="w-full h-full opacity-45" viewBox="0 0 1000 1000" fill="none">
        <polygon points="500,200 800,800 200,800" fill="#071c0f" stroke="#00ff66" strokeWidth="4" />
        <circle cx="500" cy="450" r="120" fill="#0d2c18" stroke="#10b981" strokeWidth="3" />
      </svg>
    ),
  },
  register: {
    title: 'FINAL MISSION SCENE',
    svg: (
      <svg className="w-full h-full opacity-45" viewBox="0 0 1000 1000" fill="none">
        <circle cx="500" cy="500" r="400" stroke="#00ff66" strokeWidth="4" strokeDasharray="20,10" />
        <circle cx="500" cy="500" r="280" fill="#061c0e" stroke="#10b981" strokeWidth="2" />
        <polygon points="500,320 620,600 380,600" fill="#00ff66" fillOpacity="0.2" stroke="#00ff66" strokeWidth="3" />
      </svg>
    ),
  },
};

const sectionIds = [
  'home',
  'about',
  'dates',
  'countdown',
  'treasure',
  'prize-reveal',
  'problem-statement',
  'team-rules',
  'hackathon-rules',
  'timeline',
  'prizes',
  'register',
];

const CinematicBackground = () => {
  const [activeScene, setActiveScene] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const canvasRef = useRef(null);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mediaQuery.matches;
  }, []);

  // Track scroll progress for Sondaven-style scene zoom momentum
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(window.scrollY / totalHeight);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // IntersectionObserver to switch sticky character scene smoothly on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-25% 0px -25% 0px',
      threshold: 0.1,
    };

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          if (sectionIds.includes(id)) {
            setActiveScene(id);
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Particle & Storm Canvas System
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

    const numParticles = prefersReducedMotion.current ? 15 : 60;
    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.5,
      speedY: Math.random() * 0.8 + 0.2,
      speedX: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    let lightningTimer = 0;
    let lightningFlash = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const grad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        50,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 1.2
      );
      grad.addColorStop(0, 'rgba(15, 30, 20, 0.45)');
      grad.addColorStop(0.6, 'rgba(5, 11, 7, 0.88)');
      grad.addColorStop(1, '#050b07');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (!prefersReducedMotion.current) {
        lightningTimer++;
        if (lightningTimer > 280 && Math.random() > 0.95) {
          lightningFlash = 0.8;
          lightningTimer = 0;
        }
        if (lightningFlash > 0) {
          ctx.fillStyle = `rgba(0, 255, 102, ${lightningFlash * 0.15})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          lightningFlash -= 0.05;
        }
      }

      ctx.fillStyle = '#00ff66';
      particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (!prefersReducedMotion.current) {
          p.y -= p.speedY;
          p.x += p.speedX;
          if (p.y < 0) {
            p.y = canvas.height;
            p.x = Math.random() * canvas.width;
          }
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

  // Sondaven-style subtle scale zoom calculation based on scroll momentum
  const sceneScale = 1 + (scrollProgress % 0.1) * 0.3;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      {/* Top Scroll Progress Indicator Bar (Sondaven style) */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#0f2416] z-50">
        <div
          className="h-full bg-gradient-to-r from-[#00ff66] via-[#10b981] to-[#00ff66] transition-all duration-150 shadow-[0_0_10px_#00ff66]"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Dynamic Canvas Background (Storm & Particles) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Sticky Character Scenes Stack with Sondaven Scroll Crossfade & Scale */}
      <div className="absolute inset-0 flex items-center justify-center">
        {sectionIds.map((id) => {
          const isActive = activeScene === id;
          const scene = sceneArtwork[id] || sceneArtwork.home;

          return (
            <div
              key={id}
              style={{
                transform: isActive ? `scale(${sceneScale})` : 'scale(1.08)',
              }}
              className={`absolute inset-0 flex items-center justify-center p-6 transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${
                isActive
                  ? 'opacity-100 blur-0 z-10'
                  : 'opacity-0 blur-sm z-0'
              }`}
            >
              <div className="w-full max-w-4xl h-[70vh] flex items-center justify-center">
                {scene.svg}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid scanlines overlay */}
      <div className="absolute inset-0 scanline-bg opacity-30" />
    </div>
  );
};

export default CinematicBackground;
