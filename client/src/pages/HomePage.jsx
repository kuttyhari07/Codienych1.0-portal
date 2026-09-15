import React, { useState } from 'react';
import LoadingScreen from '../components/LoadingScreen';
import CinematicBackground from '../components/CinematicBackground';
import Navbar from '../components/Navbar';
import MissionHudIndex from '../components/MissionHudIndex';
import MissionIdBadgeGenerator from '../components/MissionIdBadgeGenerator';
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

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <SmoothScrollProvider>
      <div className="relative min-h-screen bg-[#050b07] text-gray-100 overflow-x-hidden selection:bg-[#00ff66] selection:text-black">
        {isLoading && <LoadingScreen onFinish={() => setIsLoading(false)} />}

        {/* Sticky Cinematic Scroll Background */}
        <CinematicBackground />

        {/* Navigation & Desktop HUD Sidebar Index */}
        <Navbar />
        <MissionHudIndex />

        {/* Main Content Sections with Sondaven Scroll Reveal Physics */}
        <main className="relative z-10">
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

          <ScrollReveal variant="scale-up">
            <MissionIdBadgeGenerator />
          </ScrollReveal>

          <ScrollReveal variant="fade-up">
            <ContactSection />
          </ScrollReveal>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </SmoothScrollProvider>
  );
};

export default HomePage;
