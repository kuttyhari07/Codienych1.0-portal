import React, { useState, useEffect } from 'react';
import { Crosshair } from 'lucide-react';

const hudItems = [
  { id: 'home', label: '01 PROLOGUE' },
  { id: 'about', label: '02 DOSSIER' },
  { id: 'dates', label: '03 TIMEFRAME' },
  { id: 'countdown', label: '04 LAUNCH' },
  { id: 'prizes', label: '05 VAULT' },
  { id: 'entertainment', label: '06 CHILL ZONE' },
  { id: 'problem-statement', label: '07 PROBLEM' },
  { id: 'team-rules', label: '08 PROTOCOL' },
  { id: 'hackathon-rules', label: '09 RULES' },
  { id: 'timeline', label: '10 TIMELINE' },
  { id: 'faq', label: '11 INTEL AI' },
  { id: 'contact', label: '12 COMMS' },
];

const MissionHudIndex = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 250;
      for (let i = hudItems.length - 1; i >= 0; i--) {
        const el = document.getElementById(hudItems[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(hudItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30 hidden 2xl:flex flex-col items-end space-y-2 pointer-events-auto select-none">
      {/* Top HUD Telemetry status */}
      <div className="flex items-center space-x-1.5 font-mono text-[9px] text-[#00ff66] bg-[#050b07]/90 border border-[#00ff66]/40 px-2 py-1 rounded mb-2 backdrop-blur-md">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-ping" />
        <span>SYS.OK // 0x7F</span>
      </div>

      {hudItems.map((item) => {
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="group flex items-center space-x-2 text-right transition-all duration-200"
          >
            <span
              className={`font-mono text-[10px] tracking-wider transition-all duration-200 ${
                isActive
                  ? 'text-[#00ff66] font-bold scale-105 drop-shadow-[0_0_8px_#00ff66]'
                  : 'text-gray-500 group-hover:text-gray-300 opacity-60 group-hover:opacity-100'
              }`}
            >
              {item.label}
            </span>
            <div
              className={`transition-all duration-200 ${
                isActive
                  ? 'w-4 h-1.5 bg-[#00ff66] shadow-[0_0_10px_#00ff66] rounded-sm'
                  : 'w-1.5 h-1.5 bg-gray-700 group-hover:bg-[#10b981] rounded-full'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default MissionHudIndex;
