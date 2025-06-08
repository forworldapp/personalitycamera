import { useState, useCallback } from "react";

interface AdManagerState {
  dailyAnalysisCount: number;
  maxDailyAnalysis: number;
  showInterstitial: boolean;
  showRewardedAd: boolean;
}

export function useAdManager() {
  const [state, setState] = useState<AdManagerState>({
    dailyAnalysisCount: parseInt(localStorage.getItem('dailyAnalysisCount') || '0'),
    maxDailyAnalysis: 3, // Free users get 3 analyses per day
    showInterstitial: false,
    showRewardedAd: false,
  });

  const canAnalyze = useCallback(() => {
    return state.dailyAnalysisCount < state.maxDailyAnalysis;
  }, [state.dailyAnalysisCount, state.maxDailyAnalysis]);

  const incrementAnalysisCount = useCallback(() => {
    const newCount = state.dailyAnalysisCount + 1;
    setState(prev => ({ ...prev, dailyAnalysisCount: newCount }));
    localStorage.setItem('dailyAnalysisCount', newCount.toString());
    localStorage.setItem('lastAnalysisDate', new Date().toDateString());
  }, [state.dailyAnalysisCount]);

  const showInterstitialAd = useCallback(() => {
    // Show interstitial after every 2nd analysis
    if (state.dailyAnalysisCount > 0 && state.dailyAnalysisCount % 2 === 0) {
      setState(prev => ({ ...prev, showInterstitial: true }));
    }
  }, [state.dailyAnalysisCount]);

  const showRewardedAdOffer = useCallback(() => {
    if (!canAnalyze()) {
      setState(prev => ({ ...prev, showRewardedAd: true }));
    }
  }, [canAnalyze]);

  const hideInterstitial = useCallback(() => {
    setState(prev => ({ ...prev, showInterstitial: false }));
  }, []);

  const hideRewardedAd = useCallback(() => {
    setState(prev => ({ ...prev, showRewardedAd: false }));
  }, []);

  const earnReward = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      maxDailyAnalysis: prev.maxDailyAnalysis + 1,
      showRewardedAd: false 
    }));
  }, []);

  const resetDailyCount = useCallback(() => {
    const lastDate = localStorage.getItem('lastAnalysisDate');
    const today = new Date().toDateString();
    
    if (lastDate !== today) {
      setState(prev => ({ 
        ...prev, 
        dailyAnalysisCount: 0,
        maxDailyAnalysis: 3 
      }));
      localStorage.setItem('dailyAnalysisCount', '0');
      localStorage.removeItem('lastAnalysisDate');
    }
  }, []);

  return {
    canAnalyze: canAnalyze(),
    analysisCount: state.dailyAnalysisCount,
    maxAnalysis: state.maxDailyAnalysis,
    showInterstitial: state.showInterstitial,
    showRewardedAd: state.showRewardedAd,
    incrementAnalysisCount,
    showInterstitialAd,
    showRewardedAdOffer,
    hideInterstitial,
    hideRewardedAd,
    earnReward,
    resetDailyCount,
  };
}