import { useEffect, useRef } from "react";

interface BannerAdProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
  position?: 'top' | 'bottom' | 'inline';
}

export default function BannerAd({ className = "", size = 'medium', position = 'bottom' }: BannerAdProps) {
  const adRef = useRef<HTMLDivElement>(null);

  const adSizes = {
    small: { width: 320, height: 50 },   // Mobile Banner
    medium: { width: 320, height: 100 }, // Large Mobile Banner
    large: { width: 728, height: 90 }    // Leaderboard
  };

  useEffect(() => {
    // AdMob integration will be added here for Android deployment
    if (adRef.current && typeof window !== 'undefined') {
      // For web version, show placeholder
      const isProduction = import.meta.env.PROD;
      if (!isProduction) {
        console.log('AdMob banner ad would load here in production');
      }
    }
  }, []);

  const { width, height } = adSizes[size];

  return (
    <div 
      ref={adRef}
      className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg ${className}`}
      style={{ width: `${width}px`, height: `${height}px`, minHeight: `${height}px` }}
    >
      <div className="text-center text-gray-500 dark:text-gray-400 text-xs">
        <div className="mb-1">📱</div>
        <div>광고 영역</div>
        <div className="text-xs opacity-75">{width}x{height}</div>
      </div>
    </div>
  );
}