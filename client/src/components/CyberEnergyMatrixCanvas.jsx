import React, { useEffect, useRef, useState } from 'react';
import { Shield, Sparkles, Zap, Terminal } from 'lucide-react';
import { playLaserBlip } from '../utils/cyberSound';

const CyberEnergyMatrixCanvas = () => {
  const canvasRef = useRef(null);
  const [pulseSpeed, setPulseSpeed] = useState('normal');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationId;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = 120;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const cy = height / 2;

      time += pulseSpeed === 'boost' ? 0.08 : 0.035;

      // Draw Multi-Layered Neon Sinusoidal Energy Waves
      const waves = [
        { freq: 0.015, amp: 28, speed: 1.0, color: '#00ff66', width: 2.5, alpha: 0.8 },
        { freq: 0.025, amp: 18, speed: -1.3, color: '#10b981', width: 1.8, alpha: 0.5 },
        { freq: 0.008, amp: 38, speed: 0.7, color: '#ffffff', width: 1.0, alpha: 0.3 },
      ];

      waves.forEach((w) => {
        ctx.save();
        ctx.strokeStyle = w.color;
        ctx.lineWidth = w.width;
        ctx.globalAlpha = w.alpha;
        ctx.shadowColor = w.color;
        ctx.shadowBlur = 12;

        ctx.beginPath();
        for (let x = 0; x < width; x += 4) {
          const y = cy + Math.sin(x * w.freq + time * w.speed) * w.amp * Math.sin((x / width) * Math.PI);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.restore();
      });

      // Draw Floating Quantum Sparks on the wave crest
      for (let i = 0; i < 8; i++) {
        const sparkX = ((time * 40 + i * (width / 8)) % width);
        const sparkY = cy + Math.sin(sparkX * 0.015 + time) * 28 * Math.sin((sparkX / width) * Math.PI);

        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#00ff66';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(sparkX, sparkY, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [pulseSpeed]);

  return (
    <div className="relative mt-8 max-w-3xl mx-auto rounded-2xl bg-[#040e08] border border-[#10b981]/40 p-4 shadow-[0_0_30px_rgba(0,255,102,0.15)] overflow-hidden">
      <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-2 border-b border-[#1b3524] pb-2">
        <div className="flex items-center space-x-2 text-[#00ff66]">
          <Zap className="w-4 h-4 text-[#00ff66] animate-pulse" />
          <span className="font-bold">QUANTUM CHRONO FLUX HARMONIZER</span>
        </div>

        <button
          onClick={() => {
            playLaserBlip();
            setPulseSpeed((prev) => (prev === 'normal' ? 'boost' : 'normal'));
          }}
          className="text-[10px] bg-[#00ff66]/10 border border-[#00ff66]/40 px-2.5 py-0.5 rounded text-[#00ff66] hover:bg-[#00ff66] hover:text-black transition-colors"
        >
          {pulseSpeed === 'boost' ? '⚡ TURBO FLUX' : 'STANDARD FLUX'}
        </button>
      </div>

      <canvas ref={canvasRef} className="w-full h-[100px] block" />
    </div>
  );
};

export default CyberEnergyMatrixCanvas;
