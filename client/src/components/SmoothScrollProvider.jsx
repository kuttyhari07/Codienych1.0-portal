import React, { useEffect } from 'react';
import Lenis from 'lenis';

export const SmoothScrollProvider = ({ children }) => {
  useEffect(() => {
    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Sondaven-like exponential smooth ease
      direction: 'vertical',
      gestureDirection: 'vertical',
      smoothTouch: false,
      touchMultiplier: 2,
      wheelMultiplier: 1,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Sync Lenis scroll events with IntersectionObserver / scrollspy
    lenis.on('scroll', () => {
      window.dispatchEvent(new Event('scroll'));
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};
