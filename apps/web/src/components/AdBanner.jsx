
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils.js';

export default function AdBanner({ className }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    try {
      window.atOptions = {
        key: '785a6d49ee66b164c4736ccb9f985361',
        format: 'iframe',
        height: 90,
        width: 728,
        params: {}
      };

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://www.highperformanceformat.com/785a6d49ee66b164c4736ccb9f985361/invoke.js';
      script.async = true;
      
      containerRef.current.appendChild(script);
    } catch (err) {
      console.error('AdBanner script injection error:', err);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className={cn('ad-space max-w-[768px]', className)}>
      <div id="ad-banner-leaderboard" ref={containerRef} className="min-h-[90px] min-w-[728px] flex items-center justify-center overflow-hidden">
        {/* Ad script will inject iframe here */}
      </div>
    </div>
  );
}
