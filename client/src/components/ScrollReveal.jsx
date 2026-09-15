import React from 'react';
import { motion } from 'framer-motion';

export const ScrollReveal = ({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.8,
  className = '',
  stagger = false,
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: delay,
      },
    },
  };

  const variants = {
    'fade-up': {
      hidden: { opacity: 0, y: 35, scale: 0.98 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1], // Smooth exponential deceleration
        },
      },
    },
    'scale-up': {
      hidden: { opacity: 0, scale: 0.92, y: 20 },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    },
    'fade-right': {
      hidden: { opacity: 0, x: -40 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    },
    'fade-left': {
      hidden: { opacity: 0, x: 40 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        },
      },
    },
  };

  if (stagger) {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        variants={containerVariants}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      variants={variants[variant] || variants['fade-up']}
      className={className}
    >
      {children}
    </motion.div>
  );
};
