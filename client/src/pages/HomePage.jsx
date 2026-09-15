import React, { useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import CinematicBackground from '../components/CinematicBackground';
import InteractiveCursor from '../components/InteractiveCursor';
import CyberEasterEggHud from '../components/CyberEasterEggHud';
import Navbar from '../components/Navbar';
import MissionHudIndex from '../components/MissionHudIndex';
import HeroSection from '../sections/HeroSection';
import AboutSection from '../sections/AboutSection';
import DatesSection from '../sections/DatesSection';
import CountdownSection from '../sections/CountdownSection';
import ProblemStatementSection from '../sections/ProblemStatementSection';
import TeamRulesSection from '../sections/TeamRulesSection';
import HackathonRulesSection from '../sections/HackathonRulesSection';
import TimelineSection from '../sections/TimelineSection';
import PrizesSection from '../sections/PrizesSection';
import EntertainmentSection from '../sections/EntertainmentSection';
import FaqSection from '../sections/FaqSection';
import ContactSection from '../sections/ContactSection';
import Footer from '../sections/Footer';
import { SmoothScrollProvider } from '../components/SmoothScrollProvider';
import { ScrollReveal } from '../components/ScrollReveal';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen bg-[#050b07] text-gray-100 overflow-x-hidden selection:bg-[#00ff66] selection:text-black">
        {/* Loading Screen Overlay */}
        <AnimatePresence>
          {isLoading && <LoadingScreen onFinish={() => setIsLoading(false)} />}
        </AnimatePresence>

        {/* Interactive Ambient Cursor Glow */}
        <InteractiveCursor />
        <CyberEasterEggHud />

        {/* Sticky Cinematic Scroll Background */}
        <CinematicBackground />

        {/* Navigation & Desktop HUD Sidebar Index */}
        <Navbar />
        <MissionHudIndex />

        {/* Main Content Sections with Smooth Landing Entrance */}
        <motion.main
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          <HeroSection />

          <ScrollReveal variant="fade-up">
            <AboutSection />
          </ScrollReveal>

          <ScrollReveal variant="fade-up">
            <DatesSection />
          </ScrollReveal>

          <ScrollReveal variant="scale-up">
            <CountdownSection />
          </ScrollReveal>

          <ScrollReveal variant="fade-up">
            <PrizesSection />
          </ScrollReveal>

          <ScrollReveal variant="fade-up">
            <EntertainmentSection />
          </ScrollReveal>

          <ScrollReveal variant="scale-up">
            <ProblemStatementSection />
          </ScrollReveal>

          <ScrollReveal variant="fade-up">
            <TeamRulesSection />
          </ScrollReveal>

          <ScrollReveal variant="fade-up">
            <HackathonRulesSection />
          </ScrollReveal>

          <ScrollReveal variant="fade-up">
            <TimelineSection />
          </ScrollReveal>

          <ScrollReveal variant="fade-up">
            <FaqSection />
          </ScrollReveal>

          <ScrollReveal variant="fade-up">
            <ContactSection />
          </ScrollReveal>
        </motion.main>

        {/* Footer */}
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
};

export default HomePage;
