import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import PersonalityCamera from "@/components/personality-camera";
import PersonalityResult from "@/components/personality-result";
import BannerAd from "@/components/ads/banner-ad";
import InterstitialAd from "@/components/ads/interstitial-ad";
import RewardedAd from "@/components/ads/rewarded-ad";
import { useAdManager } from "@/hooks/useAdManager";
import { Button } from "@/components/ui/button";
import { Zap, BarChart3 } from "lucide-react";

interface PersonalityResult {
  id: string;
  mbtiType: string;
  confidence: string;
  traits: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  analysis: { ko: string; en: string };
  strengths: { ko: string; en: string };
  weaknesses: { ko: string; en: string };
  recommendations: { ko: string; en: string };
  createdAt: string;
}

export default function Home() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [currentResult, setCurrentResult] = useState<PersonalityResult | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const handleAnalysisComplete = (result: PersonalityResult, image: string) => {
    setCurrentResult(result);
    setCapturedImage(image);
  };

  const handleRetake = () => {
    setCurrentResult(null);
    setCapturedImage(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">🧠</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">Personality AI</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover border-2 border-purple-200"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">👤</span>
                </div>
              )}
              <span className="text-sm font-medium text-gray-700 hidden sm:block">
                {user?.firstName || user?.email?.split('@')[0] || 'User'}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-600 hover:text-purple-500 transition-colors"
              title="로그아웃"
            >
              <span className="text-sm">🚪</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {!currentResult ? (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {language === 'ko' ? '얼굴로 보는 성격 분석' : 'Face-Based Personality Analysis'}
              </h2>
              <p className="text-gray-600">
                {language === 'ko' 
                  ? 'AI가 당신의 얼굴을 분석하여 성격과 MBTI를 예측합니다' 
                  : 'AI analyzes your face to predict personality and MBTI type'
                }
              </p>
            </div>
            
            <PersonalityCamera onAnalysisComplete={handleAnalysisComplete} />

            {/* Info Section */}
            <section className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 space-y-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-white text-xl">ℹ️</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {language === 'ko' ? 'AI 분석 정보' : 'AI Analysis Info'}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {language === 'ko' 
                    ? 'Google Gemini AI를 사용하여 얼굴 특징을 분석하고 성격을 예측합니다. 결과는 참고용이며 실제와 다를 수 있습니다.'
                    : 'Uses Google Gemini AI to analyze facial features and predict personality. Results are for reference and may differ from reality.'
                  }
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center">
                  <div className="text-purple-600 font-semibold text-lg">
                    {language === 'ko' ? 'MBTI 예측' : 'MBTI Prediction'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {language === 'ko' ? '16가지 유형' : '16 Types'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-purple-600 font-semibold text-lg">
                    {language === 'ko' ? '실시간' : 'Real-time'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {language === 'ko' ? '처리 속도' : 'Processing'}
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          <PersonalityResult 
            result={currentResult} 
            capturedImage={capturedImage}
            onRetake={handleRetake}
            language={language}
            onLanguageChange={setLanguage}
          />
        )}
      </main>
    </div>
  );
}
