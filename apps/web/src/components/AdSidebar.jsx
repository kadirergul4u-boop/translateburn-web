
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils.js';

export default function AdSidebar({ className }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';

    try {
      window.atOptions = {
        key: 'f8826a67e169074184d4c8344bcee9b5',
        format: 'iframe',
        height: 250,
        width: 300,
        params: {}
      };

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://www.highperformanceformat.com/f8826a67e169074184d4c8344bcee9b5/invoke.js';
      
      script.onerror = () => {
        console.error('AdSidebar ad script failed to load.');
      };

      containerRef.current.appendChild(script);
    } catch (err) {
      console.error('AdSidebar script injection error:', err);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className={cn('ad-space max-w-[340px] flex-col hidden lg:flex', className)}>
      <p className="text-[10px] text-muted-foreground text-center mb-3 uppercase tracking-wider font-medium">Advertisement</p>
      <div 
        id="ad-sidebar-medium" 
        ref={containerRef} 
        className="min-h-[250px] min-w-[300px] flex items-center justify-center overflow-hidden"
      >
        {/* Ad script will inject iframe here */}
      </div>
    </div>
  );
}
