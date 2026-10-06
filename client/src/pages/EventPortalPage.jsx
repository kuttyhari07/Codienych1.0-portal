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
            <div className="max-w-5xl mx-auto px-4 pt-3 sm:pt-5 pb-1">
              <Link
                to="/register"
                className="w-full text-left group relative p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-[#2c0808]/95 via-[#4a1208]/95 to-[#2c0808]/95 border-2 border-[#ff3b3b] hover:border-[#ff6666] shadow-[0_0_35px_rgba(255,59,59,0.45)] hover:shadow-[0_0_55px_rgba(255,59,59,0.7)] transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer transform hover:-translate-y-0.5 backdrop-blur-md block"
              >
                <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0">
                  <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#dc2626] to-[#991b1b] text-white font-cinzel font-black text-[10px] sm:text-xs tracking-wider uppercase shadow-[0_0_15px_rgba(220,38,38,0.7)] flex-shrink-0 animate-pulse border border-[#fca5a5]">
                    <span>⚡ CLOSING TONIGHT</span>
                  </span>
                  <div className="min-w-0">
                    <span className="font-pirate text-base sm:text-2xl text-[#ffd700] tracking-wide block truncate pirate-gold-glow">
                      REGISTRATION CLOSES TONIGHT AT 11:59 PM SHARP!
                    </span>
                    <span className="font-cinzel text-[10px] sm:text-xs text-gray-200 block truncate">
                      Registration Fee: <strong className="text-[#ffd700]">₹{EVENT_CONFIG.REGISTRATION_FEE_PER_MEMBER} / Pirate</strong> (3–6 Pirates: ₹1,500 – ₹3,000) • Automatic System Lock at 11:59 PM IST
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2.5 flex-shrink-0 self-end sm:self-auto">
                  {remaining && remaining.totalMs > 0 && (
                    <div className="bg-black/80 border border-[#ffd700]/70 px-3 py-1.5 rounded-xl font-mono font-black text-xs text-[#ffd700] shadow-sm">
                      {remaining.hours > 0 ? `${remaining.hours}h ` : '0h '}
                      {String(remaining.minutes).padStart(2, '0')}m {String(remaining.seconds).padStart(2, '0')}s
                    </div>
                  )}
                  <div className="flex items-center space-x-1.5 text-xs font-cinzel font-black text-black bg-gradient-to-r from-[#ffd700] to-[#f39c12] border border-[#ffd700] px-4 py-2 rounded-full shadow-[0_0_15px_rgba(255,215,0,0.5)] group-hover:brightness-110 transition-all">
                    <span>ENLIST NOW</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Prominent Admiralty Urgent Announcement Banner: Meals & Wi-Fi */}
          <div className="max-w-5xl mx-auto px-4 pt-2 pb-1">
            <button
              type="button"
              onClick={scrollToRefreshmentScroll}
              className="w-full text-left group relative p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-[#241004]/95 via-[#3d1a06]/95 to-[#241004]/95 border-2 border-[#ffd700] hover:border-[#ffe885] shadow-[0_0_35px_rgba(255,215,0,0.35)] hover:shadow-[0_0_50px_rgba(255,215,0,0.6)] transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 cursor-pointer transform hover:-translate-y-0.5 backdrop-blur-md"
            >
              <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0">
                <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#dc2626] to-[#991b1b] text-white font-cinzel font-black text-[10px] sm:text-xs tracking-wider uppercase shadow-[0_0_15px_rgba(220,38,38,0.7)] flex-shrink-0 animate-pulse border border-[#fca5a5]">
                  <span>⚠️ IMPORTANT</span>
                </span>
                <div className="min-w-0">
                  <span className="font-pirate text-base sm:text-2xl text-[#ffd700] tracking-wide block truncate pirate-gold-glow">
                    Meal & Refreshment Schedule & Wi-Fi Guidelines Released
                  </span>
                  <span className="font-cinzel text-[10px] sm:text-xs text-gray-300 block truncate">
                    Day 1 Juice (12 PM) • Tea & Snacks (3-4 PM) • Dinner (8 PM) • Midnight Tea (11-12 AM) • Day 2 Coffee (5:30-6:30 AM) • Breakfast (7-8 AM)
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-xs font-cinzel font-black text-[#ffd700] bg-[#120a04] border border-[#ffd700]/60 px-3.5 py-1.5 rounded-full shadow-sm group-hover:bg-[#ffd700] group-hover:text-black transition-all flex-shrink-0 self-end sm:self-auto">
                <span>VIEW SCHEDULE SCROLL</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
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
