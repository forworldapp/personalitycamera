import { useState, useEffect } from 'react';

interface PlatformInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isCapacitor: boolean;
  hasNotch: boolean;
}

export function usePlatform(): PlatformInfo {
  const [platform, setPlatform] = useState<PlatformInfo>({
    isIOS: false,
    isAndroid: false,
    isMobile: false,
    isCapacitor: false,
    hasNotch: false,
  });

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    const isMobile = /mobi|android|iphone|ipad|ipod/.test(userAgent);
    const isCapacitor = !!(window as any).Capacitor;
    
    // iPhone with notch detection
    const hasNotch = isIOS && (
      window.screen.height === 812 || // iPhone X, XS, 11 Pro
      window.screen.height === 896 || // iPhone XR, 11, XS Max, 11 Pro Max
      window.screen.height === 844 || // iPhone 12, 12 Pro
      window.screen.height === 926 || // iPhone 12 Pro Max
      window.screen.height === 852 || // iPhone 14 Pro
      window.screen.height === 932    // iPhone 14 Pro Max
    );

    setPlatform({
      isIOS,
      isAndroid,
      isMobile,
      isCapacitor,
      hasNotch,
    });
  }, []);

  return platform;
}