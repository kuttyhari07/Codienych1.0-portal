import React, { useState, useEffect } from 'react';
import { Compass } from 'lucide-react';

const hudItems = [
  { id: 'home', label: '01 EMBARKATION' },
  { id: 'about', label: '02 DOSSIER' },
  { id: 'dates', label: '03 TIMEFRAME' },
  { id: 'countdown', label: '04 COUNTDOWN' },
  { id: 'domains', label: '05 DOMAINS' },
  { id: 'problem-statement', label: '06 RIDDLE' },
  { id: 'prizes', label: '07 BOUNTIES' },
  { id: 'entertainment', label: '08 TAVERN' },
  { id: 'team-rules', label: '09 CREW CODE' },
  { id: 'hackathon-rules', label: '10 RULES' },
  { id: 'timeline', label: '11 VOYAGE MAP' },
  { id: 'faq', label: '12 CAPTAIN FAQ' },
  { id: 'contact', label: '13 ADMIRALTY' },
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
      <div className="flex items-center space-x-1.5 font-cinzel text-[9px] text-[#ffd700] bg-[#04080e]/95 border border-[#ffd700]/50 px-2.5 py-1 rounded-md mb-2 backdrop-blur-md shadow-md">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ffd700] animate-ping" />
        <span className="font-bold">SEAS CALM // BEARING 077°</span>
      </div>

      {hudItems.map((item) => {
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className="group flex items-center space-x-2 text-right transition-all duration-200 cursor-pointer"
          >
            <span
              className={`font-cinzel text-[10px] tracking-wider transition-all duration-200 ${
                isActive
                  ? 'text-[#ffd700] font-bold scale-105 drop-shadow-[0_0_8px_#ffd700]'
                  : 'text-gray-400 group-hover:text-[#f4e6c3] opacity-60 group-hover:opacity-100'
              }`}
            >
              {item.label}
            </span>
            <div
              className={`transition-all duration-200 ${
                isActive
                  ? 'w-4 h-1.5 bg-[#ffd700] shadow-[0_0_10px_#ffd700] rounded-sm'
                  : 'w-1.5 h-1.5 bg-gray-700 group-hover:bg-[#e5c158] rounded-full'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default MissionHudIndex;
