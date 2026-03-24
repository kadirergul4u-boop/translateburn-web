
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils.js';

export default function RightSidebar({ className }) {
  const containerRef = useRef(null);
  const [adFailed, setAdFailed] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content to prevent duplicate ad injections on re-renders
    containerRef.current.innerHTML = '';
    setAdFailed(false);

    let scriptLoaded = false;

    try {
      // 1. Define atOptions BEFORE loading the script to prevent timing issues
      window.atOptions = {
        key: 'f8826a67e169074184d4c8344bcee9b5',
        format: 'iframe',
        height: 250,
        width: 300,
        params: {}
      };

      // 2. Create and inject the script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = 'https://actionfurmap.com/f8826a67e169074184d4c8344bcee9b5/invoke.js';
      
      script.onload = () => {
        scriptLoaded = true;
      };

      // 3. Add error handling
      script.onerror = () => {
        console.error('RightSidebar ad script failed to load. It may be blocked by an adblocker.');
        setAdFailed(true);
      };

      containerRef.current.appendChild(script);
    } catch (err) {
      console.error('RightSidebar script injection error:', err);
      setAdFailed(true);
    }

    // 4. Fallback timeout: if ad fails to load after 5s, show placeholder
    const timeoutId = setTimeout(() => {
      if (containerRef.current) {
        // If no iframe was injected or script failed
        const hasIframe = containerRef.current.querySelector('iframe');
        if (!hasIframe && !scriptLoaded) {
          setAdFailed(true);
        }
      }
    }, 5000);

    // 5. Cleanup function to remove injected elements on unmount
    return () => {
      clearTimeout(timeoutId);
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <aside className={cn('sticky top-4 rounded-lg border border-border p-4 bg-card shadow-sm relative z-10 w-[332px] shrink-0 hidden xl:block', className)}>
      <p className="text-[10px] text-muted-foreground text-center mb-2 uppercase tracking-wider font-medium">Advertisement</p>
      <div 
        id="atcontainer-right" 
        ref={containerRef} 
        className="min-h-[250px] min-w-[300px] flex items-center justify-center bg-muted/30 rounded overflow-hidden relative"
      >
        {adFailed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground text-sm p-4 text-center border border-dashed border-border/50 rounded bg-muted/10">
            <span className="font-medium">Advertisement Space</span>
            <span className="text-xs opacity-70 mt-1">(Ad blocked or failed to load)</span>
          </div>
        )}
      </div>
    </aside>
  );
}
