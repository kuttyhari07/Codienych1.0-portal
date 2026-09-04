import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Terminal } from 'lucide-react';
import { EVENT_CONFIG } from '../utils/config';

const Footer = () => {
  return (
    <footer className="relative bg-[#030704] border-t border-[#1b3524] pt-16 pb-12 px-4 z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#0f1e14] border border-[#10b981] flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#00ff66]" />
            </div>
            <span className="font-orbitron font-extrabold text-2xl text-white tracking-wider">
              CODIENYCH<span className="text-[#00ff66]"> 1.0</span>
            </span>
          </div>
          <p className="font-mono text-xs text-[#00ff66] tracking-wider uppercase font-semibold">
            {EVENT_CONFIG.COLLEGE_NAME}
          </p>
          <p className="font-mono text-xs text-gray-400 tracking-wider uppercase">
            {EVENT_CONFIG.DEPARTMENT} <span className="text-[#00ff66]">PRESENTS</span>
          </p>
          <p className="font-mono text-[11px] text-[#10b981] tracking-widest uppercase">
            24-HOUR SOFTWARE HACKATHON
          </p>
          <p className="font-sans text-sm text-gray-400 max-w-sm leading-relaxed">
            “24 Hours of Coding, Creativity and Innovation.” Form your team, build software solutions, and conquer the mission.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-orbitron font-bold text-sm text-white uppercase tracking-wider mb-4 border-b border-[#1b3524] pb-2">
            QUICK LINKS
          </h4>
          <ul className="space-y-2 font-mono text-xs text-gray-400">
            <li><a href="#home" className="hover:text-[#00ff66] transition-colors">HOME</a></li>
            <li><a href="#about" className="hover:text-[#00ff66] transition-colors">ABOUT</a></li>
            <li><a href="#rules" className="hover:text-[#00ff66] transition-colors">RULES</a></li>
            <li><a href="#timeline" className="hover:text-[#00ff66] transition-colors">TIMELINE</a></li>
            <li><a href="#prizes" className="hover:text-[#00ff66] transition-colors">PRIZES</a></li>
            <li><a href="#faq" className="hover:text-[#00ff66] transition-colors">FAQ</a></li>
            <li><a href="#contact" className="hover:text-[#00ff66] transition-colors">CONTACT</a></li>
            <li><Link to="/register" className="text-[#00ff66] hover:underline font-bold">REGISTER NOW</Link></li>
          </ul>
        </div>

        {/* Portals & Meta */}
        <div>
          <h4 className="font-orbitron font-bold text-sm text-white uppercase tracking-wider mb-4 border-b border-[#1b3524] pb-2">
            PORTALS
          </h4>
          <ul className="space-y-3 font-mono text-xs text-gray-400">
            <li>
              <Link to="/status" className="hover:text-[#00ff66] transition-colors flex items-center space-x-1.5">
                <Terminal className="w-4 h-4 text-[#10b981]" />
                <span>CHECK STATUS</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/login" className="hover:text-[#00ff66] transition-colors text-gray-500 hover:text-gray-300">
                [ADMIN ACCESS]
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-[#1b3524]/60 text-center flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-gray-500 gap-4">
        <div>
          © 2026 CODIENYCH 1.0. All Rights Reserved.
        </div>
        <div className="text-[10px] text-gray-600">
          DARK FUTURISTIC • POST-APOCALYPTIC • SUPERHERO MISSION
        </div>
      </div>
    </footer>
  );
};

export default Footer;
