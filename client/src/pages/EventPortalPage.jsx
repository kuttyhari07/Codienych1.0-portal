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
import RefreshmentScheduleSection from '../sections/RefreshmentScheduleSection';
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

const EventPortalPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Smoothly scroll to top on mount
    window.scrollTo(0, 0);
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
