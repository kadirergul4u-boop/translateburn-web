
import React from 'react';
import { Link } from 'react-router-dom';
import { Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils.js';

export default function AdvertisingPlaceholder({ size = 'leaderboard', className }) {
  const isSidebar = size === 'sidebar';
  
  return (
    <div 
      className={cn(
        'bg-[#F8F9FA] border-2 border-dashed border-[#FF5722] rounded-xl flex flex-col items-center justify-center text-center p-[40px] shadow-sm hover:shadow-md transition-shadow duration-300 mx-auto my-8 overflow-hidden relative group',
        isSidebar ? 'w-full max-w-[300px] min-h-[250px]' : 'w-full max-w-[728px] min-h-[120px]',
        className
      )}
    >
      <div className="absolute inset-0 bg-[#FF5722]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <Megaphone className="h-8 w-8 text-[#FF5722] mb-4 opacity-80" aria-hidden="true" />
      
      <h3 className="text-[#2C3E50] font-bold text-lg md:text-xl mb-2 tracking-tight">
        Would you like to advertise here?
      </h3>
      
      <p className="text-[#343A40] text-sm mb-6 max-w-md leading-relaxed">
        Reach thousands of translation users daily
      </p>
      
      <Link 
        to="/contact" 
        className="bg-[#FF5722] hover:bg-[#E64A19] text-white text-sm font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow active:scale-95 inline-flex items-center gap-2"
      >
        Contact Us for Advertising
      </Link>
    </div>
  );
}
