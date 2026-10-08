import React, { useState, useEffect } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import CinematicBackground from '../components/CinematicBackground';
import InteractiveCursor from '../components/InteractiveCursor';
import CyberBotAssistant from '../components/CyberBotAssistant';
import Navbar from '../components/Navbar';
import MissionHudIndex from '../components/MissionHudIndex';
import AboutSection from '../sections/AboutSection';
import DatesSection from '../sections/DatesSection';
import CountdownSection from '../sections/CountdownSection';
import ProblemStatementSection from '../sections/ProblemStatementSection';
import TeamRulesSection from '../sections/TeamRulesSection';
import HackathonRulesSection from '../sections/HackathonRulesSection';
import RefreshmentScheduleSection, { scrollToRefreshmentScroll } from '../sections/RefreshmentScheduleSection';
import TimelineSection from '../sections/TimelineSection';
import PrizesSection from '../sections/PrizesSection';
import DomainsSection from '../sections/DomainsSection';
import EntertainmentSection from '../sections/EntertainmentSection';
import FaqSection from '../sections/FaqSection';
import ContactSection from '../sections/ContactSection';
import Footer from '../sections/Footer';
import { SmoothScrollProvider } from '../components/SmoothScrollProvider';
import { ScrollReveal } from '../components/ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Swords } from 'lucide-react';
import { EVENT_CONFIG } from '../utils/config';
import useRegistrationStatus from '../utils/useRegistrationStatus';

