import React, { useState, useEffect, useRef } from 'react';
import { playChirp } from '../utils/cyberSound';

const CHARS = '!<>-_\\/[]{}—=+*^?#________01';

const DecipherText = ({ text, className = '', triggerOnHover = true }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isDeciphering, setIsDeciphering] = useState(false);
  const intervalRef = useRef(null);

  const startDecipher = () => {
    if (isDeciphering) return;
    setIsDeciphering(true);
    playChirp();

    let iteration = 0;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((letter, index) => {
            if (letter === ' ') return ' ';
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
        setIsDeciphering(false);
      }

      iteration += 1 / 2;
    }, 25);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <span
      onMouseEnter={triggerOnHover ? startDecipher : undefined}
      className={`inline-block cursor-default select-none ${className}`}
    >
      {displayText}
    </span>
  );
};

export default DecipherText;
