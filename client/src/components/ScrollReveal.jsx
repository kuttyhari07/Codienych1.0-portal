import React from 'react';
import { motion } from 'framer-motion';

export const ScrollReveal = ({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 0.8,
  className = '',
}) => {
  const variants = {
    'fade-up': {
      hidden: { opacity: 0, y: 40, scale: 0.98 },
      visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration,
          delay,
          ease: [0.25, 1, 0.5, 1], // Sondaven ease-out curve
        },
      },
    },
    'scale-up': {
      hidden: { opacity: 0, scale: 0.88 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration,
          delay,
          ease: [0.25, 1, 0.5, 1],
        },
      },
    },
    'fade-right': {
      hidden: { opacity: 0, x: -50 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration,
          delay,
          ease: [0.25, 1, 0.5, 1],
        },
      },
    },
    'fade-left': {
      hidden: { opacity: 0, x: 50 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration,
          delay,
          ease: [0.25, 1, 0.5, 1],
        },
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2 }}
      variants={variants[variant] || variants['fade-up']}
      className={className}
    >
      {children}
    </motion.div>
  );
};