const EventPortalPage = () => {
  const { isClosed, remaining } = useRegistrationStatus();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If navigating directly to #refreshments, smoothly open and scroll to it
    if (window.location.hash === '#refreshments') {
      setTimeout(() => {
        scrollToRefreshmentScroll();
      }, 400);
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen bg-[#020508] text-[#f4e6c3] overflow-x-hidden selection:bg-[#ffd700] selection:text-black">
        {/* Loading Screen Overlay if triggered */}
        <AnimatePresence>
          {isLoading && <LoadingScreen onFinish={() => setIsLoading(false)} />}
        </AnimatePresence>

        {/* Interactive Ambient Cursor */}
        <InteractiveCursor />

        {/* Interactive Captain Mascot */}
        <CyberBotAssistant />

        {/* Sticky Cinematic Ocean Background */}
        <CinematicBackground />

        {/* Full Navigation & Desktop HUD Sidebar Index */}
        <Navbar />
        <MissionHudIndex />

        {/* Main Content Sections with Sequential Scroll Reveals */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 pt-20"
        >
          {/* Prominent Admiralty Urgent Announcement Banner: Registration Closes Tonight */}
          {!isClosed && (
            <div className="max-w-5xl mx-auto px-3 sm:px-4 pt-3 sm:pt-5 pb-1">
              <Link
                to="/register"
                className="w-full text-left group relative p-3.5 sm:p-5 rounded-2xl bg-gradient-to-r from-[#2c0808]/95 via-[#4a1208]/95 to-[#2c0808]/95 border-2 border-[#ff3b3b] hover:border-[#ff6666] shadow-[0_0_35px_rgba(255,59,59,0.45)] hover:shadow-[0_0_55px_rgba(255,59,59,0.7)] transition-all duration-300 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 cursor-pointer transform hover:-translate-y-0.5 backdrop-blur-md block"
              >
                <div className="flex-1 min-w-0">
                  {/* Top Badge & Mobile Timer Row */}
                  <div className="flex items-center justify-between gap-2 mb-2 sm:mb-1.5 flex-wrap">
                    <span className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-gradient-to-r from-[#dc2626] to-[#991b1b] text-white font-cinzel font-black text-[10px] sm:text-xs tracking-wider uppercase shadow-[0_0_15px_rgba(220,38,38,0.7)] flex-shrink-0 animate-pulse border border-[#fca5a5]">
                      <span>⚡ CLOSING TONIGHT</span>
                    </span>
                    {/* Mobile-only Timer Badge */}
                    {remaining && remaining.totalMs > 0 && (
                      <div className="md:hidden bg-black/80 border border-[#ffd700]/70 px-2.5 py-1 rounded-xl font-mono font-black text-xs text-[#ffd700] shadow-sm flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-[#ffd700]" />
                        <span>{remaining.hours > 0 ? `${remaining.hours}h ` : '0h '}</span>
                        <span>{String(remaining.minutes).padStart(2, '0')}m </span>
                        <span>{String(remaining.seconds).padStart(2, '0')}s</span>
                      </div>
                    )}
                  </div>

                  {/* Title & Description with NO truncation */}
                  <h3 className="font-pirate text-lg sm:text-2xl text-[#ffd700] tracking-wide leading-snug pirate-gold-glow">
                    REGISTRATION CLOSES TONIGHT AT 11:59 PM SHARP!
                  </h3>
                  <p className="font-cinzel text-[11px] sm:text-xs text-gray-200 mt-1 sm:mt-0.5 leading-relaxed">
                    Registration Fee: <strong className="text-[#ffd700]">₹{EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER} / Pirate</strong> (3–6 Pirates: ₹1,500 – ₹3,000) • Automatic System Lock at 11:59 PM IST
                  </p>
                </div>

                {/* Desktop Actions & Mobile Action Button */}
                <div className="flex items-center justify-between md:justify-end gap-2.5 flex-shrink-0 mt-1 md:mt-0 pt-2 md:pt-0 border-t border-white/10 md:border-0">
                  {/* Desktop-only Timer */}
                  {remaining && remaining.totalMs > 0 && (
                    <div className="hidden md:flex bg-black/80 border border-[#ffd700]/70 px-3.5 py-2 rounded-xl font-mono font-black text-sm text-[#ffd700] shadow-sm items-center space-x-1.5">
                      <Clock className="w-4 h-4 text-[#ffd700] animate-spin" style={{ animationDuration: '6s' }} />
                      <span>{remaining.hours > 0 ? `${remaining.hours}h ` : '0h '}</span>
                      <span>{String(remaining.minutes).padStart(2, '0')}m </span>
                      <span>{String(remaining.seconds).padStart(2, '0')}s</span>
                    </div>
                  )}
                  <div className="w-full md:w-auto text-center flex items-center justify-center space-x-2 text-xs sm:text-sm font-cinzel font-black text-black bg-gradient-to-r from-[#ffd700] to-[#f39c12] border border-[#ffd700] px-5 py-2.5 rounded-xl md:rounded-full shadow-[0_0_20px_rgba(255,215,0,0.5)] group-hover:brightness-110 transition-all flex-shrink-0">
                    <span>ENLIST NOW</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Prominent Admiralty Urgent Announcement Banner: Meals & Wi-Fi */}
          <div className="max-w-5xl mx-auto px-3 sm:px-4 pt-2 pb-1">
            <button
              type="button"
              onClick={scrollToRefreshmentScroll}
              className="w-full text-left group relative p-3.5 sm:p-5 rounded-2xl bg-gradient-to-r from-[#241004]/95 via-[#3d1a06]/95 to-[#241004]/95 border-2 border-[#ffd700] hover:border-[#ffe885] shadow-[0_0_35px_rgba(255,215,0,0.35)] hover:shadow-[0_0_50px_rgba(255,215,0,0.6)] transition-all duration-300 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 cursor-pointer transform hover:-translate-y-0.5 backdrop-blur-md block"
            >
              <div className="flex-1 min-w-0">
                {/* Badge Row */}
                <div className="flex items-center space-x-2 mb-2 sm:mb-1.5">
                  <span className="inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-gradient-to-r from-[#dc2626] to-[#991b1b] text-white font-cinzel font-black text-[10px] sm:text-xs tracking-wider uppercase shadow-[0_0_15px_rgba(220,38,38,0.7)] flex-shrink-0 animate-pulse border border-[#fca5a5]">
                    <span>⚠️ IMPORTANT</span>
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono text-[#00e5ff] uppercase tracking-wider">
                    PORT SCHEDULE DISPATCH
                  </span>
                </div>

                {/* Title & Description with NO truncation */}
                <h3 className="font-pirate text-lg sm:text-2xl text-[#ffd700] tracking-wide leading-snug pirate-gold-glow">
                  Meal & Refreshment Schedule & Wi-Fi Guidelines Released
                </h3>
                <p className="font-cinzel text-[10px] sm:text-xs text-gray-300 mt-1 sm:mt-0.5 leading-relaxed">
                  Day 1 Juice (12 PM) • Tea & Snacks (3-4 PM) • Dinner (8 PM) • Midnight Tea (11-12 AM) • Day 2 Coffee (5:30-6:30 AM) • Breakfast (7-8 AM)
                </p>
              </div>

              {/* Button */}
              <div className="flex items-center justify-end flex-shrink-0 mt-1 md:mt-0 pt-2 md:pt-0 border-t border-white/10 md:border-0">
                <div className="w-full md:w-auto text-center flex items-center justify-center space-x-1.5 text-xs sm:text-sm font-cinzel font-black text-[#ffd700] bg-[#120a04] border border-[#ffd700]/60 px-5 py-2.5 rounded-xl md:rounded-full shadow-sm group-hover:bg-[#ffd700] group-hover:text-black transition-all">
                  <span>VIEW SCHEDULE SCROLL</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </button>
          </div>

          {/* Live Review Chronometer Stage Banner */}
          <div className="max-w-6xl mx-auto px-4 mt-6 mb-2">
            <Link
              to="/review"
              className="w-full text-left bg-gradient-to-r from-[#120505] via-[#240d0d] to-[#120505] hover:from-[#1c0808] hover:to-[#1c0808] border-2 border-[#ffd700] rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_0_25px_rgba(255,215,0,0.25)] transition-all group block"
            >
              <div className="flex items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#ffd700]/20 border border-[#ffd700] flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#ffd700] animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="font-cinzel text-xs font-black text-[#ffd700] tracking-widest uppercase">
                      LIVE REVIEW ROUNDS & COUNTDOWN CHRONOMETER
                    </span>
                  </div>
                  <h3 className="font-pirate text-lg sm:text-xl text-white mt-0.5">
                    Live Evaluation Stage Window • Jury Deadlines & Projector View
                  </h3>
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <span className="px-4 py-2 rounded-xl bg-[#ffd700] text-black font-cinzel font-black text-xs group-hover:bg-[#ffe066] transition-colors shadow-md">
                  OPEN LIVE COUNTDOWN →
                </span>
              </div>
            </Link>
          </div>

          {/* 1. About Section */}
          <ScrollReveal variant="fade-up">
            <AboutSection />
          </ScrollReveal>

          {/* 2. Important Dates & Countdown */}
          <ScrollReveal variant="fade-up">
            <DatesSection />
          </ScrollReveal>

          <ScrollReveal variant="scale-up">
            <CountdownSection />
          </ScrollReveal>

          {/* 3. Competition Domains */}
          <ScrollReveal variant="fade-up">
            <DomainsSection />
          </ScrollReveal>

          {/* 4. Problem Statements (Revealed on Spot at Embarkation) */}
          <ScrollReveal variant="scale-up">
            <ProblemStatementSection />
          </ScrollReveal>

          {/* 5. Prizes & Bounties */}
          <ScrollReveal variant="fade-up">
            <PrizesSection />
          </ScrollReveal>

          {/* 6. Tavern & Entertainment */}
          <ScrollReveal variant="fade-up">
            <EntertainmentSection />
          </ScrollReveal>

          {/* 6. Pirate Code & Rules */}
          <ScrollReveal variant="fade-up">
            <TeamRulesSection />
          </ScrollReveal>

          <ScrollReveal variant="fade-up">
            <HackathonRulesSection />
          </ScrollReveal>

          {/* 7. Refreshment & Meal Schedule + Wi-Fi Scroll */}
          <ScrollReveal variant="fade-up">
            <RefreshmentScheduleSection />
          </ScrollReveal>

          {/* 8. Voyage Map & Timeline */}
          <ScrollReveal variant="fade-up">
            <TimelineSection />
          </ScrollReveal>

          {/* 8. FAQ */}
          <ScrollReveal variant="fade-up">
            <FaqSection />
          </ScrollReveal>

          {/* 9. Contact & Admiralty */}
          <ScrollReveal variant="fade-up">
            <ContactSection />
          </ScrollReveal>

          {/* 10. Footer */}
          <Footer />
        </motion.main>
      </div>
    </SmoothScrollProvider>
  );
};

export default EventPortalPage;
