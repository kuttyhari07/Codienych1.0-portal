import React, { useEffect, useRef, useState } from 'react';
import { Shield, Sparkles, Orbit, Radio, Zap } from 'lucide-react';
import { playLaserBlip, playChirp } from '../utils/cyberSound';

const Cyber3dReactorCanvas = () => {
  const canvasRef = useRef(null);
  const [mode, setMode] = useState('hologram'); // 'hologram' | 'core' | 'matrix'
  const [rotationSpeed, setRotationSpeed] = useState(1);
  const mouseRef = useRef({ x: 0, y: 0, isHover: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    let angleX = 0;
    let angleY = 0;
    let angleZ = 0;

    // Generate 3D point cloud of an advanced Cybernetic Icosahedron Reactor + Orbital Rings
    const nodes = [];
    const phi = (1 + Math.sqrt(5)) / 2;
    const radius = 105;

    // Base icosahedron vertices
    const icosaVertices = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ].map(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z);
      return { x: (x / len) * radius, y: (y / len) * radius, z: (z / len) * radius };
    });

    // Particle nodes floating on rings
    const ringParticles = [];
    const numRingParticles = 48;
    for (let i = 0; i < numRingParticles; i++) {
      const theta = (i / numRingParticles) * Math.PI * 2;
      ringParticles.push({
        theta,
        r: radius * 1.5,
        tilt: 0.6,
        size: Math.random() * 2 + 1,
        speed: (Math.random() * 0.01 + 0.01),
      });
    }

    const ringParticles2 = [];
    for (let i = 0; i < 36; i++) {
      const theta = (i / 36) * Math.PI * 2;
      ringParticles2.push({
        theta,
        r: radius * 1.85,
        tilt: -0.7,
        size: Math.random() * 2 + 1,
        speed: (Math.random() * 0.008 + 0.008),
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
      const targetSpeedX = mouseRef.current.isHover ? mouseRef.current.y * 0.04 : 0.008 * rotationSpeed;
      const targetSpeedY = mouseRef.current.isHover ? mouseRef.current.x * 0.04 : 0.012 * rotationSpeed;

      angleX += targetSpeedX;
      angleY += targetSpeedY;
      angleZ += 0.004;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosZ = Math.cos(angleZ);
      const sinZ = Math.sin(angleZ);

      // Project 3D to 2D
      const project = (point) => {
        // Rotation Y
        let x1 = point.x * cosY + point.z * sinY;
        let y1 = point.y;
        let z1 = -point.x * sinY + point.z * cosY;

        // Rotation X
        let x2 = x1;
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = y1 * sinX + z1 * cosX;

        // Rotation Z
        let x3 = x2 * cosZ - y2 * sinZ;
        let y3 = x2 * sinZ + y2 * cosZ;
        let z3 = z2;

        const distance = 400;
        const scale = distance / (distance + z3);
        const px = cx + x3 * scale;
        const py = cy + y3 * scale;

        return { px, py, scale, z: z3 };
      };

      const projectedVertices = icosaVertices.map(project);

      // Draw Glowing Center Core Orb
      const coreGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 50);
      coreGrad.addColorStop(0, '#ffffff');
      coreGrad.addColorStop(0.3, '#00ff66');
      coreGrad.addColorStop(0.7, 'rgba(16, 185, 129, 0.4)');
      coreGrad.addColorStop(1, 'rgba(5, 11, 7, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 50, 0, Math.PI * 2);
      ctx.fill();

      // Connect 3D Wireframe Edges
      ctx.strokeStyle = '#00ff66';
      ctx.lineWidth = 1.4;
      for (let i = 0; i < projectedVertices.length; i++) {
        for (let j = i + 1; j < projectedVertices.length; j++) {
          const v1 = icosaVertices[i];
          const v2 = icosaVertices[j];
          const dist = Math.hypot(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);

          // Connect neighboring vertices only
          if (dist < radius * 1.2) {
            const p1 = projectedVertices[i];
            const p2 = projectedVertices[j];
            const avgScale = (p1.scale + p2.scale) / 2;

            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.globalAlpha = Math.max(0.15, (p1.scale + p2.scale) * 0.4 - 0.2);
            ctx.stroke();
          }
        }
      }

      // Draw Vertices Nodes with Neon Halos
      projectedVertices.forEach((p) => {
        ctx.globalAlpha = Math.max(0.3, p.scale);
        ctx.fillStyle = '#00ff66';
        ctx.beginPath();
        ctx.arc(p.px, p.py, 3.5 * p.scale, 0, Math.PI * 2);
        ctx.fill();

        // Outer Vertex Ping Ring
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.px, p.py, 6 * p.scale, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Render Orbital Particles Rings (Ring 1)
      ringParticles.forEach((rp) => {
        rp.theta += rp.speed;
        const x = Math.cos(rp.theta) * rp.r;
        const y = Math.sin(rp.theta) * rp.r * Math.cos(rp.tilt);
        const z = Math.sin(rp.theta) * rp.r * Math.sin(rp.tilt);

        const p = project({ x, y, z });
        ctx.globalAlpha = Math.max(0.2, (p.z + 200) / 400);
        ctx.fillStyle = '#00ff66';
        ctx.beginPath();
        ctx.arc(p.px, p.py, rp.size * p.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Orbital Particles Rings (Ring 2)
      ringParticles2.forEach((rp) => {
        rp.theta -= rp.speed;
        const x = Math.cos(rp.theta) * rp.r;
        const y = Math.sin(rp.theta) * rp.r * Math.cos(rp.tilt);
        const z = Math.sin(rp.theta) * rp.r * Math.sin(rp.tilt);

        const p = project({ x, y, z });
        ctx.globalAlpha = Math.max(0.2, (p.z + 200) / 400);
        ctx.fillStyle = '#10b981';
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
      {/* 3D Canvas Container with Cyber Frame */}
      <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] rounded-full border-2 border-[#00ff66]/60 bg-gradient-to-b from-[#06180d] via-[#040e07] to-[#020704] flex items-center justify-center shadow-[0_0_50px_rgba(0,255,102,0.35)] group transition-all duration-300">
        
        {/* Outer Rotating HUD SVG Ring */}
        <div className="absolute inset-0 pointer-events-none animate-spin" style={{ animationDuration: '24s' }}>
          <svg viewBox="0 0 400 400" className="w-full h-full opacity-60">
            <circle cx="200" cy="200" r="188" stroke="#00ff66" strokeWidth="1.5" strokeDasharray="10, 15, 30, 15" fill="none" />
            <circle cx="200" cy="200" r="176" stroke="#10b981" strokeWidth="1" strokeDasharray="4, 12" fill="none" />
          </svg>
        </div>

        <div className="absolute inset-0 pointer-events-none animate-spin" style={{ animationDuration: '36s', animationDirection: 'reverse' }}>
          <svg viewBox="0 0 400 400" className="w-full h-full opacity-40">
            <circle cx="200" cy="200" r="160" stroke="#00ff66" strokeWidth="2" strokeDasharray="60, 40" fill="none" />
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
        <div className="absolute -bottom-3 bg-[#06180e] border border-[#00ff66] px-4 py-1 rounded-full text-[10px] font-mono text-[#00ff66] shadow-[0_0_15px_#00ff66] flex items-center space-x-1.5 z-20">
          <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-ping" />
          <span className="font-bold tracking-widest uppercase">3D QUANTUM CORE // INTERACTIVE</span>
        </div>
      </div>

      {/* 3D Controls Bar */}
      <div className="flex items-center space-x-2.5 mt-6">
        <button
          onClick={handleSpeedBoost}
          data-cursor-text="SPEED"
          className="px-3.5 py-1.5 rounded-xl font-mono text-xs bg-[#092212] border border-[#00ff66]/50 hover:border-[#00ff66] text-[#00ff66] transition-all active:scale-95 flex items-center space-x-1.5 shadow-md"
        >
          <Zap className="w-3.5 h-3.5 text-[#00ff66]" />
          <span>VELOCITY: {rotationSpeed}X</span>
        </button>

        <span className="font-mono text-[11px] text-gray-400 hidden sm:inline">
          (Hover & drag mouse to rotate 3D hologram in real-time)
        </span>
      </div>
    </div>
  );
};

export default Cyber3dReactorCanvas;
