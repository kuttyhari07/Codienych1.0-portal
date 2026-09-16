import React, { useEffect, useRef, useState } from 'react';
import { Compass, Sparkles, Zap, Anchor, Skull } from 'lucide-react';
import { playLaserBlip } from '../utils/cyberSound';

const Cyber3dReactorCanvas = () => {
  const canvasRef = useRef(null);
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const mouseRef = useRef({ x: 0, y: 0, isHover: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    let angleX = 0.2;
    let angleY = 0;
    let angleZ = 0;

    // Outer and inner rings of Jack Sparrow's Astrolabe
    const radius = 105;

    // Astrolabe ring particles
    const ringParticles = [];
    const numRingParticles = 40;
    for (let i = 0; i < numRingParticles; i++) {
      const theta = (i / numRingParticles) * Math.PI * 2;
      ringParticles.push({
        theta,
        r: radius * 1.35,
        tilt: 0.45,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.01 + 0.01,
      });
    }

    const ringParticles2 = [];
    for (let i = 0; i < 32; i++) {
      const theta = (i / 32) * Math.PI * 2;
      ringParticles2.push({
        theta,
        r: radius * 1.65,
        tilt: -0.55,
        size: Math.random() * 2.2 + 1,
        speed: Math.random() * 0.008 + 0.008,
      });
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseRef.current = { x: x * 2, y: y * 2, isHover: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHover = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Smooth rotate with mouse velocity influence
      const targetSpeedX = mouseRef.current.isHover ? mouseRef.current.y * 0.04 : 0.006 * rotationSpeed;
      const targetSpeedY = mouseRef.current.isHover ? mouseRef.current.x * 0.04 : 0.012 * rotationSpeed;

      angleX += targetSpeedX;
      angleY += targetSpeedY;
      angleZ += 0.003;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosZ = Math.cos(angleZ);
      const sinZ = Math.sin(angleZ);

      // Project 3D to 2D
      const project = (point) => {
        let x1 = point.x * cosY + point.z * sinY;
        let y1 = point.y;
        let z1 = -point.x * sinY + point.z * cosY;

        let x2 = x1;
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = y1 * sinX + z1 * cosX;

        let x3 = x2 * cosZ - y2 * sinZ;
        let y3 = x2 * sinZ + y2 * cosZ;
        let z3 = z2;

        const distance = 420;
        const scale = distance / (distance + z3);
        const px = cx + x3 * scale;
        const py = cy + y3 * scale;

        return { px, py, scale, z: z3 };
      };

      // Draw Glowing Aztec Gold Core
      const coreGrad = ctx.createRadialGradient(cx, cy, 6, cx, cy, 55);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.25, '#ffd700');
      coreGrad.addColorStop(0.65, '#b8860b');
      coreGrad.addColorStop(1, 'rgba(6, 20, 32, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 55, 0, Math.PI * 2);
      ctx.fill();

      // Draw 3D Brass Astrolabe Rings
      const numSegments = 36;
      ctx.strokeStyle = '#e5c158';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      for (let i = 0; i <= numSegments; i++) {
        const theta = (i / numSegments) * Math.PI * 2;
        const pt = project({ x: Math.cos(theta) * radius, y: 0, z: Math.sin(theta) * radius });
        if (i === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      }
      ctx.stroke();

      // Vertical Ring
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let i = 0; i <= numSegments; i++) {
        const theta = (i / numSegments) * Math.PI * 2;
        const pt = project({ x: 0, y: Math.cos(theta) * radius, z: Math.sin(theta) * radius });
        if (i === 0) ctx.moveTo(pt.px, pt.py);
        else ctx.lineTo(pt.px, pt.py);
      }
      ctx.stroke();

      // Compass Needle in 3D (Pointing towards mouse/north)
      const needleAngle = mouseRef.current.isHover
        ? Math.atan2(mouseRef.current.y, mouseRef.current.x)
        : angleY * 2;

      const nTip = project({
        x: Math.cos(needleAngle) * radius * 0.9,
        y: Math.sin(needleAngle) * radius * 0.9,
        z: 0,
      });
      const sTip = project({
        x: -Math.cos(needleAngle) * radius * 0.9,
        y: -Math.sin(needleAngle) * radius * 0.9,
        z: 0,
      });

      // North Needle (Crimson / Ruby)
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(nTip.px - 6 * nTip.scale, nTip.py);
      ctx.lineTo(nTip.px, nTip.py);
      ctx.lineTo(nTip.px + 6 * nTip.scale, nTip.py);
      ctx.closePath();
      ctx.fill();

      // South Needle (Gold / Brass)
      ctx.fillStyle = '#e5c158';
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sTip.px - 6 * sTip.scale, sTip.py);
      ctx.lineTo(sTip.px, sTip.py);
      ctx.lineTo(sTip.px + 6 * sTip.scale, sTip.py);
      ctx.closePath();
      ctx.fill();

      // Render Orbital Gold Particles (Ring 1)
      ringParticles.forEach((rp) => {
        rp.theta += rp.speed;
        const x = Math.cos(rp.theta) * rp.r;
        const y = Math.sin(rp.theta) * rp.r * Math.cos(rp.tilt);
        const z = Math.sin(rp.theta) * rp.r * Math.sin(rp.tilt);

        const p = project({ x, y, z });
        ctx.globalAlpha = Math.max(0.2, (p.z + 200) / 400);
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(p.px, p.py, rp.size * p.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Orbital Cyan Mist Particles (Ring 2)
      ringParticles2.forEach((rp) => {
        rp.theta -= rp.speed;
        const x = Math.cos(rp.theta) * rp.r;
        const y = Math.sin(rp.theta) * rp.r * Math.cos(rp.tilt);
        const z = Math.sin(rp.theta) * rp.r * Math.sin(rp.tilt);

        const p = project({ x, y, z });
        ctx.globalAlpha = Math.max(0.2, (p.z + 200) / 400);
        ctx.fillStyle = '#00e5ff';
        ctx.beginPath();
        ctx.arc(p.px, p.py, rp.size * p.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1.0;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [rotationSpeed]);

  const handleSpeedBoost = () => {
    playLaserBlip();
    setRotationSpeed((prev) => (prev === 1 ? 2.5 : prev === 2.5 ? 4 : 1));
  };

  return (
    <div className="relative my-6 max-w-xl mx-auto flex flex-col items-center select-none">
      {/* 3D Canvas Container with Ornate Pirate Gold Dial */}
      <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full border-2 border-[#e5c158]/70 bg-gradient-to-b from-[#161208] via-[#09151f] to-[#03070b] flex items-center justify-center shadow-[0_0_50px_rgba(229,193,88,0.35)] group transition-all duration-300">
        
        {/* Outer Rotating Antique Compass Rose Ring */}
        <div className="absolute inset-0 pointer-events-none animate-spin" style={{ animationDuration: '28s' }}>
          <svg viewBox="0 0 400 400" className="w-full h-full opacity-60">
            <circle cx="200" cy="200" r="188" stroke="#e5c158" strokeWidth="1.5" strokeDasharray="8, 16, 24, 16" fill="none" />
            <circle cx="200" cy="200" r="176" stroke="#00e5ff" strokeWidth="1" strokeDasharray="4, 12" fill="none" />
          </svg>
        </div>

        <div className="absolute inset-0 pointer-events-none animate-spin" style={{ animationDuration: '40s', animationDirection: 'reverse' }}>
          <svg viewBox="0 0 400 400" className="w-full h-full opacity-40">
            <circle cx="200" cy="200" r="162" stroke="#e5c158" strokeWidth="2" strokeDasharray="45, 30" fill="none" />
          </svg>
        </div>

        {/* 3D Canvas */}
        <canvas
          ref={canvasRef}
          width={380}
          height={380}
          className="w-full h-full cursor-grab active:cursor-grabbing z-10"
        />

        {/* Center Live Telemetry Badge */}
        <div className="absolute -bottom-3 bg-[#0a1722] border border-[#e5c158] px-4 py-1 rounded-full text-[10px] font-mono text-[#e5c158] shadow-[0_0_15px_rgba(229,193,88,0.5)] flex items-center space-x-1.5 z-20">
          <span className="w-2 h-2 rounded-full bg-[#e5c158] animate-ping" />
          <span className="font-bold tracking-widest uppercase font-cinzel">JACK'S CURSED COMPASS // 3D</span>
        </div>
      </div>

      {/* 3D Controls Bar */}
      <div className="flex items-center space-x-2.5 mt-6">
        <button
          onClick={handleSpeedBoost}
          data-cursor-text="SPEED"
          className="px-3.5 py-1.5 rounded-xl font-mono text-xs bg-[#1a140b] border border-[#e5c158]/60 hover:border-[#ffd700] text-[#e5c158] transition-all active:scale-95 flex items-center space-x-1.5 shadow-md hover:shadow-[0_0_15px_rgba(229,193,88,0.4)]"
        >
          <Compass className="w-3.5 h-3.5 text-[#e5c158]" />
          <span>DIAL VELOCITY: {rotationSpeed}X</span>
        </button>

        <span className="font-cinzel text-[11px] text-gray-400 hidden sm:inline">
          (Hover & drag mouse to rotate Jack's magical compass in 3D)
        </span>
      </div>
    </div>
  );
};

export default Cyber3dReactorCanvas;
