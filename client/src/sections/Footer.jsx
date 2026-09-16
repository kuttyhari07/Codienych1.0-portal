import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Skull, Swords, Anchor, Scroll } from 'lucide-react';
import { EVENT_CONFIG } from '../utils/config';

const Footer = () => {
  return (
    <footer className="relative bg-[#020508] border-t border-[#4a381e] pt-16 pb-12 px-4 z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        {/* Brand */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#140e06] border border-[#ffd700] flex items-center justify-center">
              <Skull className="w-6 h-6 text-[#ffd700]" />
            </div>
            <span className="font-pirate text-3xl text-[#ffd700] tracking-wider">
              CODIENYCH<span className="text-[#00e5ff]"> 1.0</span>
            </span>
          </div>
          <p className="font-cinzel text-xs text-[#ffd700] tracking-wider uppercase font-bold">
            {EVENT_CONFIG.COLLEGE_NAME}
          </p>
          <p className="font-cinzel text-xs text-[#cfb07a] tracking-wider uppercase">
            {EVENT_CONFIG.DEPARTMENT} <span className="text-[#ffd700]">PROUDLY PRESENTS</span>
          </p>
          <p className="font-cinzel text-[11px] text-[#00e5ff] tracking-widest uppercase font-bold">
            24-HOUR CARIBBEAN HACKATHON
          </p>
          <p className="font-medieval text-sm text-[#f4e6c3] max-w-sm leading-relaxed italic">
            “Not all treasure is silver and gold, mate... 24 Hours of Coding, Creativity and Innovation on the High Seas.”
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-pirate text-xl text-white uppercase tracking-wider mb-4 border-b border-[#3b2b19] pb-2">
            SHIP LOG NAVIGATION
          </h4>
          <ul className="space-y-2 font-cinzel text-xs text-gray-300">
            <li><a href="#home" className="hover:text-[#ffd700] transition-colors">PORT OF EMBARKATION</a></li>
            <li><a href="#about" className="hover:text-[#ffd700] transition-colors">EXPEDITION DOSSIER</a></li>
            <li><a href="#rules" className="hover:text-[#ffd700] transition-colors">PIRATE CODE</a></li>
            <li><a href="#timeline" className="hover:text-[#ffd700] transition-colors">VOYAGE TIMELINE</a></li>
            <li><a href="#prizes" className="hover:text-[#ffd700] transition-colors">TREASURE BOUNTIES</a></li>
            <li><a href="#faq" className="hover:text-[#ffd700] transition-colors">CAPTAIN FAQ</a></li>
            <li><a href="#contact" className="hover:text-[#ffd700] transition-colors">ADMIRALTY COMMS</a></li>
            <li><Link to="/register" className="text-[#ffd700] hover:underline font-bold">JOIN THE CREW</Link></li>
          </ul>
        </div>

        {/* Portals & Meta */}
        <div>
          <h4 className="font-pirate text-xl text-white uppercase tracking-wider mb-4 border-b border-[#3b2b19] pb-2">
            VOYAGE PORTALS
          </h4>
          <ul className="space-y-3 font-cinzel text-xs text-gray-300">
            <li>
              <Link to="/status" className="hover:text-[#ffd700] transition-colors flex items-center space-x-1.5">
                <Compass className="w-4 h-4 text-[#00e5ff]" />
                <span>CHECK VOYAGE STATUS</span>
              </Link>
            </li>
            <li>
              <Link to="/admin/login" className="hover:text-[#ffd700] transition-colors text-gray-500 hover:text-gray-300">
                [CAPTAIN'S QUARTERS ACCESS]
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-[#3b2b19]/60 text-center flex flex-col sm:flex-row items-center justify-between text-xs font-cinzel text-gray-400 gap-4">
        <div>
          © 2026 CODIENYCH 1.0. All Rights Reserved on the Seven Seas.
        </div>
        <div className="text-[10px] text-[#ffd700]/70 font-semibold tracking-wider">
          PIRATES OF THE CARIBBEAN • HIGH SEAS 24-HR CODING EXPEDITION
        </div>
      </div>
    </footer>
  );
};

export default Footer;
