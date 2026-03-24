
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton.jsx';

export default function LoadingSkeletonFallback() {
  return (
    <div className="w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Skeleton className="h-9 w-48 mb-2" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-24 rounded-md" />
          <Skeleton className="h-10 w-24 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 lg:gap-6 items-start">
        {/* Source Panel Skeleton */}
        <div className="flex flex-col gap-4 bg-card rounded-2xl p-4 md:p-6 shadow-sm border">
          <Skeleton className="h-10 w-full max-w-[200px] rounded-md" />
          <Skeleton className="h-[240px] md:h-[320px] w-full rounded-md" />
        </div>

        {/* Swap Button Skeleton */}
        <div className="flex justify-center md:pt-[4.5rem]">
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>

        {/* Target Panel Skeleton */}
        <div className="flex flex-col gap-4 bg-card rounded-2xl p-4 md:p-6 shadow-sm border">
          <Skeleton className="h-10 w-full max-w-[200px] rounded-md" />
          <Skeleton className="h-[240px] md:h-[320px] w-full rounded-md" />
        </div>
      </div>
    </div>
  );
}
