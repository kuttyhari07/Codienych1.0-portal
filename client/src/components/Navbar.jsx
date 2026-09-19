import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Compass, Skull, Swords, Anchor, Scroll, MapPin } from 'lucide-react';
import TinyBgmToggle from './TinyBgmToggle';

const navItems = [
  { label: 'ABOUT', href: '#about' },
  { label: 'DATES', href: '#dates' },
  { label: 'DOMAINS', href: '#domains' },
  { label: 'BOUNTIES', href: '#prizes' },
  { label: 'TAVERN', href: '#entertainment' },
  { label: 'RIDDLE', href: '#problem-statement' },
  { label: 'PIRATE CODE', href: '#rules' },
  { label: 'VOYAGE MAP', href: '#timeline' },
  { label: 'FAQ', href: '#faq' },
  { label: 'ADMIRALTY', href: '#contact' },
];

const Navbar = () => {
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
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#03070b]/95 backdrop-blur-md border-b border-[#8a6d1b]/40 py-2.5 shadow-[0_4px_25px_rgba(0,0,0,0.8)]'
          : 'bg-[#03070b]/80 backdrop-blur-sm border-b border-[#3a2e1d]/60 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer flex-shrink-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#140e06] border border-[#ffd700]/70 flex items-center justify-center group-hover:shadow-[0_0_15px_#ffd700] transition-all flex-shrink-0 overflow-hidden p-0.5 shadow-md">
            <img
              src="/codienych-logo-round.png"
              alt="CODIENYCH 1.0 Logo"
              className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div>
            <span className="font-pirate text-lg sm:text-2xl text-[#ffd700] tracking-wider group-hover:text-white transition-colors whitespace-nowrap block leading-none">
              CODIENYCH<span className="text-[#00e5ff]"> 1.0</span>
            </span>
            <span className="block text-[8px] sm:text-[10px] font-cinzel text-[#cfb07a] tracking-widest leading-none mt-0.5">
              24-HR CARIBBEAN HACKATHON
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          {navItems.map((item) => {
            const isHome = item.href === '/';
            const sectionId = isHome ? '' : item.href.substring(1);
            const isActive = !isHome && activeSection === sectionId;
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={`px-2.5 py-1.5 rounded text-xs font-cinzel font-semibold tracking-wider transition-all cursor-pointer ${
                  isHome
                    ? 'text-[#00e5ff] hover:text-[#ffd700] hover:bg-[#0c1e2d] border border-[#00e5ff]/30'
                    : isActive
                    ? 'text-[#ffd700] bg-[#1a140b] border border-[#e5c158]/70 shadow-[0_0_12px_rgba(229,193,88,0.35)] font-bold'
                    : 'text-gray-300 hover:text-[#ffd700] hover:bg-[#120e07]/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center space-x-3">
          <TinyBgmToggle />
          <Link
            to="/status"
            className="px-3.5 py-2 text-xs font-cinzel text-gray-300 hover:text-[#ffd700] border border-[#3b2b19] rounded-lg hover:border-[#e5c158] transition-all flex items-center space-x-1.5 bg-[#091522]/60"
          >
            <Compass className="w-3.5 h-3.5 text-[#00e5ff]" />
            <span>VOYAGE STATUS</span>
          </Link>
          <Link
            to="/register"
            className="relative px-5 py-2 rounded-lg text-xs font-pirate text-base text-black bg-gradient-to-r from-[#ffd700] to-[#e5c158] hover:from-[#fff2a3] hover:to-[#ffd700] transition-all shadow-[0_0_15px_rgba(229,193,88,0.5)] hover:shadow-[0_0_25px_rgba(255,215,0,0.8)] transform hover:-translate-y-0.5 active:translate-y-0 font-bold flex items-center space-x-1.5"
          >
            <Swords className="w-4 h-4 text-black" />
            <span>JOIN THE CREW</span>
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="lg:hidden flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
          <TinyBgmToggle />
          <Link
            to="/register"
            className="px-3 py-1.5 rounded text-xs font-pirate text-sm font-bold text-black bg-[#ffd700] shadow-[0_0_10px_#ffd700] uppercase"
          >
            JOIN CREW
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 sm:p-2 rounded-lg bg-[#140e06] border border-[#8a6d1b]/60 text-[#f4e6c3] hover:text-[#ffd700]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#03070b]/98 backdrop-blur-xl border-b border-[#8a6d1b]/60 px-4 pt-4 pb-6 mt-2 space-y-1.5 animate-fadeIn">
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
