import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Compass, Skull, Swords, Anchor, Scroll, MapPin, Lock } from 'lucide-react';
import useRegistrationStatus from '../utils/useRegistrationStatus';

const navItems = [
  { label: 'ABOUT', href: '#about' },
  { label: 'DATES', href: '#dates' },
  { label: 'DOMAINS', href: '#domains' },
  { label: 'RIDDLE', href: '#problem-statement' },
  { label: 'BOUNTIES', href: '#prizes' },
  { label: 'TAVERN', href: '#entertainment' },
  { label: 'RULES', href: '#rules' },
  { label: 'MEALS', href: '#refreshments' },
  { label: 'MAP', href: '#timeline' },
  { label: 'FAQ', href: '#faq' },
  { label: 'CONTACT', href: '#contact' },
];

const Navbar = () => {
  const { isClosed, isSpecialSlotOpen } = useRegistrationStatus();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Section scrollspy
      const sections = navItems
        .filter((item) => item.href.startsWith('#'))
        .map((item) => item.href.substring(1));

      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    if (href === '#refreshments') {
      window.dispatchEvent(new CustomEvent('open-parchment-scroll', { detail: { id: 'refreshment-schedule-scroll' } }));
    }

    if (href === '/') {
      navigate('/');
      return;
    }

    if (location.pathname !== '/portal') {
      navigate('/portal' + href);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 h-14 sm:h-16 transition-all duration-300 ${
        scrolled
          ? 'bg-[#03070b]/95 backdrop-blur-md border-b border-[#8a6d1b]/40 shadow-[0_4px_25px_rgba(0,0,0,0.8)]'
          : 'bg-[#03070b]/90 backdrop-blur-sm border-b border-[#3a2e1d]/60'
      } flex items-center`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full flex items-center justify-between h-full">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer flex-shrink-0"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#140e06] border border-[#ffd700]/70 flex items-center justify-center group-hover:shadow-[0_0_15px_#ffd700] transition-all flex-shrink-0 overflow-hidden p-0.5 shadow-md">
            <img
              src="/codienych-logo-round.png"
              alt="CODIENYCH 1.0 Logo"
              className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div>
            <span className="font-pirate text-base sm:text-xl text-[#ffd700] tracking-wider group-hover:text-white transition-colors whitespace-nowrap block leading-none">
              CODIENYCH<span className="text-[#00e5ff]"> 1.0</span>
            </span>
            <span className="block text-[8px] sm:text-[9px] font-cinzel text-[#cfb07a] tracking-widest leading-none mt-0.5 whitespace-nowrap">
              24-HR CARIBBEAN HACKATHON
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1.5 flex-shrink-0">
          {navItems.map((item) => {
            const isHome = item.href === '/';
            const sectionId = isHome ? '' : item.href.substring(1);
            const isActive = !isHome && activeSection === sectionId;
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={`px-1.5 xl:px-2.5 py-1 rounded text-[11px] xl:text-xs font-cinzel font-semibold tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  isHome
                    ? 'text-[#00e5ff] hover:text-[#ffd700] hover:bg-[#0c1e2d] border border-[#00e5ff]/30'
                    : isActive
                    ? 'text-[#ffd700] bg-[#1a140b] border border-[#e5c158]/70 shadow-[0_0_10px_rgba(229,193,88,0.35)] font-bold'
                    : 'text-gray-300 hover:text-[#ffd700] hover:bg-[#120e07]/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center space-x-2 xl:space-x-3 flex-shrink-0">
          <Link
            to="/status"
            className="px-3 py-1.5 text-xs font-cinzel text-gray-300 hover:text-[#ffd700] border border-[#3b2b19] rounded-lg hover:border-[#e5c158] transition-all flex items-center space-x-1.5 bg-[#091522]/60 whitespace-nowrap"
          >
            <Compass className="w-3.5 h-3.5 text-[#00e5ff]" />
            <span>STATUS</span>
          </Link>
          {isClosed ? (
            <Link
              to="/register"
              className="relative px-3.5 py-1.5 rounded-lg text-xs font-pirate text-red-400 bg-[#240a0a] border border-red-500/50 hover:bg-[#341111] transition-all shadow-[0_0_12px_rgba(239,68,68,0.3)] flex items-center space-x-1.5 font-bold whitespace-nowrap"
            >
              <Lock className="w-3.5 h-3.5 text-red-400" />
              <span>CLOSED</span>
            </Link>
          ) : (
            <Link
              to="/register"
              className="relative px-3.5 xl:px-4 py-1.5 rounded-lg text-xs xl:text-sm font-pirate text-black bg-gradient-to-r from-[#ffd700] via-[#ffe066] to-[#ffd700] hover:brightness-110 transition-all shadow-[0_0_15px_rgba(255,215,0,0.6)] hover:shadow-[0_0_25px_rgba(255,215,0,0.85)] transform hover:-translate-y-0.5 active:translate-y-0 font-bold flex items-center space-x-1.5 border border-[#ffd700] whitespace-nowrap"
            >
              <Swords className="w-3.5 h-3.5 text-black" />
              <span>{isSpecialSlotOpen ? '1 FINAL SLOT' : 'JOIN CREW • 11:59 PM'}</span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="lg:hidden flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
          {isClosed ? (
            <Link
              to="/register"
              className="px-2 py-1 rounded text-[10px] font-pirate font-bold text-red-400 bg-[#240a0a] border border-red-500/50 uppercase whitespace-nowrap"
            >
              CLOSED
            </Link>
          ) : (
            <Link
              to="/register"
              className="px-2.5 py-1 rounded text-[11px] font-pirate font-bold text-black bg-[#ffd700] shadow-[0_0_10px_#ffd700] uppercase whitespace-nowrap"
            >
              JOIN CREW
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg bg-[#140e06] border border-[#8a6d1b]/60 text-[#f4e6c3] hover:text-[#ffd700]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#03070b]/98 backdrop-blur-xl border-b border-[#8a6d1b]/60 px-4 pt-4 pb-6 mt-2 space-y-1.5 animate-fadeIn">
          {/* Urgent Registration Alert in Mobile Menu */}
          {!isClosed && (
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full mb-2 px-3.5 py-2.5 rounded-xl text-xs font-cinzel font-black bg-gradient-to-r from-[#2c0808] via-[#48120c] to-[#2c0808] text-[#ffd700] border-2 border-red-500 flex items-center justify-between shadow-[0_0_15px_rgba(239,68,68,0.4)]"
            >
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span>⚡ CLOSES TONIGHT AT 11:59 PM (₹500/MEMBER)</span>
              </div>
              <span className="text-white font-bold">JOIN →</span>
            </Link>
          )}

          {/* Prominent Important Schedule Banner in Mobile Menu */}
          <button
            onClick={() => handleNavClick('#refreshments')}
            className="w-full mb-3 px-3.5 py-2.5 rounded-xl text-xs font-cinzel font-black bg-gradient-to-r from-[#2e1305] via-[#451c07] to-[#2e1305] text-[#ffd700] border-2 border-[#ffd700] flex items-center justify-between shadow-[0_0_15px_rgba(255,215,0,0.35)]"
          >
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>⚠️ IMPORTANT: MEAL & WI-FI SCHEDULE</span>
            </div>
            <span>→</span>
          </button>
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              className="block w-full text-left px-4 py-2.5 rounded text-sm font-cinzel text-gray-200 hover:text-[#ffd700] hover:bg-[#1a140b] transition-colors cursor-pointer"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-[#3b2b19] flex flex-col space-y-2">
            <Link
              to="/status"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 text-xs font-cinzel text-[#e5c158] border border-[#8a6d1b]/60 rounded-lg bg-[#0e1722]"
            >
              CHECK CREW MANIFEST STATUS
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
