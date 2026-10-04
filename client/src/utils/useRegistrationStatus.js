import { useState, useEffect } from 'react';
import { EVENT_CONFIG, isRegistrationClosed } from './config';

/**
 * Custom hook to monitor registration deadline live (10:30 PM IST, Oct 4, 2026).
 * Automatically updates every second so state transitions cleanly.
 */
export const useRegistrationStatus = () => {
  const computeStatus = () => {
    try {
      const deadline = new Date(EVENT_CONFIG.REGISTRATION_DEADLINE).getTime();
      const now = Date.now();
      const diff = deadline - now;
      const closed = isRegistrationClosed();

      let hours = 0;
      let minutes = 0;
      let seconds = 0;

      if (diff > 0) {
        const totalSeconds = Math.floor(diff / 1000);
        hours = Math.floor(totalSeconds / 3600);
        minutes = Math.floor((totalSeconds % 3600) / 60);
        seconds = totalSeconds % 60;
      }

      return {
        isClosed: closed,
        remaining: { hours, minutes, seconds, totalMs: diff },
        deadlineDate: new Date(EVENT_CONFIG.REGISTRATION_DEADLINE),
      };
    } catch (e) {
      return {
        isClosed: false,
        remaining: { hours: 0, minutes: 0, seconds: 0, totalMs: 0 },
        deadlineDate: new Date(EVENT_CONFIG.REGISTRATION_DEADLINE),
      };
    }
  };

  const [status, setStatus] = useState(computeStatus);

  useEffect(() => {
    // If already closed, no need for ticking intervals
    if (status.isClosed) return;

    const interval = setInterval(() => {
      const next = computeStatus();
      setStatus(next);
      if (next.isClosed) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [status.isClosed]);

  return status;
};

export default useRegistrationStatus;
