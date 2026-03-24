
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils.js';

export default function LeftSidebar({ className }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    try {
      window.atOptions = {
        key: '3b9e31444ff32658e1ce617ac70d54e0',
        format: 'iframe',
        height: 600,
        width: 160,
        params: {}
      };

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://www.highperformanceformat.com/3b9e31444ff32658e1ce617ac70d54e0/invoke.js';
      
      script.onerror = () => {
        console.error('Sidebar ad script failed to load. It may be blocked by an adblocker.');
      };

      containerRef.current.appendChild(script);
    } catch (err) {
      console.error('Sidebar script injection error:', err);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <aside className={cn('ad-sidebar-right', className)}>
      <p className="text-[10px] text-muted-foreground text-center mb-2 uppercase tracking-wider">Advertisement</p>
      <div 
        id="ad-sidebar-wide-skyscraper" 
        ref={containerRef} 
        className="min-h-[600px] min-w-[160px] flex items-center justify-center bg-muted/10 rounded overflow-hidden"
      >
        {/* Ad script will inject iframe here */}
      </div>
    </aside>
  );
}
