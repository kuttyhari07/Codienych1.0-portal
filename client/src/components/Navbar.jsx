import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Shield, Terminal } from 'lucide-react';

const navItems = [
  { label: 'HOME', href: '#home' },
  { label: 'ABOUT', href: '#about' },
  { label: 'DATES', href: '#dates' },
  { label: 'COUNTDOWN', href: '#countdown' },
  { label: 'TREASURE', href: '#treasure' },
  { label: 'RULES', href: '#rules' },
  { label: 'TIMELINE', href: '#timeline' },
  { label: 'PRIZES', href: '#prizes' },
  { label: 'FAQ', href: '#faq' },
  { label: 'CONTACT', href: '#contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      // Section scrollspy
      const sections = navItems.map((item) => item.href.substring(1));
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
    if (location.pathname !== '/') {
      navigate('/' + href);
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
          ? 'bg-[#050b07]/90 backdrop-blur-md border-b border-[#10b981]/30 py-3 shadow-[0_4px_20px_rgba(0,255,102,0.1)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-1.5 sm:space-x-3 group cursor-pointer flex-shrink-0"
        >
          <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg bg-[#0f1e14] border border-[#10b981] flex items-center justify-center group-hover:shadow-[0_0_15px_#00ff66] transition-all flex-shrink-0">
            <Shield className="w-3.5 h-3.5 sm:w-6 sm:h-6 text-[#00ff66]" />
          </div>
          <div>
            <span className="font-orbitron font-extrabold text-xs sm:text-lg lg:text-xl text-white tracking-wide group-hover:text-[#00ff66] transition-colors whitespace-nowrap block">
              CODIENYCH<span className="text-[#00ff66]"> 1.0</span>
            </span>
            <span className="block text-[8px] sm:text-[10px] font-mono text-[#10b981] tracking-widest leading-none">
              24-HR HACKATHON
            </span>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          {navItems.map((item) => {
            const sectionId = item.href.substring(1);
            const isActive = location.pathname === '/' && activeSection === sectionId;
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-all ${
                  isActive
                    ? 'text-[#00ff66] bg-[#0f1e14] border border-[#10b981]/50 shadow-[0_0_10px_rgba(0,255,102,0.2)]'
                    : 'text-gray-300 hover:text-[#00ff66] hover:bg-[#0f1e14]/50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center space-x-3">
          <Link
            to="/status"
            className="px-3 py-2 text-xs font-mono text-gray-300 hover:text-white border border-[#1b3524] rounded hover:border-[#10b981] transition-all flex items-center space-x-1"
          >
            <Terminal className="w-3.5 h-3.5 text-[#10b981]" />
            <span>STATUS</span>
          </Link>
          <Link
            to="/register"
            className="relative px-5 py-2 rounded text-xs font-orbitron font-bold text-black bg-[#00ff66] hover:bg-[#10b981] hover:text-white transition-all shadow-[0_0_15px_rgba(0,255,102,0.4)] hover:shadow-[0_0_25px_rgba(0,255,102,0.7)] transform hover:-translate-y-0.5 active:translate-y-0"
          >
            REGISTER NOW
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="lg:hidden flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0">
          <Link
            to="/register"
            className="px-2.5 py-1.5 rounded text-[10px] sm:text-xs font-orbitron font-bold text-black bg-[#00ff66] shadow-[0_0_10px_#00ff66] uppercase"
          >
            REGISTER
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 sm:p-2 rounded-lg bg-[#0f1e14] border border-[#10b981]/40 text-gray-200 hover:text-[#00ff66]"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#050b07]/95 backdrop-blur-xl border-b border-[#10b981]/40 px-4 pt-4 pb-6 mt-3 space-y-2 animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavClick(item.href)}
              className="block w-full text-left px-4 py-2.5 rounded text-sm font-mono text-gray-300 hover:text-[#00ff66] hover:bg-[#0f1e14] transition-colors"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-[#1b3524] flex flex-col space-y-2">
            <Link
              to="/status"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 text-xs font-mono text-gray-300 border border-[#1b3524] rounded"
            >
              CHECK REGISTRATION STATUS
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
