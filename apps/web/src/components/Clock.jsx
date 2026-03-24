
import React, { useState, useEffect } from 'react';

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Set interval to update time every second
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div 
      className="fixed z-30 bottom-4 right-4 md:bottom-auto md:top-20 md:right-6 bg-[#2C3E50] text-[#FF5722] text-[14px] font-semibold rounded-lg px-4 py-3 shadow-lg border border-white/5 transition-all duration-300 pointer-events-none"
      aria-label="Current time"
    >
      {formatTime(time)}
    </div>
  );
}
